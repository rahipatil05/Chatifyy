"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";

function EditorPanel() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor, setCode, code, lintCode, ignoredMarkers, ignoreMarker } = useCodeEditorStore();
  const [currentMarkers, setCurrentMarkers] = useState<any[]>([]);

  const mounted = useMounted();

  // Helper to hash message
  const getMarkerHash = (message: string) => {
    return message.trim().toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    if (!editor || !mounted) return;

    const monaco = (window as any).monaco;
    if (!monaco) return;

    // Add "Ignore AI Warning" to context menu
    const ignoreAction = editor.addAction({
      id: "ignore-ai-warning",
      label: "Ignore AI Warning",
      contextMenuOrder: 1,
      contextMenuGroupId: "9_ai",
      run: (ed: any) => {
        const position = ed.getPosition();
        const model = ed.getModel();
        if (!model || !position) return;

        // Find markers at the current position
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const markerAtPos = markers.find((m: any) => 
          m.startLineNumber <= position.lineNumber && 
          m.endLineNumber >= position.lineNumber &&
          m.owner === "ai-linter"
        );

        if (markerAtPos) {
          ignoreMarker(getMarkerHash(markerAtPos.message));
        }
      },
    });

    return () => ignoreAction.dispose();
  }, [editor, mounted, ignoreMarker]);

  // Effect 1: Fetch markers (Debounced)
  useEffect(() => {
    if (!editor || !mounted || !code || code.trim().length < 10) {
      setCurrentMarkers([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const markers = await lintCode();
        setCurrentMarkers(markers);
      } catch (error) {
        console.error("Lint error:", error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [code, lintCode, mounted, editor]);

  // Effect 2: Render markers (Immediate)
  useEffect(() => {
    if (!editor || !mounted) return;
    const monaco = (window as any).monaco;
    if (!monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const filteredMarkers = currentMarkers.filter((m: any) => 
      !ignoredMarkers.includes(getMarkerHash(m.message))
    );

    monaco.editor.setModelMarkers(
      model,
      "ai-linter",
      filteredMarkers.map((m: any) => ({
        startLineNumber: m.line,
        startColumn: 1,
        endLineNumber: m.line,
        endColumn: 1000,
        message: m.message,
        severity: m.severity === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      }))
    );
  }, [currentMarkers, ignoredMarkers, editor, mounted]);

  const handleRefresh = () => {
    const config = LANGUAGE_CONFIG[language];
    const defaultCode = config ? config.defaultCode : `// ${language} Playground\n\n`;
    if (editor) editor.setValue(defaultCode);
    setCode(defaultCode);
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  return (
    <div className="h-full relative">
      <div className="h-full relative bg-[#0a0a0f]/80 backdrop-blur-xl rounded-xl border border-white/[0.05] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image 
                src={LANGUAGE_CONFIG[language]?.logoPath || "/javascript.png"} 
                alt="Logo" 
                width={24} 
                height={24} 
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
      <div className="relative flex-1 min-h-0 bg-[#0a0a0f] border border-white/[0.05] rounded-xl overflow-hidden">
          {mounted ? (
            <Editor
              key={language}
              height="100%"
              language={LANGUAGE_CONFIG[language]?.monacoLanguage || language}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor, monaco) => {
                setEditor(editor);
                (window as any).monaco = monaco;
              }}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          ) : (
            <EditorPanelSkeleton />
          )}
        </div>
      </div>
      {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
    </div>
  );
}
export default EditorPanel;
