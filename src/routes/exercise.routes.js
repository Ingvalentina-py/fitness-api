import { Router } from 'express'
import {
  archiveExercise,
  createExercise,
  getExercise,
  listExercises,
  updateExercise,
} from '../controllers/exercise.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createExerciseBodySchema,
  listExercisesQuerySchema,
  updateExerciseBodySchema,
} from '../validators/exercise.validators.js'

const router = Router()

router.get('/', validate({ query: listExercisesQuerySchema }), listExercises)
router.post('/', validate({ body: createExerciseBodySchema }), createExercise)
router.get('/:id', validate({ params: idParamsSchema }), getExercise)
router.patch('/:id', validate({ params: idParamsSchema, body: updateExerciseBodySchema }), updateExercise)
router.delete('/:id', validate({ params: idParamsSchema }), archiveExercise)

export default router
