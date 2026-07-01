'use strict';

/**
 * like controller
 *
 * Strapi has no built-in way to enforce composite uniqueness across two
 * relations (one user can only like a given photo once), so it's enforced
 * here instead. The liking user always comes from the authenticated
 * request (ctx.state.user), never from the request body - mirrors the old
 * Express app's PUT /api/users/photo/:id, which always liked as req.user,
 * never as an arbitrary user passed in by the client.
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { errors } = require('@strapi/utils');

module.exports = createCoreController('api::like.like', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      throw new errors.UnauthorizedError('You must be logged in to like a photo.');
    }

    const photoId = ctx.request.body?.data?.photo;
    if (!photoId) {
      throw new errors.ValidationError('A photo is required to create a like.');
    }

    const existing = await strapi.documents('api::like.like').findFirst({
      filters: { user: { id: user.id }, photo: { documentId: photoId } },
    });
    if (existing) {
      throw new errors.ApplicationError('You have already liked this photo.');
    }

    ctx.request.body.data.user = user.id;

    return super.create(ctx);
  },
}));
