import { z } from "zod";

export const createCollectionSchema = z.object({
    name: z.string().trim().min(3, "Collection name cannot be empty."),
    slug: z
        .string()
        .trim()
        .min(3, "Slug cannot be empty.")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and single hyphens.",
        ),
});

export const collectionIdSchema = z.object({
    id: z.string().trim().min(1, "Collection ID cannot be empty."),
});
