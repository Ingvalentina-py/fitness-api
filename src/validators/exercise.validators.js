import { z } from 'zod'
import { EQUIPMENT_VALUES, MOVEMENT_PATTERN_VALUES } from '../constants/exercises.js'
import { MUSCLE_VALUES } from '../constants/muscles.js'
import { paginationQuerySchema } from './common.js'

// GET /exercises?muscle=gluteMax&equipment=machine&pattern=hipThrust&page=1&limit=20
export const listExercisesQuerySchema = paginationQuerySchema.extend({
  muscle: z.enum(MUSCLE_VALUES).optional(),
  equipment: z.enum(EQUIPMENT_VALUES).optional(),
  pattern: z.enum(MOVEMENT_PATTERN_VALUES).optional(),
})
