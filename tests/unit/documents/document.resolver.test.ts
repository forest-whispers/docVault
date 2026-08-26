import { describe, expect, it, vi } from "vitest";

vi.mock("../../../src/modules/documents/document.service.ts", () => ({
    createDocument: vi.fn(),
    getDocumentById: vi.fn(),
    getDocuments: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    moveDocument: vi.fn(),
}));

import { documentResolvers } from "../../../src/modules/documents/document.resolver.ts";
import {
    createDocument,
    deleteDocument,
    getDocumentById,
    getDocuments,
    moveDocument,
    updateDocument,
} from "../../../src/modules/documents/document.service.ts";

const mockDocument = {
    id: "document-1",
    title: "GraphQL Architecture",
    content: "GraphQL content",
    tags: ["graphql", "api"],
    collectionId: "collection-1",
    isArchived: false,
    createdAt: new Date(),
};

describe("document resolvers", () => {
    describe("Query.documents", () => {
        it("passes query arguments to the service", async () => {
            const expected = {
                nodes: [],
                pageInfo: {
                    hasNextPage: false,
                    endCursor: null,
                },
            };

            vi.mocked(getDocuments).mockResolvedValue(expected);

            const args = {
                collectionId: "collection-1",
                search: "graphql",
                isArchived: false,
                take: 10,
                cursor: "cursor-1",
            };

            const result = await documentResolvers.Query.documents(
                undefined,
                args,
            );

            expect(getDocuments).toHaveBeenCalledWith(args);
            expect(result).toEqual(expected);
        });
    });

    describe("Query.document", () => {
        it("passes the document ID to the service", async () => {
            const expected = {
                ...mockDocument,
                id: "document-1",
                title: "GraphQL",
            };

            vi.mocked(getDocumentById).mockResolvedValue(expected);

            const result = await documentResolvers.Query.document(undefined, {
                id: "document-1",
            });

            expect(getDocumentById).toHaveBeenCalledWith({
                id: "document-1",
            });

            expect(result).toEqual(expected);
        });
    });

    describe("Mutation.createDocument", () => {
        it("passes the input to the service", async () => {
            const input = {
                title: "GraphQL Architecture",
                content: "GraphQL content",
                tags: ["graphql", "api"],
                collectionId: "collection-1",
            };

            const expected = {
                ...mockDocument,
                ...input,
            };

            vi.mocked(createDocument).mockResolvedValue(expected);

            const result = await documentResolvers.Mutation.createDocument(
                undefined,
                { input },
            );

            expect(createDocument).toHaveBeenCalledWith(input);
            expect(result).toEqual(expected);
        });
    });

    describe("Mutation.updateDocument", () => {
        it("passes the document ID and input to the service", async () => {
            const input = {
                title: "Updated title",
                isArchived: true,
            };

            const expected = {
                ...mockDocument,
                title: "Updated title",
                isArchived: true,
            };

            vi.mocked(updateDocument).mockResolvedValue(expected);

            const result = await documentResolvers.Mutation.updateDocument(
                undefined,
                {
                    id: "document-1",
                    input,
                },
            );

            expect(updateDocument).toHaveBeenCalledWith("document-1", input);

            expect(result).toEqual(expected);
        });
    });

    describe("Mutation.deleteDocument", () => {
        it("passes the document ID to the service", async () => {
            const expected = {
                ...mockDocument,
                title: "Deleted document",
            };

            vi.mocked(deleteDocument).mockResolvedValue(expected);

            const result = await documentResolvers.Mutation.deleteDocument(
                undefined,
                { id: "document-1" },
            );

            expect(deleteDocument).toHaveBeenCalledWith("document-1");

            expect(result).toEqual(expected);
        });
    });

    describe("Mutation.moveDocument", () => {
        it("passes the document and collection IDs to the service", async () => {
            const expected = {
                ...mockDocument,
                collectionId: "collection-2",
            };

            vi.mocked(moveDocument).mockResolvedValue(expected);

            const result = await documentResolvers.Mutation.moveDocument(
                undefined,
                {
                    id: "document-1",
                    collectionId: "collection-2",
                },
            );

            expect(moveDocument).toHaveBeenCalledWith(
                "document-1",
                "collection-2",
            );

            expect(result).toEqual(expected);
        });
    });
});
