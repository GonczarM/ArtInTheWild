import sendRequest from './send-request';

const BASE_URL = '/api/murals';

const POPULATE =
  'populate[user]=true' +
  '&populate[favoritedBy]=true' +
  '&populate[photos][populate][photo]=true' +
  '&populate[photos][populate][likes][populate][user]=true';

// The old Mongoose `Mural.find({})` had no pagination; Strapi defaults to
// 25 per page. Bumped up to roughly match old unpaginated behavior at this
// app's scale rather than actually building pagination UI.
const UNPAGINATED = 'pagination[pageSize]=100';

export async function createMural(data) {
  const res = await sendRequest(`${BASE_URL}?${POPULATE}`, 'POST', { data });
  return { mural: res.data };
}

export async function getMurals() {
  const res = await sendRequest(`${BASE_URL}?${POPULATE}&${UNPAGINATED}`);
  return { murals: res.data };
}

export async function getMural(muralId) {
  const res = await sendRequest(`${BASE_URL}/${muralId}?${POPULATE}`);
  return { mural: res.data };
}

export async function getMuralsWithPhoto() {
  const res = await sendRequest(`${BASE_URL}?${POPULATE}&${UNPAGINATED}`);
  return { murals: res.data.filter((mural) => mural.photos && mural.photos.length > 0) };
}

export async function searchMuralsByType(searchData) {
  return sendRequest(`${BASE_URL}/list/${searchData.type}/${encodeURIComponent(searchData.term)}`);
}

export async function searchMurals(searchData) {
  const res = await sendRequest(`${BASE_URL}/search/${searchData.type}/${encodeURIComponent(searchData.term)}`);
  return { murals: res.data };
}

export async function editMural(data, muralId) {
  const res = await sendRequest(`${BASE_URL}/${muralId}?${POPULATE}`, 'PUT', { data });
  return { mural: res.data };
}

export async function deleteMural(muralId) {
  const res = await sendRequest(`${BASE_URL}/${muralId}`, 'DELETE');
  return { mural: res.data };
}

export async function getUserMurals(userId) {
  const res = await sendRequest(`${BASE_URL}?filters[user][id][$eq]=${userId}&${POPULATE}&${UNPAGINATED}`);
  return { murals: res.data };
}

export async function getUserFavorites(userId) {
  const res = await sendRequest(`${BASE_URL}?filters[favoritedBy][id][$eq]=${userId}&${POPULATE}&${UNPAGINATED}`);
  return { murals: res.data };
}

export async function favoriteMural(muralId) {
  const res = await sendRequest(`${BASE_URL}/${muralId}/favorite`, 'PUT');
  return { mural: res.data };
}
