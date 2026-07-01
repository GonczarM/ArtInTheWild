'use strict';

/**
 * Custom favorite-a-mural route. Kept separate from the generic `update`
 * route (routes/mural.js) specifically so it isn't gated by the is-owner
 * policy - see the `favorite` action in controllers/mural.js for why.
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
