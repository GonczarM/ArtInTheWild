import sendRequest from './send-request';
const BASE_URL = '/api/murals';
const API_URL = 'https://data.cityofchicago.org/resource/we8h-apcf.json'

export function createMural(muralData) {
  return sendRequest(BASE_URL, 'POST', muralData);
}

export function editMural(muralData, muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'PUT', muralData)
}

export function searchMurals(searchData){
  return sendRequest(`${BASE_URL}/${searchData}`)
}

export async function getMuralAPI(){
  const res = await fetch(API_URL);
  if (res.ok) return res.json();
  throw new Error('Bad Request');
}

export function deleteMural(muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'DELETE')
}