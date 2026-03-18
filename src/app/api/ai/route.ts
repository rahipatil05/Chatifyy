import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  try {
    const { code, language, mode, messages, output } = await req.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API Key not configured" }, { status: 500 });
    }

    let prompt = "";

    if (mode === "explain") {
      prompt = `Explain the following ${language} code in detail but concisely for a developer. Focus on how it works and its purpose:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (mode === "security") {
      prompt = `Perform a security vulnerability scan on this ${language} code. Identify potential risks like SQL injection, XSS, buffer overflows, or insecure practices. Format as a bulleted list:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (mode === "optimize") {
      prompt = `Analyze this ${language} code for performance bottlenecks. Suggest optimizations for time and space complexity. Provide the optimized code snippet if possible:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    } else if (mode === "visualize") {
      prompt = `Analyze the following ${language} code and generate a high-level flowchart representing its logic.
        Return ONLY a JSON array of steps, where each step is an object with:
        - id: unique string
        - type: one of ["start", "process", "decision", "end", "io"]
        - label: short descriptive text
        - description: detailed explanation of what happens here
        - next: array of ids of subsequent steps (for decision, provide multiple)

        Code:
        \`\`\`${language}\n${code}\n\`\`\``;
    } else if (mode === "lint") {
      prompt = `Perform a real-time static analysis on this ${language} code. Identify syntax errors, obvious logical bugs, or potential runtime crashes.
        Return ONLY a JSON array of markers, where each marker is an object with:
        - line: number (1-indexed)
        - message: short descriptive error message
        - severity: one of ["error", "warning"]

        Code:
        \`\`\`${language}\n${code}\n\`\`\``;
    } else if (mode === "chat") {
      const lastMessage = messages?.[messages.length - 1]?.content || "";
      const history = messages?.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') || "";

      prompt = `You are a helpful AI coding assistant. You have access to the user's current code and its latest execution output.
      
      Current Code (${language}):
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Latest Execution Output:
      ${output || "No output yet."}
      
      Conversation History:
      ${history}
      
      User's Question:
      ${lastMessage}
      
      Provide a helpful, technical, and concise response. If the user asks about the code or output, use the provided context.`;
    }

    const systemPrompt = (mode === "visualize" || mode === "lint")
      ? "You are an expert software engineer. Return ONLY a valid JSON array of objects. No markdown, no triple backticks, no preamble." 
      : "You are an expert polyglot software engineer and security researcher. Provide accurate, technical, and helpful insights.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
       return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process AI request" }, { status: 500 });
  }
}
