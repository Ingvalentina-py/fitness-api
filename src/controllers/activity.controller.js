import * as activityService from '../services/activity.service.js'
import { toLocalDay } from '../utils/timezone.js'

// GET /api/v1/activities?day=2026-09-25
export async function listActivities(req, res) {
  const day = req.validated.query.day ?? toLocalDay(new Date(), req.user.preferences.timezone)
  const activities = await activityService.listActivitiesByDay(req.user._id, day)

  res.json({ data: activities, meta: { day } })
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
