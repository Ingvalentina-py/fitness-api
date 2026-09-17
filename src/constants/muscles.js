// En la base de datos se guarda `value` (en inglés, nunca cambia).
// `label` es el texto en español que muestra la interfaz.

export const MUSCLE_REGIONS = [
  { value: 'lower', label: 'Tren inferior' },
  { value: 'upper', label: 'Tren superior' },
  { value: 'core', label: 'Core' },
  { value: 'other', label: 'Otro' },
]

export const MUSCLES = [
  { value: 'gluteMax', label: 'Glúteo mayor', region: 'lower' },
  { value: 'gluteMed', label: 'Glúteo medio', region: 'lower' },
  { value: 'quadriceps', label: 'Cuádriceps', region: 'lower' },
  { value: 'hamstrings', label: 'Femorales', region: 'lower' },
  { value: 'adductors', label: 'Aductores', region: 'lower' },
  { value: 'abductors', label: 'Abductores', region: 'lower' },
  { value: 'calves', label: 'Pantorrillas', region: 'lower' },
  { value: 'hipFlexors', label: 'Flexores de cadera', region: 'lower' },
  { value: 'chest', label: 'Pecho', region: 'upper' },
  { value: 'lats', label: 'Dorsales', region: 'upper' },
  { value: 'traps', label: 'Trapecio', region: 'upper' },
  { value: 'rhomboids', label: 'Romboides', region: 'upper' },
  { value: 'frontDelts', label: 'Deltoides anterior', region: 'upper' },
  { value: 'sideDelts', label: 'Deltoides lateral', region: 'upper' },
  { value: 'rearDelts', label: 'Deltoides posterior', region: 'upper' },
  { value: 'biceps', label: 'Bíceps', region: 'upper' },
  { value: 'triceps', label: 'Tríceps', region: 'upper' },
  { value: 'forearms', label: 'Antebrazos', region: 'upper' },
  { value: 'abs', label: 'Abdomen', region: 'core' },
  { value: 'obliques', label: 'Oblicuos', region: 'core' },
  { value: 'lowerBack', label: 'Lumbar', region: 'core' },
  { value: 'fullBody', label: 'Cuerpo completo', region: 'other' },
]

export const MUSCLE_VALUES = MUSCLES.map((muscle) => muscle.value)
