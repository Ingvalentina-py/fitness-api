import { z } from 'zod'
import { ENERGY_LEVEL, WEIGHT_UNIT_VALUES } from '../constants/activities.js'
import { localDaySchema, objectIdSchema } from './common.js'

// Una serie: repeticiones y peso pueden ir vacíos mientras la sesión está en curso
const setSchema = z.strictObject({
  reps: z.number().int().min(0).max(1000).optional(),
  weight: z.number().min(0).max(2000).optional(),
  unit: z.enum(WEIGHT_UNIT_VALUES),
  completed: z.boolean().default(false),
})

const performedExerciseSchema = z.strictObject({
  exercise: objectIdSchema,
  // Se puede marcar unilateral solo para esta sesión, sin tocar el catálogo
  isUnilateral: z.boolean().optional(),
  restSeconds: z.number().int().min(0).max(600).optional(),
  sets: z.array(setSchema).max(20, 'Máximo 20 series por ejercicio').default([]),
  notes: z.string().trim().max(500).optional(),
})

// POST /sessions → la sesión terminada. El día local lo calcula el servidor
// con la zona horaria de la persona.
export const createSessionBodySchema = z.strictObject({
  routine: objectIdSchema.optional(),
  date: z.coerce.date().optional(),
  durationMinutes: z.number().int().min(0).max(1440).optional(),
  energy: z.number().int().min(ENERGY_LEVEL.min).max(ENERGY_LEVEL.max).optional(),
  notes: z.string().trim().max(1000).optional(),
  exercises: z
    .array(performedExerciseSchema)
    .min(1, 'Agrega al menos un ejercicio')
    .max(30, 'Máximo 30 ejercicios por sesión'),
})

// GET /sessions?day=2026-09-25
export const listSessionsQuerySchema = z.object({ day: localDaySchema.optional() })

// GET /sessions/previous?exerciseIds=id1,id2 → la lista llega como texto separado por comas
export const lastPerformancesQuerySchema = z.object({
  exerciseIds: z
    .string()
    .transform((value) => value.split(',').filter(Boolean))
    .pipe(z.array(objectIdSchema).min(1).max(50)),
})

// POST /sessions/:id/routine
// Unión discriminada: según el valor de `mode`, Zod exige unos campos u otros.
export const saveAsRoutineBodySchema = z.discriminatedUnion('mode', [
  z.strictObject({
    mode: z.literal('create'),
    name: z.string().trim().min(1, 'Escribe el nombre de la rutina').max(60),
    group: objectIdSchema,
  }),
  z.strictObject({ mode: z.literal('update') }),
])
