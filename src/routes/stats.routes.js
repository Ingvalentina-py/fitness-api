import { Router } from 'express'
import {
  getDistribution,
  getExerciseProgress,
  getSummary,
  listExercisesWithHistory,
} from '../controllers/stats.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import { rangeQuerySchema } from '../validators/stats.validators.js'

const router = Router()

router.get('/summary', validate({ query: rangeQuerySchema }), getSummary)
router.get('/distribution', validate({ query: rangeQuerySchema }), getDistribution)
// La ruta fija va antes que la que tiene :id
router.get('/exercises', listExercisesWithHistory)
router.get(
  '/exercises/:id',
  validate({ params: idParamsSchema, query: rangeQuerySchema }),
  getExerciseProgress,
)

export default router
