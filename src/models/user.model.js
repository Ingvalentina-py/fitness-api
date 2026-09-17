import mongoose from 'mongoose'
import { WEIGHT_UNIT_VALUES } from '../constants/activities.js'
import { USER_PLANS, USER_ROLES, WEEK_START_DAY_VALUES } from '../constants/users.js'
import { isValidTimeZone } from '../utils/timezone.js'
import { baseSchemaOptions } from './shared.js'

const preferencesSchema = new mongoose.Schema(
  {
    weightUnit: { type: String, enum: WEIGHT_UNIT_VALUES, default: 'kg' },
    weekStartsOn: { type: Number, enum: WEEK_START_DAY_VALUES, default: 1 },
    timezone: {
      type: String,
      default: 'UTC',
      validate: { validator: isValidTimeZone, message: 'Zona horaria inválida' },
    },
    voicePhrases: { type: Boolean, default: false },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      unique: true,
    },
    // Nunca se guarda la contraseña, solo su hash (bcrypt, Fase 2).
    // select: false → las consultas no lo traen a menos que se pida explícitamente.
    passwordHash: { type: String, required: true, select: false },
    // Versión de las sesiones: al cambiar la contraseña sube y los tokens anteriores dejan de valer
    tokenVersion: { type: Number, default: 0, select: false },
    role: { type: String, enum: USER_ROLES, default: 'user' },
    plan: { type: String, enum: USER_PLANS, default: 'free' },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  {
    ...baseSchemaOptions,
    toJSON: {
      ...baseSchemaOptions.toJSON,
      // Doble seguro: aunque el documento traiga estos campos, nunca salen en una respuesta
      transform: (_doc, ret) => {
        delete ret.passwordHash
        delete ret.tokenVersion
        return ret
      },
    },
  },
)

export const User = mongoose.model('User', userSchema)
