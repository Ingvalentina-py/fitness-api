import mongoose from 'mongoose'
import { Exercise, GymSession, Routine } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { toLocalDay } from '../utils/timezone.js'
import { countCompletedSets } from '../utils/volume.js'
import * as personalRecordService from './personalRecord.service.js'
import * as routineService from './routine.service.js'

// Límites del modelo Routine que hay que respetar al guardar una sesión como rutina
const MAX_TARGET_SETS = 20
const MAX_TARGET_REPS = 100

export async function getSessionById(userId, id) {
  const session = await GymSession.findOne({ _id: id, user: userId }).populate('routine', 'name goal')
  if (!session) throw AppError.notFound('Sesión no encontrada')
  return session
}

// Sesiones de un día concreto (lo usa la pantalla Hoy)
export async function listSessionsByDay(userId, day) {
  return GymSession.find({ user: userId, day }).sort({ date: -1 }).populate('routine', 'name goal')
}

// Lo que hiciste la última vez en cada ejercicio: la referencia que aparece al lado
// de cada ejercicio durante la sesión.
export async function getLastPerformances(userId, exerciseIds) {
  if (exerciseIds.length === 0) return []

  const ids = exerciseIds.map((id) => new mongoose.Types.ObjectId(id))
  // Se ordena por fecha ANTES de agrupar: $first se queda con la sesión más reciente
  // de cada ejercicio. El filtro `kind` es necesario porque aggregate() no lo agrega solo.
  const results = await GymSession.aggregate([
    { $match: { user: userId, kind: 'gym', 'exercises.exercise': { $in: ids } } },
    { $sort: { date: -1 } },
    { $unwind: '$exercises' },
    { $match: { 'exercises.exercise': { $in: ids } } },
    {
      $group: {
        _id: '$exercises.exercise',
        session: { $first: '$_id' },
        date: { $first: '$date' },
        day: { $first: '$day' },
        sets: { $first: '$exercises.sets' },
        volumeKg: { $first: '$exercises.volumeKg' },
      },
    },
  ])

  return results.map(({ _id, sets, ...rest }) => ({
    exercise: _id,
    // Solo interesan las series que realmente hizo
    sets: sets.filter((set) => set.completed),
    ...rest,
  }))
}

export async function createSession(user, data) {
  const userId = user._id
  const exercises = await buildPerformedExercises(userId, data.exercises)

  if (countCompletedSets(exercises) === 0) {
    throw AppError.validation([
      { field: 'body.exercises', message: 'Marca al menos una serie como completada' },
    ])
  }
  if (data.routine) await assertOwnRoutine(userId, data.routine)

  const date = data.date ?? new Date()
  const session = await GymSession.create({
    user: userId,
    routine: data.routine ?? null,
    // El día local se calcula aquí con la zona horaria de la persona: una sesión de
    // las 9 p. m. en Bogotá ya es el día siguiente en UTC y no debe saltar de día.
    day: toLocalDay(date, user.preferences.timezone),
    date,
    durationMinutes: data.durationMinutes,
    energy: data.energy,
    notes: data.notes,
    exercises,
  })

  // "Última vez usada" alimenta el orden y el historial de la rutina
  if (session.routine) {
    await Routine.updateOne({ _id: session.routine, user: userId }, { $set: { lastUsedAt: date } })
  }

  const records = await personalRecordService.applySession(userId, session)

  return { session: await getSessionById(userId, session._id), records }
}

// Guarda lo que hiciste como rutina nueva, o actualiza la rutina de la que saliste
export async function saveSessionAsRoutine(userId, sessionId, { mode, name, group }) {
  const session = await getSessionById(userId, sessionId)
  const exercises = session.exercises.map(toRoutineExercise)

  if (mode === 'update') {
    if (!session.routine) {
      throw AppError.validation([
        { field: 'body.mode', message: 'Esta sesión no salió de una rutina guardada' },
      ])
    }
    return routineService.updateRoutine(userId, session.routine._id, { exercises })
  }

  return routineService.createRoutine(userId, {
    group,
    name,
    goal: session.routine?.goal ?? 'other',
    exercises,
  })
}

// Las series objetivo de la rutina salen de lo que realmente hiciste
function toRoutineExercise(performed) {
  const reps = performed.sets.filter((set) => set.completed && set.reps > 0).map((set) => set.reps)

  return {
    exercise: performed.exercise,
    targetSets: clamp(performed.sets.length || 1, 1, MAX_TARGET_SETS),
    targetRepsMin: reps.length > 0 ? clamp(Math.min(...reps), 1, MAX_TARGET_REPS) : undefined,
    targetRepsMax: reps.length > 0 ? clamp(Math.max(...reps), 1, MAX_TARGET_REPS) : undefined,
    restSeconds: performed.restSeconds,
    notes: performed.notes,
  }
}

// El nombre y los músculos se copian del catálogo del servidor, no de lo que envía el
// navegador: así el historial siempre refleja el ejercicio real que existía ese día.
async function buildPerformedExercises(userId, items) {
  const ids = [...new Set(items.map((item) => item.exercise))]
  const catalog = await Exercise.find({ _id: { $in: ids }, owner: { $in: [null, userId] } })
  const byId = new Map(catalog.map((exercise) => [String(exercise._id), exercise]))

  if (byId.size !== ids.length) {
    throw AppError.validation([
      { field: 'body.exercises', message: 'Algún ejercicio de la sesión no existe' },
    ])
  }

  return items.map((item) => {
    const exercise = byId.get(String(item.exercise))

    return {
      exercise: exercise._id,
      name: exercise.name,
      equipment: exercise.equipment,
      movementPattern: exercise.movementPattern,
      primaryMuscles: exercise.primaryMuscles,
      secondaryMuscles: exercise.secondaryMuscles,
      // La persona puede marcar unilateral solo para esta sesión
      isUnilateral: item.isUnilateral ?? exercise.isUnilateral,
      restSeconds: item.restSeconds,
      sets: item.sets,
      notes: item.notes,
    }
  })
}

async function assertOwnRoutine(userId, routineId) {
  if (!(await Routine.exists({ _id: routineId, user: userId }))) {
    throw AppError.validation([{ field: 'body.routine', message: 'La rutina no existe' }])
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
