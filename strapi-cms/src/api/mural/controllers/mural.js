'use strict';

/**
 * mural controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { errors } = require('@strapi/utils');

const SEARCHABLE_FIELDS = ['title', 'artist', 'zipcode'];

function assertSearchableField(type) {
  if (!SEARCHABLE_FIELDS.includes(type)) {
    throw new errors.ValidationError(
      `"${type}" is not a searchable field. Use one of: ${SEARCHABLE_FIELDS.join(', ')}.`
    );
  }
}

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

  async favorite(ctx) {
    const user = ctx.state.user;
    if (!user) {
      throw new errors.UnauthorizedError('You must be logged in to favorite a mural.');
    }

    const { id: documentId } = ctx.params;

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
