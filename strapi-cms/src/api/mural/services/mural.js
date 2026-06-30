'use strict';

/**
 * mural service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mural.mural');
