import { Activity, GeneralActivity } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { toLocalDay } from '../utils/timezone.js'
import * as activityTypeService from './activityType.service.js'
import * as personalRecordService from './personalRecord.service.js'

// Lo que acompaña a cada actividad al leerla: de dónde salió la sesión y de qué
// tipo fue la actividad. `kind` distingue las dos (ver activity.model.js).
const POPULATE = [
  { path: 'routine', select: 'name goal' },
  { path: 'activityType', select: 'name color icon usesDistance' },
]

// Todo lo registrado en un día: sesiones de gimnasio y otras actividades juntas,
// que es como se vive el día (el plan, sección 3: "varias actividades por día").
export async function listActivitiesByDay(userId, day) {
  return Activity.find({ user: userId, day }).sort({ date: -1 }).populate(POPULATE)
}

// Un rango de días (el mes del calendario). Sin los ejercicios de cada sesión:
// el calendario solo necesita saber qué hubo cada día, y así la respuesta es liviana.
export async function listActivitiesInRange(userId, from, to) {
  return Activity.find({ user: userId, day: { $gte: from, $lte: to } })
    .select('-exercises')
    .sort({ day: 1, date: 1 })
    .populate(POPULATE)
}

export async function getActivityById(userId, id) {
  const activity = await Activity.findOne({ _id: id, user: userId }).populate(POPULATE)
  if (!activity) throw AppError.notFound('Actividad no encontrada')
  return activity
}

export async function createGeneralActivity(user, data) {
  const activityType = await activityTypeService.getActivityTypeById(user._id, data.activityType)
  const date = data.date ?? new Date()

  const activity = await GeneralActivity.create({
    user: user._id,
    activityType: activityType._id,
    // El día local se calcula con la zona horaria de la persona, no con la del servidor
    day: toLocalDay(date, user.preferences.timezone),
    date,
    durationMinutes: data.durationMinutes,
    intensity: data.intensity,
    notes: data.notes,
    // La distancia solo tiene sentido en los tipos que la usan (bicicleta, patinaje…)
    distanceKm: activityType.usesDistance ? data.distanceKm : undefined,
  })

  return getActivityById(user._id, activity._id)
}

// Corregir una actividad ya registrada. El cuerpo trae el formulario completo,
// así que los campos que no se envían quedan vacíos (es lo que se ve en pantalla).
export async function updateGeneralActivity(user, id, data) {
  const activity = await GeneralActivity.findOne({ _id: id, user: user._id })
  if (!activity) throw AppError.notFound('Actividad no encontrada')

  const activityType = await activityTypeService.getActivityTypeById(user._id, data.activityType)
  const date = data.date ?? activity.date

  activity.activityType = activityType._id
  activity.date = date
  activity.day = toLocalDay(date, user.preferences.timezone)
  activity.durationMinutes = data.durationMinutes
  activity.intensity = data.intensity
  activity.notes = data.notes
  activity.distanceKm = activityType.usesDistance ? data.distanceKm : undefined
  await activity.save()

  return getActivityById(user._id, id)
}

// Borra cualquier registro del día, sea gimnasio u otra actividad
export async function deleteActivity(userId, id) {
  const activity = await Activity.findOne({ _id: id, user: userId })
  if (!activity) throw AppError.notFound('Actividad no encontrada')

  await activity.deleteOne()

  // Al borrar una sesión, sus récords pueden quedar apuntando a algo que ya no existe
  if (activity.kind === 'gym') {
    await personalRecordService.recomputeForExercises(
      userId,
      activity.exercises.map((exercise) => exercise.exercise),
    )
  }
}
