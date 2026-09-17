import * as exerciseService from '../services/exercise.service.js'
import { paginated } from '../utils/pagination.js'

// GET /api/v1/exercises
export async function listExercises(req, res) {
  const query = req.validated.query
  const { items, total } = await exerciseService.listExercises(query)

  res.json(paginated(items, { page: query.page, limit: query.limit, total }))
}

// GET /api/v1/exercises/:id
export async function getExercise(req, res) {
  const exercise = await exerciseService.getExerciseById(req.validated.params.id)

  res.json({ data: exercise })
}
