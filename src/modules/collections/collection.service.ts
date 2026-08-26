import { prisma } from "../../shared/database/prisma.ts";
import {
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../../shared/errors/errors.ts";
import {
    collectionIdSchema,
    createCollectionSchema,
} from "./collection.validation.ts";
import type {
    CollectionIdInput,
    CreateCollectionInput,
} from "./collection.types.ts";

export const createCollection = async (input: CreateCollectionInput) => {
    const result = createCollectionSchema.safeParse(input);

    if (!result.success) {
        throw new ValidationError(result.error.issues[0]?.message ?? "Invalid collection input.");
    }

    const existing = await prisma.collection.findUnique({
        where: {
            slug: result.data.slug,
        },
    });

    if (existing) {
        throw new ConflictError("A collection with this slug already exists.");
    }

    return prisma.collection.create({
        data: {
            name: result.data.name,
            slug: result.data.slug,
        },
    });
}

export const getCollections = async () => {
    return prisma.collection.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
}

export const getCollectionById = async (input: CollectionIdInput) => {
    const result = collectionIdSchema.safeParse(input);

    if (!result.success) {
        throw new ValidationError(result.error.issues[0]?.message ?? "Invalid collection ID.");
    }

    const collection = await prisma.collection.findUnique({
        where: {
            id: result.data.id,
        },
    });

    if (!collection) {
        throw new NotFoundError("Collection not found.");
    }

    return collection;
}