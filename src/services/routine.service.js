import { Routine, RoutineGroup } from '../models/index.js'
import { AppError } from '../utils/AppError.js'
import { hasSameIds } from '../utils/ids.js'
import * as exerciseService from './exercise.service.js'
import * as weeklyPlanService from './weeklyPlan.service.js'

// Datos del ejercicio que acompañan a cada ejercicio de la rutina al pedirla completa
const EXERCISE_FIELDS = 'name equipment movementPattern primaryMuscles secondaryMuscles isUnilateral owner isArchived'

export async function listRoutines(userId, { archived }) {
  return Routine.find({ user: userId, isArchived: archived }).sort({ order: 1, createdAt: 1 })
}

export async function getRoutineById(userId, id) {
  const routine = await Routine.findOne({ _id: id, user: userId }).populate(
    'exercises.exercise',
    EXERCISE_FIELDS,
  )
  if (!routine) throw AppError.notFound('Rutina no encontrada')
  return routine
}

export async function createRoutine(userId, data) {
  await assertOwnGroup(userId, data.group)
  await exerciseService.assertExercisesUsable(userId, data.exercises.map((item) => item.exercise))

  const routine = await Routine.create({
    ...data,
    user: userId,
    order: await nextOrderInGroup(userId, data.group),
  })

  return getRoutineById(userId, routine._id)
}

export async function updateRoutine(userId, id, changes) {
  const routine = await findOwnRoutine(userId, id)
  const targetGroup = changes.group ?? routine.group

  if (changes.group && !routine.group.equals(changes.group)) {
    await assertOwnGroup(userId, changes.group)
  }
  if (changes.exercises) {
    await exerciseService.assertExercisesUsable(
      userId,
      changes.exercises.map((item) => item.exercise),
    )
  }

  // Al cambiar de grupo o restaurar una rutina archivada, queda al final de su grupo
  const changesGroup = changes.group && !routine.group.equals(changes.group)
  const isRestoring = changes.isArchived === false && routine.isArchived
  if (changesGroup || isRestoring) {
    routine.order = await nextOrderInGroup(userId, targetGroup)
  }

  routine.set(changes)
  await routine.save()

  // Una rutina archivada ya no se planea: sale del plan semanal
  if (changes.isArchived === true) {
    await weeklyPlanService.removeRoutineFromPlan(userId, routine._id)
  }

  return getRoutineById(userId, id)
}

export async function duplicateRoutine(userId, id) {
  const source = await findOwnRoutine(userId, id)

  const copy = await Routine.create({
    user: userId,
    group: source.group,
    name: `${source.name} (copia)`.slice(0, 60),
    goal: source.goal,
    exercises: source.exercises.map(
      ({ exercise, targetSets, targetRepsMin, targetRepsMax, restSeconds, notes }) => ({
        exercise,
        targetSets,
        targetRepsMin,
        targetRepsMax,
        restSeconds,
        notes,
      }),
    ),
    order: await nextOrderInGroup(userId, source.group),
  })

  return getRoutineById(userId, copy._id)
}

// Recibe todas las rutinas activas de un grupo en el nuevo orden
export async function reorderRoutines(userId, groupId, routineIds) {
  await assertOwnGroup(userId, groupId)
  const routines = await Routine.find({ user: userId, group: groupId, isArchived: false }).select('_id')

  if (!hasSameIds(routines.map((routine) => routine._id), routineIds)) {
    throw AppError.validation([
      {
        field: 'body.routineIds',
        message: 'La lista debe incluir todas las rutinas activas del grupo, una vez cada una',
      },
    ])
  }

  await Routine.bulkWrite(
    routineIds.map((routineId, index) => ({
      updateOne: { filter: { _id: routineId, user: userId }, update: { $set: { order: index } } },
    })),
  )
}

async function findOwnRoutine(userId, id) {
  const routine = await Routine.findOne({ _id: id, user: userId })
  if (!routine) throw AppError.notFound('Rutina no encontrada')
  return routine
}

async function assertOwnGroup(userId, groupId) {
  if (!(await RoutineGroup.exists({ _id: groupId, user: userId }))) {
    throw AppError.validation([{ field: 'body.group', message: 'El grupo no existe' }])
  }
}

async function nextOrderInGroup(userId, groupId) {
  const last = await Routine.findOne({ user: userId, group: groupId, isArchived: false })
    .sort({ order: -1 })
    .select('order')
  return (last?.order ?? -1) + 1
}
