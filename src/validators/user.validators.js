import { z } from 'zod'
import { WEIGHT_UNIT_VALUES } from '../constants/activities.js'
import { WEEK_START_DAY_VALUES } from '../constants/users.js'
import { currentPasswordSchema, nameSchema, newPasswordSchema } from './auth.validators.js'
import { timezoneSchema } from './common.js'

// strictObject rechaza campos desconocidos: nadie puede colarse "role": "admin"
// o "plan" en la petición para darse permisos que no tiene.

// PATCH /users/me
export const updateMeBodySchema = z
  .strictObject({
    name: nameSchema.optional(),
    preferences: z
      .strictObject({
        weightUnit: z.enum(WEIGHT_UNIT_VALUES).optional(),
        weekStartsOn: z.literal(WEEK_START_DAY_VALUES).optional(),
        timezone: timezoneSchema.optional(),
        voicePhrases: z.boolean().optional(),
      })
      .optional(),
  })
  .refine((body) => body.name !== undefined || body.preferences !== undefined, {
    message: 'No hay cambios para guardar',
  })

// PATCH /users/me/password
export const changePasswordBodySchema = z
  .strictObject({
    currentPassword: currentPasswordSchema,
    newPassword: newPasswordSchema,
  })
  .refine((body) => body.currentPassword !== body.newPassword, {
    message: 'La nueva contraseña debe ser distinta de la actual',
    path: ['newPassword'],
  })
