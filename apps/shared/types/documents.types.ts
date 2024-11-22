export interface Document {
    id: string;  // uid
    title: string;
    content: string; // markdown content
    createdAt: Date;
    updatedAt: Date;
}

export type CreateDocumentDTO = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;