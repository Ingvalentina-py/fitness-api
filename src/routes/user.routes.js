import { Router } from 'express'
import { changePassword, getMe, updateMe } from '../controllers/user.controller.js'
import { validate } from '../middlewares/validate.js'
import { changePasswordBodySchema, updateMeBodySchema } from '../validators/user.validators.js'

// Todas estas rutas requieren sesión (requireAuth se aplica en routes/index.js)
const router = Router()

router.get('/me', getMe)
router.patch('/me', validate({ body: updateMeBodySchema }), updateMe)
router.patch('/me/password', validate({ body: changePasswordBodySchema }), changePassword)

export default router
