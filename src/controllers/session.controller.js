import * as sessionService from '../services/session.service.js'
import { toLocalDay } from '../utils/timezone.js'

// GET /api/v1/sessions?day=2026-09-25
export async function listSessions(req, res) {
  const day = req.validated.query.day ?? toLocalDay(new Date(), req.user.preferences.timezone)
  const sessions = await sessionService.listSessionsByDay(req.user._id, day)

  res.json({ data: sessions, meta: { day } })
}

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

// POST /api/v1/sessions/:id/routine
export async function saveSessionAsRoutine(req, res) {
  const routine = await sessionService.saveSessionAsRoutine(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.status(201).json({ data: routine })
}
