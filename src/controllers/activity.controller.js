import * as activityService from '../services/activity.service.js'
import { toLocalDay } from '../utils/timezone.js'

// GET /api/v1/activities?day=2026-09-25 o ?from=2026-09-01&to=2026-09-30
export async function listActivities(req, res) {
  const { day, from, to } = req.validated.query

  if (from) {
    const activities = await activityService.listActivitiesInRange(req.user._id, from, to)
    return res.json({ data: activities, meta: { from, to } })
  }

  const selectedDay = day ?? toLocalDay(new Date(), req.user.preferences.timezone)
  const activities = await activityService.listActivitiesByDay(req.user._id, selectedDay)

  res.json({ data: activities, meta: { day: selectedDay } })
}

// GET /api/v1/activities/:id
export async function getActivity(req, res) {
  const activity = await activityService.getActivityById(req.user._id, req.validated.params.id)

  res.json({ data: activity })
}

// POST /api/v1/activities
export async function createActivity(req, res) {
  const activity = await activityService.createGeneralActivity(req.user, req.validated.body)

  res.status(201).json({ data: activity })
}

// PATCH /api/v1/activities/:id (solo actividades distintas al gimnasio;
// las sesiones se corrigen en PATCH /sessions/:id)
export async function updateActivity(req, res) {
  const activity = await activityService.updateGeneralActivity(
    req.user,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: activity })
}

// DELETE /api/v1/activities/:id → borra cualquier registro del día
export async function deleteActivity(req, res) {
  await activityService.deleteActivity(req.user._id, req.validated.params.id)

  res.status(204).end()
}
