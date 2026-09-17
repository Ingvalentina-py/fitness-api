import bcrypt from 'bcryptjs'
import { BCRYPT_ROUNDS } from '../constants/auth.js'

// Hash de una contraseña inventada (con el mismo costo). Se usa para comparar
// cuando el correo no existe, así el tiempo de respuesta no revela qué correos
// están registrados.
export const DUMMY_PASSWORD_HASH = '$2b$11$k2fDdWl1aa4RlwnUsaIr6uCQoB3g4VRj0Fqf97uy7VQMwf.VKQNQ2'

// bcrypt agrega una "sal" aleatoria: la misma contraseña produce hashes distintos
export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash)
}
