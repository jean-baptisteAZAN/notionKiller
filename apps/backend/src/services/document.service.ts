// src/services/document.service.ts
import { sql } from '../config/db'
import { Context } from 'hono'
import { Document, CreateDocumentDTO } from '@notionkiller/shared'

export class DocumentService {
    static async create(data: CreateDocumentDTO, userId: number) {
        const [document] = await sql`
            INSERT INTO documents (
                title,
                content,
                user_id
            )
            VALUES (
                       ${data.title},
                       ${data.content},
                       ${userId}
                   )
                RETURNING *
        `
        return document
    }

    static async findAll(userId: number) {
        return await sql`
        SELECT * FROM documents
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `
    }

    static async findOne(id: string) {
        const [document] = await sql`
            SELECT * FROM documents
            WHERE id = ${id}
        `
        return document
    }

    static async update(id: string, data: Partial<CreateDocumentDTO>) {
        const [document] = await sql`
            UPDATE documents
            SET title = ${data.title},
                content = ${data.content},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `
        return document
    }

    static async delete(id: string) {
        await sql`
            DELETE FROM documents
            WHERE id = ${id}
        `
    }
}