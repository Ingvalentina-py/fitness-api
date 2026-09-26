import { PersonalRecord } from '../models/index.js'
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

// Mejor serie y volumen de cada ejercicio de la sesión. Si un ejercicio aparece dos
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

function round2(value) {
  return Math.round(value * 100) / 100
}
