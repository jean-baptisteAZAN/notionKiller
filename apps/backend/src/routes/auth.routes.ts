import { Hono } from 'hono'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const auth = new Hono()

auth.post('/register', AuthController.register)
auth.post('/login', AuthController.login)
auth.get('/me', authMiddleware, (c) => c.json(c.get('user')))

export default auth