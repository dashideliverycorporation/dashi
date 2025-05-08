/**
 * Example router with sample procedures
 * This demonstrates how to create tRPC procedures with different access levels
 */
import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  restaurantProcedure,
  customerProcedure,
  router,
} from "../trpc";

/**
 * Input schema for the hello procedure
 */
const helloInputSchema = z.object({
  text: z.string().optional(),
});

/**
 * Example router with various procedure types
 */
export const exampleRouter = router({
  /**
   * Public procedure that anyone can access
   * Returns a greeting message
   */
  hello: publicProcedure.input(helloInputSchema).query(({ input }) => {
    return {
      greeting: `Hello ${input.text ?? "world"}!`,
      time: new Date().toISOString(),
    };
  }),

  /**
   * Protected procedure that only authenticated users can access
   * Returns user session information
   */
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  /**
   * Admin-only procedure
   * Returns a special message only for admins
   */
  adminOnly: adminProcedure.query(() => {
    return {
      message: "This is an admin-only message",
      secretInfo: "You have access to all the admin features",
    };
  }),

  /**
   * Restaurant-only procedure
   * Returns restaurant-specific information
   */
  restaurantOnly: restaurantProcedure.query(() => {
    return {
      message: "This is a restaurant-only message",
      tip: "You can manage your menu and orders here",
    };
  }),

  /**
   * Customer-only procedure
   * Returns customer-specific information
   */
  customerOnly: customerProcedure.query(() => {
    return {
      message: "This is a customer-only message",
      tip: "You can browse restaurants and place orders",
    };
  }),

  /**
   * Example mutation that requires authentication
   * Simulates updating a user profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).optional(),
        bio: z.string().max(160).optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      // In a real implementation, this would update the database
      return {
        status: "success",
        message: `Profile updated for user: ${ctx.session.user.email}`,
        data: input,
      };
    }),
});
