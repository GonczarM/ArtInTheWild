import sendRequest from './send-request';
const BASE_URL = '/api/users';

export function signUp(userData) {
  return sendRequest(`${BASE_URL}/register`, 'POST', userData);
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}

export function getUserMurals(userId) {
  return sendRequest(`${BASE_URL}/${userId}`);
}

export function deleteUser(userId){
  return sendRequest(`${BASE_URL}/${userId}`, 'DELETE')
}