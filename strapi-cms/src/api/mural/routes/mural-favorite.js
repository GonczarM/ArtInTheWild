'use strict';

/**
 * Custom favorite-a-mural route.
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'PUT',
      path: '/murals/:id/favorite',
      handler: 'mural.favorite',
      config: {
        policies: [],
      },
    },
  ],
};
