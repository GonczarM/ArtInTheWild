import * as usersAPI from './users-api'

const TOKEN_COOKIE = 'token'

function decodePayload(token) {
  return JSON.parse(window.atob(token.split('.')[1]))
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setTokenCookie(token) {
  const { exp } = decodePayload(token)
  const maxAge = Math.max(0, exp - Math.floor(Date.now() / 1000))
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`
}

export async function login(userData) {
  const token = await usersAPI.login(userData);
  setTokenCookie(token)
  return getUser()
}

export function getToken() {
  const token = readCookie(TOKEN_COOKIE);
  if (!token) return null;
  const payload = decodePayload(token);
  if (payload.exp < Date.now() / 1000) {
    logOut();
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  return token ? decodePayload(token).user : null;
}

export function logOut() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export async function signUp(userData){
  const token = await usersAPI.signUp(userData)
  setTokenCookie(token)
  return getUser()
}
