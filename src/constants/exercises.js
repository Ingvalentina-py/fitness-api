export const EQUIPMENT = [
  { value: 'machine', label: 'Máquina' },
  { value: 'cable', label: 'Polea' },
  { value: 'dumbbell', label: 'Mancuerna' },
  { value: 'barbell', label: 'Barra' },
  { value: 'smith', label: 'Máquina Smith' },
  { value: 'bodyweight', label: 'Peso corporal' },
  { value: 'band', label: 'Banda elástica' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'other', label: 'Otro' },
]

// Patrón de movimiento: agrupa variaciones de un mismo gesto
// (por ejemplo, todas las sentadillas), sin importar el equipo.
export const MOVEMENT_PATTERNS = [
  { value: 'squat', label: 'Sentadilla' },
  { value: 'hinge', label: 'Bisagra de cadera' },
  { value: 'lunge', label: 'Zancada' },
  { value: 'hipThrust', label: 'Empuje de cadera' },
  { value: 'horizontalPush', label: 'Empuje horizontal' },
  { value: 'verticalPush', label: 'Empuje vertical' },
  { value: 'horizontalPull', label: 'Tirón horizontal' },
  { value: 'verticalPull', label: 'Tirón vertical' },
  { value: 'isolation', label: 'Aislamiento' },
  { value: 'core', label: 'Core' },
  { value: 'other', label: 'Otro' },
]

export const EQUIPMENT_VALUES = EQUIPMENT.map((item) => item.value)
export const MOVEMENT_PATTERN_VALUES = MOVEMENT_PATTERNS.map((pattern) => pattern.value)
