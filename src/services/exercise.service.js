import { Exercise } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'
import { AppError } from '../utils/AppError.js'
import { getSkip } from '../utils/pagination.js'
import { escapeRegex, normalizeForSearch } from '../utils/text.js'

// Ejercicios visibles para una persona: los globales (owner: null) y los suyos
const visibleTo = (userId) => ({ owner: { $in: [null, userId] }, isArchived: false })

export async function listExercises(
  userId,
  { search, scope, muscle, equipment, pattern, page, limit },
) {
  const filter = scope === 'mine' ? { owner: userId, isArchived: false } : visibleTo(userId)
  // "thrust" encuentra "Hip thrust"; "biceps" encuentra "Bíceps"
  if (search) filter.searchName = { $regex: escapeRegex(normalizeForSearch(search)) }
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

export async function createExercise(userId, data) {
  try {
    return await Exercise.create({ ...data, owner: userId })
  } catch (error) {
    throwIfDuplicateName(error)
    throw error
  }
}

export async function updateExercise(userId, id, changes) {
  const exercise = await findOwnExercise(userId, id)
  exercise.set(changes)

  try {
    await exercise.save()
  } catch (error) {
    throwIfDuplicateName(error)
    throw error
  }

  return exercise
}

// Archivar en vez de borrar: las rutinas y el historial que lo usan siguen funcionando
export async function archiveExercise(userId, id) {
  const exercise = await findOwnExercise(userId, id)
  exercise.isArchived = true
  await exercise.save()
}

// Verifica que todos los ids sean ejercicios que la persona puede usar
// (globales o propios; los propios archivados se aceptan si ya estaban en una rutina)
export async function assertExercisesUsable(userId, exerciseIds) {
  const uniqueIds = [...new Set(exerciseIds.map(String))]
  if (uniqueIds.length === 0) return

  const count = await Exercise.countDocuments({
    _id: { $in: uniqueIds },
    owner: { $in: [null, userId] },
  })

  if (count !== uniqueIds.length) {
    throw AppError.validation([
      { field: 'body.exercises', message: 'Algún ejercicio de la lista no existe' },
    ])
  }
}

// Solo se modifican ejercicios propios: los del catálogo general son de todos
async function findOwnExercise(userId, id) {
  const exercise = await Exercise.findOne({ _id: id, ...visibleTo(userId) })
  if (!exercise) throw AppError.notFound('Ejercicio no encontrado')

  if (!exercise.owner?.equals(userId)) {
    throw AppError.forbidden(
      'Los ejercicios del catálogo general no se pueden modificar. Crea uno propio.',
    )
  }

  return exercise
}

function throwIfDuplicateName(error) {
  if (error.code === 11000) {
    throw AppError.conflict('Ya tienes un ejercicio con ese nombre', [
      { field: 'body.name', message: 'Ya tienes un ejercicio con este nombre' },
    ])
  }
}
