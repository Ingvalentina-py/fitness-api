export const USER_ROLES = ['user', 'admin']

// Solo existe "free" por ahora; aquí se agregarán los planes de pago
export const USER_PLANS = ['free']

// Mismo número que usa JavaScript en Date#getDay(): 0 = domingo, 1 = lunes
export const WEEK_START_DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 0, label: 'Domingo' },
]

// Temas de color de la interfaz. El valor no cambia nunca (se guarda en la base);
// el texto es lo que se ve. Los colores de cada uno viven en el frontend
// (src/styles/themes.css): aquí solo está la lista válida.
export const USER_THEMES = [
  { value: 'pulse', label: 'Pulso' },
  { value: 'violet', label: 'Violeta' },
  { value: 'ocean', label: 'Océano' },
  { value: 'forest', label: 'Bosque' },
  { value: 'sunset', label: 'Atardecer' },
  { value: 'graphite', label: 'Grafito' },
]

export const USER_THEME_VALUES = USER_THEMES.map((theme) => theme.value)

export const WEEK_START_DAY_VALUES = WEEK_START_DAYS.map((day) => day.value)
