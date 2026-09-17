import * as routineGroupService from '../services/routineGroup.service.js'

// GET /api/v1/routine-groups
export async function listGroups(req, res) {
  const groups = await routineGroupService.listGroups(req.user._id)

  res.json({ data: groups })
}

// POST /api/v1/routine-groups
export async function createGroup(req, res) {
  const group = await routineGroupService.createGroup(req.user._id, req.validated.body)

  res.status(201).json({ data: group })
}

// PATCH /api/v1/routine-groups/:id
export async function updateGroup(req, res) {
  const group = await routineGroupService.updateGroup(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: group })
}

// PUT /api/v1/routine-groups/order
export async function reorderGroups(req, res) {
  await routineGroupService.reorderGroups(req.user._id, req.validated.body.groupIds)

  res.status(204).end()
}

// DELETE /api/v1/routine-groups/:id?moveTo=<id>
export async function deleteGroup(req, res) {
  await routineGroupService.deleteGroup(
    req.user._id,
    req.validated.params.id,
    req.validated.query.moveTo,
  )

  res.status(204).end()
}
