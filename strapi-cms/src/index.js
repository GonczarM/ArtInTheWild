'use strict';

// Phase 2 permission seeding: mirrors the old Express app's auth model
// (see MIGRATION_NOTES.md "Auth model summary") onto Strapi's
// users-permissions roles, in code rather than as untracked admin-panel
// clicks, so the next phase/session can see what's public vs authenticated
// just by reading this file.
//
// - Public (no token): read-only on Mural/Photo/Like, plus the allowlisted
//   search routes - matches the old app's public GET /api/murals/*.
// - Authenticated (any logged-in user): everything Public has, plus
//   create/update/delete on Mural/Photo and create/delete on Like.
//   Per-owner restrictions (e.g. only the mural's creator can edit/delete
//   it) are NOT enforced here - Strapi's default role permissions are
//   "any authenticated user can," same shape as the old app's
//   ensureLoggedIn middleware. The old app's extra ownership check
//   (`req.user._id === mural.user`) has no Strapi equivalent yet; flagged
//   in MIGRATION_NOTES.md as a Phase 4 follow-up rather than built here,
//   since it wasn't part of the Phase 2 schema-building scope.
const ROLE_ACTIONS = {
  public: [
    // Without this, GET /api/murals?populate=user omits the `user` relation
    // entirely for anonymous requests (Strapi requires read access to a
    // relation's target type to populate it, same gate as the write-side
    // check below) - granted because the old Express app's public mural
    // list always included the raw `user` ObjectId, populated or not.
    'plugin::users-permissions.user.find',
    'api::mural.mural.find',
    'api::mural.mural.findOne',
    'api::mural.mural.search',
    'api::mural.mural.searchList',
    'api::photo.photo.find',
    'api::photo.photo.findOne',
    'api::like.like.find',
    'api::like.like.findOne',
  ],
  authenticated: [
    // Strapi requires read (`find`) access to a relation's target type
    // before that relation can be *set* on create/update (see
    // @strapi/utils throw-restricted-relations.js) - needed here so a
    // logged-in user can attach themselves as a Mural/Photo/Like's `user`.
    'plugin::users-permissions.user.find',
    'plugin::upload.content-api.upload',
    'api::mural.mural.find',
    'api::mural.mural.findOne',
    'api::mural.mural.search',
    'api::mural.mural.searchList',
    'api::mural.mural.create',
    'api::mural.mural.update',
    'api::mural.mural.delete',
    'api::photo.photo.find',
    'api::photo.photo.findOne',
    'api::photo.photo.create',
    'api::photo.photo.update',
    'api::photo.photo.delete',
    'api::like.like.find',
    'api::like.like.findOne',
    'api::like.like.create',
    'api::like.like.delete',
  ],
};

function actionToTreePath(action) {
  // 'api::mural.mural.find' -> typeName: 'api::mural', controllerName: 'mural', actionName: 'find'
  const lastDot = action.lastIndexOf('.');
  const actionName = action.slice(lastDot + 1);
  const rest = action.slice(0, lastDot); // 'api::mural.mural'
  const secondLastDot = rest.lastIndexOf('.');
  const controllerName = rest.slice(secondLastDot + 1);
  const typeName = rest.slice(0, secondLastDot);
  return { typeName, controllerName, actionName };
}

async function grantRoleActions(strapi, roleType, actionsToAdd) {
  const roleService = strapi.plugin('users-permissions').service('role');

  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: roleType }, populate: ['permissions'] });
  if (!role) return;

  const existingActions = role.permissions.map((p) => p.action);
  const allActions = Array.from(new Set([...existingActions, ...actionsToAdd]));

  const permissions = {};
  for (const action of allActions) {
    const { typeName, controllerName, actionName } = actionToTreePath(action);
    permissions[typeName] ??= { controllers: {} };
    permissions[typeName].controllers[controllerName] ??= {};
    permissions[typeName].controllers[controllerName][actionName] = { enabled: true };
  }

  await roleService.updateRole(role.id, { name: role.name, description: role.description, permissions });
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await grantRoleActions(strapi, 'public', ROLE_ACTIONS.public);
    await grantRoleActions(strapi, 'authenticated', ROLE_ACTIONS.authenticated);
  },
};
