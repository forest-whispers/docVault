import { createCollection, getCollections, getCollectionById } from "./collection.service.ts";

interface CreateCollectionArgs {
    input: {
        name: string;
        slug: string;
    };
}

interface CollectionArgs {
    id: string;
}

export const collectionResolvers = {
    Query: {
        collections: () => getCollections(),

        collection: (
            _: unknown,
            args: CollectionArgs
        ) => getCollectionById(args),
    },

    Mutation: {
        createCollection: (
            _: unknown,
            args: CreateCollectionArgs
        ) => createCollection(args.input),
    },
};