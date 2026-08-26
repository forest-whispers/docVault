import { GraphQLError } from "graphql";

import { AppError } from "../shared/errors/AppError.ts";

export const formatGraphQLError = (error: unknown): GraphQLError => {
    if (error instanceof GraphQLError) {
        const originalError = error.originalError;

        if (originalError instanceof AppError) {
            return new GraphQLError(originalError.message, {
                nodes: error.nodes,
                source: error.source,
                positions: error.positions,
                path: error.path,
                extensions: {
                    code: originalError.name,
                    statusCode: originalError.statusCode,
                },
            });
        }

        return new GraphQLError("Internal server error.", {
            nodes: error.nodes,
            source: error.source,
            positions: error.positions,
            path: error.path,
            extensions: {
                code: "INTERNAL_SERVER_ERROR",
                statusCode: 500,
            },
        });
    }

    return new GraphQLError("Internal server error.", {
        extensions: {
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500,
        },
    });
};
