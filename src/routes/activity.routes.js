import { Router } from 'express'
import {
  createActivity,
  deleteActivity,
  getActivity,
  listActivities,
  updateActivity,
} from '../controllers/activity.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import { activityBodySchema, listActivitiesQuerySchema } from '../validators/activity.validators.js'

const router = Router()

router.get('/', validate({ query: listActivitiesQuerySchema }), listActivities)
router.post('/', validate({ body: activityBodySchema }), createActivity)
router.get('/:id', validate({ params: idParamsSchema }), getActivity)
router.patch('/:id', validate({ params: idParamsSchema, body: activityBodySchema }), updateActivity)
router.delete('/:id', validate({ params: idParamsSchema }), deleteActivity)

export default router
