import { Phrase } from '../models/index.js'

// Frases activas del sistema y de la persona, opcionalmente de un solo contexto
export async function listPhrases(userId, { context }) {
  const filter = { owner: { $in: [null, userId] }, isActive: true }
  if (context) filter.context = context

  return Phrase.find(filter).sort({ context: 1, _id: 1 })
}
