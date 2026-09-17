import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'
import apiV1Router from './routes/index.js'

// Crea y configura la app de Express, sin ponerla a escuchar en un puerto.
// Así la misma app sirve para el servidor local (server.js) y para Vercel.
const app = express()

app.use(helmet()) // cabeceras HTTP de seguridad
app.use(cors({ origin: env.CORS_ORIGIN })) // solo el frontend autorizado puede llamar a la API
app.use(express.json()) // convierte el cuerpo JSON de las peticiones en req.body

app.use('/api/v1', apiV1Router)

// Siempre al final: primero "ruta no encontrada", después el manejador de errores
app.use(notFound)
app.use(errorHandler)

export default app
