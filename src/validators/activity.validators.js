import { z } from 'zod'
import { INTENSITY_VALUES } from '../constants/activities.js'
import { localDaySchema, objectIdSchema } from './common.js'

// GET /activities?day=2026-09-25
export const listActivitiesQuerySchema = z.object({ day: localDaySchema.optional() })

// POST /activities → una actividad distinta al gimnasio.
// El día local lo calcula el servidor con la zona horaria de la persona.
export const createActivityBodySchema = z.strictObject({
  activityType: objectIdSchema,
  date: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(1, 'Escribe cuánto duró').max(1440),
  intensity: z.enum(INTENSITY_VALUES).optional(),
  distanceKm: z.number().min(0).max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
})
