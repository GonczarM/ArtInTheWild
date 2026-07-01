import sendRequest from './send-request';

export function likePhoto(photoId) {
  return sendRequest('/api/likes', 'POST', { data: { photo: photoId } });
}
