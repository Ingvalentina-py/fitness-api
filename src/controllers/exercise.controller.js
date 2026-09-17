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
