import { Router } from 'express'
import {
  archiveActivityType,
  createActivityType,
  listActivityTypes,
  updateActivityType,
} from '../controllers/activityType.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createActivityTypeBodySchema,
  updateActivityTypeBodySchema,
} from '../validators/activityType.validators.js'

const router = Router()

router.get('/', listActivityTypes)
router.post('/', validate({ body: createActivityTypeBodySchema }), createActivityType)
router.patch(
  '/:id',
  validate({ params: idParamsSchema, body: updateActivityTypeBodySchema }),
  updateActivityType,
)
router.delete('/:id', validate({ params: idParamsSchema }), archiveActivityType)

export default router
