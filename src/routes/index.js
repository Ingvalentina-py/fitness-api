import { Router } from 'express'
import healthRoutes from './health.routes.js'

// Router de la versión 1 de la API. Cada recurso monta aquí sus rutas
// (en próximas fases: /auth, /routines, /activities…).
const router = Router()

router.use('/health', healthRoutes)

export default router
