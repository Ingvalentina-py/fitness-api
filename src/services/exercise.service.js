import { Exercise } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'
import { AppError } from '../utils/AppError.js'
import { getSkip } from '../utils/pagination.js'

// Por ahora solo el catálogo global (owner: null).
// Desde la Fase 2 también incluirá los ejercicios propios de cada persona.
const globalCatalog = { owner: null, isArchived: false }

export async function listExercises({ muscle, equipment, pattern, page, limit }) {
  const filter = { ...globalCatalog }
  if (muscle) filter.primaryMuscles = muscle
  if (equipment) filter.equipment = equipment
  if (pattern) filter.movementPattern = pattern

  // Las dos consultas son independientes: se lanzan a la vez
  const [items, total] = await Promise.all([
    Exercise.find(filter)
      .collation(SPANISH_COLLATION)
      .sort({ name: 1 })
      .skip(getSkip({ page, limit }))
      .limit(limit),
    Exercise.countDocuments(filter),
  ])

  return { items, total }
}

export async function getExerciseById(id) {
  const exercise = await Exercise.findOne({ _id: id, ...globalCatalog })
  if (!exercise) throw AppError.notFound('Ejercicio no encontrado')
  return exercise
}
