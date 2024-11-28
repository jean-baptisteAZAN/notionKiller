import { Context } from 'hono'
import { DocumentService } from "../services/document.service";

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
            const id = parseInt(c.req.param('id'))
            const user = c.get('user')
            const document = await DocumentService.findOne(id, user.id)

            if (!document) {
                return c.json({ message: 'Document not found' }, 404)
            }

            return c.json(document)
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }

    static async update(c: Context) {
        try {
            const id = parseInt(c.req.param('id'))
            const user = c.get('user')
            const body = await c.req.json()

            const document = await DocumentService.update(id, user.id, body)

            if (!document) {
                return c.json({ message: 'Document not found or permission denied' }, 404)
            }

            return c.json(document)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async delete(c: Context) {
        try {
            const id = parseInt(c.req.param('id'))
            const user = c.get('user')

            const deleted = await DocumentService.delete(id, user.id)

            if (!deleted) {
                return c.json({ message: 'Document not found or permission denied' }, 404)
            }

            return c.json({ message: 'Document deleted successfully' })
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }
}