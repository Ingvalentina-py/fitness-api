import { AppError } from '../utils/AppError.js'

// Valida partes de la petición (body, query, params) con esquemas de Zod.
// Si todo está bien, deja los datos limpios y convertidos en req.validated
// (ej.: "?page=2" llega como texto y sale como número). Si no, responde 400
// con la lista de campos a corregir.
export function validate(schemas) {
  return (req, _res, next) => {
    const validated = {}
    const details = []

    for (const [location, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[location])

      if (result.success) {
        validated[location] = result.data
      } else {
        for (const issue of result.error.issues) {
          details.push({ field: [location, ...issue.path].join('.'), message: issue.message })
        }
      }
    }

    if (details.length > 0) throw AppError.validation(details)

    req.validated = validated
    next()
  }
}
