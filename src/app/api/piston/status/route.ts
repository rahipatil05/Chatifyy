import { NextResponse } from "next/server";

export async function GET() {
  const pistonUrl = process.env.PISTON_URL || "http://localhost:2000";
  
  try {
    const response = await fetch(`${pistonUrl}/api/v2/runtimes`, {
      method: "GET",
      // Set a short timeout for the status check
      signal: AbortSignal.timeout(2000), 
    });

    if (response.ok) {
      return NextResponse.json({ online: true });
    }
    return NextResponse.json({ online: false });
  } catch (error) {
    return NextResponse.json({ online: false });
  }
}
