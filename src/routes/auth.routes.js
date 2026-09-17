import { Router } from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { loginBodySchema, registerBodySchema } from '../validators/auth.validators.js'

const router = Router()

router.post('/register', validate({ body: registerBodySchema }), register)
router.post('/login', validate({ body: loginBodySchema }), login)
router.post('/logout', logout)

export default router
