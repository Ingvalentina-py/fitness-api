import mongoose from 'mongoose'
import { Activity } from './activity.model.js'

// Actividad distinta al gimnasio (baile, clase grupal, bicicleta…)
const generalActivitySchema = new mongoose.Schema({
  activityType: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityType', required: true },
  // Solo si el tipo de actividad usa distancia
  distanceKm: { type: Number, min: 0, max: 1000 },
})

export const GeneralActivity = Activity.discriminator(
  'GeneralActivity',
  generalActivitySchema,
  'general',
)
