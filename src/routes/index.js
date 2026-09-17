import { Router } from 'express'
import { ensureDatabase } from '../middlewares/ensureDatabase.js'
import activityTypeRoutes from './activityType.routes.js'
import exerciseRoutes from './exercise.routes.js'
import healthRoutes from './health.routes.js'
import metaRoutes from './meta.routes.js'
import phraseRoutes from './phrase.routes.js'

// Router de la versión 1 de la API. Cada recurso monta aquí sus rutas.
const router = Router()

// No necesitan ensureDatabase: /health maneja su propia conexión y /meta no usa MongoDB
router.use('/health', healthRoutes)
router.use('/meta', metaRoutes)

// Estas rutas leen MongoDB: ensureDatabase conecta (o reutiliza la conexión) antes
router.use('/exercises', ensureDatabase, exerciseRoutes)
router.use('/activity-types', ensureDatabase, activityTypeRoutes)
router.use('/phrases', ensureDatabase, phraseRoutes)

export default router
