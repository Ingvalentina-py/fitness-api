import './zod.js'
import { z } from 'zod'

// Convierte "a, b,c" en ['a', 'b', 'c']
const toList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

// Describe y valida las variables de entorno. Si falta alguna o está mal escrita,
// la API se detiene al arrancar con un mensaje claro, en vez de fallar más tarde.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z
    .string({
      error: 'Falta MONGODB_URI: copia .env.example como .env y pega tu cadena de conexión de Atlas',
    })
    .regex(/^mongodb(\+srv)?:\/\//, 'MONGODB_URI debe empezar por mongodb+srv:// o mongodb://')
    .refine(
      (uri) => !/<[^>]+>/.test(uri),
      'MONGODB_URI todavía tiene marcadores como <db_password>: reemplázalos por tus datos',
    ),
  MONGODB_DB_NAME: z.string().min(1).default('fitness'),
  JWT_SECRET: z
    .string({ error: 'Falta JWT_SECRET: revisa .env.example para generar una' })
    .min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  // Opcional: servidores DNS para resolver direcciones mongodb+srv:// (ver database.js)
  DNS_SERVERS: z
    .string()
    .default('')
    .transform(toList)
    .pipe(z.array(z.ipv4({ error: 'DNS_SERVERS debe ser una lista de IPs, ej.: 8.8.8.8,1.1.1.1' }))),
  // Lista separada por comas: "http://localhost:5173,https://fitness-web.vercel.app"
  CORS_ORIGIN: z.string().default('http://localhost:5173').transform(toList),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`)
}

export const env = result.data
