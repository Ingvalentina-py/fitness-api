import { Router } from 'express'
import { listRecords } from '../controllers/stats.controller.js'

const router = Router()

router.get('/', listRecords)

export default router
