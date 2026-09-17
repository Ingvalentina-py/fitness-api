import { z } from 'zod'

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Id inválido')

export const idParamsSchema = z.object({ id: objectIdSchema })

// Los parámetros de la URL llegan como texto: z.coerce los convierte a número
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
