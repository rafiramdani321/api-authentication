import express from 'express'
import { validation, RegisterValidation, LoginValidation } from '../validation/index.js'
import { Login, Logout, Register, verifyEmail } from '../controllers/auth.controller.js'
import { refreshToken } from '../controllers/refreshToken.js'


const routerAuth = express.Router()

routerAuth.post('/register', RegisterValidation, validation, Register)
routerAuth.get('/user/verify/:id/:token', verifyEmail)
routerAuth.post('/login', LoginValidation, validation, Login)
routerAuth.get('/token', refreshToken)
routerAuth.delete('/logout', Logout)

export default routerAuth