export const USER_ROLES = ['user', 'admin']

// Solo existe "free" por ahora; aquí se agregarán los planes de pago
export const USER_PLANS = ['free']

// Mismo número que usa JavaScript en Date#getDay(): 0 = domingo, 1 = lunes
export const WEEK_START_DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 0, label: 'Domingo' },
]

export const WEEK_START_DAY_VALUES = WEEK_START_DAYS.map((day) => day.value)
