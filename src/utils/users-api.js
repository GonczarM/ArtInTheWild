import sendRequest from './send-request';
const BASE_URL = '/api/users';

export function signUp(userData) {
  return sendRequest(`${BASE_URL}/register`, 'POST', userData);
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}

export function getUserMurals() {
  return sendRequest(`${BASE_URL}/murals`);
}

export function getUserFavorites(){
  return sendRequest(`${BASE_URL}/favorites`)
}

export function favoriteMural(muralId){
  return sendRequest(`${BASE_URL}/favorite/${muralId}`, 'PUT')
}

export function deleteUser(){
  return sendRequest(`${BASE_URL}`, 'DELETE')
}