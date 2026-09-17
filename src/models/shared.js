// Opciones comunes a todos los esquemas:
// - timestamps: agrega createdAt y updatedAt automáticamente
// - toJSON: oculta __v (control interno de versiones de Mongoose) en las respuestas
export const baseSchemaOptions = {
  timestamps: true,
  toJSON: { versionKey: false },
}

// Compara textos en español sin distinguir mayúsculas ("Hip thrust" = "hip thrust")
// y ordena bien las tildes y la ñ.
export const SPANISH_COLLATION = { locale: 'es', strength: 2 }

export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

// Día local en formato AAAA-MM-DD (ver activity.model.js)
export const LOCAL_DAY_REGEX = /^\d{4}-\d{2}-\d{2}$/
