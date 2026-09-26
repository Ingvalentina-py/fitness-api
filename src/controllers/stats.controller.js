import * as personalRecordService from '../services/personalRecord.service.js'
import * as statsService from '../services/stats.service.js'
import { shiftDay } from '../utils/days.js'
import { toLocalDay } from '../utils/timezone.js'

// Sin filtro se muestran los últimos 3 meses: suficiente para ver una tendencia
// sin que la primera pantalla tenga que leer todo el historial.
const DEFAULT_RANGE_DAYS = 90

// El rango siempre se resuelve con la zona horaria de la persona
function resolveRange(req) {
  const today = toLocalDay(new Date(), req.user.preferences.timezone)
  const { from, to } = req.validated.query

  return {
    today,
    from: from ?? shiftDay(to ?? today, -(DEFAULT_RANGE_DAYS - 1)),
    to: to ?? today,
  }
}

// GET /api/v1/stats/summary?from=&to=
export async function getSummary(req, res) {
  const range = resolveRange(req)
  const summary = await statsService.getSummary(req.user._id, range)

  res.json({ data: summary, meta: { from: range.from, to: range.to, today: range.today } })
}

// GET /api/v1/stats/distribution?from=&to=
export async function getDistribution(req, res) {
  const range = resolveRange(req)
  const distribution = await statsService.getDistribution(req.user._id, range)

  res.json({ data: distribution, meta: { from: range.from, to: range.to } })
}

// GET /api/v1/stats/exercises → ejercicios con historial
export async function listExercisesWithHistory(req, res) {
  const exercises = await statsService.listExercisesWithHistory(req.user._id)

  res.json({ data: exercises })
}

// GET /api/v1/stats/exercises/:id?from=&to=
export async function getExerciseProgress(req, res) {
  const range = resolveRange(req)
  const progress = await statsService.getExerciseProgress(
    req.user._id,
    req.validated.params.id,
    range,
  )

  res.json({ data: progress, meta: { from: range.from, to: range.to } })
}

// GET /api/v1/records
export async function listRecords(req, res) {
  const records = await personalRecordService.listRecords(req.user._id)

  res.json({ data: records })
}
