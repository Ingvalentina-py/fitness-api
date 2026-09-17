import { env } from '../config/env.js'
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from '../constants/auth.js'

const baseCookieOptions = {
  // El JavaScript del navegador no puede leerla: un script malicioso no la roba
  httpOnly: true,
  // En producción solo viaja por HTTPS
  secure: env.NODE_ENV === 'production',
  // No se envía en peticiones que otros sitios hagan a la API (protege contra CSRF)
  sameSite: 'lax',
  path: '/',
}

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    ...baseCookieOptions,
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, baseCookieOptions)
}

export function getSessionToken(req) {
  return req.cookies?.[SESSION_COOKIE_NAME]
}
