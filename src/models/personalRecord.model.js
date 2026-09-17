import mongoose from 'mongoose'
import { baseSchemaOptions } from './shared.js'

// Un récord concreto: valor, cuándo y en qué sesión se logró
const recordValueSchema = new mongoose.Schema(
  {
    valueKg: { type: Number, min: 0, required: true },
    reps: { type: Number, min: 0 },
    achievedAt: { type: Date, required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  },
  { _id: false },
)

const personalRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    // Peso más alto levantado en una serie
    maxWeight: { type: recordValueSchema, default: null },
    // Mayor volumen (reps × peso) de este ejercicio en una sesión
    bestVolume: { type: recordValueSchema, default: null },
  },
  { ...baseSchemaOptions, collection: 'personalRecords' },
)

// Un documento de récords por persona y ejercicio
personalRecordSchema.index({ user: 1, exercise: 1 }, { unique: true })

export const PersonalRecord = mongoose.model('PersonalRecord', personalRecordSchema)
