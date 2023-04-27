import sendRequest from './send-request';
const BASE_URL = '/api/murals';

export function createMural(muralData) {
  return sendRequest(BASE_URL, 'POST', muralData);
}

export function editMural(muralData, muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'PUT', muralData)
}

export function searchMurals(searchData){
  return sendRequest(`${BASE_URL}/search/${searchData}`)
}

export function deleteMural(muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'DELETE')
}

export function getMural(muralId){
  return sendRequest(`${BASE_URL}/${muralId}`)
}

export function addPhoto(photoData, muralId){
  return sendRequest(`${BASE_URL}/photo/${muralId}`, 'PUT', photoData)
}

// Chicago Mural API
// https://dev.socrata.com/foundry/data.cityofchicago.org/we8h-apcf
const API_URL = 'https://data.cityofchicago.org/resource/we8h-apcf.json'

export async function getMuralsAPI(){
  const res = await fetch(API_URL);
  if (res.ok) return res.json();
  throw new Error('Bad Request');
}

export async function getMuralAPI(muralId){
  const res = await fetch(`${API_URL}?mural_registration_id=${muralId}`)
  if (res.ok) return res.json();
  throw new Error('Bad Request');
}
