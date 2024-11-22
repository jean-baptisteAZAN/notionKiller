import { Context } from 'hono'
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async register(c: Context) {
        try {
            const data = await c.req.json()
            const result = await AuthService.register(data)
            return c.json(result, 201)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async login(c: Context) {
        try {
            const data = await c.req.json()
            const result = await AuthService.login(data)
            return c.json(result)
        } catch (error) {
            return c.json({ message: error.message }, 401)
        }
    }
}