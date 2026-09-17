import mongoose from 'mongoose'
import { INTENSITY_VALUES } from '../constants/activities.js'
import { LOCAL_DAY_REGEX, baseSchemaOptions } from './shared.js'

// Modelo base de todo lo que se registra en un día. Usa "discriminators":
// sesiones de gimnasio y otras actividades viven en la misma colección `activities`,
// cada una con sus campos extra, y el campo `kind` indica de qué tipo es.
// Así el historial y las estadísticas consultan una sola colección.
const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Momento exacto de inicio (MongoDB lo guarda en UTC)
    date: { type: Date, required: true },
    // Día local de la persona, ej. "2026-09-16". Va aparte porque una clase a las
    // 9 p. m. en América ya es el día siguiente en UTC: el calendario y las rachas
    // deben usar el día que vivió la persona, aunque luego cambie de zona horaria.
    day: { type: String, required: true, match: LOCAL_DAY_REGEX },
    durationMinutes: { type: Number, min: 0, max: 1440 },
    intensity: { type: String, enum: INTENSITY_VALUES },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { ...baseSchemaOptions, discriminatorKey: 'kind', collection: 'activities' },
)

// Consulta más frecuente: actividades de una persona por día (calendario, historial, rachas)
activitySchema.index({ user: 1, day: -1, date: -1 })

export const Activity = mongoose.model('Activity', activitySchema)
