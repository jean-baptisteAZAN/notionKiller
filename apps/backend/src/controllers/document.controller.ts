import { Context } from 'hono'
import { DocumentService } from '../services/document.service'

export class DocumentController {
    static async create(c: Context) {
        try {
            const body = await c.req.json()
            const user = c.get('user')
            const document = await DocumentService.create(body, user.id)
            return c.json(document, 201)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async getAll(c: Context) {
        try {
            const user = c.get('user')
            const documents = await DocumentService.findAll(user.id)
            return c.json(documents)
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }

    static async getOne(c: Context) {
        try {
            const id = c.req.param('id')
            const document = await DocumentService.findOne(id)
            if (!document) return c.json({ message: 'Document not found' }, 404)
            return c.json(document)
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }

    static async update(c: Context) {
        try {
            const id = c.req.param('id')
            const body = await c.req.json()
            const document = await DocumentService.update(id, body)
            return c.json(document)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async delete(c: Context) {
        try {
            const id = c.req.param('id')
            await DocumentService.delete(id)
            return c.json({ message: 'Document deleted' })
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }
}