import mongoose from 'mongoose'
import { HEX_COLOR_REGEX, baseSchemaOptions } from './shared.js'

// Carpeta para organizar rutinas (ej.: "Tren inferior")
const routineGroupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    color: { type: String, required: true, match: HEX_COLOR_REGEX },
    icon: { type: String, required: true, trim: true, maxlength: 40 },
    order: { type: Number, default: 0 },
  },
  { ...baseSchemaOptions, collection: 'routineGroups' },
)

routineGroupSchema.index({ user: 1, order: 1 })

export const RoutineGroup = mongoose.model('RoutineGroup', routineGroupSchema)
