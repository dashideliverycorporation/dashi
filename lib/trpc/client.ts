/**
 * tRPC client configuration for Dashi
 *
 * This file sets up the tRPC client with superjson transformer for frontend use.
 * It provides type-safe API calls to the tRPC backend.
 */
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import { AppRouter } from "@/server/trpc/root";
import superjson from "superjson";

/**
 * Configuration for the tRPC client
 */
const trpcClientConfig = {
  /**
   * Links used by tRPC client
   * httpBatchLink: Batches multiple tRPC calls into a single HTTP request
   */
  links: [
    httpBatchLink({
      url: "/api/trpc",
      /**
       * Data transformer
       * superjson: Enables proper serialization of complex data types like Date, Map, Set, etc.
       */
      transformer: superjson,
    }),
  ],
};

/**
 * Export a tRPC react-query client for use in components
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Export a standalone tRPC client for use outside of React components
 * Useful for server-side operations or utility functions
 */
export const trpcClient = createTRPCProxyClient<AppRouter>(trpcClientConfig);

/**
 * Type helper for inferring the return type of a tRPC procedure
 * Example usage: type HelloQuery = inferProcedureOutput<AppRouter['example']['hello']>;
 */
export type inferProcedureOutput<T extends (...args: unknown[]) => unknown> =
  Awaited<ReturnType<T>>;

/**
 * Type helper for inferring the input type of a tRPC procedure
 * Example usage: type HelloInput = inferProcedureInput<AppRouter['example']['hello']>;
 */
export type inferProcedureInput<T extends (...args: unknown[]) => unknown> =
  Parameters<T>[0];
