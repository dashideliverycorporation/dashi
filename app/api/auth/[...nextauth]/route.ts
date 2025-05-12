import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

// This is the route handler for Next Auth with App Router
// It exports GET and POST handlers from the NextAuth function
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
