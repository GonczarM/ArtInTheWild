'use strict';

/**
 * mural router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::mural.mural', {
  config: {
    update: { policies: ['api::mural.is-owner'] },
    delete: { policies: ['api::mural.is-owner'] },
  },
});
