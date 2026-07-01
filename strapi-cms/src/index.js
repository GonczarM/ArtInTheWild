'use strict';

const ROLE_ACTIONS = {
  public: [
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
    'plugin::users-permissions.user.find',
    'plugin::upload.content-api.upload',
    'api::mural.mural.find',
    'api::mural.mural.findOne',
    'api::mural.mural.search',
    'api::mural.mural.searchList',
    'api::mural.mural.create',
    'api::mural.mural.update',
    'api::mural.mural.delete',
    'api::mural.mural.favorite',
    'api::photo.photo.find',
    'api::photo.photo.findOne',
    'api::photo.photo.create',
    'api::photo.photo.update',
    'api::photo.photo.delete',
    'api::like.like.find',
    'api::like.like.findOne',
    'api::like.like.create',
    'api::like.like.delete',
    'api::account.account.deleteMe',
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
