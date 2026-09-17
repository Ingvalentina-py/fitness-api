import { Router } from 'express'
import { getWeeklyPlan, updateWeeklyPlan } from '../controllers/weeklyPlan.controller.js'
import { validate } from '../middlewares/validate.js'
import { updateWeeklyPlanBodySchema } from '../validators/weeklyPlan.validators.js'

const router = Router()

router.get('/', getWeeklyPlan)
router.put('/', validate({ body: updateWeeklyPlanBodySchema }), updateWeeklyPlan)

export default router
