import { collectionResolvers } from "../modules/collections/collection.resolver.ts";
import { documentResolvers } from "../modules/documents/document.resolver.ts";

export const resolvers = {
    Query: {
        ...collectionResolvers.Query,
        ...documentResolvers.Query,
    },

    Mutation: {
        ...collectionResolvers.Mutation,
        ...documentResolvers.Mutation,
    },

    Collection: {
        ...collectionResolvers.Collection,
    },
};