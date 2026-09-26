import { Router } from 'express'
import { createActivity, getActivity, listActivities } from '../controllers/activity.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createActivityBodySchema,
  listActivitiesQuerySchema,
} from '../validators/activity.validators.js'

const router = Router()

router.get('/', validate({ query: listActivitiesQuerySchema }), listActivities)
router.post('/', validate({ body: createActivityBodySchema }), createActivity)
router.get('/:id', validate({ params: idParamsSchema }), getActivity)

export default router
