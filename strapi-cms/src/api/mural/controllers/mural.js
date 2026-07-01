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
}));
