/**
 * Root tRPC router
 * Combines all sub-routers into a single router
 */
import { router } from "./trpc";
import { exampleRouter } from "./routers/example";
import { restaurantRouter } from "./routers/restaurant";
import { userRouter } from "./routers/user";

/**
 * Main application router
 * This combines all sub-routers and is used as the entry point for all tRPC procedures
 *
 * As more features are developed, additional sub-routers can be added here
 * Examples of future routers:
 * - menuRouter (menu item management)
 * - orderRouter (order processing)
 */
export const appRouter = router({
  example: exampleRouter,
  restaurant: restaurantRouter,
  user: userRouter,
  // Add additional sub-routers as the application grows
  // menu: menuRouter,
  // order: orderRouter,
});

/**
 * Export type definition of the full API router
 * This is used by the client to provide type-safety for all procedure calls
 */
export type AppRouter = typeof appRouter;
