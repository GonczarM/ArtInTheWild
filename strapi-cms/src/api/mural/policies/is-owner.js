'use strict';

/**
 * is-owner policy
 */

const { errors } = require('@strapi/utils');

module.exports = async (ctx, config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) {
    throw new errors.UnauthorizedError('You must be logged in to do that.');
  }

  const { id: documentId } = ctx.params;
  const mural = await strapi.documents('api::mural.mural').findOne({
    documentId,
    populate: ['user'],
  });

  if (!mural) return true;

  if (!mural.user || mural.user.id !== user.id) {
    throw new errors.ForbiddenError('You can only edit or delete your own murals.');
  }

  return true;
};
