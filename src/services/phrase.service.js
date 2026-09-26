import { Phrase } from '../models/index.js'
import { AppError } from '../utils/AppError.js'

// Frases del sistema y de la persona. Las desactivadas solo salen cuando se piden
// expresamente (la pantalla donde se gestionan).
export async function listPhrases(userId, { context, scope, includeInactive }) {
  const filter = scope === 'mine' ? { owner: userId } : { owner: { $in: [null, userId] } }
  if (context) filter.context = context
  if (!includeInactive) filter.isActive = true

  return Phrase.find(filter).sort({ context: 1, _id: 1 })
}

export async function createPhrase(userId, data) {
  try {
    return await Phrase.create({ ...data, owner: userId })
  } catch (error) {
    throwIfDuplicateText(error)
    throw error
  }
}

export async function updatePhrase(userId, id, changes) {
  const phrase = await findOwnPhrase(userId, id)
  phrase.set(changes)

  try {
    await phrase.save()
  } catch (error) {
    throwIfDuplicateText(error)
    throw error
  }

  return phrase
}

// Las frases propias sí se borran: no las usa ningún historial
export async function deletePhrase(userId, id) {
  const phrase = await findOwnPhrase(userId, id)
  await phrase.deleteOne()
}

// Las frases del sistema son de todos: se pueden desactivar creando las propias,
// pero no editarse ni borrarse.
async function findOwnPhrase(userId, id) {
  const phrase = await Phrase.findOne({ _id: id, owner: { $in: [null, userId] } })
  if (!phrase) throw AppError.notFound('Frase no encontrada')

  if (!phrase.owner?.equals(userId)) {
    throw AppError.forbidden('Las frases del sistema no se pueden modificar. Crea las tuyas.')
  }

  return phrase
}

function throwIfDuplicateText(error) {
  if (error.code === 11000) {
    throw AppError.conflict('Ya tienes esa frase', [
      { field: 'body.text', message: 'Ya tienes una frase con este texto' },
    ])
  }
}
