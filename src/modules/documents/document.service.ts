import { prisma } from "../../shared/database/prisma.ts";
import {
    NotFoundError,
    ValidationError,
} from "../../shared/errors/errors.ts";
import {
    createDocumentSchema,
    documentIdSchema,
    documentsSchema,
} from "./document.validation.ts";
import type {
    CreateDocumentInput,
    DocumentIdInput,
    DocumentsInput,
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

    return prisma.document.findMany({
        ...(result.data.collectionId && {
            where: {
                collectionId: result.data.collectionId,
            },
        }),
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const getDocumentById = async (input: DocumentIdInput) => {
    const result = documentIdSchema.safeParse(input);

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