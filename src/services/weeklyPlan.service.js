import { DAYS_OF_WEEK } from '../constants/days.js'
import { MUSCLES } from '../constants/muscles.js'
import { ActivityType, Routine, WeeklyPlan } from '../models/index.js'
import { AppError } from '../utils/AppError.js'

const LOWER_BODY_MUSCLES = new Set(
  MUSCLES.filter((muscle) => muscle.region === 'lower').map((muscle) => muscle.value),
)

// El plan completo: siempre 7 días (domingo = 0 … sábado = 6) y los avisos
export async function getWeeklyPlan(userId) {
  const plan = await WeeklyPlan.findOne({ user: userId })
    .populate({
      path: 'days.items.routine',
      select: 'name goal group isArchived exercises',
      populate: [
        { path: 'group', select: 'name color icon' },
        { path: 'exercises.exercise', select: 'primaryMuscles' },
      ],
    })
    .populate('days.items.activityType', 'name color icon isLegIntensive isArchived')

  const itemsByDay = new Map((plan?.days ?? []).map((day) => [day.dayOfWeek, day.items]))

  const days = DAYS_OF_WEEK.map(({ value }) => ({
    dayOfWeek: value,
    items: (itemsByDay.get(value) ?? []).map(toItemResponse).filter(Boolean),
  }))

  return { days, warnings: getLegWarnings(days) }
}

export async function updateWeeklyPlan(userId, { days }) {
  await assertItemsUsable(userId, days)

  // Solo se guardan los días con algo planeado; los demás son descanso
  const plannedDays = days
    .filter((day) => day.items.length > 0)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const plan = (await WeeklyPlan.findOne({ user: userId })) ?? new WeeklyPlan({ user: userId })
  plan.days = plannedDays
  await plan.save()

  return getWeeklyPlan(userId)
}

export async function removeRoutineFromPlan(userId, routineId) {
  await WeeklyPlan.updateOne(
    { user: userId },
    { $pull: { 'days.$[].items': { kind: 'routine', routine: routineId } } },
  )
}

// Rutina de "pierna intensa": al menos la mitad de sus ejercicios trabajan
// principalmente el tren inferior
function isLegIntenseRoutine(routine) {
  const exercises = routine.exercises.map((item) => item.exercise).filter(Boolean)
  if (exercises.length === 0) return false

  const lowerBodyCount = exercises.filter((exercise) =>
    exercise.primaryMuscles.some((muscle) => LOWER_BODY_MUSCLES.has(muscle)),
  ).length

  return lowerBodyCount / exercises.length >= 0.5
}

// Da forma a cada elemento del plan. Devuelve null si la rutina o el tipo ya no existe
// o se archivó (así el plan nunca muestra algo roto).
function toItemResponse(item) {
  if (item.kind === 'routine') {
    const routine = item.routine
    if (!routine || routine.isArchived) return null

    return {
      _id: item._id,
      kind: 'routine',
      routine: {
        _id: routine._id,
        name: routine.name,
        goal: routine.goal,
        group: routine.group,
        exerciseCount: routine.exercises.length,
      },
      isLegIntense: isLegIntenseRoutine(routine),
    }
  }

  const activityType = item.activityType
  if (!activityType || activityType.isArchived) return null

  return {
    _id: item._id,
    kind: 'activityType',
    activityType: {
      _id: activityType._id,
      name: activityType.name,
      color: activityType.color,
      icon: activityType.icon,
    },
    isLegIntense: activityType.isLegIntensive,
  }
}

// Aviso suave: pierna intensa justo después de otro día que ya exigió las piernas
function getLegWarnings(days) {
  return days.flatMap((day) => {
    const legRoutine = day.items.find((item) => item.kind === 'routine' && item.isLegIntense)
    if (!legRoutine) return []

    const previousDay = days[(day.dayOfWeek + 6) % 7]
    const previousLegItem = previousDay.items.find((item) => item.isLegIntense)
    if (!previousLegItem) return []

    const dayName = DAYS_OF_WEEK[day.dayOfWeek].label.toLowerCase()
    const previousDayName = DAYS_OF_WEEK[previousDay.dayOfWeek].label.toLowerCase()
    const previousName = previousLegItem.routine?.name ?? previousLegItem.activityType.name

    return [
      {
        dayOfWeek: day.dayOfWeek,
        message: `El ${dayName} tienes "${legRoutine.routine.name}" justo después de "${previousName}" del ${previousDayName}, que también exige tus piernas. Considera bajar la intensidad o cambiar uno de los dos días.`,
      },
    ]
  })
}

// Todas las rutinas deben ser propias y activas; los tipos, globales o propios
async function assertItemsUsable(userId, days) {
  const items = days.flatMap((day) => day.items)
  const routineIds = [...new Set(items.filter((i) => i.kind === 'routine').map((i) => i.routine))]
  const typeIds = [
    ...new Set(items.filter((i) => i.kind === 'activityType').map((i) => i.activityType)),
  ]

  const [routineCount, typeCount] = await Promise.all([
    Routine.countDocuments({ _id: { $in: routineIds }, user: userId, isArchived: false }),
    ActivityType.countDocuments({
      _id: { $in: typeIds },
      owner: { $in: [null, userId] },
      isArchived: false,
    }),
  ])

  if (routineCount !== routineIds.length || typeCount !== typeIds.length) {
    throw AppError.validation([
      { field: 'body.days', message: 'Alguna rutina o actividad del plan no existe' },
    ])
  }
}
