/**
 * tRPC API route handler
 * This file sets up the tRPC API endpoint for Next.js App Router
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/root";
import { createTRPCContext } from "@/server/trpc/trpc";
import { NextRequest } from "next/server";

/**
 * Handle tRPC requests through fetch API
 * @param req Request object
 * @returns Response object
 */
export async function POST(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req,
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
}
