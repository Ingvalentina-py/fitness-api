import mongoose from 'mongoose'
import { baseSchemaOptions } from './shared.js'

// Intentos fallidos de inicio de sesión. Se guardan en MongoDB (y no en la memoria
// del servidor) porque en Vercel hay varias instancias efímeras que no comparten memoria.
const loginAttemptSchema = new mongoose.Schema(
  {
    // Qué se limita, ej.: "email:vale@correo.com"
    key: { type: String, required: true },
    failedCount: { type: Number, default: 0 },
    // Fin de la ventana o del bloqueo
    expiresAt: { type: Date, required: true },
  },
  { ...baseSchemaOptions, collection: 'loginAttempts' },
)

loginAttemptSchema.index({ key: 1 }, { unique: true })
// Índice TTL: MongoDB borra solo el documento cuando pasa expiresAt (revisa cada ~60 s)
loginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema)
