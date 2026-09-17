import mongoose from 'mongoose'
import { baseSchemaOptions } from './shared.js'

// Algo planeado para un día: una rutina o un tipo de actividad (ej.: baile)
const planItemSchema = new mongoose.Schema({
  kind: { type: String, enum: ['routine', 'activityType'], required: true },
  routine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Routine',
    required() {
      return this.kind === 'routine'
    },
  },
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType',
    required() {
      return this.kind === 'activityType'
    },
  },
})

const planDaySchema = new mongoose.Schema(
  {
    // 0 = domingo … 6 = sábado (igual que Date#getDay). Sin elementos = descanso.
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    items: { type: [planItemSchema], default: [] },
  },
  { _id: false },
)

const weeklyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    days: {
      type: [planDaySchema],
      default: [],
      validate: {
        validator: (days) => new Set(days.map((day) => day.dayOfWeek)).size === days.length,
        message: 'Cada día de la semana solo puede aparecer una vez',
      },
    },
  },
  { ...baseSchemaOptions, collection: 'weeklyPlans' },
)

// Un solo plan semanal por persona
weeklyPlanSchema.index({ user: 1 }, { unique: true })

export const WeeklyPlan = mongoose.model('WeeklyPlan', weeklyPlanSchema)
