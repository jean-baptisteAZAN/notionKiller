export interface Document {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: number;
}


export type CreateDocumentDTO = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;