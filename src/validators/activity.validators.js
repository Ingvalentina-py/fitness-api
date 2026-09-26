import { z } from 'zod'
import { INTENSITY_VALUES } from '../constants/activities.js'
import { localDaySchema, objectIdSchema } from './common.js'

// GET /activities?day=2026-09-25 (un día) o ?from=…&to=… (el mes del calendario).
// Los días en formato AAAA-MM-DD se comparan como texto igual que en el tiempo.
export const listActivitiesQuerySchema = z
  .object({
    day: localDaySchema.optional(),
    from: localDaySchema.optional(),
    to: localDaySchema.optional(),
  })
  .refine(({ from, to }) => (from === undefined) === (to === undefined), {
    message: 'Envía "from" y "to" juntos',
    path: ['from'],
  })
  .refine(({ from, to }) => from === undefined || from <= to, {
    message: 'La fecha inicial no puede ser posterior a la final',
    path: ['from'],
  })

// POST /activities y PATCH /activities/:id → una actividad distinta al gimnasio.
// El día local lo calcula el servidor con la zona horaria de la persona.
export const activityBodySchema = z.strictObject({
  activityType: objectIdSchema,
  date: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(1, 'Escribe cuánto duró').max(1440),
  intensity: z.enum(INTENSITY_VALUES).optional(),
  distanceKm: z.number().min(0).max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
})
