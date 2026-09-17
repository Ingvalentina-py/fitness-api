import mongoose from 'mongoose'
import { DEFAULT_ROUTINE_GROUPS } from '../constants/routines.js'
import { SUGGESTED_ROUTINES, SUGGESTED_WEEK } from '../constants/suggestedSplit.js'
import { ActivityType, Exercise, Routine, RoutineGroup, WeeklyPlan } from '../models/index.js'
import { SPANISH_COLLATION } from '../models/shared.js'
import { AppError } from '../utils/AppError.js'
import { normalizeForSearch } from '../utils/text.js'

// Carga las 4 rutinas de ejemplo y el plan semanal sugerido.
// Solo si la persona aún no tiene rutinas, para no duplicar nada.
export async function createSuggestedSplit(userId) {
  if (await Routine.exists({ user: userId })) {
    throw AppError.conflict('La división sugerida solo se puede cargar si aún no tienes rutinas')
  }

  const exerciseIds = await findGlobalIdsByName(
    Exercise,
    SUGGESTED_ROUTINES.flatMap((routine) => routine.exercises.map((exercise) => exercise.name)),
  )
  const activityTypeIds = await findGlobalIdsByName(
    ActivityType,
    SUGGESTED_WEEK.filter((day) => day.activityType).map((day) => day.activityType),
  )

  // Transacción: se crea todo el ejemplo o nada
  return mongoose.connection.transaction(async (session) => {
    const groups = await ensureGroups(userId, session)
    const routineIdByKey = new Map()
    const nextOrderByGroup = new Map()

    for (const template of SUGGESTED_ROUTINES) {
      const group = groups.get(template.group)
      const order = nextOrderByGroup.get(template.group) ?? 0
      nextOrderByGroup.set(template.group, order + 1)

      const [routine] = await Routine.create(
        [
          {
            user: userId,
            group: group._id,
            name: template.name,
            goal: template.goal,
            order,
            // Si algún ejercicio no está en el catálogo (seed sin ejecutar), se omite
            exercises: template.exercises
              .filter(({ name }) => exerciseIds.has(normalizeForSearch(name)))
              .map(({ name, ...targets }) => ({
                exercise: exerciseIds.get(normalizeForSearch(name)),
                ...targets,
              })),
          },
        ],
        { session },
      )
      routineIdByKey.set(template.key, routine._id)
    }

    // El plan solo se escribe si la persona no tenía nada planeado
    const plan = (await WeeklyPlan.findOne({ user: userId }).session(session)) ??
      new WeeklyPlan({ user: userId })

    if (plan.days.every((day) => day.items.length === 0)) {
      plan.days = SUGGESTED_WEEK.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        items: day.routine
          ? [{ kind: 'routine', routine: routineIdByKey.get(day.routine) }]
          : [{ kind: 'activityType', activityType: activityTypeIds.get(normalizeForSearch(day.activityType)) }],
      })).filter((day) => day.items.every((item) => item.routine ?? item.activityType))
      await plan.save({ session })
    }

    return { routineCount: routineIdByKey.size }
  })
}

// Mapa nombre normalizado → id, buscando sin distinguir mayúsculas
async function findGlobalIdsByName(Model, names) {
  const documents = await Model.find({ owner: null, name: { $in: [...new Set(names)] } })
    .collation(SPANISH_COLLATION)
    .select('name')

  return new Map(documents.map((doc) => [normalizeForSearch(doc.name), doc._id]))
}

// Usa los grupos "Tren inferior" y "Tren superior" de la persona; si los borró, los recrea
async function ensureGroups(userId, session) {
  const neededNames = [...new Set(SUGGESTED_ROUTINES.map((routine) => routine.group))]
  const existing = await RoutineGroup.find({ user: userId }).session(session)
  const groups = new Map()
  let nextOrder = existing.reduce((max, group) => Math.max(max, group.order), -1) + 1

  for (const name of neededNames) {
    const found = existing.find(
      (group) => normalizeForSearch(group.name) === normalizeForSearch(name),
    )

    if (found) {
      groups.set(name, found)
    } else {
      const defaults = DEFAULT_ROUTINE_GROUPS.find((group) => group.name === name)
      const [created] = await RoutineGroup.create(
        [{ ...defaults, user: userId, order: nextOrder++ }],
        { session },
      )
      groups.set(name, created)
    }
  }

  return groups
}
