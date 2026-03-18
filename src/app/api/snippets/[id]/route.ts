import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Snippet from "@/models/Snippet";
import Comment from "@/models/Comment";
import Star from "@/models/Star";

// GET /api/snippets/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const snippet = await Snippet.findById(resolvedParams.id).lean();
    if (!snippet) return NextResponse.json({ error: "Snippet not found" }, { status: 404 });

    return NextResponse.json({
      ...snippet,
      _id: (snippet as { _id: { toString: () => string } })._id.toString(),
      _creationTime: new Date((snippet as { createdAt: Date }).createdAt).getTime(),
    });
  } catch (error) {
    console.error("GET /api/snippets/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 });
  }
}

// DELETE /api/snippets/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    await Snippet.findByIdAndDelete(resolvedParams.id);
    await Comment.deleteMany({ snippetId: resolvedParams.id });
    await Star.deleteMany({ snippetId: resolvedParams.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/snippets/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
  }
}
