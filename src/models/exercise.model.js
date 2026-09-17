import mongoose from 'mongoose'
import { EQUIPMENT_VALUES, MOVEMENT_PATTERN_VALUES } from '../constants/exercises.js'
import { MUSCLE_VALUES } from '../constants/muscles.js'
import { normalizeForSearch } from '../utils/text.js'
import { SPANISH_COLLATION, baseSchemaOptions } from './shared.js'

const musclesField = { type: [{ type: String, enum: MUSCLE_VALUES }], default: [] }

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    // Nombre sin tildes ni mayúsculas para buscar (se calcula solo; no sale en las respuestas)
    searchName: { type: String, select: false },
    equipment: { type: String, enum: EQUIPMENT_VALUES, required: true },
    movementPattern: { type: String, enum: MOVEMENT_PATTERN_VALUES, default: 'other' },
    primaryMuscles: {
      ...musclesField,
      validate: {
        validator: (muscles) => muscles.length > 0,
        message: 'Indica al menos un músculo principal',
      },
    },
    secondaryMuscles: musclesField,
    isUnilateral: { type: Boolean, default: false },
    // null = ejercicio global del sistema; id de usuario = ejercicio personalizado
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isArchived: { type: Boolean, default: false },
  },
  baseSchemaOptions,
)

exerciseSchema.pre('validate', function setSearchName() {
  if (this.isModified('name') || !this.searchName) {
    this.searchName = normalizeForSearch(this.name ?? '')
  }
})

// Un mismo dueño no puede repetir nombre (sin distinguir mayúsculas).
// El índice también acelera listar el catálogo ordenado por nombre.
exerciseSchema.index({ owner: 1, name: 1 }, { unique: true, collation: SPANISH_COLLATION })

export const Exercise = mongoose.model('Exercise', exerciseSchema)
