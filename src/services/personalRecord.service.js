import { GymSession, PersonalRecord } from '../models/index.js'
import { bestSetOf } from '../utils/volume.js'

// Los dos récords que lleva la app por ejercicio
const RECORD_KINDS = ['maxWeight', 'bestVolume']

// Revisa una sesión recién guardada, actualiza los récords de cada ejercicio y
// devuelve solo los que SUPERAN una marca anterior. La primera vez que haces un
// ejercicio se guarda la marca en silencio: celebrar "récord" en el primer intento
// no significa nada.
export async function applySession(userId, session) {
  const results = summarizeExercises(session.exercises)
  if (results.size === 0) return []

  const exerciseIds = [...results.keys()]
  const existing = await PersonalRecord.find({ user: userId, exercise: { $in: exerciseIds } })
  const byExercise = new Map(existing.map((record) => [String(record.exercise), record]))

  const achievements = []
  const writes = []

  for (const [exerciseId, result] of results) {
    const record = byExercise.get(exerciseId)
    const updates = {}

    for (const kind of RECORD_KINDS) {
      const candidate = result[kind]
      const previous = record?.[kind] ?? null
      if (!candidate || (previous && candidate.valueKg <= previous.valueKg)) continue

      updates[kind] = { ...candidate, achievedAt: session.date, session: session._id }
      // Sin marca anterior no hay nada que superar todavía
      if (previous) {
        achievements.push({
          exercise: exerciseId,
          name: result.name,
          kind,
          valueKg: candidate.valueKg,
          reps: candidate.reps,
          previousKg: previous.valueKg,
        })
      }
    }

    if (Object.keys(updates).length > 0) {
      writes.push({
        updateOne: {
          filter: { user: userId, exercise: exerciseId },
          update: { $set: updates, $setOnInsert: { user: userId, exercise: exerciseId } },
          upsert: true,
        },
      })
    }
  }

  if (writes.length > 0) await PersonalRecord.bulkWrite(writes)

  return achievements
}

// Vuelve a calcular desde cero los récords de unos ejercicios, mirando todas las
// sesiones donde aparecen. Hace falta al editar o borrar una sesión: si la sesión
// que tenía el récord cambió, el récord no puede seguir apuntando a ella.
// Cuando el historial crezca mucho, esto pasará a ser una agregación en MongoDB;
// hoy son pocas sesiones por persona y así el cálculo queda en un solo sitio.
export async function recomputeForExercises(userId, exerciseIds) {
  const ids = [...new Set(exerciseIds.map(String))]
  if (ids.length === 0) return

  // De la más antigua a la más reciente, para que ante un empate gane la primera vez
  const sessions = await GymSession.find(
    { user: userId, 'exercises.exercise': { $in: ids } },
    { date: 1, exercises: 1 },
  ).sort({ date: 1 })

  // exerciseId → la mejor marca de cada tipo entre todas sus sesiones
  const best = new Map()

  for (const session of sessions) {
    for (const [exerciseId, result] of summarizeExercises(session.exercises)) {
      if (!ids.includes(exerciseId)) continue
      const current = best.get(exerciseId) ?? { maxWeight: null, bestVolume: null }

      best.set(exerciseId, {
        maxWeight: betterOf(current.maxWeight, achievedIn(result.maxWeight, session)),
        bestVolume: betterOf(current.bestVolume, achievedIn(result.bestVolume, session)),
      })
    }
  }

  await PersonalRecord.bulkWrite(
    ids.map((exerciseId) => {
      const record = best.get(exerciseId)

      // Si ya no queda ninguna serie válida, el ejercicio se queda sin récord
      if (!record?.maxWeight && !record?.bestVolume) {
        return { deleteOne: { filter: { user: userId, exercise: exerciseId } } }
      }

      return {
        updateOne: {
          filter: { user: userId, exercise: exerciseId },
          update: {
            $set: { maxWeight: record.maxWeight ?? null, bestVolume: record.bestVolume ?? null },
            $setOnInsert: { user: userId, exercise: exerciseId },
          },
          upsert: true,
        },
      }
    }),
  )
}

// Mejor serie y volumen de cada ejercicio de una sesión. Si un ejercicio aparece dos
// veces en la misma sesión, su volumen se suma y se queda la serie más pesada.
function summarizeExercises(exercises) {
  const results = new Map()

  for (const exercise of exercises) {
    const id = String(exercise.exercise)
    const current = results.get(id) ?? { name: exercise.name, maxWeight: null, bestVolume: null }
    const best = bestSetOf(exercise)

    if (best && (!current.maxWeight || best.weightKg > current.maxWeight.valueKg)) {
      current.maxWeight = { valueKg: best.weightKg, reps: best.reps }
    }
    if (exercise.volumeKg > 0) {
      const previousVolume = current.bestVolume?.valueKg ?? 0
      current.bestVolume = { valueKg: round2(previousVolume + exercise.volumeKg) }
    }

    if (current.maxWeight || current.bestVolume) results.set(id, current)
  }

  return results
}

// Completa una marca con cuándo y en qué sesión se logró
function achievedIn(value, session) {
  return value ? { ...value, achievedAt: session.date, session: session._id } : null
}

// Ante un empate se queda la marca más antigua: fue la primera en lograrse
function betterOf(current, candidate) {
  if (!candidate) return current
  if (!current || candidate.valueKg > current.valueKg) return candidate
  return current
}

function round2(value) {
  return Math.round(value * 100) / 100
}
