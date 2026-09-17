import * as metaService from '../services/meta.service.js'

// GET /api/v1/meta
export function getMeta(_req, res) {
  res.json({ data: metaService.getMeta() })
}
