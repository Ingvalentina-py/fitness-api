import { z } from 'zod'
import {
  hasAtLeastOneField,
  hexColorSchema,
  iconNameSchema,
  objectIdSchema,
  uniqueObjectIdsSchema,
} from './common.js'

const groupFields = {
  name: z.string().trim().min(1, 'Escribe el nombre del grupo').max(40),
  color: hexColorSchema,
  icon: iconNameSchema,
}

// POST /routine-groups
export const createGroupBodySchema = z.strictObject(groupFields)

// PATCH /routine-groups/:id
export const updateGroupBodySchema = z
  .strictObject(groupFields)
  .partial()
  .refine(...hasAtLeastOneField)

// PUT /routine-groups/order → todos los grupos en el nuevo orden
export const reorderGroupsBodySchema = z.strictObject({ groupIds: uniqueObjectIdsSchema })

// DELETE /routine-groups/:id?moveTo=<id> → a qué grupo pasan sus rutinas
export const deleteGroupQuerySchema = z.object({ moveTo: objectIdSchema.optional() })
