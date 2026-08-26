import {
    createDocument,
    getDocumentById,
    getDocuments,
    updateDocument,
} from "./document.service.ts";
import type {
    CreateDocumentInput,
    UpdateDocumentInput,
} from "./document.types.ts";

interface CreateDocumentArgs {
    input: CreateDocumentInput;
}

interface DocumentArgs {
    id: string;
}

interface DocumentsArgs {
    collectionId?: string;
    search?: string;
    isArchived?: boolean;
    take?: number;
    cursor?: string;
}

interface UpdateDocumentArgs {
    id: string;
    input: UpdateDocumentInput;
}

export const documentResolvers = {
    Query: {
        documents: (
            _: unknown,
            args: DocumentsArgs
        ) => getDocuments(args),

        document: (
            _: unknown,
            args: DocumentArgs
        ) => getDocumentById(args),
    },

    Mutation: {
        createDocument: (
            _: unknown,
            args: CreateDocumentArgs
        ) => createDocument(args.input),

        updateDocument: (
            _: unknown,
            args: UpdateDocumentArgs
        ) => updateDocument(args.id, args.input),
    },
};