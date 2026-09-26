import { ActivityType } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'
import { AppError } from '../utils/AppError.js'
import * as weeklyPlanService from './weeklyPlan.service.js'

// Tipos visibles para una persona: los globales (owner: null) y los suyos
const visibleTo = (userId) => ({ owner: { $in: [null, userId] }, isArchived: false })

// Es una lista corta: no se pagina.
export async function listActivityTypes(userId) {
  return ActivityType.find(visibleTo(userId)).collation(SPANISH_COLLATION).sort({ name: 1 })
}

export async function getActivityTypeById(userId, id) {
  const activityType = await ActivityType.findOne({ _id: id, ...visibleTo(userId) })
  if (!activityType) throw AppError.notFound('Tipo de actividad no encontrado')
  return activityType
}

export async function createActivityType(userId, data) {
  try {
    return await ActivityType.create({ ...data, owner: userId })
  } catch (error) {
    throwIfDuplicateName(error)
    throw error
  }
}

export async function updateActivityType(userId, id, changes) {
  const activityType = await findOwnActivityType(userId, id)
  activityType.set(changes)

  try {
    await activityType.save()
  } catch (error) {
    throwIfDuplicateName(error)
    throw error
  }

  return activityType
}

// Archivar en vez de borrar: las actividades ya registradas con este tipo
// siguen mostrándose en el historial.
export async function archiveActivityType(userId, id) {
  const activityType = await findOwnActivityType(userId, id)
  activityType.isArchived = true
  await activityType.save()

  // Un tipo archivado ya no se planea: sale del plan semanal
  await weeklyPlanService.removeActivityTypeFromPlan(userId, activityType._id)
}

// Solo se modifican los tipos propios: los del sistema son de todos
async function findOwnActivityType(userId, id) {
  const activityType = await getActivityTypeById(userId, id)

  if (!activityType.owner?.equals(userId)) {
    throw AppError.forbidden(
      'Los tipos de actividad del sistema no se pueden modificar. Crea uno propio.',
    )
  }

  return activityType
}

function throwIfDuplicateName(error) {
  if (error.code === 11000) {
    throw AppError.conflict('Ya tienes un tipo de actividad con ese nombre', [
      { field: 'body.name', message: 'Ya tienes un tipo con este nombre' },
    ])
  }
}
