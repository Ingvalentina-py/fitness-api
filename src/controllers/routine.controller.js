import * as routineService from '../services/routine.service.js'
import * as suggestedSplitService from '../services/suggestedSplit.service.js'

// GET /api/v1/routines?archived=false
export async function listRoutines(req, res) {
  const routines = await routineService.listRoutines(req.user._id, req.validated.query)

  res.json({ data: routines })
}

// GET /api/v1/routines/:id
export async function getRoutine(req, res) {
  const routine = await routineService.getRoutineById(req.user._id, req.validated.params.id)

  res.json({ data: routine })
}

// POST /api/v1/routines
export async function createRoutine(req, res) {
  const routine = await routineService.createRoutine(req.user._id, req.validated.body)

  res.status(201).json({ data: routine })
}

// PATCH /api/v1/routines/:id
export async function updateRoutine(req, res) {
  const routine = await routineService.updateRoutine(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: routine })
}

// POST /api/v1/routines/:id/duplicate
export async function duplicateRoutine(req, res) {
  const routine = await routineService.duplicateRoutine(req.user._id, req.validated.params.id)

  res.status(201).json({ data: routine })
}

// PUT /api/v1/routines/order
export async function reorderRoutines(req, res) {
  const { groupId, routineIds } = req.validated.body
  await routineService.reorderRoutines(req.user._id, groupId, routineIds)

  res.status(204).end()
}

// POST /api/v1/routines/suggested-split
export async function createSuggestedSplit(req, res) {
  const result = await suggestedSplitService.createSuggestedSplit(req.user._id)

  res.status(201).json({ data: result })
}
