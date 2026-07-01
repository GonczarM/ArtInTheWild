'use strict';

/**
 * Custom mural search routes.
 *
 * Mirrors the old Express GET /api/murals/search/:type/:term and
 * /api/murals/list/:type/:term endpoints in shape, but - per the Phase 0
 * decision in MIGRATION_NOTES.md - :type is restricted server-side to
 * title/artist/zipcode instead of accepting any Mongo field name.
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
