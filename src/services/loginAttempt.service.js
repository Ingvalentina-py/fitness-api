import { LOGIN_LOCK_MINUTES, LOGIN_MAX_FAILED_ATTEMPTS } from '../constants/auth.js'
import { LoginAttempt } from '../models/index.js'
import { AppError } from '../utils/AppError.js'

const LOCK_MS = LOGIN_LOCK_MINUTES * 60 * 1000

// Se limita por correo: protege cada cuenta aunque el atacante cambie de IP.
const keyFor = (email) => `email:${email}`

// Lanza 429 si ese correo acumuló demasiados intentos fallidos
export async function assertNotBlocked(email) {
  const attempt = await LoginAttempt.findOne({
    key: keyFor(email),
    expiresAt: { $gt: new Date() },
  })

  if (attempt && attempt.failedCount >= LOGIN_MAX_FAILED_ATTEMPTS) {
    const minutesLeft = Math.ceil((attempt.expiresAt.getTime() - Date.now()) / 60_000)
    throw AppError.tooManyRequests(
      `Demasiados intentos fallidos. Intenta de nuevo en ${minutesLeft} min.`,
    )
  }
}

export async function registerFailure(email) {
  const key = keyFor(email)
  const now = Date.now()

  // Si la ventana anterior ya venció (y MongoDB aún no la borró), empieza de cero
  await LoginAttempt.deleteOne({ key, expiresAt: { $lte: new Date(now) } })

  const attempt = await LoginAttempt.findOneAndUpdate(
    { key },
    { $inc: { failedCount: 1 }, $setOnInsert: { expiresAt: new Date(now + LOCK_MS) } },
    { upsert: true, returnDocument: 'after' },
  )

  // Al llegar al límite, el bloqueo dura 15 minutos completos desde este intento
  if (attempt.failedCount === LOGIN_MAX_FAILED_ATTEMPTS) {
    attempt.expiresAt = new Date(now + LOCK_MS)
    await attempt.save()
  }
}

export async function clearFailures(email) {
  await LoginAttempt.deleteOne({ key: keyFor(email) })
}
