// Operaciones con días locales en formato AAAA-MM-DD (ver activity.model.js).
// Se trabaja en UTC a propósito: el texto ya representa el día que vivió la persona,
// así que solo hacen falta sumas de días, sin horas ni horarios de verano.
const MS_PER_DAY = 86_400_000

export function shiftDay(day, amount) {
  return new Date(toTime(day) + amount * MS_PER_DAY).toISOString().slice(0, 10)
}

export function daysBetween(from, to) {
  return Math.round((toTime(to) - toTime(from)) / MS_PER_DAY)
}

function toTime(day) {
  return Date.parse(`${day}T00:00:00Z`)
}
