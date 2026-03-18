import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Snippet from "@/models/Snippet";

// GET /api/snippets — list all snippets
export async function GET() {
  try {
    await connectDB();
    const snippets = await Snippet.find({}).sort({ createdAt: -1 }).lean();
    
    // Ensure each snippet has an _id string and _creationTime for compatibility
    const formatted = snippets.map((s) => ({
      ...s,
      _id: (s as { _id: { toString: () => string } })._id.toString(),
      _creationTime: new Date((s as { createdAt: Date }).createdAt).getTime(),
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/snippets error:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

// POST /api/snippets — create a new snippet
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, language, code, userName = "Anonymous", userId = "anonymous" } = body;

    if (!title || !language || !code) {
      return NextResponse.json({ error: "title, language, and code are required" }, { status: 400 });
    }

    const snippet = await Snippet.create({ title, language, code, userName, userId });
    return NextResponse.json(
      {
        ...snippet.toObject(),
        _id: snippet._id.toString(),
        _creationTime: new Date(snippet.createdAt).getTime(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/snippets error:", error);
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
  }
}
