import * as activityTypeService from '../services/activityType.service.js'

// GET /api/v1/activity-types
export async function listActivityTypes(_req, res) {
  const activityTypes = await activityTypeService.listActivityTypes()

  res.json({ data: activityTypes })
}
