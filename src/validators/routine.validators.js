import { z } from 'zod'
import { ROUTINE_GOAL_VALUES } from '../constants/routines.js'
import {
  booleanQuerySchema,
  hasAtLeastOneField,
  objectIdSchema,
  uniqueObjectIdsSchema,
} from './common.js'

// Ejercicio planeado dentro de una rutina
const routineExerciseSchema = z
  .strictObject({
    exercise: objectIdSchema,
    targetSets: z.number().int().min(1).max(20).default(3),
    targetRepsMin: z.number().int().min(1).max(100).optional(),
    targetRepsMax: z.number().int().min(1).max(100).optional(),
    restSeconds: z.number().int().min(0).max(600).optional(),
    notes: z.string().trim().max(300).optional(),
  })
  .refine(
    ({ targetRepsMin, targetRepsMax }) =>
      targetRepsMin === undefined || targetRepsMax === undefined || targetRepsMax >= targetRepsMin,
    { message: 'El máximo de repeticiones no puede ser menor que el mínimo', path: ['targetRepsMax'] },
  )

const routineFields = {
  group: objectIdSchema,
  name: z.string().trim().min(1, 'Escribe el nombre de la rutina').max(60),
  goal: z.enum(ROUTINE_GOAL_VALUES),
  // El orden de la lista es el orden de los ejercicios en la rutina
  exercises: z.array(routineExerciseSchema).max(30, 'Máximo 30 ejercicios por rutina'),
}

// GET /routines?archived=true
export const listRoutinesQuerySchema = z.object({
  archived: booleanQuerySchema.default(false),
})

// POST /routines
export const createRoutineBodySchema = z.strictObject({
  ...routineFields,
  goal: routineFields.goal.default('other'),
  exercises: routineFields.exercises.default([]),
})

// PATCH /routines/:id (también archiva o restaura con isArchived)
export const updateRoutineBodySchema = z
  .strictObject({ ...routineFields, isArchived: z.boolean() })
  .partial()
  .refine(...hasAtLeastOneField)

// PUT /routines/order → las rutinas activas de un grupo en el nuevo orden
export const reorderRoutinesBodySchema = z.strictObject({
  groupId: objectIdSchema,
  routineIds: uniqueObjectIdsSchema,
})
