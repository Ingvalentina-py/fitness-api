import { Router } from 'express'
import {
  createGroup,
  deleteGroup,
  listGroups,
  reorderGroups,
  updateGroup,
} from '../controllers/routineGroup.controller.js'
import { validate } from '../middlewares/validate.js'
import { idParamsSchema } from '../validators/common.js'
import {
  createGroupBodySchema,
  deleteGroupQuerySchema,
  reorderGroupsBodySchema,
  updateGroupBodySchema,
} from '../validators/routineGroup.validators.js'

const router = Router()

router.get('/', listGroups)
router.post('/', validate({ body: createGroupBodySchema }), createGroup)
// Las rutas fijas (/order) van antes que las que tienen :id
router.put('/order', validate({ body: reorderGroupsBodySchema }), reorderGroups)
router.patch('/:id', validate({ params: idParamsSchema, body: updateGroupBodySchema }), updateGroup)
router.delete('/:id', validate({ params: idParamsSchema, query: deleteGroupQuerySchema }), deleteGroup)

export default router
