import { z } from 'zod'
import { EQUIPMENT_VALUES, MOVEMENT_PATTERN_VALUES } from '../constants/exercises.js'
import { MUSCLE_VALUES } from '../constants/muscles.js'
import { hasAtLeastOneField, paginationQuerySchema } from './common.js'

// GET /exercises?search=hip&scope=mine&muscle=gluteMax&equipment=machine&pattern=hipThrust&page=1
export const listExercisesQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(80).optional(),
  // all = catálogo general + propios; mine = solo los propios
  scope: z.enum(['all', 'mine']).default('all'),
  muscle: z.enum(MUSCLE_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES).optional(),
  pattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
})

const musclesSchema = z
  .array(z.enum(MUSCLE_VALUES))
  .refine((muscles) => new Set(muscles).size === muscles.length, 'Hay músculos repetidos')

const exerciseFields = {
  name: z.string().trim().min(1, 'Escribe el nombre del ejercicio').max(80),
  equipment: z.enum(EQUIPMENT_VALUES),
  movementPattern: z.enum(MOVEMENT_PATTERN_VALUES),
  primaryMuscles: musclesSchema.min(1, 'Elige al menos un músculo principal').max(6),
  secondaryMuscles: musclesSchema.max(8),
  isUnilateral: z.boolean(),
}

// Un músculo no puede ser principal y secundario a la vez
const noMuscleInBothLists = [
  ({ primaryMuscles = [], secondaryMuscles = [] }) =>
    !primaryMuscles.some((muscle) => secondaryMuscles.includes(muscle)),
  { message: 'Un músculo no puede ser principal y secundario a la vez', path: ['secondaryMuscles'] },
]

// POST /exercises
export const createExerciseBodySchema = z
  .strictObject({
    ...exerciseFields,
    movementPattern: exerciseFields.movementPattern.default('other'),
    secondaryMuscles: exerciseFields.secondaryMuscles.default([]),
    isUnilateral: exerciseFields.isUnilateral.default(false),
  })
  .refine(...noMuscleInBothLists)

// PATCH /exercises/:id
export const updateExerciseBodySchema = z
  .strictObject(exerciseFields)
  .partial()
  .refine(...hasAtLeastOneField)
  .refine(...noMuscleInBothLists)
