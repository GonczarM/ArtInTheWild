'use strict';

/**
 * Phase 3 one-off data migration: MongoDB (old Express app) -> Strapi.
 *
 * Not part of either running app - a throwaway tool. Run from inside
 * strapi-cms/ (it needs to boot a real Strapi instance to use the Document
 * Service, which sidesteps the users-permissions REST permission gates
 * documented in MIGRATION_NOTES.md Phase 2):
 *
 *   cd strapi-cms && node scripts/migrate.js
 *
 * Safe to re-run: wipes existing Mural/Photo/Like/upload-file content and
 * every non-admin User at the start, then re-migrates everything fresh from
 * Mongo. This is a dry run against scratch data, not production.
 *
 * Migrates in dependency order (relations need both sides to exist first):
 *   Users -> Murals -> Photos -> Likes -> Favorites
 *
 * Writes a reviewable summary + skip list + ID mappings to
 * strapi-cms/MIGRATION_LOG.md (not console output that scrolls away).
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const { S3Client, HeadObjectCommand } = require('@aws-sdk/client-s3');
const strapiPkg = require('@strapi/strapi');

const MONGO_URI = process.env.MIGRATE_MONGO_URI || 'mongodb://localhost/ArtInTheWild5';

// Strapi's users-permissions hashes whatever password value it's given (an
// already-hashed Mongo bcrypt string would just get hashed *again*, locking
// everyone out) - confirmed empirically, see MIGRATION_NOTES.md Phase 3.
// Migrated users get this placeholder and need a real reset before any
// production cutover.
const PLACEHOLDER_PASSWORD = 'ChangeMe!Migrated2026';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const log = {
  startedAt: new Date(),
  summary: {}, // type -> { attempted, succeeded, failed }
  skips: [], // { type, reason, detail }
  warnings: [], // { type, detail }
  idMaps: { User: [], Mural: [], Photo: [] }, // rows for the log's mapping tables
};

function recordAttempt(type) {
  log.summary[type] ??= { attempted: 0, succeeded: 0, failed: 0 };
  log.summary[type].attempted++;
}
function recordSuccess(type) {
  log.summary[type].succeeded++;
}
function recordSkip(type, reason, detail) {
  log.summary[type].failed++;
  log.skips.push({ type, reason, detail });
}
function recordWarning(type, detail) {
  log.warnings.push({ type, detail });
}

function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

async function resetStrapiData(app) {
  const counts = {};
  counts.Like = (await app.db.query('api::like.like').deleteMany({ where: {} })).count;
  counts.Photo = (await app.db.query('api::photo.photo').deleteMany({ where: {} })).count;
  counts.Mural = (await app.db.query('api::mural.mural').deleteMany({ where: {} })).count;
  counts.File = (await app.db.query('plugin::upload.file').deleteMany({ where: {} })).count;
  counts.User = (await app.db.query('plugin::users-permissions.user').deleteMany({ where: {} })).count;
  app.log.info(`[migrate] reset: cleared ${JSON.stringify(counts)} existing records before migrating`);
}

// Every idMap below is mongo _id (string) -> { id, documentId }: `id` (the
// internal numeric id) is what relation fields and strapi.db.query() calls
// need, `documentId` is what the log and the REST API use. See
// MIGRATION_NOTES.md Phase 3 for why documentId alone isn't enough here.

async function migrateUsers(app, mongoUsers) {
  const authRole = await app.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });
  const userService = app.plugin('users-permissions').service('user');

  const idMap = new Map();

  for (const mongoUser of mongoUsers) {
    recordAttempt('User');
    try {
      const created = await userService.add({
        username: mongoUser.username,
        // The old schema has no email field at all - synthesized since
        // Strapi's User requires one (unique, required). Flagged in
        // MIGRATION_NOTES.md rather than silently invented.
        email: `${mongoUser.username}@migrated.local`,
        password: PLACEHOLDER_PASSWORD,
        confirmed: true,
        provider: 'local',
        role: authRole.id,
      });
      idMap.set(mongoUser._id.toString(), { id: created.id, documentId: created.documentId });
      log.idMaps.User.push({
        mongoId: mongoUser._id.toString(),
        username: mongoUser.username,
        strapiDocumentId: created.documentId,
      });
      recordSuccess('User');
    } catch (error) {
      recordSkip('User', 'create failed', `username "${mongoUser.username}": ${error.message}`);
    }
  }

  return idMap;
}

async function migrateMurals(app, mongoMurals, userIdMap) {
  const idMap = new Map();

  for (const mongoMural of mongoMurals) {
    recordAttempt('Mural');

    let owner;
    if (mongoMural.user) {
      owner = userIdMap.get(mongoMural.user.toString());
      if (!owner) {
        recordWarning(
          'Mural',
          `"${mongoMural.title}" referenced owner ${mongoMural.user} who failed to migrate - created without an owner instead (orphaned, same as if it never had one)`
        );
      }
    }
    // No `else` branch needed: a Mural with no `user` in Mongo simply stays
    // unset in Strapi too - the Phase 0 orphaning decision, not a fallback.

    try {
      const data = compact({
        title: mongoMural.title,
        artist: mongoMural.artist,
        description: mongoMural.description,
        year: typeof mongoMural.year === 'number' ? mongoMural.year : undefined,
        affiliation: mongoMural.affiliation,
        address: mongoMural.address,
        zipcode: mongoMural.zipcode,
        latitude: mongoMural.latitude,
        longitude: mongoMural.longitude,
        user: owner?.id,
      });
      const created = await app.documents('api::mural.mural').create({ data });
      idMap.set(mongoMural._id.toString(), { id: created.id, documentId: created.documentId });
      log.idMaps.Mural.push({
        mongoId: mongoMural._id.toString(),
        title: mongoMural.title,
        strapiDocumentId: created.documentId,
      });
      recordSuccess('Mural');
    } catch (error) {
      recordSkip('Mural', 'create failed', `"${mongoMural.title}" (${mongoMural._id}): ${error.message}`);
    }
  }

  return idMap;
}

function guessMime(ext) {
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
  return map[ext.toLowerCase()] || 'application/octet-stream';
}

async function headS3Object(url) {
  const { hostname, pathname } = new URL(url);
  const bucket = hostname.split('.')[0];
  const key = decodeURIComponent(pathname.replace(/^\//, ''));
  const res = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  return { sizeBytes: res.ContentLength, mime: res.ContentType };
}

async function migratePhotos(app, mongoMurals, muralIdMap) {
  const idMap = new Map();

  for (const mongoMural of mongoMurals) {
    const mural = muralIdMap.get(mongoMural._id.toString());

    for (const mongoPhoto of mongoMural.photos || []) {
      recordAttempt('Photo');

      if (!mural) {
        recordSkip(
          'Photo',
          'parent mural failed to migrate',
          `photo subdoc ${mongoPhoto._id} on mural "${mongoMural.title}" (${mongoMural._id})`
        );
        continue;
      }

      try {
        const url = mongoPhoto.photo;
        const basename = decodeURIComponent(new URL(url).pathname.split('/').pop());
        const ext = path.extname(basename) || '.jpg';
        const name = basename;
        // unique even when the same S3 URL is referenced from more than one
        // Mongo photo subdoc (real production data wouldn't do this, but
        // worth being defensive about it)
        const hash = `${mongoPhoto._id}_${path.basename(basename, ext)}`;

        let sizeBytes = 0;
        let mime = guessMime(ext);
        try {
          const head = await headS3Object(url);
          sizeBytes = head.sizeBytes ?? 0;
          mime = head.mime || mime;
        } catch (headError) {
          recordWarning(
            'Photo',
            `HEAD ${url} failed (${headError.name || headError.message}) - file record created with placeholder size/mime, not verified against the bucket`
          );
        }

        // Inserted directly via the query layer, not strapi.documents() or
        // the upload service's own create flow, specifically to avoid
        // re-uploading or re-processing the image - this just registers a
        // file row pointing at what's already in the bucket.
        const file = await app.db.query('plugin::upload.file').create({
          data: {
            name,
            hash,
            ext,
            mime,
            size: Math.round((sizeBytes / 1024) * 100) / 100, // Strapi stores `size` in KB
            url,
            provider: 'aws-s3',
            publishedAt: new Date(),
          },
        });

        const createdPhoto = await app.documents('api::photo.photo').create({
          data: { mural: mural.id, photo: file.id },
        });

        idMap.set(mongoPhoto._id.toString(), { id: createdPhoto.id, documentId: createdPhoto.documentId });
        log.idMaps.Photo.push({
          mongoId: mongoPhoto._id.toString(),
          muralTitle: mongoMural.title,
          strapiDocumentId: createdPhoto.documentId,
        });
        recordSuccess('Photo');
      } catch (error) {
        recordSkip(
          'Photo',
          'create failed',
          `photo subdoc ${mongoPhoto._id} on mural "${mongoMural.title}": ${error.message}`
        );
      }
    }
  }

  return idMap;
}

async function migrateLikes(app, mongoMurals, userIdMap, photoIdMap) {
  const seenPairs = new Set(); // `${userId}|${photoId}` - enforces the one-like-per-user-per-photo invariant during migration too

  for (const mongoMural of mongoMurals) {
    for (const mongoPhoto of mongoMural.photos || []) {
      for (const mongoUserId of mongoPhoto.likes || []) {
        recordAttempt('Like');

        const user = userIdMap.get(mongoUserId.toString());
        const photo = photoIdMap.get(mongoPhoto._id.toString());
        const context = `user ${mongoUserId} on photo ${mongoPhoto._id} (mural "${mongoMural.title}")`;

        if (!user) {
          recordSkip('Like', 'referenced user does not exist or failed to migrate', context);
          continue;
        }
        if (!photo) {
          recordSkip('Like', 'referenced photo failed to migrate', context);
          continue;
        }
        const pairKey = `${user.id}|${photo.id}`;
        if (seenPairs.has(pairKey)) {
          recordSkip('Like', 'duplicate like for the same user+photo (one-per-user-per-photo invariant)', context);
          continue;
        }

        try {
          await app.documents('api::like.like').create({ data: { photo: photo.id, user: user.id } });
          seenPairs.add(pairKey);
          recordSuccess('Like');
        } catch (error) {
          recordSkip('Like', 'create failed', `${context}: ${error.message}`);
        }
      }
    }
  }
}

async function migrateFavorites(app, mongoMurals, userIdMap, muralIdMap) {
  for (const mongoMural of mongoMurals) {
    const mural = muralIdMap.get(mongoMural._id.toString());
    const favoriteUserIds = [];

    for (const mongoUserId of mongoMural.favorite || []) {
      recordAttempt('Favorite');
      const context = `user ${mongoUserId} favoriting mural "${mongoMural.title}" (${mongoMural._id})`;

      if (!mural) {
        recordSkip('Favorite', 'mural failed to migrate', context);
        continue;
      }
      const user = userIdMap.get(mongoUserId.toString());
      if (!user) {
        recordSkip('Favorite', 'referenced user does not exist or failed to migrate', context);
        continue;
      }
      favoriteUserIds.push(user.id);
    }

    if (favoriteUserIds.length === 0) continue;

    // One connect() call per mural carrying every favorite resolved for it -
    // if it fails, every favorite that was about to be connected for this
    // mural is counted as failed, not just a single generic entry.
    //
    // Uses strapi.db.query() rather than strapi.documents().update(): the
    // Document Service's update() silently no-ops (returns null, writes
    // nothing) when called from a standalone bootstrapped script instead of
    // through an actual HTTP request - see MIGRATION_NOTES.md Phase 3. Also
    // needs numeric ids, not documentId strings, here - db.query()'s
    // relation `connect` doesn't accept documentId.
    try {
      await app.db.query('api::mural.mural').update({
        where: { id: mural.id },
        data: { favoritedBy: { connect: favoriteUserIds } },
      });
      log.summary.Favorite.succeeded += favoriteUserIds.length;
    } catch (error) {
      log.summary.Favorite.failed += favoriteUserIds.length;
      log.skips.push({
        type: 'Favorite',
        reason: 'connect failed',
        detail: `mural "${mongoMural.title}" (${mongoMural._id}), ${favoriteUserIds.length} favorite(s): ${error.message}`,
      });
    }
  }
}

function writeLog() {
  const lines = [];
  lines.push('# Migration Log');
  lines.push('');
  lines.push(`Run at: ${log.startedAt.toISOString()}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Content Type | Attempted | Succeeded | Failed |');
  lines.push('|---|---|---|---|');
  for (const [type, counts] of Object.entries(log.summary)) {
    lines.push(`| ${type} | ${counts.attempted} | ${counts.succeeded} | ${counts.failed} |`);
  }
  lines.push('');

  lines.push('## ID Mappings');
  lines.push('');
  lines.push('### Users (Mongo `_id` -> Strapi `documentId`)');
  lines.push('');
  lines.push('| Mongo _id | username | Strapi documentId |');
  lines.push('|---|---|---|');
  for (const row of log.idMaps.User) {
    lines.push(`| ${row.mongoId} | ${row.username} | ${row.strapiDocumentId} |`);
  }
  lines.push('');
  lines.push('### Murals (Mongo `_id` -> Strapi `documentId`)');
  lines.push('');
  lines.push('| Mongo _id | title | Strapi documentId |');
  lines.push('|---|---|---|');
  for (const row of log.idMaps.Mural) {
    lines.push(`| ${row.mongoId} | ${row.title} | ${row.strapiDocumentId} |`);
  }
  lines.push('');
  lines.push('### Photos (Mongo photo subdoc `_id` -> Strapi `documentId`)');
  lines.push('');
  lines.push('| Mongo photo _id | parent mural | Strapi documentId |');
  lines.push('|---|---|---|');
  for (const row of log.idMaps.Photo) {
    lines.push(`| ${row.mongoId} | ${row.muralTitle} | ${row.strapiDocumentId} |`);
  }
  lines.push('');

  lines.push('## Skipped Records');
  lines.push('');
  if (log.skips.length === 0) {
    lines.push('None.');
  } else {
    for (const skip of log.skips) {
      lines.push(`- **[${skip.type}]** ${skip.reason} — ${skip.detail}`);
    }
  }
  lines.push('');

  lines.push('## Warnings (non-fatal)');
  lines.push('');
  if (log.warnings.length === 0) {
    lines.push('None.');
  } else {
    for (const warning of log.warnings) {
      lines.push(`- **[${warning.type}]** ${warning.detail}`);
    }
  }
  lines.push('');

  const outPath = path.join(__dirname, '..', 'MIGRATION_LOG.md');
  fs.writeFileSync(outPath, lines.join('\n'));
  return outPath;
}

async function main() {
  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db();

  const appContext = await strapiPkg.compileStrapi();
  const app = await strapiPkg.createStrapi(appContext).load();

  try {
    await resetStrapiData(app);

    const mongoUsers = await db.collection('users').find({}).toArray();
    const mongoMurals = await db.collection('murals').find({}).toArray();

    const userIdMap = await migrateUsers(app, mongoUsers);
    const muralIdMap = await migrateMurals(app, mongoMurals, userIdMap);
    const photoIdMap = await migratePhotos(app, mongoMurals, muralIdMap);
    await migrateLikes(app, mongoMurals, userIdMap, photoIdMap);
    await migrateFavorites(app, mongoMurals, userIdMap, muralIdMap);

    const outPath = writeLog();
    console.log('\nMigration complete. Summary:');
    console.table(log.summary);
    console.log(`Full log written to ${outPath}`);
  } finally {
    await mongoClient.close();
    await app.destroy();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
