import { Router } from 'express'
import { listPhrases } from '../controllers/phrase.controller.js'
import { validate } from '../middlewares/validate.js'
import { listPhrasesQuerySchema } from '../validators/phrase.validators.js'

const router = Router()

router.get('/', validate({ query: listPhrasesQuerySchema }), listPhrases)

export default router
