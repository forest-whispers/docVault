import { z } from "zod";

export const createDocumentSchema = z.object({
    title: z.string().trim().min(3, "Document title cannot be empty."),
    content: z.string().trim().min(1, "Document content cannot be empty."),
    tags: z.array(z.string()),
    collectionId: z.string().trim().min(1, "Collection ID cannot be empty."),
});

export const updateDocumentSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Document title cannot be empty.")
            .optional(),

        content: z
            .string()
            .trim()
            .min(1, "Document content cannot be empty.")
            .optional(),

        tags: z.array(z.string()).optional(),

        isArchived: z.boolean().optional(),
    })
    .refine(
        (input) =>
            input.title !== undefined ||
            input.content !== undefined ||
            input.tags !== undefined ||
            input.isArchived !== undefined,
        {
            message: "At least one field must be provided for update.",
        }
);

export const documentsSchema = z.object({
    collectionId: z.string().trim().min(1).optional(),
    search: z.string().trim().min(1).optional(),
    isArchived: z.boolean().optional(),
    take: z.number().int().min(1).max(100).default(10),
    cursor: z.string().trim().min(1).optional(),
});

export const idSchema = z.object({
    id: z.string().trim().min(1, "Document ID cannot be empty."),
});