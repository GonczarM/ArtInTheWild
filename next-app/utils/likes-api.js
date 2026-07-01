import sendRequest from './send-request';

// The custom Like controller (strapi-cms/src/api/like/controllers/like.js)
// always assigns the liking user from the authenticated request itself, not
// from anything in the body, and rejects a duplicate like on the same
// photo+user with a 400.
export function likePhoto(photoId) {
  return sendRequest('/api/likes', 'POST', { data: { photo: photoId } });
}
