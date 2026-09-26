import * as sessionService from '../services/session.service.js'

// GET /api/v1/sessions/previous?exerciseIds=id1,id2
export async function getLastPerformances(req, res) {
  const performances = await sessionService.getLastPerformances(
    req.user._id,
    req.validated.query.exerciseIds,
  )

  res.json({ data: performances })
}

// GET /api/v1/sessions/:id
export async function getSession(req, res) {
  const session = await sessionService.getSessionById(req.user._id, req.validated.params.id)

  res.json({ data: session })
}

// POST /api/v1/sessions
export async function createSession(req, res) {
  const { session, records } = await sessionService.createSession(req.user, req.validated.body)

  res.status(201).json({ data: session, meta: { records } })
}

// PATCH /api/v1/sessions/:id → corrige una sesión ya guardada
export async function updateSession(req, res) {
  const session = await sessionService.updateSession(
    req.user,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: session })
}

// POST /api/v1/sessions/:id/routine
export async function saveSessionAsRoutine(req, res) {
  const routine = await sessionService.saveSessionAsRoutine(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.status(201).json({ data: routine })
}
