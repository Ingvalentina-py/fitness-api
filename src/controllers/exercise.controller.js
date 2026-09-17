import * as exerciseService from '../services/exercise.service.js'
import { paginated } from '../utils/pagination.js'

// GET /api/v1/exercises
export async function listExercises(req, res) {
  const query = req.validated.query
  const { items, total } = await exerciseService.listExercises(req.user._id, query)

  res.json(paginated(items, { page: query.page, limit: query.limit, total }))
}

// GET /api/v1/exercises/:id
export async function getExercise(req, res) {
  const exercise = await exerciseService.getExerciseById(req.user._id, req.validated.params.id)

  res.json({ data: exercise })
}

// POST /api/v1/exercises
export async function createExercise(req, res) {
  const exercise = await exerciseService.createExercise(req.user._id, req.validated.body)

  res.status(201).json({ data: exercise })
}

// PATCH /api/v1/exercises/:id
export async function updateExercise(req, res) {
  const exercise = await exerciseService.updateExercise(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: exercise })
}

// DELETE /api/v1/exercises/:id → archiva (no borra)
export async function archiveExercise(req, res) {
  await exerciseService.archiveExercise(req.user._id, req.validated.params.id)

  res.status(204).end()
}
