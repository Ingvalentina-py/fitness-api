import { z } from 'zod'
import { objectIdSchema } from './common.js'

// Algo planeado para un día: una rutina o un tipo de actividad.
// discriminatedUnion elige el esquema según el valor de `kind`.
const planItemSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('routine'), routine: objectIdSchema }),
  z.strictObject({ kind: z.literal('activityType'), activityType: objectIdSchema }),
])

const planDaySchema = z.strictObject({
  dayOfWeek: z.number().int().min(0).max(6),
  items: z.array(planItemSchema).max(6, 'Máximo 6 actividades por día'),
})

// PUT /weekly-plan → el plan completo
export const updateWeeklyPlanBodySchema = z.strictObject({
  days: z
    .array(planDaySchema)
    .max(7)
    .refine(
      (days) => new Set(days.map((day) => day.dayOfWeek)).size === days.length,
      'Cada día de la semana solo puede aparecer una vez',
    ),
})
