/**
 * Auth.js configuration for authentication
 * Sets up Auth.js with Prisma adapter and credentials provider for email/password auth
 */
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Changed from bcrypt to bcryptjs
import { UserRole } from "@/prisma/app/generated/prisma/client";
import { db } from "../lib/db";
import type { Adapter } from "next-auth/adapters";

/**
 * Module augmentation for next-auth to add custom properties to the session
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

/**
 * Verifies a password against its hash
 * @param password - The plain text password
 * @param hash - The hashed password
 * @returns True if the password matches the hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Hashes a password for secure storage
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Direct implementation of the auth adapter to avoid type compatibility issues
 * between @auth/prisma-adapter and next-auth
 */
export const authOptions: NextAuthOptions = {
  // Using PrismaAdapter with a type assertion to avoid TypeScript errors
  // @ts-expect-error - TypeScript has trouble with the adapter types
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
    error: "/signin", // Error code passed in query string as ?error=
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // If no user found or no password (OAuth users won't have password)
        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
    // Additional providers can be added here later (Google, etc.)
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include user role in JWT token when user signs in
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Make properties available in the client session
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Auth.js handler with configured options
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
