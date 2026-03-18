import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

// GET /api/snippets/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const comments = await Comment.find({ snippetId: resolvedParams.id })
      .sort({ createdAt: 1 })
      .lean();
    const formatted = comments.map((c) => ({
      ...c,
      ...({} as Record<string, unknown>),
      _id: (c as { _id: { toString: () => string } })._id.toString(),
      _creationTime: new Date((c as { createdAt: Date }).createdAt).getTime(),
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/snippets/[id]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();
    const { content, userName = "Anonymous", userId = "anonymous" } = body;

    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const comment = await Comment.create({
      snippetId: resolvedParams.id,
      content,
      userName,
      userId,
    });

    return NextResponse.json(
      {
        ...comment.toObject(),
        _id: comment._id.toString(),
        _creationTime: new Date(comment.createdAt).getTime(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

// DELETE /api/snippets/[id]/comments?commentId=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "commentId is required" }, { status: 400 });
    }
    await Comment.findByIdAndDelete(commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE comment error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
