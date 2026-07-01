'use strict';

/**
 * mural controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { errors } = require('@strapi/utils');

// Per MIGRATION_NOTES.md Phase 0 decision #7: only these three fields are
// actually searched by the frontend, so the old open-ended :type param
// (any Mongo field name) is replaced with a server-enforced allowlist.
const SEARCHABLE_FIELDS = ['title', 'artist', 'zipcode'];

function assertSearchableField(type) {
  if (!SEARCHABLE_FIELDS.includes(type)) {
    throw new errors.ValidationError(
      `"${type}" is not a searchable field. Use one of: ${SEARCHABLE_FIELDS.join(', ')}.`
    );
  }
}

// Matches the populate depth next-app/utils/murals-api.js requests on every
// other mural endpoint, so search results carry the same shape (ownership
// checks, photo/like display, favoriting) as a regular list/detail fetch.
const FULL_POPULATE = {
  user: true,
  favoritedBy: true,
  photos: {
    populate: {
      photo: true,
      likes: { populate: ['user'] },
    },
  },
};

module.exports = createCoreController('api::mural.mural', ({ strapi }) => ({
  async search(ctx) {
    const { type, term } = ctx.params;
    assertSearchableField(type);

    const results = await strapi.documents('api::mural.mural').findMany({
      filters: { [type]: { $containsi: term } },
      populate: FULL_POPULATE,
    });

    const sanitizedResults = await this.sanitizeOutput(results, ctx);
    return this.transformResponse(sanitizedResults);
  },

  async searchList(ctx) {
    const { type, term } = ctx.params;
    assertSearchableField(type);

    const results = await strapi.documents('api::mural.mural').findMany({
      filters: { [type]: { $containsi: term } },
      fields: [type],
    });

    const searchList = [];
    for (const mural of results) {
      if (searchList.length >= 10) break;
      if (!searchList.includes(mural[type])) searchList.push(mural[type]);
    }

    ctx.body = { searchList };
  },

  // Deliberately its own action/route, not routed through the generic
  // `update` - that's gated by the is-owner policy, but favoriting was
  // always meant to be open to any authenticated user regardless of who
  // owns the mural (the old Express app had it as a wholly separate route,
  // PUT /api/users/favorite/:id, with no ownership check at all). Always
  // connects the *requesting* user, never a user id from the body, mirroring
  // how that old route always used req.user, never a target id.
  async favorite(ctx) {
    const user = ctx.state.user;
    if (!user) {
      throw new errors.UnauthorizedError('You must be logged in to favorite a mural.');
    }

    const { id: documentId } = ctx.params;
    // documents().update() takes ONE options object ({ documentId, data, ... }) -
    // not (documentId, { data }) as two arguments. Getting this wrong makes it
    // silently do nothing (documentId ends up undefined inside the function,
    // no error, no write) - see MIGRATION_NOTES.md for how this was
    // misdiagnosed once already.
    await strapi.documents('api::mural.mural').update({
      documentId,
      data: { favoritedBy: { connect: [user.id] } },
    });

    const updated = await strapi.documents('api::mural.mural').findOne({
      documentId,
      populate: FULL_POPULATE,
    });
    const sanitized = await this.sanitizeOutput(updated, ctx);
    return this.transformResponse(sanitized);
  },
}));
