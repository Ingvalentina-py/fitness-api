import { z } from 'zod'
import { isValidTimeZone } from '../utils/timezone.js'

export const timezoneSchema = z.string().refine(isValidTimeZone, 'Zona horaria inválida')

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido')

export const idParamsSchema = z.object({ id: objectIdSchema })

// Lista de ids sin repetidos (ej. el nuevo orden de una lista)
export const uniqueObjectIdsSchema = z
  .array(objectIdSchema)
  .min(1)
  .max(100)
  .refine((ids) => new Set(ids).size === ids.length, 'La lista tiene ids repetidos')

export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido (formato #RRGGBB)')

// Nombre de ícono, ej. "heart-pulse". El frontend lo traduce a un dibujo.
export const iconNameSchema = z.string().regex(/^[a-z0-9-]{1,40}$/, 'Ícono inválido')

// "?archived=true" llega como texto: se convierte a booleano
export const booleanQuerySchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')

// Los parámetros de la URL llegan como texto: z.coerce los convierte a número
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// En un PATCH hay que enviar al menos un campo
export const hasAtLeastOneField = [
  (body) => Object.keys(body).length > 0,
  { message: 'No hay cambios para guardar' },
]
