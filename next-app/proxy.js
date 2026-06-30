import { NextResponse } from 'next/server'

// Optimistic auth check (decodes the JWT payload, does not verify the signature -
// Express still owns real verification/authorization on every API call).
// Mirrors the original client-side guard in UserShow: if there's no logged-in user,
// bounce to the home page instead of rendering the profile page.
function hasValidToken(request) {
  const token = request.cookies.get('token')?.value
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp > Date.now() / 1000
  } catch {
    return false
  }
}

export function proxy(request) {
  if (!hasValidToken(request)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/user/:username',
}
