/**
 * Root tRPC router
 * Combines all sub-routers into a single router
 */
import { router } from "./trpc";
import { exampleRouter } from "./routers/example";

/**
 * Main application router
 * This combines all sub-routers and is used as the entry point for all tRPC procedures
 *
 * As more features are developed, additional sub-routers can be added here
 * Examples of future routers:
 * - userRouter (user profile management)
 * - restaurantRouter (restaurant management)
 * - menuRouter (menu item management)
 * - orderRouter (order processing)
 */
export const appRouter = router({
  example: exampleRouter,
  // Add additional sub-routers as the application grows
  // user: userRouter,
  // restaurant: restaurantRouter,
  // menu: menuRouter,
  // order: orderRouter,
});

/**
 * Export type definition of the full API router
 * This is used by the client to provide type-safety for all procedure calls
 */
export type AppRouter = typeof appRouter;
