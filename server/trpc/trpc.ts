/**
 * Base tRPC configuration for Dashi
 *
 * This file sets up the core tRPC functionality including:
 * - Context creation
 * - Procedure builders with transformers
 * - Error formatting
 * - Middleware for logging, authentication, and more
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/server/auth";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NextRequest } from "next/server";

/**
 * Context interface for tRPC procedures
 */
export interface Context {
  session: Session | null;
  req?: NextRequest;
}

/**
 * Creates the tRPC context for each request
 * The context is where you can store request-specific data that will be available in all procedures
 */
export const createTRPCContext = async (
  opts: { req?: NextRequest } = {}
): Promise<Context> => {
  const session = await getServerSession(authOptions);

  return {
    session,
    req: opts.req,
  };
};

/**
 * Initialize tRPC with transformers and context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create reusable router and procedure builders
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Logger middleware - logs each request and its parameters
 * Useful for debugging and monitoring
 */
const loggerMiddleware = t.middleware(async ({ path, type, next, input }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[${new Date().toISOString()}] ${path} [${type}] - ${durationMs}ms`
    );
    console.log("Input:", input);

    if (!result.ok) {
      console.error("Error:", result.error);
    }
  }

  return result;
});

/**
 * Authentication middleware - checks if a user is authenticated
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      // Infers the session context with proper typing
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Role-based access control middleware - checks if a user has the required role
 */
const hasRole = (allowedRoles: string[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    const userRole = ctx.session.user.role;
    if (!allowedRoles.includes(userRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `User with role ${userRole} is not allowed to access this resource`,
      });
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * Base procedure with logger middleware applied
 * All other procedures should extend from this
 */
export const baseProcedure = t.procedure.use(loggerMiddleware);

/**
 * Public procedure - can be accessed by anyone
 * Includes logger middleware
 */
export const enhancedPublicProcedure = baseProcedure;

/**
 * Protected procedure - can only be invoked by authenticated users
 * Includes logger and authentication middleware
 */
export const protectedProcedure = baseProcedure.use(isAuthed);

/**
 * Role-specific procedures - only accessible by users with specific roles
 */
export const adminProcedure = protectedProcedure.use(hasRole(["ADMIN"]));
export const restaurantProcedure = protectedProcedure.use(
  hasRole(["RESTAURANT"])
);
export const customerProcedure = protectedProcedure.use(hasRole(["CUSTOMER"]));
