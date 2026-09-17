import * as authService from '../services/auth.service.js'
import { clearSessionCookie, setSessionCookie } from '../utils/sessionCookie.js'

async function startSession(res, user) {
  const token = await authService.createSessionToken(user)
  setSessionCookie(res, token)
}

// POST /api/v1/auth/register
export async function register(req, res) {
  const user = await authService.register(req.validated.body)
  await startSession(res, user)

  res.status(201).json({ data: user })
}

// POST /api/v1/auth/login
export async function login(req, res) {
  const user = await authService.login(req.validated.body)
  await startSession(res, user)

  res.json({ data: user })
}

// POST /api/v1/auth/logout
export function logout(_req, res) {
  clearSessionCookie(res)
  res.status(204).end()
}
