import { sql } from '../config/db'
import { Document, CreateDocumentDTO, UpdateDocumentDTO } from "@notionkiller/shared/types";

export class DocumentService {
    static async create(data: CreateDocumentDTO, ownerId: number): Promise<Document> {
        const [document] = await sql<Document>`
            INSERT INTO documents (title, content, owner_id)
            VALUES (${data.title}, ${data.content}, ${ownerId})
                RETURNING *
        `
        return document
    }

    static async findAll(userId: number): Promise<Document[]> {
        return await sql<Document>`
            SELECT DISTINCT d.*
            FROM documents d
            LEFT JOIN document_collaborators dc ON d.id = dc.document_id
            WHERE d.owner_id = ${userId}
               OR dc.user_id = ${userId}
            ORDER BY d.updated_at DESC
        `
    }

    static async findOne(id: number, userId: number): Promise<Document | null> {
        const [document] = await sql<Document>`
            SELECT d.*
            FROM documents d
                     LEFT JOIN document_collaborators dc ON d.id = dc.document_id
            WHERE d.id = ${id}
              AND (d.owner_id = ${userId} OR dc.user_id = ${userId})
        `
        return document || null
    }

    static async update(id: number, userId: number, data: UpdateDocumentDTO): Promise<Document | null> {
        // Vérifie d'abord les permissions
        const canEdit = await sql`
            SELECT 1
            FROM documents d
            LEFT JOIN document_collaborators dc ON d.id = dc.document_id
            WHERE d.id = ${id}
              AND (d.owner_id = ${userId} 
                   OR (dc.user_id = ${userId} AND dc.permission_level = 'write'))
        `
        if (!canEdit.length) return null

        const [document] = await sql<Document>`
            UPDATE documents
            SET title = COALESCE(${data.title}, title),
                content = COALESCE(${data.content}, content)
            WHERE id = ${id}
            RETURNING *
        `
        return document
    }

    static async delete(id: number, userId: number): Promise<boolean> {
        const result = await sql`
            DELETE FROM documents
            WHERE id = ${id}
              AND owner_id = ${userId}
            RETURNING id
        `
        return result.length > 0
    }
}