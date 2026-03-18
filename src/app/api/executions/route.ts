import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CodeExecution from "@/models/CodeExecution";

// POST /api/executions — execute code via Wandbox or local Piston and save result
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { language, code, wandboxId, stdin, pistonRuntime, engine: requestedEngine } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const engine = requestedEngine || process.env.EXECUTION_ENGINE || "wandbox";
    const pistonUrl = process.env.PISTON_URL || "http://localhost:2000";

    let output = "";
    let error = "";

    if (engine === "piston") {
      // 1. Execute via LOCAL Piston (Docker)
      try {
        const lang = pistonRuntime?.language || language;
        const extensionMap: Record<string, string> = {
          javascript: "js",
          typescript: "ts",
          python: "py",
          java: "java",
          go: "go",
          rust: "rs",
          cpp: "cpp",
          csharp: "cs",
          ruby: "rb",
          swift: "swift",
          bash: "sh",
        };
        const ext = extensionMap[lang] || "txt";

        const response = await fetch(`${pistonUrl}/api/v2/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: lang,
            version: "*", // Always use latest installed version for local Piston
            files: [{ name: `main.${ext}`, content: code }],
            stdin: stdin || "",
          }),
        });

        const data = await response.json();
        if (data.message) {
          error = data.message;
        } else if (data.run) {
          output = data.run.stdout || "";
          error = data.run.stderr || "";
          if (data.run.output && !output && !error) output = data.run.output;
        }
      } catch (execErr) {
        console.error("Local Piston error:", execErr);
        error = "Local Piston engine not found. Ensure Docker container is running.";
      }
    } else {
      // 2. Execute via Wandbox API (Public)
      if (!wandboxId) return NextResponse.json({ error: "wandboxId is required for public execution" }, { status: 400 });
      
      try {
        const response = await fetch("https://wandbox.org/api/compile.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            compiler: wandboxId,
            code: code,
            stdin: stdin || "",
            save: true,
          }),
        });

        const data = await response.json();
        if (data.program_message || data.compiler_message) {
          output = data.program_output || "";
          error = data.program_error || data.compiler_error || data.program_message || data.compiler_message || "";
        } else {
          output = data.program_output || "";
          error = data.program_error || data.compiler_error || "";
        }
      } catch (execErr) {
        console.error("Wandbox execution error:", execErr);
        error = "Execution service unavailable or timed out";
      }
    }

    // 2. Save result to MongoDB
    const execution = await CodeExecution.create({ 
      language: language || "unknown", 
      code, 
      output: output.trim(), 
      error: error.trim() || null 
    });

    return NextResponse.json(
      { 
        ...execution.toObject(), 
        _id: execution._id.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/executions error:", err);
    return NextResponse.json({ error: "Failed to process execution" }, { status: 500 });
  }
}
