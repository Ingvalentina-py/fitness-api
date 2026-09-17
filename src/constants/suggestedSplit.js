// División sugerida para empezar (plan, sección 5.2). Se carga como ejemplo y es
// totalmente editable. Los ejercicios se buscan por nombre en el catálogo global.
// Fuerza: pocas repeticiones y más descanso. Hipertrofia: más repeticiones y menos descanso.

const strength = { targetRepsMin: 6, targetRepsMax: 8, restSeconds: 120 }
const hypertrophy = { targetRepsMin: 10, targetRepsMax: 12, restSeconds: 75 }

export const SUGGESTED_ROUTINES = [
  {
    key: 'lowerA',
    group: 'Tren inferior',
    name: 'Inferior A – Fuerza',
    goal: 'strength',
    exercises: [
      { name: 'Sentadilla sumo en prensa', targetSets: 4, ...strength },
      { name: 'Hip thrust', targetSets: 4, ...strength },
      { name: 'Sentadilla búlgara', targetSets: 3, ...strength, restSeconds: 90 },
      { name: 'Curl femoral acostado', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
    ],
  },
  {
    key: 'upperA',
    group: 'Tren superior',
    name: 'Superior A – Fuerza',
    goal: 'strength',
    exercises: [
      { name: 'Press de pecho en máquina', targetSets: 4, ...strength },
      { name: 'Jalón al pecho', targetSets: 4, ...strength },
      { name: 'Remo sentado en polea', targetSets: 3, ...strength, restSeconds: 90 },
      { name: 'Press de hombro con mancuernas', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { name: 'Curl de bíceps en polea baja (con barra)', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 60 },
    ],
  },
  {
    key: 'lowerB',
    group: 'Tren inferior',
    name: 'Inferior B – Hipertrofia',
    goal: 'hypertrophy',
    exercises: [
      { name: 'Hip thrust', targetSets: 4, ...hypertrophy, restSeconds: 90 },
      { name: 'Peso muerto rumano con mancuernas', targetSets: 3, ...hypertrophy, restSeconds: 90 },
      { name: 'Patada de glúteo en máquina', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { name: 'Abducción de cadera en máquina', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { name: 'Curl femoral acostado', targetSets: 3, ...hypertrophy, restSeconds: 60 },
    ],
  },
  {
    key: 'upperB',
    group: 'Tren superior',
    name: 'Superior B – Hipertrofia',
    goal: 'hypertrophy',
    exercises: [
      { name: 'Abrazos en máquina (pec deck)', targetSets: 3, ...hypertrophy },
      { name: 'Remo con mancuerna', targetSets: 3, ...hypertrophy },
      { name: 'Elevaciones laterales con mancuernas', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { name: 'Curl martillo en polea baja (con cuerda)', targetSets: 3, ...hypertrophy, restSeconds: 60 },
      { name: 'Extensión de tríceps en polea', targetSets: 3, ...hypertrophy, restSeconds: 60 },
    ],
  },
]

// Lunes a viernes según el plan; miércoles y sábado, actividades libres; domingo, descanso
export const SUGGESTED_WEEK = [
  { dayOfWeek: 1, routine: 'lowerA' },
  { dayOfWeek: 2, routine: 'upperA' },
  { dayOfWeek: 3, activityType: 'Clase grupal' },
  { dayOfWeek: 4, routine: 'lowerB' },
  { dayOfWeek: 5, routine: 'upperB' },
  { dayOfWeek: 6, activityType: 'Baile' },
]
