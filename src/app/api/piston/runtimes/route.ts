import { NextResponse } from "next/server";

export async function GET() {
  const pistonUrl = process.env.PISTON_URL || "http://localhost:2000";
  
  try {
    const response = await fetch(`${pistonUrl}/api/v2/runtimes`, {
      method: "GET",
      // Set a short timeout for the status check
      signal: AbortSignal.timeout(5000), 
    });

    if (response.ok) {
      const runtimes = await response.json();
      return NextResponse.json(runtimes);
    }
    return NextResponse.json({ error: "Failed to fetch runtimes from Piston" }, { status: 502 });
  } catch (error) {
    console.error("Piston runtimes API error:", error);
    return NextResponse.json({ error: "Piston service unreachable" }, { status: 503 });
  }
}
