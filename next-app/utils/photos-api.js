import sendRequest from './send-request';

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('files', file);
  const [uploaded] = await sendRequest('/api/upload', 'POST', formData);
  return uploaded;
}

const POPULATE = 'populate[photo]=true&populate[likes][populate][user]=true';

export async function addPhoto(file, muralId) {
  const uploaded = await uploadFile(file);
  const res = await sendRequest(`/api/photos?${POPULATE}`, 'POST', {
    data: { mural: muralId, photo: uploaded.id },
  });
  return { photo: res.data };
}
