import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";
import { Monaco } from "@monaco-editor/react";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    isAnalyzing: false,
    aiInsights: null,
    showAI: false,
    ignoredMarkers: [],
    editorWidth: typeof window !== "undefined" ? Number(localStorage.getItem("editor-width")) || 45 : 45,
    aiWidth: typeof window !== "undefined" ? Number(localStorage.getItem("ai-width")) || 30 : 30,
    chatMessages: [],
    isChatting: false,
    error: null,
    editor: null,
    code: "",
    stdin: typeof window !== "undefined" ? localStorage.getItem("editor-stdin") || "" : "",
    executionResult: null,
    engine: (typeof window !== "undefined" ? (localStorage.getItem("editor-engine") as any) : "piston") || "piston",
    
    toggleAI: () => set((state) => ({ showAI: !state.showAI })),
    ignoreMarker: (markerHash: string) => set((state) => ({ 
      ignoredMarkers: [...state.ignoredMarkers, markerHash] 
    })),
    setEditorWidth: (width) => {
      localStorage.setItem("editor-width", width.toString());
      set({ editorWidth: width });
    },
    setAIWidth: (width) => {
      localStorage.setItem("ai-width", width.toString());
      set({ aiWidth: width });
    },
    getCode: () => get().code || get().editor?.getValue() || "",

    setEditor: (editor: any) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      const config = LANGUAGE_CONFIG[get().language];
      const initialCode = savedCode || (config ? config.defaultCode : `// ${get().language} Playground\n\n`);
      if (initialCode) editor.setValue(initialCode);

      set({ editor, code: initialCode });
    },

    setCode: (code: string) => {
      set({ code });
      localStorage.setItem(`editor-code-${get().language}`, code);
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setStdin: (stdin: string) => {
      localStorage.setItem("editor-stdin", stdin);
      set({ stdin });
    },

    setEngine: (engine: "wandbox" | "piston") => {
      localStorage.setItem("editor-engine", engine);
      set({ engine });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().code || get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      const config = LANGUAGE_CONFIG[language];
      const nextCode = localStorage.getItem(`editor-code-${language}`) || (config ? config.defaultCode : `// ${language} Playground\n\n`);

      set({
        language,
        code: nextCode,
        output: "",
        error: null,
        aiInsights: null, // Reset AI insights on language change
        chatMessages: [], // Reset chat on language change
      });

      if (get().editor) {
        get().editor.setValue(nextCode);
      }
    },

    analyzeCode: async () => {
      const { language, code } = get();
      if (!code) return;

      set({ isAnalyzing: true, error: null });

      try {
        const modes = ["explain", "security", "optimize", "visualize"] as const;
        const insights: any = {};

        // Run all AI analyses in parallel
        await Promise.all(
          modes.map(async (mode) => {
            const response = await fetch("/api/ai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, language, mode }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let message = "AI analysis failed";
                try {
                  const data = JSON.parse(errorText);
                  message = data.error || data.message || message;
                } catch {
                  message = errorText || message;
                }
                throw new Error(message);
            }

            const data = await response.json();
            insights[mode] = data.result;
          })
        );

        set({ aiInsights: insights });
      } catch (error: any) {
        console.error("AI Analysis Error:", error);
        set({ error: `AI Analysis Failed: ${error.message}` });
      } finally {
        set({ isAnalyzing: false });
      }
    },

    sendChatMessage: async (message: string) => {
      const { language, code, executionResult, chatMessages } = get();
      
      const newUserMessage = {
        role: "user" as const,
        content: message,
        timestamp: Date.now(),
      };

      const updatedMessages = [...chatMessages, newUserMessage];
      set({ chatMessages: updatedMessages, isChatting: true, error: null });

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            mode: "chat",
            messages: updatedMessages,
            output: executionResult?.output || "",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get AI response");
        }

        const data = await response.json();
        
        const assistantMessage = {
          role: "assistant" as const,
          content: data.result,
          timestamp: Date.now(),
        };

        set({ chatMessages: [...updatedMessages, assistantMessage] });
      } catch (error: any) {
        console.error("Chat Error:", error);
        set({ error: `Chat Error: ${error.message}` });
      } finally {
        set({ isChatting: false });
      }
    },

    runCode: async () => {
      const { language, code, stdin } = get();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language];
        
        // Determine the engine to use. 
        // If the language doesn't have a wandboxId, we MUST use piston.
        let targetEngine = get().engine;
        if (targetEngine === "wandbox" && !runtime?.wandboxId) {
          targetEngine = "piston";
        }
        
        const response = await fetch("/api/executions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            engine: targetEngine,
            wandboxId: runtime?.wandboxId,
            pistonRuntime: runtime?.pistonRuntime || { language, version: "*" },
            stdin,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Execution failed");
        }

        if (data.error && !data.output) {
          set({
            error: data.error,
            executionResult: {
              code,
              output: "",
              error: data.error,
            },
          });
          return;
        }

        set({
          output: (data.output || "").trim(),
          error: data.error || null,
          executionResult: {
            code,
            output: (data.output || "").trim(),
            error: data.error || null,
          },
        });
      } catch (error) {
        console.log("Error running code:", error);
        const errorMsg = (error as any).message || "Error running code";
        set({
          error: `Error running code: ${errorMsg}`,
          executionResult: { code, output: "", error: `Error running code: ${errorMsg}` },
        });
      } finally {
        set({ isRunning: false });
      }
    },

    lintCode: async () => {
      const { language, code } = get();
      if (!code || code.trim().length < 5) return [];

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language, mode: "lint" }),
        });

        if (!response.ok) return [];

        const data = await response.json();
        // Clean markdown for JSON
        const cleanResult = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
        const markers = JSON.parse(cleanResult);
        
        return Array.isArray(markers) ? markers : [];
      } catch (error) {
        console.error("AI Lint Error:", error);
        return [];
      }
    },
  };
});

export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
