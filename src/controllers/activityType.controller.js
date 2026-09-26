import * as activityTypeService from '../services/activityType.service.js'

// GET /api/v1/activity-types
export async function listActivityTypes(req, res) {
  const activityTypes = await activityTypeService.listActivityTypes(req.user._id)

  res.json({ data: activityTypes })
}

// POST /api/v1/activity-types
export async function createActivityType(req, res) {
  const activityType = await activityTypeService.createActivityType(req.user._id, req.validated.body)

  res.status(201).json({ data: activityType })
}

// PATCH /api/v1/activity-types/:id
export async function updateActivityType(req, res) {
  const activityType = await activityTypeService.updateActivityType(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: activityType })
}

// DELETE /api/v1/activity-types/:id → lo archiva
export async function archiveActivityType(req, res) {
  await activityTypeService.archiveActivityType(req.user._id, req.validated.params.id)

  res.status(204).end()
}
