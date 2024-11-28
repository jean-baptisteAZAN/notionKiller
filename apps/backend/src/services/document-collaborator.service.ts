import { sql } from '../config/db'
import { DocumentCollaborator, ShareDocumentDTO } from "@notionkiller/shared/types";

export class DocumentCollaboratorService {
    static async addCollaborator(
        documentId: number,
        ownerId: number,
        data: ShareDocumentDTO
    ): Promise<DocumentCollaborator | null> {
        const [isOwner] = await sql`
            SELECT 1 FROM documents
            WHERE id = ${documentId} AND owner_id = ${ownerId}
        `
        if (!isOwner) return null

        const [collaborator] = await sql<DocumentCollaborator>`
            INSERT INTO document_collaborators (
                document_id, user_id, permission_level
            )
            VALUES (
                ${documentId}, ${data.userId}, ${data.permissionLevel}
            )
            ON CONFLICT (document_id, user_id) 
            DO UPDATE SET permission_level = ${data.permissionLevel}
            RETURNING *
        `
        return collaborator
    }

    static async removeCollaborator(
        documentId: number,
        ownerId: number,
        collaboratorId: number
    ): Promise<boolean> {
        const result = await sql`
            WITH doc_check AS (
                SELECT 1 FROM documents
                WHERE id = ${documentId} AND owner_id = ${ownerId}
            )
            DELETE FROM document_collaborators
            WHERE document_id = ${documentId}
              AND user_id = ${collaboratorId}
              AND EXISTS (SELECT 1 FROM doc_check)
            RETURNING id
        `
        return result.length > 0
    }

    static async getCollaborators(documentId: number, userId: number) {
        return await sql`
            SELECT
                dc.*,
                u.name,
                u.email
            FROM document_collaborators dc
                     JOIN users u ON u.id = dc.user_id
            WHERE dc.document_id = ${documentId}
              AND EXISTS (
                SELECT 1 FROM documents d
                WHERE d.id = dc.document_id
                  AND (d.owner_id = ${userId}
                    OR dc.user_id = ${userId})
            )
        `
    }
}