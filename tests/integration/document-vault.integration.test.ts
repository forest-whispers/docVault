import { afterAll, beforeAll, describe, expect, it } from "vitest";

import * as graphqlTest from "graphql";

import { prisma } from "../../src/shared/database/prisma.ts";
import { yoga } from "../../src/app.ts";

console.log("TEST GRAPHQL VERSION:", graphqlTest.version);
console.log(
    "TEST GRAPHQL RESOLVE:",
    import.meta.resolve("graphql")
);

type CreateCollectionData = {
    createCollection: {
        id: string;
        name: string;
        slug: string;
    };
};

type CreateDocumentData = {
    createDocument: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        collectionId: string;
        isArchived: boolean;
    };
};

type GetDocumentData = {
    document: {
        id: string;
        title: string;
        content: string;
        tags: string[];
        collectionId: string;
        isArchived: boolean;
    } | null;
};

describe("Document Vault integration", () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("creates a collection and document and retrieves the document", async () => {
        const collectionSlug = `integration-test-${Date.now()}`;

        // const createCollectionResult = await graphql({
        //     schema,
        //     source: `
        //         mutation CreateCollection($input: CreateCollectionInput!) {
        //             createCollection(input: $input) {
        //                 id
        //                 name
        //                 slug
        //             }
        //         }
        //     `,
        //     variableValues: {
        //         input: {
        //             name: "Integration Test Collection",
        //             slug: collectionSlug,
        //         },
        //     },
        // });

        const createCollectionResponse = await yoga.fetch(
            "http://localhost/graphql",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation CreateCollection($input: CreateCollectionInput!) {
                            createCollection(input: $input) {
                                id
                                name
                                slug
                            }
                        }
                    `,
                    variables: {
                        input: {
                            name: "Integration Test Collection",
                            slug: collectionSlug,
                        },
                    },
                }),
            }
        );

        const createCollectionResult =
            await createCollectionResponse.json();        

        expect(createCollectionResult.errors).toBeUndefined();
        expect(createCollectionResult.data).toBeDefined();

        const collection =
            createCollectionResult.data as CreateCollectionData;

        expect(collection.createCollection).toBeDefined();
        expect(collection.createCollection.name).toBe(
            "Integration Test Collection"
        );
        expect(collection.createCollection.slug).toBe(
            collectionSlug
        );

        const collectionId = collection.createCollection.id;

        // const createDocumentResult = await graphql({
        //     schema,
        //     source: `
        //         mutation CreateDocument($input: CreateDocumentInput!) {
        //             createDocument(input: $input) {
        //                 id
        //                 title
        //                 content
        //                 tags
        //                 collectionId
        //                 isArchived
        //             }
        //         }
        //     `,
        //     variableValues: {
        //         input: {
        //             title: "Integration Test Document",
        //             content: "Testing PostgreSQL integration",
        //             tags: ["integration", "postgres"],
        //             collectionId,
        //         },
        //     },
        // });

        const createDocumentResponse = await yoga.fetch(
            "http://localhost/graphql",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation CreateDocument($input: CreateDocumentInput!) {
                            createDocument(input: $input) {
                                id
                                title
                                content
                                tags
                                collectionId
                                isArchived
                            }
                        }
                    `,
                    variables: {
                        input: {
                            title: "Integration Test Document",
                            content: "Testing PostgreSQL integration",
                            tags: ["integration", "postgres"],
                            collectionId,
                        },
                    },
                }),
            }
        );

        const createDocumentResult =
            await createDocumentResponse.json();        

        expect(createDocumentResult.errors).toBeUndefined();
        expect(createDocumentResult.data).toBeDefined();

        const document =
            createDocumentResult.data as CreateDocumentData;

        expect(document.createDocument).toBeDefined();
        expect(document.createDocument.title).toBe(
            "Integration Test Document"
        );
        expect(document.createDocument.collectionId).toBe(
            collectionId
        );

        const documentId = document.createDocument.id;

        // const queryResult = await graphql({
        //     schema,
        //     source: `
        //         query GetDocument($id: ID!) {
        //             document(id: $id) {
        //                 id
        //                 title
        //                 content
        //                 tags
        //                 collectionId
        //                 isArchived
        //             }
        //         }
        //     `,
        //     variableValues: {
        //         id: documentId,
        //     },
        // });

        const queryResponse = await yoga.fetch(
            "http://localhost/graphql",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        query GetDocument($id: ID!) {
                            document(id: $id) {
                                id
                                title
                                content
                                tags
                                collectionId
                                isArchived
                            }
                        }
                    `,
                    variables: {
                        id: documentId,
                    },
                }),
            }
        );

        const queryResult = await queryResponse.json();        

        expect(queryResult.errors).toBeUndefined();
        expect(queryResult.data).toBeDefined();

        const queryData =
            queryResult.data as GetDocumentData;

        expect(queryData.document).toBeDefined();

        expect(queryData.document).toEqual({
            id: documentId,
            title: "Integration Test Document",
            content: "Testing PostgreSQL integration",
            tags: ["integration", "postgres"],
            collectionId,
            isArchived: false,
        });

        await prisma.document.delete({
            where: {
                id: documentId,
            },
        });

        await prisma.collection.delete({
            where: {
                id: collectionId,
            },
        });
    });
});