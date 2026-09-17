// Duración de la sesión: después de este tiempo hay que volver a iniciar sesión
export const SESSION_DURATION_DAYS = 30
export const SESSION_COOKIE_NAME = 'fitness_session'

// Costo de bcrypt: cada punto duplica el tiempo de cálculo (11 ≈ 0,2 s).
// Hace muy lento probar millones de contraseñas si alguien roba la base de datos.
export const BCRYPT_ROUNDS = 11

// Límite de intentos fallidos de inicio de sesión por correo
export const LOGIN_MAX_FAILED_ATTEMPTS = 5
export const LOGIN_LOCK_MINUTES = 15
