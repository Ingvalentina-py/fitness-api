import { z } from 'zod'
import { hasAtLeastOneField, hexColorSchema, iconNameSchema } from './common.js'

const activityTypeFields = {
  name: z.string().trim().min(1, 'Escribe el nombre del tipo').max(40),
  color: hexColorSchema,
  icon: iconNameSchema,
  usesDistance: z.boolean(),
  // Exige mucho a las piernas: activa el aviso del plan semanal
  isLegIntensive: z.boolean(),
}

// POST /activity-types
export const createActivityTypeBodySchema = z.strictObject({
  ...activityTypeFields,
  usesDistance: activityTypeFields.usesDistance.default(false),
  isLegIntensive: activityTypeFields.isLegIntensive.default(false),
})

// PATCH /activity-types/:id
export const updateActivityTypeBodySchema = z
  .strictObject(activityTypeFields)
  .partial()
  .refine(...hasAtLeastOneField)
