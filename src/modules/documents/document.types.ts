export interface CreateDocumentInput {
    title: string;
    content: string;
    tags: string[];
    collectionId: string;
}

export interface DocumentIdInput {
    id: string;
}

export interface DocumentsInput {
    collectionId?: string;
}