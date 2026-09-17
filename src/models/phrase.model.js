import mongoose from 'mongoose'
import { PHRASE_CONTEXT_VALUES } from '../constants/phrases.js'
import { baseSchemaOptions } from './shared.js'

const phraseSchema = new mongoose.Schema(
  {
    // null = frase del sistema; id de usuario = frase propia
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    text: { type: String, required: true, trim: true, maxlength: 140 },
    context: { type: String, enum: PHRASE_CONTEXT_VALUES, default: 'general' },
    isActive: { type: Boolean, default: true },
  },
  baseSchemaOptions,
)

// Evita frases repetidas para un mismo dueño
phraseSchema.index({ owner: 1, text: 1 }, { unique: true })

export const Phrase = mongoose.model('Phrase', phraseSchema)
