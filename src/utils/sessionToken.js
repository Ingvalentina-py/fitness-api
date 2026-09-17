import { SignJWT, jwtVerify } from 'jose'
import { env } from '../config/env.js'
import { SESSION_DURATION_DAYS } from '../constants/auth.js'

const secretKey = new TextEncoder().encode(env.JWT_SECRET)
const ALGORITHM = 'HS256'

// El token guarda quién eres (sub) y la versión de tus sesiones (ver).
// Al cambiar la contraseña sube la versión y los tokens anteriores dejan de valer.
export function signSessionToken({ userId, tokenVersion }) {
  return new SignJWT({ ver: tokenVersion })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(secretKey)
}

// Lanza un error si la firma no coincide o el token venció.
// `algorithms` evita que acepte tokens firmados con otro algoritmo.
export async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, secretKey, { algorithms: [ALGORITHM] })
  return { userId: payload.sub, tokenVersion: payload.ver }
}
