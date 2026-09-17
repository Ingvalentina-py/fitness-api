import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

const DATABASE_ERROR_NAMES = ['MongooseServerSelectionError', 'MongoNetworkError']

// Traduce errores conocidos de librerías a AppError. Devuelve null si es inesperado.
function toAppError(error) {
  if (error instanceof AppError) return error

  // Cuerpo JSON mal escrito o demasiado grande (lo detecta express.json)
  if (error.type === 'entity.parse.failed') {
    return new AppError('El cuerpo de la petición no es un JSON válido', {
      status: 400,
      code: 'INVALID_JSON',
    })
  }
  if (error.type === 'entity.too.large') {
    return new AppError('El cuerpo de la petición es demasiado grande', {
      status: 413,
      code: 'PAYLOAD_TOO_LARGE',
    })
  }

  // Validación de Mongoose: última barrera, normalmente Zod lo detecta antes
  if (error instanceof mongoose.Error.ValidationError) {
    return AppError.validation(
      Object.values(error.errors).map(({ path, message }) => ({ field: path, message })),
    )
  }

  // Valor imposible de convertir (ej.: un id con formato incorrecto)
  if (error instanceof mongoose.Error.CastError) {
    return new AppError(`Valor inválido para "${error.path}"`, { status: 400, code: 'INVALID_VALUE' })
  }

  // Índice único violado (ej.: un nombre de ejercicio repetido)
  if (error.code === 11000) {
    const fields = Object.keys(error.keyValue ?? {})
    return new AppError('Ya existe un registro con esos datos', {
      status: 409,
      code: 'DUPLICATE',
      details: fields.map((field) => ({ field, message: 'Ya está en uso' })),
    })
  }

  if (DATABASE_ERROR_NAMES.includes(error.name)) {
    return new AppError('La base de datos no está disponible. Intenta de nuevo en unos segundos.', {
      status: 503,
      code: 'DATABASE_UNAVAILABLE',
    })
  }

  return null
}

// Manejador central de errores. Express lo reconoce porque recibe 4 parámetros.
// Todas las respuestas de error tienen la misma forma:
// { "error": { "code": "...", "message": "...", "details": [...] } }
export function errorHandler(error, req, res, next) {
  // Si la respuesta ya empezó a enviarse, Express debe cerrar la conexión
  if (res.headersSent) return next(error)

  const appError = toAppError(error)

  if (!appError) {
    // Inesperado: se registra completo en el servidor, sin revelar detalles al cliente
    console.error(`💥 ${req.method} ${req.originalUrl}`, error)
  }

  const { status, code, message, details } = appError ?? new AppError('Ocurrió un error inesperado')

  res.status(status).json({
    error: {
      code,
      message,
      ...(details && { details }),
      // En desarrollo, la traza ayuda a encontrar el fallo
      ...(!appError && env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  })
}
