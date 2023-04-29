import sendRequest from './send-request';
const BASE_URL = '/api/murals';

export function createMural(muralData) {
  return sendRequest(BASE_URL, 'POST', muralData);
}

export function addAPIMural(photoData, muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'POST', photoData)
}

export function getMurals(){
  return sendRequest(BASE_URL)
}

export function getMural(muralId){
  return sendRequest(`${BASE_URL}/${muralId}`)
}

export function searchMurals(searchData){
  return sendRequest(`${BASE_URL}/search/${searchData}`)
}

export function editMural(muralData, muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'PUT', muralData)
}

export function addPhoto(photoData, muralId){
  return sendRequest(`${BASE_URL}/photo/${muralId}`, 'PUT', photoData)
}

export function deleteMural(muralId){
  return sendRequest(`${BASE_URL}/${muralId}`, 'DELETE')
}