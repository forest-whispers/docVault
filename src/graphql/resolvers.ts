import { collectionResolvers } from "../modules/collections/collection.resolver.ts";

export const resolvers = {
    Query: {
        ...collectionResolvers.Query,
    },

    Mutation: {
        ...collectionResolvers.Mutation,
    },
};