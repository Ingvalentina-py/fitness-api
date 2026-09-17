import * as weeklyPlanService from '../services/weeklyPlan.service.js'

// GET /api/v1/weekly-plan
export async function getWeeklyPlan(req, res) {
  const plan = await weeklyPlanService.getWeeklyPlan(req.user._id)

  res.json({ data: plan })
}

// PUT /api/v1/weekly-plan
export async function updateWeeklyPlan(req, res) {
  const plan = await weeklyPlanService.updateWeeklyPlan(req.user._id, req.validated.body)

  res.json({ data: plan })
}
