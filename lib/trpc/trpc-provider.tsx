/**
 * tRPC Provider Component
 *
 * This component wraps the application with the necessary providers for tRPC and React Query.
 * It sets up the tRPC client with React Query for efficient data fetching and caching.
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "./client";

/**
 * Props for the TRPCProvider component
 */
interface TRPCProviderProps {
  /**
   * The children to wrap with the providers
   */
  children: React.ReactNode;
}

/**
 * TRPCProvider component that sets up React Query and tRPC
 *
 * This component creates a new QueryClient instance for each client session
 * and configures the tRPC client with React Query.
 */
export default function TRPCProvider({ children }: TRPCProviderProps) {
  // Create a new QueryClient instance for each client session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default query options
            staleTime: 5 * 1000, // 5 seconds
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Create a new tRPC client for each client session
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Only show React Query Devtools in development */}
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
