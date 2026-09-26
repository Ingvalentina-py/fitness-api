import mongoose from 'mongoose'
import { Activity, GymSession } from '../models/index.js'
import { MUSCLES } from '../constants/muscles.js'
import { daysBetween } from '../utils/days.js'

const MUSCLE_REGIONS = new Map(MUSCLES.map((muscle) => [muscle.value, muscle.region]))

// Resumen del rango elegido más las rachas, que siempre miran todo el historial:
// una racha es "cuántos días seguidos llevas", no "dentro de estas fechas".
export async function getSummary(userId, { from, to, today }) {
  const [activeDays, totals, allDays] = await Promise.all([
    Activity.distinct('day', { user: userId, day: { $gte: from, $lte: to } }),
    getTotals(userId, from, to),
    Activity.distinct('day', { user: userId }),
  ])

  return {
    activeDays: activeDays.sort(),
    totals,
    streak: getStreaks(allDays.sort(), today),
  }
}

async function getTotals(userId, from, to) {
  const [result] = await Activity.aggregate([
    { $match: { user: userId, day: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: null,
        activities: { $sum: 1 },
        sessions: { $sum: { $cond: [{ $eq: ['$kind', 'gym'] }, 1, 0] } },
        minutes: { $sum: { $ifNull: ['$durationMinutes', 0] } },
        volumeKg: { $sum: { $ifNull: ['$totalVolumeKg', 0] } },
      },
    },
  ])

  return {
    activities: result?.activities ?? 0,
    sessions: result?.sessions ?? 0,
    minutes: result?.minutes ?? 0,
    volumeKg: Math.round((result?.volumeKg ?? 0) * 100) / 100,
  }
}

// Racha actual (días seguidos hasta hoy o ayer) y la mejor de todo el historial.
// Se cuenta hasta ayer si hoy todavía no hay nada: el día sigue abierto y no
// tendría sentido decir que se rompió la racha a las 9 de la mañana.
export function getStreaks(days, today) {
  if (days.length === 0) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let index = 1; index < days.length; index += 1) {
    run = daysBetween(days[index - 1], days[index]) === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }

  const lastDay = days.at(-1)
  const distanceToToday = today ? daysBetween(lastDay, today) : 0
  const current = distanceToToday <= 1 ? run : 0

  return { current, best }
}

// Cuánto se hizo de cada tipo de actividad y cuántas series tocaron cada músculo
export async function getDistribution(userId, { from, to }) {
  const match = { user: userId, day: { $gte: from, $lte: to } }

  const [byActivity, byMuscle] = await Promise.all([
    Activity.aggregate([
      { $match: match },
      {
        $group: {
          // Las sesiones de gimnasio van todas juntas; las demás, por su tipo
          _id: { $cond: [{ $eq: ['$kind', 'gym'] }, 'gym', '$activityType'] },
          count: { $sum: 1 },
          minutes: { $sum: { $ifNull: ['$durationMinutes', 0] } },
        },
      },
      {
        $lookup: {
          from: 'activityTypes',
          localField: '_id',
          foreignField: '_id',
          as: 'activityType',
        },
      },
      { $sort: { count: -1 } },
    ]),
    GymSession.aggregate([
      { $match: { ...match, kind: 'gym' } },
      { $unwind: '$exercises' },
      // Solo cuentan las series hechas, igual que en el volumen
      {
        $set: {
          completed: {
            $size: {
              $filter: { input: '$exercises.sets', as: 'set', cond: '$$set.completed' },
            },
          },
        },
      },
      { $match: { completed: { $gt: 0 } } },
      // Una serie cuenta para cada músculo principal que trabaja
      { $unwind: '$exercises.primaryMuscles' },
      { $group: { _id: '$exercises.primaryMuscles', sets: { $sum: '$completed' } } },
      { $sort: { sets: -1 } },
    ]),
  ])

  return {
    byActivity: byActivity.map(({ _id, count, minutes, activityType }) => ({
      key: String(_id),
      name: _id === 'gym' ? 'Gimnasio' : (activityType[0]?.name ?? 'Actividad'),
      color: _id === 'gym' ? null : (activityType[0]?.color ?? null),
      count,
      minutes,
    })),
    byMuscle: byMuscle.map(({ _id, sets }) => ({
      muscle: _id,
      region: MUSCLE_REGIONS.get(_id) ?? 'other',
      sets,
    })),
  }
}

// Ejercicios de los que hay historial, para elegir cuál ver en la gráfica
export async function listExercisesWithHistory(userId) {
  return GymSession.aggregate([
    { $match: { user: userId, kind: 'gym' } },
    { $unwind: '$exercises' },
    {
      $group: {
        _id: '$exercises.exercise',
        name: { $last: '$exercises.name' },
        sessions: { $sum: 1 },
        lastDay: { $max: '$day' },
      },
    },
    { $sort: { sessions: -1, name: 1 } },
    { $project: { _id: 0, exercise: '$_id', name: 1, sessions: 1, lastDay: 1 } },
  ])
}

// Cómo evolucionó un ejercicio: peso más alto y volumen de cada día que se hizo
export async function getExerciseProgress(userId, exerciseId, { from, to }) {
  return GymSession.aggregate([
    {
      $match: {
        user: userId,
        kind: 'gym',
        day: { $gte: from, $lte: to },
        'exercises.exercise': new mongoose.Types.ObjectId(exerciseId),
      },
    },
    { $unwind: '$exercises' },
    { $match: { 'exercises.exercise': new mongoose.Types.ObjectId(exerciseId) } },
    {
      $set: {
        completedSets: {
          $filter: { input: '$exercises.sets', as: 'set', cond: '$$set.completed' },
        },
      },
    },
    {
      $group: {
        // Un mismo día puede tener dos sesiones: se suma el volumen y se toma el peso más alto
        _id: '$day',
        volumeKg: { $sum: '$exercises.volumeKg' },
        maxWeightKg: { $max: { $max: '$completedSets.weightKg' } },
        sets: { $sum: { $size: '$completedSets' } },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, day: '$_id', volumeKg: 1, maxWeightKg: 1, sets: 1 } },
  ])
}
