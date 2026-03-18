import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Star from "@/models/Star";

// GET /api/snippets/[id]/stars?userId=xxx
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous";

    const count = await Star.countDocuments({ snippetId: resolvedParams.id });
    const isStarred = await Star.exists({ snippetId: resolvedParams.id, userId });

    return NextResponse.json({ count, isStarred: !!isStarred });
  } catch (error) {
    console.error("GET stars error:", error);
    return NextResponse.json({ error: "Failed to fetch stars" }, { status: 500 });
  }
}

// POST /api/snippets/[id]/stars — toggle star
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();
    const userId = body.userId || "anonymous";

    const existing = await Star.findOne({ snippetId: resolvedParams.id, userId });

    if (existing) {
      await Star.findByIdAndDelete(existing._id);
      const count = await Star.countDocuments({ snippetId: resolvedParams.id });
      return NextResponse.json({ isStarred: false, count });
    } else {
      await Star.create({ snippetId: resolvedParams.id, userId });
      const count = await Star.countDocuments({ snippetId: resolvedParams.id });
      return NextResponse.json({ isStarred: true, count });
    }
  } catch (error) {
    console.error("POST star error:", error);
    return NextResponse.json({ error: "Failed to toggle star" }, { status: 500 });
  }
}
