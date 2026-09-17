// Error "esperado" de la aplicación: lleva el código HTTP (status) y un código
// estable que el frontend puede usar (code). Cualquier otro error es inesperado → 500.
export class AppError extends Error {
  constructor(message, { status = 500, code = 'INTERNAL_ERROR', details } = {}) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }

  static validation(details) {
    return new AppError('Los datos enviados no son válidos', {
      status: 400,
      code: 'VALIDATION_ERROR',
      details,
    })
  }

  static unauthorized(message = 'Necesitas iniciar sesión', code = 'UNAUTHENTICATED') {
    return new AppError(message, { status: 401, code })
  }

  static forbidden(message = 'No tienes permiso para hacer esto') {
    return new AppError(message, { status: 403, code: 'FORBIDDEN' })
  }

  static notFound(message = 'No se encontró lo que buscas') {
    return new AppError(message, { status: 404, code: 'NOT_FOUND' })
  }

  static conflict(message, details) {
    return new AppError(message, { status: 409, code: 'CONFLICT', details })
  }

  static tooManyRequests(message) {
    return new AppError(message, { status: 429, code: 'TOO_MANY_ATTEMPTS' })
  }
}
