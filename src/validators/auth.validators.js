import { z } from 'zod'
import { timezoneSchema } from './common.js'

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Escribe tu nombre')
  .max(60, 'El nombre puede tener máximo 60 caracteres')

// Primero limpia espacios y mayúsculas, luego valida el formato
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email('Escribe un correo válido'))

// Para contraseñas nuevas. bcrypt solo usa los primeros 72 bytes: más largo no aporta.
export const newPasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .refine((value) => new TextEncoder().encode(value).length <= 72, 'La contraseña es demasiado larga')

// Para contraseñas existentes: no se vuelven a exigir reglas, solo que no esté vacía
export const currentPasswordSchema = z
  .string()
  .min(1, 'Escribe tu contraseña')
  .max(1000, 'La contraseña es demasiado larga')

// POST /auth/register
export const registerBodySchema = z.strictObject({
  name: nameSchema,
  email: emailSchema,
  password: newPasswordSchema,
  // El frontend envía la zona horaria del navegador
  timezone: timezoneSchema.optional(),
})

// POST /auth/login
export const loginBodySchema = z.strictObject({
  email: emailSchema,
  password: currentPasswordSchema,
})
