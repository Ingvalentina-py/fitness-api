import * as activityTypeService from '../services/activityType.service.js'

// GET /api/v1/activity-types
export async function listActivityTypes(req, res) {
  const activityTypes = await activityTypeService.listActivityTypes(req.user._id)

  res.json({ data: activityTypes })
}
