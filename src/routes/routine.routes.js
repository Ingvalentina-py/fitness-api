import { Router } from 'express'
import {
  createRoutine,
  createSuggestedSplit,
  duplicateRoutine,
  getRoutine,
  listRoutines,
  reorderRoutines,
  updateRoutine,
} from '../controllers/routine.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createRoutineBodySchema,
  listRoutinesQuerySchema,
  reorderRoutinesBodySchema,
  updateRoutineBodySchema,
} from '../validators/routine.validators.js'

const router = Router()

router.get('/', validate({ query: listRoutinesQuerySchema }), listRoutines)
router.post('/', validate({ body: createRoutineBodySchema }), createRoutine)
// Las rutas fijas van antes que las que tienen :id
router.post('/suggested-split', createSuggestedSplit)
router.put('/order', validate({ body: reorderRoutinesBodySchema }), reorderRoutines)
router.get('/:id', validate({ params: idParamsSchema }), getRoutine)
router.patch('/:id', validate({ params: idParamsSchema, body: updateRoutineBodySchema }), updateRoutine)
router.post('/:id/duplicate', validate({ params: idParamsSchema }), duplicateRoutine)

export default router
