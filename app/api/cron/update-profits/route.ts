import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const preferredRegion = "iad1";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");

    // Verify the request is from Vercel Cron
    if (
      process.env.VERCEL_CRON_SECRET &&
      authorization !== `Bearer ${process.env.VERCEL_CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call your investment profit update endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/investment-profit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update profits: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Profits updated successfully",
      details: result,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to execute cron job" },
      { status: 500 }
    );
  }
}
