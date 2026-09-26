import mongoose from 'mongoose'
import { ENERGY_LEVEL, WEIGHT_UNIT_VALUES } from '../constants/activities.js'
import { EQUIPMENT_VALUES, MOVEMENT_PATTERN_VALUES } from '../constants/exercises.js'
import { MUSCLE_VALUES } from '../constants/muscles.js'
import { exerciseVolumeKg } from '../utils/volume.js'
import { toKg } from '../utils/weight.js'
import { Activity } from './activity.model.js'

const setSchema = new mongoose.Schema({
  reps: { type: Number, min: 0, max: 1000 },
  weight: { type: Number, min: 0, max: 2000 },
  unit: { type: String, enum: WEIGHT_UNIT_VALUES, required: true },
  // Peso convertido a kg para las estadísticas (se calcula solo, ver el hook de abajo)
  weightKg: { type: Number, min: 0 },
  completed: { type: Boolean, default: false },
})

// Ejercicio realizado. Guarda una COPIA del nombre, equipo y músculos del catálogo:
// si después editas el ejercicio original, tu historial sigue mostrando lo que hiciste.
const performedExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  equipment: { type: String, enum: EQUIPMENT_VALUES },
  movementPattern: { type: String, enum: MOVEMENT_PATTERN_VALUES },
  primaryMuscles: { type: [{ type: String, enum: MUSCLE_VALUES }], default: [] },
  secondaryMuscles: { type: [{ type: String, enum: MUSCLE_VALUES }], default: [] },
  isUnilateral: { type: Boolean, default: false },
  // Descanso que traía la rutina, para repetirlo si la sesión se guarda como rutina
  restSeconds: { type: Number, min: 0, max: 600 },
  sets: { type: [setSchema], default: [] },
  // Volumen de este ejercicio en kg (se calcula solo). Guardarlo evita recalcularlo
  // en cada consulta de Progreso y en los récords.
  volumeKg: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 500 },
})

const gymSessionSchema = new mongoose.Schema({
  // Rutina de origen; null si la sesión empezó desde cero
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', default: null },
  exercises: { type: [performedExerciseSchema], default: [] },
  energy: { type: Number, min: ENERGY_LEVEL.min, max: ENERGY_LEVEL.max },
  // Volumen total en kg (se calcula solo)
  totalVolumeKg: { type: Number, min: 0, default: 0 },
})

// Antes de validar/guardar, normaliza los pesos a kg y calcula los volúmenes.
// Al hacerlo en el modelo, los datos quedan siempre coherentes. Ojo: los hooks de
// validate corren con save(), no con updateOne/findOneAndUpdate.
gymSessionSchema.pre('validate', function computeTotals() {
  for (const exercise of this.exercises) {
    for (const set of exercise.sets) {
      set.weightKg = set.weight == null ? undefined : toKg(set.weight, set.unit)
    }
    exercise.volumeKg = exerciseVolumeKg(exercise)
  }

  this.totalVolumeKg = this.exercises.reduce((total, exercise) => total + exercise.volumeKg, 0)
})

export const GymSession = Activity.discriminator('GymSession', gymSessionSchema, 'gym')
