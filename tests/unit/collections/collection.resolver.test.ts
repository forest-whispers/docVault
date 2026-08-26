import { describe, expect, it, vi } from "vitest";

vi.mock("../../../src/modules/collections/collection.service.ts", () => ({
    createCollection: vi.fn(),
    getCollections: vi.fn(),
    getCollectionById: vi.fn(),
}));

vi.mock("../../../src/modules/documents/document.service.ts", () => ({
    getDocumentsByCollectionId: vi.fn(),
}));

import { collectionResolvers } from "../../../src/modules/collections/collection.resolver.ts";
import {
    createCollection,
    getCollectionById,
    getCollections,
} from "../../../src/modules/collections/collection.service.ts";
import { getDocumentsByCollectionId } from "../../../src/modules/documents/document.service.ts";

const mockCollection = {
    id: "collection-1",
    name: "Engineering",
    slug: "engineering",
    createdAt: new Date(),
};

const mockDocument = {
    id: "document-1",
    title: "GraphQL Architecture",
    content: "GraphQL content",
    tags: ["graphql", "api"],
    collectionId: "collection-1",
    isArchived: false,
    createdAt: new Date(),
};

describe("collection resolvers", () => {
    describe("Query.collections", () => {
        it("returns collections from the service", async () => {
            const expected = [mockCollection];

            vi.mocked(getCollections).mockResolvedValue(expected);

            const result = await collectionResolvers.Query.collections();

            expect(getCollections).toHaveBeenCalledOnce();

            expect(result).toEqual(expected);
        });
    });

    describe("Query.collection", () => {
        it("passes the ID to the service", async () => {
            const expected = mockCollection;

            vi.mocked(getCollectionById).mockResolvedValue(expected);

            const result = await collectionResolvers.Query.collection(
                undefined,
                { id: "collection-1" },
            );

            expect(getCollectionById).toHaveBeenCalledWith({
                id: "collection-1",
            });

            expect(result).toEqual(expected);
        });
    });

    describe("Mutation.createCollection", () => {
        it("passes the input to the service", async () => {
            const input = {
                name: "Engineering",
                slug: "engineering",
            };

            const expected = {
                ...mockCollection,
                ...input,
            };

            vi.mocked(createCollection).mockResolvedValue(expected);

            const result = await collectionResolvers.Mutation.createCollection(
                undefined,
                { input },
            );

            expect(createCollection).toHaveBeenCalledWith(input);

            expect(result).toEqual(expected);
        });
    });

    describe("Collection.documents", () => {
        it("loads documents using the collection ID", async () => {
            const expected = [mockDocument];

            vi.mocked(getDocumentsByCollectionId).mockResolvedValue(expected);

            const result = await collectionResolvers.Collection.documents({
                id: "collection-1",
            });

            expect(getDocumentsByCollectionId).toHaveBeenCalledWith({
                collectionId: "collection-1",
            });

            expect(result).toEqual(expected);
        });
    });
});
