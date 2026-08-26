import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as graphqlSchema from "graphql";
import { createSchema } from "graphql-yoga";

import { resolvers } from "./resolvers.ts";

console.log("SCHEMA GRAPHQL VERSION:", graphqlSchema.version);
console.log("SCHEMA GRAPHQL RESOLVE:", import.meta.resolve("graphql"));

const schemaPath = fileURLToPath(new URL("./schema.graphql", import.meta.url));

const typeDefs = readFileSync(schemaPath, "utf8");

export const schema = createSchema({
    typeDefs,
    resolvers,
});
