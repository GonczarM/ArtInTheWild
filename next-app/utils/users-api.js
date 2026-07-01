import sendRequest from './send-request';
const AUTH_URL = '/api/auth/local';

export function signUp(userData) {
  return sendRequest(`${AUTH_URL}/register`, 'POST', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });
}

export function login(credentials) {
  return sendRequest(AUTH_URL, 'POST', {
    identifier: credentials.username,
    password: credentials.password,
  });
}

export function deleteAccount() {
  return sendRequest('/api/account/me', 'DELETE');
}
