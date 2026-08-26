import { prisma } from "../../shared/database/prisma.ts";
import {
    NotFoundError,
    ValidationError,
} from "../../shared/errors/errors.ts";
import {
    createDocumentSchema,
    idSchema,
    documentsSchema,
    updateDocumentSchema,
} from "./document.validation.ts";
import type {
    CreateDocumentInput,
    DocumentIdInput,
    DocumentsInput,
    DocumentsViaCollectionInput,
    UpdateDocumentInput,
} from "./document.types.ts";

export const createDocument = async (input: CreateDocumentInput) => {
    const result = createDocumentSchema.safeParse(input);

    if (!result.success) {
        throw new ValidationError(
            result.error.issues[0]?.message ?? "Invalid document input."
        );
    }

    const collection = await prisma.collection.findUnique({
        where: {
            id: result.data.collectionId,
        },
    });

    if (!collection) {
        throw new NotFoundError("Collection not found.");
    }

    return prisma.document.create({
        data: {
            title: result.data.title,
            content: result.data.content,
            tags: result.data.tags,
            collectionId: result.data.collectionId,
        },
    });
};

export const getDocuments = async (input: DocumentsInput) => {
    const result = documentsSchema.safeParse(input);

    if (!result.success) {
        throw new ValidationError(
            result.error.issues[0]?.message ?? "Invalid document filters."
        );
    }

    const { collectionId, search, isArchived, take, cursor } = result.data;

    const documents = await prisma.document.findMany({
        where: {
            ...(collectionId
                ? {
                    collectionId,
                }
                : {}),

            ...(isArchived !== undefined
                ? {
                    isArchived,
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            content: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },

        orderBy: {
            createdAt: "asc",
        },

        take: take + 1,

        ...(cursor
            ? {
                cursor: {
                    id: cursor,
                },
                skip: 1,
            }
            : {}),
    });

    const hasNextPage = documents.length > take;

    const nodes = hasNextPage
        ? documents.slice(0, take)
        : documents;

    const endCursor = nodes.at(-1)?.id ?? null;

    return {
        nodes,
        pageInfo: {
            hasNextPage,
            endCursor,
        },
    };
};

export const getDocumentById = async (input: DocumentIdInput) => {
    const result = idSchema.safeParse(input);

    if (!result.success) {
        throw new ValidationError(
            result.error.issues[0]?.message ?? "Invalid document ID."
        );
    }

    const document = await prisma.document.findUnique({
        where: {
            id: result.data.id,
        },
    });

    if (!document) {
        throw new NotFoundError("Document not found.");
    }

    return document;
};

export const getDocumentsByCollectionId = async (input: DocumentsViaCollectionInput) => {
    return prisma.document.findMany({
        where: {
            collectionId: input.collectionId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const updateDocument = async (
    id: string,
    input: UpdateDocumentInput
) => {
    const idResult = idSchema.safeParse({ id });

    if (!idResult.success) {
        throw new ValidationError(
            idResult.error.issues[0]?.message ?? "Invalid document ID."
        );
    }

    const inputResult = updateDocumentSchema.safeParse(input);

    if (!inputResult.success) {
        throw new ValidationError(
            inputResult.error.issues[0]?.message ?? "Invalid document input."
        );
    }

    const existing = await prisma.document.findUnique({
        where: {
            id: idResult.data.id,
        },
    });

    if (!existing) {
        throw new NotFoundError("Document not found.");
    }

    return prisma.document.update({
        where: {
            id: idResult.data.id,
        },

        data: {
            ...(inputResult.data.title !== undefined && {
                title: inputResult.data.title,
            }),
            ...(inputResult.data.content !== undefined && {
                content: inputResult.data.content,
            }),
            ...(inputResult.data.tags !== undefined && {
                tags: inputResult.data.tags,
            }),
            ...(inputResult.data.isArchived !== undefined && {
                isArchived: inputResult.data.isArchived,
            }),
        },
    });
};

export const moveDocument = async (
    id: string,
    collectionId: string
) => {
    const documentResult = idSchema.safeParse({ id });

    if (!documentResult.success) {
        throw new ValidationError(
            documentResult.error.issues[0]?.message ??
            "Invalid document ID."
        );
    }

    const collectionResult = idSchema.safeParse({
        id: collectionId,
    });

    if (!collectionResult.success) {
        throw new ValidationError(
            collectionResult.error.issues[0]?.message ??
            "Invalid collection ID."
        );
    }

    const existing = await prisma.document.findUnique({
        where: {
            id: documentResult.data.id,
        },
    });

    if (!existing) {
        throw new NotFoundError("Document not found.");
    }

    const existingCollection = await prisma.collection.findUnique({
        where: {
            id: collectionResult.data.id,
        },
    });

    if (!existingCollection) {
        throw new NotFoundError("Target collection not found.");
    }

    return prisma.document.update({
        where: {
            id: documentResult.data.id,
        },
        data: {
            collectionId: collectionResult.data.id,
        },
    });
};

export const deleteDocument = async (id: string) => {
    const result = idSchema.safeParse({ id });

    if (!result.success) {
        throw new ValidationError(
            result.error.issues[0]?.message ?? "Invalid document ID."
        );
    }

    const existing = await prisma.document.findUnique({
        where: {
            id: result.data.id,
        },
    });

    if (!existing) {
        throw new NotFoundError("Document not found.");
    }

    return prisma.document.delete({
        where: {
            id: result.data.id,
        },
    });
};