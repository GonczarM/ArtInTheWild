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

    // Orphaning decision from Phase 0 (MIGRATION_NOTES.md §4 #4): deleting a
    // user leaves their murals in place with no owner, rather than
    // cascade-deleting them the way the old Express app did.
    //
    // strapi.db.query().updateMany() rejects `user: null` outright
    // ("Update requires data" - relation fields need connect/disconnect/set,
    // not a bare null, at that layer). strapi.documents().update() does
    // accept null for clearing an xToOne relation, but has no bulk form, so
    // this loops one document at a time. Takes ONE options object
    // ({ documentId, data, ... }), not (documentId, { data }) as two
    // arguments - see MIGRATION_NOTES.md for how getting this wrong was
    // misdiagnosed once already as a context-dependent bug in Strapi itself.
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
