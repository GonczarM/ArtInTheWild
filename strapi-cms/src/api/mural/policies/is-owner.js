'use strict';

/**
 * is-owner policy
 *
 * Gates Mural update/delete to the mural's own creator. Deferred from
 * Phase 2 - previously any authenticated user could edit or delete any
 * mural via the API.
 *
 * A mural with no `user` set (orphaned - see MIGRATION_NOTES.md §4 #4)
 * rejects everyone, matching the old Express app's exact behavior: its
 * ownership check was `req.user._id === foundMural.user.toString()`, which
 * is always false when `foundMural.user` is unset, so an orphaned mural
 * could never be edited or deleted via that API either.
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

  // Let a nonexistent mural fall through to the controller's own 404,
  // rather than the policy answering a question about a mural that isn't
  // there.
  if (!mural) return true;

  if (!mural.user || mural.user.id !== user.id) {
    throw new errors.ForbiddenError('You can only edit or delete your own murals.');
  }

  return true;
};
