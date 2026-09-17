import mongoose from 'mongoose'
import { ROUTINE_GOAL_VALUES } from '../constants/routines.js'
import { baseSchemaOptions } from './shared.js'

// Ejercicio planeado dentro de una rutina. El orden es su posición en el arreglo:
// reordenar = mover el elemento, sin mantener un campo "order" sincronizado.
const routineExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  targetSets: { type: Number, min: 1, max: 20, default: 3 },
  targetRepsMin: { type: Number, min: 1, max: 100 },
  targetRepsMax: {
    type: Number,
    min: 1,
    max: 100,
    validate: {
      validator(value) {
        return this.targetRepsMin == null || value >= this.targetRepsMin
      },
      message: 'Las repeticiones máximas no pueden ser menores que las mínimas',
    },
  },
  restSeconds: { type: Number, min: 0, max: 600 },
  notes: { type: String, trim: true, maxlength: 300 },
})

const routineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'RoutineGroup', required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    goal: { type: String, enum: ROUTINE_GOAL_VALUES, default: 'other' },
    exercises: { type: [routineExerciseSchema], default: [] },
    order: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
    lastUsedAt: { type: Date, default: null },
  },
  baseSchemaOptions,
)

// Rutinas de una persona dentro de un grupo, en su orden
routineSchema.index({ user: 1, group: 1, order: 1 })

export const Routine = mongoose.model('Routine', routineSchema)
