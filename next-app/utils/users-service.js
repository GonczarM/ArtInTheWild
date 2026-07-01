import * as usersAPI from './users-api'

const TOKEN_COOKIE = 'token'
const USER_COOKIE = 'user'

// Strapi's JWT payload is just { id, iat, exp } - unlike the old custom JWT,
// it doesn't carry the user object, so there's nothing to decode getUser()
// out of. The user object Strapi returns alongside the jwt at login/register
// time is cached in its own cookie instead, so getUser() can stay
// synchronous for every existing caller (Header, providers.js, etc.)
// without needing to become async and hit /api/users/me.
function decodeExp(token) {
  return JSON.parse(window.atob(token.split('.')[1])).exp
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setSession(jwt, user) {
  const exp = decodeExp(jwt)
  const maxAge = Math.max(0, exp - Math.floor(Date.now() / 1000))
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(jwt)}; path=/; max-age=${maxAge}; samesite=lax`
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; samesite=lax`
}

export async function login(userData) {
  const { jwt, user } = await usersAPI.login(userData);
  setSession(jwt, user)
  return user
}

export function getToken() {
  const token = readCookie(TOKEN_COOKIE);
  if (!token) return null;
  if (decodeExp(token) < Date.now() / 1000) {
    logOut();
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  const raw = readCookie(USER_COOKIE);
  return raw ? JSON.parse(raw) : null;
}

export function logOut() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0`;
}

export async function signUp(userData){
  const { jwt, user } = await usersAPI.signUp(userData)
  setSession(jwt, user)
  return user
}
