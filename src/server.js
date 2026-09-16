import app from './app.js'
import { env } from './config/env.js'
import { connectToDatabase } from './config/database.js'

// Arranque para desarrollo local. En Vercel este archivo no se usa.

try {
  await connectToDatabase()
  console.log(`✅ Conectado a MongoDB Atlas (base de datos: ${env.MONGODB_DB_NAME})`)
} catch (error) {
  // No detenemos la API: /health mostrará la base de datos como desconectada
  console.error('❌ No se pudo conectar a MongoDB Atlas:', error.message)
  console.error('   Revisa MONGODB_URI en .env y tu IP en Atlas → Network Access.')
}

app.listen(env.PORT, (error) => {
  if (error) {
    console.error(`❌ No se pudo iniciar la API en el puerto ${env.PORT}:`, error.message)
    process.exit(1)
  }
  console.log(`🚀 API lista en http://localhost:${env.PORT}/api/v1/health`)
})
