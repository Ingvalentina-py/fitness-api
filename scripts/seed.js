import mongoose from 'mongoose'
import { connectToDatabase } from '../src/config/database.js'
import { env } from '../src/config/env.js'
import * as models from '../src/models/index.js'
import { SPANISH_COLLATION } from '../src/models/shared.js'
import { normalizeForSearch } from '../src/utils/text.js'
import { activityTypes } from './data/activityTypes.js'
import { exercises } from './data/exercises.js'
import { phrases } from './data/phrases.js'

// Datos iniciales: crea los índices y carga el catálogo global (owner: null).
// Puedes ejecutarlo las veces que quieras: actualiza lo que ya existe en vez de duplicarlo.

async function syncIndexes() {
  // Los discriminators (GymSession, GeneralActivity) comparten colección con Activity
  const baseModels = Object.values(models).filter((model) => !model.baseModelName)

  for (const model of baseModels) {
    await model.syncIndexes()
  }

  console.log(`🗂️  Índices sincronizados en ${baseModels.length} colecciones`)
}

// Inserta o actualiza cada elemento buscándolo por su campo clave (nombre o texto)
async function upsertGlobal(Model, items, { key, label, collation }) {
  // Primero valida con el esquema: detecta errores en los datos antes de escribir
  await Promise.all(items.map((item) => new Model(item).validate()))

  const result = await Model.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { owner: null, [key]: item[key] },
        update: { $set: item },
        upsert: true,
        ...(collation && { collation }),
      },
    })),
  )

  console.log(
    `✅ ${label}: ${items.length} (${result.upsertedCount} nuevos, ${result.matchedCount} ya existían)`,
  )
}

try {
  await connectToDatabase()
  console.log(`Conectado a la base de datos "${env.MONGODB_DB_NAME}"`)

  await syncIndexes()
  // bulkWrite no ejecuta los hooks del modelo: el nombre para buscar se calcula aquí
  const exercisesWithSearchName = exercises.map((exercise) => ({
    ...exercise,
    searchName: normalizeForSearch(exercise.name),
  }))
  await upsertGlobal(models.Exercise, exercisesWithSearchName, {
    key: 'name',
    label: 'Ejercicios',
    collation: SPANISH_COLLATION,
  })
  await upsertGlobal(models.ActivityType, activityTypes, {
    key: 'name',
    label: 'Tipos de actividad',
    collation: SPANISH_COLLATION,
  })
  await upsertGlobal(models.Phrase, phrases, { key: 'text', label: 'Frases' })

  console.log('🌱 Datos iniciales listos')
} catch (error) {
  console.error('❌ Error al cargar los datos iniciales:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
