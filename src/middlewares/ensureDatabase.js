import { connectToDatabase } from '../config/database.js'
import { AppError } from '../utils/AppError.js'

// Garantiza la conexión a MongoDB antes de llegar a la ruta. En Vercel cada instancia
// nueva empieza sin conexión; las peticiones siguientes reutilizan la misma.
export async function ensureDatabase(_req, _res, next) {
  try {
    await connectToDatabase()
  } catch (error) {
    console.error('MongoDB no disponible →', error.message)
    throw new AppError('La base de datos no está disponible. Intenta de nuevo en unos segundos.', {
      status: 503,
      code: 'DATABASE_UNAVAILABLE',
    })
  }

  next()
}
