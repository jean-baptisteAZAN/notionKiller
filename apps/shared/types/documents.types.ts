export interface Document {
    id: number;
    title: string;
    content: string;
    owner_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface DocumentCollaborator {
    id: number;
    document_id: number;
    user_id: number;
    permission_level: 'read' | 'write';
    created_at: Date;
    updated_at: Date;
}

export interface CreateDocumentDTO {
    title: string;
    content: string;
}


export interface UpdateDocumentDTO {
    title?: string;
    content?: string;
}

export interface ShareDocumentDTO {
    userId: number;
    permissionLevel: 'read' | 'write';
}