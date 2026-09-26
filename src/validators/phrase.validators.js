import { z } from 'zod'
import { PHRASE_CONTEXT_VALUES } from '../constants/phrases.js'
import { booleanQuerySchema, hasAtLeastOneField } from './common.js'

// GET /phrases?context=record&scope=mine&includeInactive=true
export const listPhrasesQuerySchema = z.object({
  context: z.enum(PHRASE_CONTEXT_VALUES).optional(),
  // all = del sistema + propias; mine = solo las propias
  scope: z.enum(['all', 'mine']).default('all'),
  includeInactive: booleanQuerySchema.default(false),
})

const phraseFields = {
  text: z.string().trim().min(1, 'Escribe tu frase').max(140),
  context: z.enum(PHRASE_CONTEXT_VALUES),
  isActive: z.boolean(),
}

// POST /phrases
export const createPhraseBodySchema = z.strictObject({
  ...phraseFields,
  context: phraseFields.context.default('general'),
  isActive: phraseFields.isActive.default(true),
})

// PATCH /phrases/:id (también activa o desactiva con isActive)
export const updatePhraseBodySchema = z
  .strictObject(phraseFields)
  .partial()
  .refine(...hasAtLeastOneField)
