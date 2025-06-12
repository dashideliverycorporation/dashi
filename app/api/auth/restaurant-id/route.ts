/**
 * API route to get the restaurant ID for the authenticated user
 * This endpoint returns the restaurant ID associated with the logged-in restaurant user
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/lib/db";

/**
 * GET handler to retrieve the restaurant ID for the authenticated user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if the user has the RESTAURANT role
    if (session.user.role !== "RESTAURANT") {
      return NextResponse.json(
        { error: "Not authorized as restaurant" },
        { status: 403 }
      );
    }

    // Get the restaurant ID for the authenticated user
    const userId = session.user.id;
    const restaurantManager = await prisma.restaurantManager.findUnique({
      where: { userId },
      select: { restaurantId: true },
    });

    if (!restaurantManager) {
      return NextResponse.json(
        { error: "User is not associated with any restaurant" },
        { status: 404 }
      );
    }

    // Return the restaurant ID
    return NextResponse.json({
      restaurantId: restaurantManager.restaurantId,
    });
  } catch (error) {
    console.error("Error fetching restaurant ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant ID" },
      { status: 500 }
    );
  }
}
