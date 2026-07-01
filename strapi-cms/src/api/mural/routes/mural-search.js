'use strict';

/**
 * Custom mural search routes.
 */

module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/murals/search/:type/:term',
      handler: 'mural.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/murals/list/:type/:term',
      handler: 'mural.searchList',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
