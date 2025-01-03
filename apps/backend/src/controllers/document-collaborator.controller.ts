import { Context } from 'hono'
import { DocumentCollaboratorService } from '../services/document-collaborator.service'
import { sql } from "../config/db";

export class DocumentCollaboratorController {
    static async addCollaborator(c: Context) {
        try {
            const documentId = parseInt(c.req.param('id'))
            const user = c.get('user')
            const { email, permission_level } = await c.req.json()
            const [targetUser] = await sql`
            SELECT id FROM users WHERE email = ${email}
        `

            if (!targetUser) {
                return c.json({ message: 'User not found' }, 404)
            }

            const collaborator = await DocumentCollaboratorService.addCollaborator(
                documentId,
                user.id,
                { userId: targetUser.id, permissionLevel: permission_level }
            )

            if (!collaborator) {
                return c.json({ message: 'Document not found or permission denied' }, 404)
            }

            return c.json(collaborator, 201)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async removeCollaborator(c: Context) {
        try {
            const documentId = parseInt(c.req.param('id'));
            const collaboratorId = parseInt(c.req.param('userId'));
            const user = c.get('user');

            console.log('Debug - Parsed values:', {
                documentId,
                collaboratorId,
                userId: user.id
            });
            if (isNaN(documentId) || isNaN(collaboratorId)) {
                return c.json({ message: 'Invalid IDs provided' }, 400);
            }

            const removed = await DocumentCollaboratorService.removeCollaborator(
                documentId,
                user.id,
                collaboratorId
            );

            if (!removed) {
                return c.json({ message: 'Document not found or permission denied' }, 404);
            }

            return c.json({ message: 'Collaborator removed successfully' });
        } catch (error) {
            console.error('Error in removeCollaborator:', error);
            return c.json({ message: error.message }, 400);
        }
    }

    static async updateCollaborator(c: Context) {
        try {
            const documentId = parseInt(c.req.param('id'))
            const collaboratorId = parseInt(c.req.param('userId'))
            const user = c.get('user')
            const { permission_level } = await c.req.json()

            const updated = await DocumentCollaboratorService.updateCollaborator(
                documentId,
                user.id,
                collaboratorId,
                permission_level
            )

            if (!updated) {
                return c.json({ message: 'Document not found or permission denied' }, 404)
            }

            return c.json(updated)
        } catch (error) {
            return c.json({ message: error.message }, 400)
        }
    }

    static async getCollaborators(c: Context) {
        try {
            const documentId = parseInt(c.req.param('id'))
            const user = c.get('user')

            const collaborators = await DocumentCollaboratorService.getCollaborators(
                documentId,
                user.id
            )

            return c.json(collaborators)
        } catch (error) {
            return c.json({ message: error.message }, 500)
        }
    }
}
