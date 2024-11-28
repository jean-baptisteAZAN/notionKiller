import { sql } from '../config/db'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'
import { LoginDTO, RegisterDTO, AuthResponse } from "@notionkiller/shared/types";

export class AuthService {
    static async register(data: RegisterDTO): Promise<AuthResponse> {
        try {
            const hashedPassword = await hashPassword(data.password)
            const [user] = await sql`
                INSERT INTO users (email, password, name)
                VALUES (${data.email}, ${hashedPassword}, ${data.name})
                RETURNING id, email, name
            `
            const token = generateToken({ id: user.id, email: user.email })
            return { token }
        } catch (error) {
            throw error
        }
    }

    static async login(data: LoginDTO): Promise<AuthResponse> {
        const [user] = await sql`SELECT * FROM users WHERE email = ${data.email}`
        if (!user || !(await comparePassword(data.password, user.password)))
            throw new Error('Invalid credentials')
        const token = generateToken({ id: user.id, email: user.email })
        return {
            token
        }
    }
}