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

export interface DocumentsInput {
    collectionId?: string;
    search?: string;
    isArchived?: boolean;
    take?: number;
    cursor?: string;
}

export interface DocumentConnection {
    nodes: Array<{
        id: string;
        title: string;
        content: string;
        tags: string[];
        collectionId: string;
        isArchived: boolean;
        createdAt: Date;
    }>;
    pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
    };
}