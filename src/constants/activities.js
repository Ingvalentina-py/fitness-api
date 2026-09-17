// Tipos de registro dentro de la colección `activities` (discriminators de Mongoose)
export const ACTIVITY_KINDS = [
  { value: 'gym', label: 'Gimnasio' },
  { value: 'general', label: 'Otra actividad' },
]

export const INTENSITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
]

export const WEIGHT_UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
]

export const ENERGY_LEVEL = { min: 1, max: 5 }

export const INTENSITY_VALUES = INTENSITIES.map((intensity) => intensity.value)
export const WEIGHT_UNIT_VALUES = WEIGHT_UNITS.map((unit) => unit.value)
