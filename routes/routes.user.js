import express from 'express'
import { verifyTokenAccess, verifyTokenAccessAdmin } from '../middleware/middleware.js'
import { getProfile, getUsers } from '../controllers/user.controller.js'

const routerUser = express.Router()

routerUser.get('/', verifyTokenAccessAdmin, getUsers)
routerUser.get('/profile', verifyTokenAccess, getProfile)

export default routerUser