import { AppError } from '../utils/AppError.js'

// Se ejecuta cuando ninguna ruta coincidió con la petición
export function notFound(req) {
  throw AppError.notFound(`La ruta ${req.method} ${req.originalUrl} no existe`)
}
