import { Exercise } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'
import { AppError } from '../utils/AppError.js'
import { getSkip } from '../utils/pagination.js'

// Ejercicios visibles para una persona: los globales (owner: null) y los suyos
const visibleTo = (userId) => ({ owner: { $in: [null, userId] }, isArchived: false })

export async function listExercises(userId, { muscle, equipment, pattern, page, limit }) {
  const filter = visibleTo(userId)
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

export async function getExerciseById(userId, id) {
  const exercise = await Exercise.findOne({ _id: id, ...visibleTo(userId) })
  if (!exercise) throw AppError.notFound('Ejercicio no encontrado')
  return exercise
}
