import { Router } from 'express'
import { listActivityTypes } from '../controllers/activityType.controller.js'

const router = Router()

router.get('/', listActivityTypes)

export default router
