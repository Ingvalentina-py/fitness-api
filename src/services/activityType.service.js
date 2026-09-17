import { ActivityType } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'

// Tipos globales y propios de la persona. Es una lista corta: no se pagina.
export async function listActivityTypes(userId) {
  return ActivityType.find({ owner: { $in: [null, userId] }, isArchived: false })
    .collation(SPANISH_COLLATION)
    .sort({ name: 1 })
}
