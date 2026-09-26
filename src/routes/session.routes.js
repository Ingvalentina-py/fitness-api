import { Router } from 'express'
import {
  createSession,
  getLastPerformances,
  getSession,
  saveSessionAsRoutine,
} from '../controllers/session.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createSessionBodySchema,
  lastPerformancesQuerySchema,
  saveAsRoutineBodySchema,
} from '../validators/session.validators.js'

const router = Router()

router.post('/', validate({ body: createSessionBodySchema }), createSession)
// Las rutas fijas van antes que las que tienen :id
router.get('/previous', validate({ query: lastPerformancesQuerySchema }), getLastPerformances)
router.get('/:id', validate({ params: idParamsSchema }), getSession)
router.post(
  '/:id/routine',
  validate({ params: idParamsSchema, body: saveAsRoutineBodySchema }),
  saveSessionAsRoutine,
)

export default router
