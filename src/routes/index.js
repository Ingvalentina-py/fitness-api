import { Router } from 'express'
import { ensureDatabase } from '../middlewares/ensureDatabase.js'
import { requireAuth } from '../middlewares/requireAuth.js'
import activityTypeRoutes from './activityType.routes.js'
import authRoutes from './auth.routes.js'
import exerciseRoutes from './exercise.routes.js'
import healthRoutes from './health.routes.js'
import metaRoutes from './meta.routes.js'
import phraseRoutes from './phrase.routes.js'
import userRoutes from './user.routes.js'

// Router de la versión 1 de la API. Cada recurso monta aquí sus rutas.
const router = Router()

// Públicas y sin base de datos: /health maneja su propia conexión y /meta no usa MongoDB
router.use('/health', healthRoutes)
router.use('/meta', metaRoutes)

// Públicas con base de datos: registro, inicio y cierre de sesión
router.use('/auth', ensureDatabase, authRoutes)

// Privadas: primero conecta a MongoDB, luego exige una sesión válida.
// Todos los datos se filtran por la persona que tiene la sesión (req.user).
const privateRoute = [ensureDatabase, requireAuth]

router.use('/users', ...privateRoute, userRoutes)
router.use('/exercises', ...privateRoute, exerciseRoutes)
router.use('/activity-types', ...privateRoute, activityTypeRoutes)
router.use('/phrases', ...privateRoute, phraseRoutes)

export default router
