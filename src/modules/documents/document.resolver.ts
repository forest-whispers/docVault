import {
    createDocument,
    deleteDocument,
    getDocumentById,
    getDocuments,
    moveDocument,
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

interface MoveDocumentArgs {
    id: string;
    collectionId: string;
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

        moveDocument: (
            _: unknown,
            args: MoveDocumentArgs
        ) => moveDocument(args.id, args.collectionId),

        deleteDocument: (
            _: unknown,
            args: DocumentArgs
        ) => deleteDocument(args.id),
    },
};