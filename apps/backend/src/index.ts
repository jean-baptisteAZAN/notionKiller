import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from "./routes/auth.routes"
import documents from "./routes/document.routes"

const api = new Hono()

api.use('/*', cors({
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision']
}))

api.route('/auth', auth)
api.route('/documents', documents) // Ajout des routes documents
api.get('/health', (c) => c.json({ status: 'OK', timestamp: new Date() }))

export default api