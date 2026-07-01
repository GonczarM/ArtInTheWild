'use strict';

/**
 * Seeds Strapi's Mural content type from the City of Chicago's public
 * "Mural Registry" open dataset. Not part of the running app - a
 * standalone tool, same pattern as scripts/migrate.js. Run from inside
 * strapi-cms/:
 *
 *   node scripts/seed-chicago.js
 *
 * Source, verified live during research (not assumed from the old,
 * now-deleted Express seed route): the Socrata dataset "Mural Registry"
 * (City of Chicago, Historic Preservation category), confirmed reachable
 * unauthenticated at the URL below, ~458 rows as of this writing, last
 * updated 2025-02-28. No app token is required for this volume of read
 * access, but one can optionally be set via SOCRATA_APP_TOKEN (sent as
 * X-App-Token) per Socrata's general recommendation for reliability on
 * repeated/production use - see MIGRATION_NOTES.md for details.
 *
 * Every seeded Mural has no `user` - these are public-record murals, not
 * user submissions, consistent with the existing optional-owner/orphaning
 * decision (MIGRATION_NOTES.md §4 #4). No Photo/Like data is seeded: the
 * dataset has no image/photo URL field at all (`media` is a free-text
 * description of the medium, e.g. "Acrylic and exterior latex paint", not
 * a file) - flagged rather than assumed, see MIGRATION_NOTES.md.
 *
 * Safe to re-run: wipes existing Mural/Photo/Like content and every
 * non-admin User before seeding, same as migrate.js.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const strapiPkg = require('@strapi/strapi');

const SOCRATA_URL = 'https://data.cityofchicago.org/resource/we8h-apcf.json';
const SOCRATA_APP_TOKEN = process.env.SOCRATA_APP_TOKEN; // optional

const log = {
  startedAt: new Date(),
  summary: { Mural: { attempted: 0, succeeded: 0, failed: 0 } },
  skips: [],
  sample: [],
};

function recordSkip(reason, detail) {
  log.summary.Mural.failed++;
  log.skips.push({ reason, detail });
}

async function fetchChicagoMurals() {
  const headers = SOCRATA_APP_TOKEN ? { 'X-App-Token': SOCRATA_APP_TOKEN } : {};
  // $limit set comfortably above the known row count (458 at research time)
  // so dataset growth doesn't silently truncate - Socrata's own default cap
  // is 1000 rows per request if $limit is omitted, this just makes it explicit.
  const res = await fetch(`${SOCRATA_URL}?$limit=5000`, { headers });
  if (!res.ok) {
    throw new Error(`Socrata request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function parseYear(value) {
  const year = parseInt(value, 10);
  return Number.isInteger(year) ? year : undefined;
}

function toMuralData(record) {
  const data = {
    title: record.artwork_title,
    artist: record.artist_credit || undefined,
    description: record.description_of_artwork || undefined,
    affiliation: record.affiliated_or_commissioning || undefined,
    address: record.street_address,
    zipcode: record.zip || undefined,
    latitude: Number(record.latitude),
    longitude: Number(record.longitude),
    year: record.year_installed ? parseYear(record.year_installed) : undefined,
  };
  Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
  return data;
}

async function resetStrapiData(app) {
  const counts = {};
  counts.Like = (await app.db.query('api::like.like').deleteMany({ where: {} })).count;
  counts.Photo = (await app.db.query('api::photo.photo').deleteMany({ where: {} })).count;
  counts.Mural = (await app.db.query('api::mural.mural').deleteMany({ where: {} })).count;
  counts.File = (await app.db.query('plugin::upload.file').deleteMany({ where: {} })).count;
  counts.User = (await app.db.query('plugin::users-permissions.user').deleteMany({ where: {} })).count;
  app.log.info(`[seed-chicago] reset: cleared ${JSON.stringify(counts)} existing records before seeding`);
}

async function seedMurals(app, records) {
  // The source dataset contains literal duplicate titles (confirmed during
  // research) - the old Express seed route deduped on title, kept the same
  // behavior here for consistency rather than deciding it needed to change.
  const seenTitles = new Set();

  for (const record of records) {
    log.summary.Mural.attempted++;
    const ref = `mural_registration_id ${record.mural_registration_id}`;

    // The schema only requires title + address now, but a mural with no
    // coordinates isn't useful in this map-centric app, so still filtered
    // on address/lat/long even though they're no longer schema-required.
    if (!record.artwork_title || !record.street_address || !record.latitude || !record.longitude) {
      recordSkip('missing title/address/coordinates', ref);
      continue;
    }
    if (seenTitles.has(record.artwork_title)) {
      recordSkip('duplicate title (matches an already-seeded record)', `"${record.artwork_title}" (${ref})`);
      continue;
    }

    try {
      const created = await app.documents('api::mural.mural').create({ data: toMuralData(record) });
      seenTitles.add(record.artwork_title);
      log.summary.Mural.succeeded++;
      if (log.sample.length < 10) {
        log.sample.push({ title: created.title, documentId: created.documentId, address: created.address });
      }
    } catch (error) {
      recordSkip('create failed', `"${record.artwork_title}" (${ref}): ${error.message}`);
    }
  }
}

function writeLog() {
  const lines = [];
  lines.push('# Chicago Seed Log');
  lines.push('');
  lines.push(`Run at: ${log.startedAt.toISOString()}`);
  lines.push(`Source: ${SOCRATA_URL}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Content Type | Attempted | Succeeded | Failed |');
  lines.push('|---|---|---|---|');
  lines.push(`| Mural | ${log.summary.Mural.attempted} | ${log.summary.Mural.succeeded} | ${log.summary.Mural.failed} |`);
  lines.push('');
  lines.push('## Sample of seeded murals (for spot-checking against the source API)');
  lines.push('');
  lines.push('| Title | Strapi documentId | Address |');
  lines.push('|---|---|---|');
  for (const row of log.sample) {
    lines.push(`| ${row.title} | ${row.documentId} | ${row.address} |`);
  }
  lines.push('');
  lines.push('## Skipped Records');
  lines.push('');
  if (log.skips.length === 0) {
    lines.push('None.');
  } else {
    for (const skip of log.skips) {
      lines.push(`- **${skip.reason}** — ${skip.detail}`);
    }
  }
  lines.push('');

  const outPath = path.join(__dirname, '..', 'CHICAGO_SEED_LOG.md');
  fs.writeFileSync(outPath, lines.join('\n'));
  return outPath;
}

async function main() {
  const records = await fetchChicagoMurals();
  console.log(`Fetched ${records.length} records from the Chicago Mural Registry API.`);

  const appContext = await strapiPkg.compileStrapi();
  const app = await strapiPkg.createStrapi(appContext).load();

  try {
    await resetStrapiData(app);
    await seedMurals(app, records);

    const outPath = writeLog();
    console.log('\nSeed complete. Summary:');
    console.table(log.summary);
    console.log(`Full log written to ${outPath}`);
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
