// El volumen es la carga total levantada: repeticiones × peso, sumando todas las series.
// Es la forma estándar de medir cuánto trabajo hiciste y de comparar sesiones entre sí.

// Los ejercicios unilaterales se registran por lado (como en el Excel: "10 (unilateral) / 12.5"),
// pero el trabajo se hace con los dos lados, así que su volumen se multiplica por 2.
// Sin esto, un día de unilaterales parecería la mitad de duro de lo que fue.
const UNILATERAL_SIDES = 2

// Solo cuentan las series marcadas como completadas: la casilla es la que dice "esto lo hice".
function setVolumeKg(set) {
  if (!set.completed || !set.reps || !set.weightKg) return 0
  return set.reps * set.weightKg
}

export function exerciseVolumeKg(exercise) {
  const sides = exercise.isUnilateral ? UNILATERAL_SIDES : 1
  const total = exercise.sets.reduce((sum, set) => sum + setVolumeKg(set), 0)

  return round2(total * sides)
}

export function countCompletedSets(exercises) {
  return exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((set) => set.completed).length,
    0,
  )
}

// Peso más alto de una serie completada (en kg) y sus repeticiones, para los récords
export function bestSetOf(exercise) {
  let best = null

  for (const set of exercise.sets) {
    if (!set.completed || !set.weightKg) continue
    if (!best || set.weightKg > best.weightKg) best = { weightKg: set.weightKg, reps: set.reps }
  }

  return best
}

function round2(value) {
  return Math.round(value * 100) / 100
}
