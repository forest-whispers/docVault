import { yoga } from "./app.ts";

const port = Number(process.env.PORT ?? 4000);

Bun.serve({
    port,
    fetch: yoga,
});

console.log(`GraphQL server running at http://localhost:${port}/graphql`);
