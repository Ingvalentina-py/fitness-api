import { ACTIVITY_KINDS, INTENSITIES, WEIGHT_UNITS } from '../constants/activities.js'
import { EQUIPMENT, MOVEMENT_PATTERNS } from '../constants/exercises.js'
import { MUSCLES, MUSCLE_REGIONS } from '../constants/muscles.js'
import { PHRASE_CONTEXTS } from '../constants/phrases.js'
import { ROUTINE_GOALS } from '../constants/routines.js'
import { WEEK_START_DAYS } from '../constants/users.js'

// Opciones válidas con sus textos en español. El frontend las usa para armar
// filtros y formularios sin duplicar listas: la API es la única fuente de verdad.
export function getMeta() {
  return {
    muscleRegions: MUSCLE_REGIONS,
    muscles: MUSCLES,
    equipment: EQUIPMENT,
    movementPatterns: MOVEMENT_PATTERNS,
    routineGoals: ROUTINE_GOALS,
    activityKinds: ACTIVITY_KINDS,
    intensities: INTENSITIES,
    weightUnits: WEIGHT_UNITS,
    phraseContexts: PHRASE_CONTEXTS,
    weekStartDays: WEEK_START_DAYS,
  }
}
