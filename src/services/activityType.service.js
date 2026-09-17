import { ActivityType } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'

// Tipos de actividad globales. Es una lista corta que no crece mucho: no se pagina.
export async function listActivityTypes() {
  return ActivityType.find({ owner: null, isArchived: false })
    .collation(SPANISH_COLLATION)
    .sort({ name: 1 })
}
