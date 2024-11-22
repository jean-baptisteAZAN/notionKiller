import { Context, Next } from 'hono'
import { verifyToken } from '../utils/jwt'

export const authMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return c.json({ message: 'No token provided' }, 401)
    }

    try {
        const decoded = verifyToken(token)
        c.set('user', decoded)
        await next()
    } catch (error) {
        return c.json({ message: 'Invalid token' }, 401)
    }
}