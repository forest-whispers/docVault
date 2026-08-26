import { z } from "zod";

export const createDocumentSchema = z.object({
    title: z.string().trim().min(1, "Document title cannot be empty."),
    content: z.string().trim().min(1, "Document content cannot be empty."),
    tags: z.array(z.string()),
    collectionId: z.string().trim().min(1, "Collection ID cannot be empty."),
});

export const documentsSchema = z.object({
    collectionId: z.string().trim().min(1).optional(),
});

export const documentIdSchema = z.object({
    id: z.string().trim().min(1, "Document ID cannot be empty."),
});