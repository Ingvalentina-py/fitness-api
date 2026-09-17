import * as authService from '../services/auth.service.js'
import * as userService from '../services/user.service.js'
import { setSessionCookie } from '../utils/sessionCookie.js'

// GET /api/v1/users/me
export function getMe(req, res) {
  res.json({ data: req.user })
}

// PATCH /api/v1/users/me
export async function updateMe(req, res) {
  const user = await userService.updateProfile(req.user, req.validated.body)

  res.json({ data: user })
}

// PATCH /api/v1/users/me/password
export async function changePassword(req, res) {
  const user = await userService.changePassword(req.user._id, req.validated.body)

  // Las sesiones anteriores quedaron invalidadas: este dispositivo recibe un token nuevo
  setSessionCookie(res, await authService.createSessionToken(user))
  res.json({ data: user })
}
