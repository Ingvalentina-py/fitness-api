import dns from 'node:dns'
import mongoose from 'mongoose'
import { env } from './env.js'

// En algunos equipos con Windows, Node no detecta el DNS del sistema y no puede
// resolver las direcciones mongodb+srv:// (error "querySrv ECONNREFUSED").
// DNS_SERVERS permite indicar servidores DNS a mano. En Vercel no hace falta.
if (env.DNS_SERVERS.length > 0) {
  dns.setServers(env.DNS_SERVERS)
}

// En Vercel la API corre como funciones serverless: una misma instancia atiende
// varias peticiones seguidas. Guardamos la conexión en variables del módulo para
// reutilizarla, en vez de abrir una nueva en cada petición (sería lento y agotaría
// el límite de conexiones de Atlas).
let connection = null
let connectionPromise = null

export async function connectToDatabase() {
  if (connection) return connection

  // Si dos peticiones llegan a la vez, ambas esperan la misma promesa
  connectionPromise ??= mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    // Falla en 10 s si no alcanza el clúster (por ejemplo, IP no autorizada en Atlas)
    serverSelectionTimeoutMS: 10_000,
  })

  try {
    connection = await connectionPromise
  } catch (error) {
    // Olvidamos la promesa fallida para reintentar en la próxima petición
    connectionPromise = null
    throw error
  }

  return connection
}
