import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createSchema, createYoga } from "graphql-yoga";
import { formatGraphQLError } from "./graphql/errors";
import { resolvers } from "./graphql/resolvers";

const schemaPath = fileURLToPath(
    new URL("./graphql/schema.graphql", import.meta.url),
);

const typeDefs = readFileSync(schemaPath, "utf8");

const schema = createSchema({
    typeDefs,
    resolvers,
});

export const yoga = createYoga({
    schema,
    maskedErrors: {
        maskError: formatGraphQLError,
    },
});
