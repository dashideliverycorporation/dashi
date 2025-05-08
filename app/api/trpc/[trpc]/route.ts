/**
 * tRPC API Route Handler for Next.js App Router
 *
 * This file creates a catch-all API route handler for tRPC requests in Next.js.
 * It connects frontend tRPC calls to the backend tRPC procedures.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/root";
import { createTRPCContext } from "@/server/trpc/trpc";
import { NextRequest } from "next/server";

/**
 * Handler for tRPC requests
 * This exports a Next.js App Router compatible handler function for tRPC requests
 */
const handler = async (req: NextRequest) => {
  /**
   * Handle tRPC requests using the fetch adapter
   */
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };
