"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

function OutputPanel() {
  const { output, error, isRunning, stdin, setStdin } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#0a0a0f] border border-white/[0.05] rounded-xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-semibold text-white">Input & Output</span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/[0.05] 
            rounded-lg border border-white/[0.05] hover:border-white/10 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Input Area (Stdin) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>Input (stdin)</span>
        </div>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Enter program input..."
          className="w-full h-20 bg-black/20 border border-white/[0.05] rounded-xl p-3 font-mono text-xs text-gray-300 
          focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none transition-all placeholder:text-gray-600"
        />
      </div>

      {/* Output Area */}
      <div className="relative flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>Output</span>
        </div>
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm border border-white/[0.05] 
        rounded-xl p-4 overflow-auto font-mono text-xs"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">Execution Error</div>
                <pre className="whitespace-pre-wrap text-red-400/80">{error}</pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Execution Successful</span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
