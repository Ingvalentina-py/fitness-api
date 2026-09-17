export const ROUTINE_GOALS = [
  { value: 'strength', label: 'Fuerza' },
  { value: 'hypertrophy', label: 'Hipertrofia' },
  { value: 'endurance', label: 'Resistencia' },
  { value: 'other', label: 'Otro' },
]

export const ROUTINE_GOAL_VALUES = ROUTINE_GOALS.map((goal) => goal.value)

// Grupos que recibe cada persona al crear su cuenta (Fase 2). Son editables.
// `icon` es un nombre de ícono que el frontend traduce a un dibujo (Fase 3).
export const DEFAULT_ROUTINE_GROUPS = [
  { name: 'Tren inferior', color: '#FF2E7E', icon: 'footprints' },
  { name: 'Tren superior', color: '#FF6B2C', icon: 'dumbbell' },
  { name: 'Full body', color: '#12D6C5', icon: 'zap' },
  { name: 'Cardio y clases', color: '#FFC928', icon: 'heart-pulse' },
]
