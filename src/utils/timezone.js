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
