import mongoose from 'mongoose'
import { HEX_COLOR_REGEX, SPANISH_COLLATION, baseSchemaOptions } from './shared.js'

// Tipos de actividad distinta al gimnasio: baile, bicicleta, patinaje…
const activityTypeSchema = new mongoose.Schema(
  {
    // null = tipo global del sistema; id de usuario = tipo personalizado
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    color: { type: String, required: true, match: HEX_COLOR_REGEX },
    icon: { type: String, required: true, trim: true, maxlength: 40 },
    usesDistance: { type: Boolean, default: false },
    // Exige mucho a las piernas: activa el aviso si al día siguiente toca pierna intensa
    isLegIntensive: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { ...baseSchemaOptions, collection: 'activityTypes' },
)

activityTypeSchema.index({ owner: 1, name: 1 }, { unique: true, collation: SPANISH_COLLATION })

export const ActivityType = mongoose.model('ActivityType', activityTypeSchema)
