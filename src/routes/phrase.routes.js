import { Router } from 'express'
import {
  createPhrase,
  deletePhrase,
  listPhrases,
  updatePhrase,
} from '../controllers/phrase.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createPhraseBodySchema,
  listPhrasesQuerySchema,
  updatePhraseBodySchema,
} from '../validators/phrase.validators.js'

const router = Router()

router.get('/', validate({ query: listPhrasesQuerySchema }), listPhrases)
router.post('/', validate({ body: createPhraseBodySchema }), createPhrase)
router.patch('/:id', validate({ params: idParamsSchema, body: updatePhraseBodySchema }), updatePhrase)
router.delete('/:id', validate({ params: idParamsSchema }), deletePhrase)

export default router
