import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { sql } from './db/db'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello World')
    .get('/api/health', () => ({
        status: 'ok',
        timestamp: new Date()
    }))
    .listen(4040)

console.log(`🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`)