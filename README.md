# Document Vault

A backend document management service built with Bun, TypeScript, GraphQL Yoga, Prisma, and PostgreSQL.

Document Vault provides a GraphQL API for organizing documents into collections, including nested documents, searching, cursor-based pagination, updating, moving, and deleting documents.

## Tech Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **API:** GraphQL Yoga
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Testing:** Vitest
- **Linting & Formatting:** Biome
- **Local Database:** Docker Compose

## Features

- Collection creation and queries
- Document creation and queries
- Nested documents within collections
- Document search and filtering
- Cursor-based pagination
- Document updates
- Move documents between collections
- Document deletion
- Centralized GraphQL error handling
- Zod-based input validation
- PostgreSQL integration testing

## Architecture

The application follows a simple resolver → service → database flow:

```
                    GraphQL Request
                           │
                           ▼
                   GraphQL Resolvers
                           │
                           ▼
                       Validation
                           │
                           ▼
                     Service Layer
                           │
                           ▼
                         Prisma
                           │
                           ▼
                      PostgreSQL
```

Resolvers handle the GraphQL API boundary, while services contain the application logic and database operations.

Input validation is handled explicitly with Zod, and application errors are normalized through centralized GraphQL error handling.

## Project Structure

```
docVault/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── graphql/
│   │   ├── errors.ts
│   │   ├── resolvers.ts
│   │   ├── schema.graphql
│   │   └── schema.ts
│   │
│   ├── modules/
│   │   ├── collections/
│   │   │   ├── collection.resolver.ts
│   │   │   ├── collection.service.ts
│   │   │   ├── collection.types.ts
│   │   │   └── collection.validation.ts
│   │   │
│   │   └── documents/
│   │       ├── document.resolver.ts
│   │       ├── document.service.ts
│   │       ├── document.types.ts
│   │       └── document.validation.ts
│   │
│   ├── shared/
│   │   ├── config/
│   │   ├── database/
│   │   └── errors/
│   │
│   ├── app.ts
│   └── server.ts
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── docker-compose.yml
├── prisma.config.ts
├── biome.json
├── vitest.config.ts
└── package.json
```

## Prerequisites

Make sure the following are installed:

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)

## Setup

Clone the repository and navigate into the project:

```bash
git clone <https://github.com/forest-whispers/docVault.git>
cd docVault
```

Start PostgreSQL, install dependencies, generate Prisma Client, apply migrations, and start the development server:

```bash
docker compose up -d
bun install
bun run gendb
bun run dev
```

> The setup command above has been verified against the project's PostgreSQL Docker environment.
> The commands should be run sequentially in PowerShell.

### What the setup does

```
docker compose up -d
        │
        ▼
Start PostgreSQL
        │
        ▼
bun install
        │
        ▼
Install dependencies
        │
        ▼
bun run gendb
        │
        ├── Generate Prisma Client
        └── Apply database migrations
        │
        ▼
bun run dev
        │
        ▼
Start GraphQL server
```

## Running the Application

Start the development server with:

```bash
bun run dev
```

The GraphQL server runs at:

```
http://localhost:4000/graphql
```

## Testing

Run the linter:

```bash
bun lint
```

Run the complete test suite:

```bash
bun run test
```

The test suite is written with Vitest and currently contains:

- 4 collection resolver unit tests
- 6 document resolver unit tests
- 1 PostgreSQL integration test

### Unit Tests

Run the collection resolver tests:

```bash
bunx vitest run tests/unit/collections/collection.resolver.test.ts
```

Run the document resolver tests:

```bash
bunx vitest run tests/unit/documents/document.resolver.test.ts
```

### Integration Test

The integration test requires the PostgreSQL container to be running.

Start PostgreSQL with:

```bash
docker compose up -d
```

Then run:

```bash
bunx vitest run tests/integration/document-vault.integration.test.ts
```

The integration test verifies the application against PostgreSQL.

### Test Summary

The current suite passes with:

```
Test Files  3 passed (3)
Tests       11 passed (11)
```

> **Note:** Use `bun run test` rather than `bun test`. The project uses Vitest, and `bun test` invokes Bun's own test runner instead.

## GraphQL API

The API is available at:

```
POST http://localhost:4000/graphql
```

### Create a Collection

```graphql
mutation {
  createCollection(input: {
    name: "Projects"
  }) {
    id
    name
  }
}
```

### Create a Document

```graphql
mutation {
  createDocument(input: {
    title: "Project Notes"
    collectionId: "COLLECTION_ID"
  }) {
    id
    title
    collectionId
  }
}
```

### Update a Document

```graphql
mutation {
  updateDocument(
    id: "DOCUMENT_ID"
    input: {
      title: "Updated Notes"
    }
  ) {
    id
    title
  }
}
```

### Move a Document

```graphql
mutation {
  moveDocument(
    id: "DOCUMENT_ID"
    collectionId: "COLLECTION_ID"
  ) {
    id
    title
    collectionId
  }
}
```

### Delete a Document

```graphql
mutation {
  deleteDocument(id: "DOCUMENT_ID") {
    id
  }
}
```

The GraphQL schema also supports collection and document queries, nested documents, searching/filtering, and cursor-based pagination.

## Design Decisions

### Resolver / Service Separation

GraphQL resolvers are kept focused on the API layer. Application logic and database operations are handled by dedicated services.

This keeps the GraphQL layer thin and makes the business logic easier to test and extend.

### Input Validation

Zod is used to validate application inputs before they reach the service layer.

This keeps validation rules explicit and prevents invalid input from being passed directly into business logic or database operations.

### Centralized Error Handling

Application errors are represented consistently and converted into GraphQL errors through centralized handling.

This avoids duplicating error formatting and mapping logic across individual resolvers.

### Cursor-Based Pagination

Document listing uses cursor-based pagination instead of offset pagination.

This provides a better foundation for handling larger datasets and avoids relying on increasingly expensive offsets.

### Prisma and PostgreSQL

PostgreSQL is used as the relational database, while Prisma provides typed database access and migration management.

## Tradeoffs

The project intentionally keeps the architecture relatively small and focused on the core document-management domain.

Authentication, authorization, file/blob storage, document versioning, and sharing are not currently included.

This keeps the current implementation straightforward while leaving clear extension points for these features later.

## Future Extensions

Possible future improvements include:

- Authentication and authorization
- Document file/blob storage
- Document versioning
- Document sharing and permissions
- Rich document metadata
- Collection-level permissions
- Expanded end-to-end API coverage
- Background processing for larger workloads

## Development Workflow

Development is organized around small, feature-focused changes.

```
Feature Branch
      │
      ▼
Implementation
      │
      ├── Lint / Formatting
      ├── Type Checking
      └── Tests
      │
      ▼
   GitHub PR
      │
      ▼
     main
```

The final changes are intended to be reviewed through a pull request from the feature branch into main.

## Project Status

The core document and collection API is implemented and backed by PostgreSQL.

Current verification:

- ✓ PostgreSQL via Docker Compose
- ✓ Prisma Client generation
- ✓ Prisma migrations
- ✓ GraphQL API
- ✓ Input validation
- ✓ Centralized error handling
- ✓ Collection resolver unit tests
- ✓ Document resolver unit tests
- ✓ PostgreSQL integration test
- ✓ Biome linting and formatting
- ✓ Development server startup

The documented setup command has been verified successfully:
> The setup commands should be run sequentially in PowerShell.

```bash
docker compose up -d
bun install
bun run gendb
bun run dev
```