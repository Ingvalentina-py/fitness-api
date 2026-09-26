import { z } from 'zod'
import { localDaySchema } from './common.js'

// Filtro por rango de fechas. Si no se envía, el controlador usa los últimos 90 días.
export const rangeQuerySchema = z
  .object({ from: localDaySchema.optional(), to: localDaySchema.optional() })
  .refine(({ from, to }) => from === undefined || to === undefined || from <= to, {
    message: 'La fecha inicial no puede ser posterior a la final',
    path: ['from'],
  })
