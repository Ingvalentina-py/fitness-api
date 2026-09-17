import { z } from 'zod'
import { PHRASE_CONTEXT_VALUES } from '../constants/phrases.js'

// GET /phrases?context=record
export const listPhrasesQuerySchema = z.object({
  context: z.enum(PHRASE_CONTEXT_VALUES).optional(),
})
