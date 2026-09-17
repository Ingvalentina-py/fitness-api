import { Phrase } from '../models/index.js'

// Frases activas del sistema, opcionalmente de un solo contexto
export async function listPhrases({ context }) {
  const filter = { owner: null, isActive: true }
  if (context) filter.context = context

  return Phrase.find(filter).sort({ context: 1, _id: 1 })
}
