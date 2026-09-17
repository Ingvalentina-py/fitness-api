import mongoose from 'mongoose'
import { DEFAULT_ROUTINE_GROUPS } from '../constants/routines.js'
import { RoutineGroup, User } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from '../utils/password.js'
import { signSessionToken, verifySessionToken } from '../utils/sessionToken.js'
import * as loginAttemptService from './loginAttempt.service.js'

const EXPIRED_SESSION_MESSAGE = 'Tu sesión expiró. Inicia sesión de nuevo.'

export async function register({ name, email, password, timezone }) {
  const passwordHash = await hashPassword(password)

  try {
    // Transacción: la cuenta y sus grupos iniciales se crean juntos, o no se crea nada
    return await mongoose.connection.transaction(async (session) => {
      const [user] = await User.create(
        [{ name, email, passwordHash, ...(timezone && { preferences: { timezone } }) }],
        { session },
      )

      await RoutineGroup.insertMany(
        DEFAULT_ROUTINE_GROUPS.map((group, index) => ({ ...group, user: user._id, order: index })),
        { session },
      )

      return user
    })
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw AppError.conflict('Ya existe una cuenta con ese correo', [
        { field: 'body.email', message: 'Este correo ya está registrado' },
      ])
    }
    throw error
  }
}

export async function login({ email, password }) {
  await loginAttemptService.assertNotBlocked(email)

  const user = await User.findOne({ email }).select('+passwordHash +tokenVersion')

  // Si el correo no existe, igual se compara contra un hash falso: así la respuesta
  // tarda lo mismo y nadie puede averiguar qué correos están registrados.
  const isPasswordValid = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH)

  if (!user || !isPasswordValid) {
    await loginAttemptService.registerFailure(email)
    throw AppError.unauthorized('Correo o contraseña incorrectos', 'INVALID_CREDENTIALS')
  }

  await loginAttemptService.clearFailures(email)
  return user
}

export function createSessionToken(user) {
  return signSessionToken({ userId: user._id, tokenVersion: user.tokenVersion })
}

// Devuelve la persona dueña del token, o lanza 401 si el token no sirve
export async function getUserFromSessionToken(token) {
  if (!token) throw AppError.unauthorized()

  const session = await verifySessionToken(token).catch(() => null)
  if (!session) throw AppError.unauthorized(EXPIRED_SESSION_MESSAGE)

  const user = await User.findById(session.userId).select('+tokenVersion')

  // Si la contraseña cambió después de crear el token, las versiones no coinciden
  if (!user || user.tokenVersion !== session.tokenVersion) {
    throw AppError.unauthorized(EXPIRED_SESSION_MESSAGE)
  }

  return user
}
