import { Router } from 'express'
import { getExercise, listExercises } from '../controllers/exercise.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import { listExercisesQuerySchema } from '../validators/exercise.validators.js'

const router = Router()

router.get('/', validate({ query: listExercisesQuerySchema }), listExercises)
router.get('/:id', validate({ params: idParamsSchema }), getExercise)

export default router
