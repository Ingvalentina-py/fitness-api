import { getUserFromSessionToken } from '../services/auth.service.js'
import { getSessionToken } from '../utils/sessionCookie.js'

// Protege una ruta: si la cookie de sesión es válida, deja a la persona en req.user;
// si no, responde 401. Necesita ensureDatabase antes, porque consulta el usuario.
export async function requireAuth(req, _res, next) {
  req.user = await getUserFromSessionToken(getSessionToken(req))
  next()
}
