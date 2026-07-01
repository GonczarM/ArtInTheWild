'use strict';

/**
 * account routes
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'DELETE',
      path: '/account/me',
      handler: 'account.deleteMe',
      config: {
        policies: [],
      },
    },
  ],
};
