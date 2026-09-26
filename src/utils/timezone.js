// Comprueba si un texto es una zona horaria IANA válida (ej.: "America/Bogota").
// Intl lanza un error si no la reconoce.
export function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat('es', { timeZone })
    return true
  } catch {
    return false
  }
}

// Día local de una fecha en formato AAAA-MM-DD (ver activity.model.js).
// "en-CA" es el idioma cuyo formato corto de fecha ya es AAAA-MM-DD.
export function toLocalDay(date, timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}
