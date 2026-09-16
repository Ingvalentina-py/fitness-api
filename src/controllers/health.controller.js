import { getHealthStatus } from '../services/health.service.js'

// GET /api/v1/health
export async function getHealth(req, res) {
  const health = await getHealthStatus()

  // 503 = "servicio no disponible": útil para monitores que vigilan la API
  res.status(health.status === 'ok' ? 200 : 503).json(health)
}
