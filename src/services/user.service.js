import { User } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import * as loginAttemptService from './loginAttempt.service.js'

// Actualiza nombre y/o preferencias. Solo cambia las preferencias enviadas.
export async function updateProfile(user, { name, preferences = {} }) {
  if (name !== undefined) user.name = name

  for (const [key, value] of Object.entries(preferences)) {
    user.set(`preferences.${key}`, value)
  }

  await user.save()
  return user
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+passwordHash +tokenVersion')

  // Mismo límite de intentos que el inicio de sesión: evita adivinar la contraseña actual
  await loginAttemptService.assertNotBlocked(user.email)

  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    await loginAttemptService.registerFailure(user.email)
    throw AppError.validation([
      { field: 'body.currentPassword', message: 'La contraseña actual no es correcta' },
    ])
  }

  await loginAttemptService.clearFailures(user.email)

  user.passwordHash = await hashPassword(newPassword)
  // Invalida las sesiones abiertas en otros dispositivos
  user.tokenVersion += 1
  await user.save()

  return user
}
