'use strict';

/**
 * account controller
 */

const { errors } = require('@strapi/utils');

module.exports = {
  async deleteMe(ctx) {
    const user = ctx.state.user;
    if (!user) {
      throw new errors.UnauthorizedError('You must be logged in to delete your account.');
    }
    const ownedMurals = await strapi.db
      .query('api::mural.mural')
      .findMany({ where: { user: user.id }, select: ['documentId'] });
    for (const mural of ownedMurals) {
      await strapi.documents('api::mural.mural').update({ documentId: mural.documentId, data: { user: null } });
    }

    const deleted = await strapi.plugin('users-permissions').service('user').remove({ id: user.id });

    ctx.body = { id: deleted.id, documentId: deleted.documentId, username: deleted.username };
  },
};
