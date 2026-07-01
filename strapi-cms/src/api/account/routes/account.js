'use strict';

/**
 * account routes
 *
 * Not a content type - just a couple of self-scoped actions on the
 * currently authenticated user. Strapi's built-in
 * `DELETE /api/users/:id` takes an arbitrary target id with no
 * self-only restriction, which isn't what the old Express app did
 * (`DELETE /api/users` always deleted `req.user`, never took an id at
 * all). This mirrors that: no id param, so there's no way to even
 * attempt targeting another user.
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
