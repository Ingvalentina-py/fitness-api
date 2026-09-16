import mongoose from 'mongoose'
import { connectToDatabase } from '../config/database.js'

// Comprueba si la base de datos responde. La lógica vive aquí (servicio)
// para que el controlador solo se encargue de la petición y la respuesta HTTP.
export async function getHealthStatus() {
  let database = 'connected'

  try {
    await connectToDatabase()
    await mongoose.connection.db.command({ ping: 1 })
  } catch (error) {
    console.error('Health check: MongoDB no responde →', error.message)
    database = 'disconnected'
  }

  return {
    status: database === 'connected' ? 'ok' : 'degraded',
    database,
    timestamp: new Date().toISOString(),
  }
}
