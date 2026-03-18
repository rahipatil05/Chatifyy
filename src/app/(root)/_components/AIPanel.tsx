"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { 
  BrainCircuit, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Loader2, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import FlowVisualizer from "./FlowVisualizer";

const AIPanel = () => {
  const { aiInsights, isAnalyzing, analyzeCode, error } = useCodeEditorStore();
  const [activeTab, setActiveTab] = useState<"explain" | "security" | "optimize" | "visualize">("explain");

  const isAIError = error?.startsWith("AI Analysis Failed");

  const tabs = [
    { id: "explain", label: "Explain", icon: BrainCircuit, color: "text-blue-400" },
    { id: "security", label: "Security", icon: ShieldAlert, color: "text-red-400" },
    { id: "optimize", label: "Optimize", icon: Zap, color: "text-yellow-400" },
    { id: "visualize", label: "Visualizer", icon: Activity, color: "text-purple-400" },
  ];

  return (
    <div className="bg-[#0a0a0f] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">AI Code Insights</h2>
        </div>
        
        <button
          onClick={() => analyzeCode()}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 
          text-blue-400 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BrainCircuit className="w-3 h-3" />
              Analyze Code
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-black/20 gap-1 border-b border-white/[0.05]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all
              ${activeTab === tab.id 
                ? "bg-white/[0.05] text-white shadow-sm" 
                : "text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? tab.color : ""}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/10">
        <AnimatePresence mode="wait">
          {isAIError ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-red-500/60" />
              </div>
              <h3 className="text-sm font-medium text-red-400 mb-1">Analysis Error</h3>
              <p className="text-xs text-gray-500 max-w-[200px] mb-4">
                {error.replace("AI Analysis Failed:", "").trim()}
              </p>
              <button
                onClick={() => analyzeCode()}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-all"
              >
                Try Again
              </button>
            </motion.div>
          ) : !aiInsights && !isAnalyzing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-12 h-12 bg-blue-500/5 rounded-full flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6 text-blue-500/40" />
              </div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">No Analysis Ready</h3>
              <p className="text-xs text-gray-500 max-w-[200px]">
                Click "Analyze Code" to get AI-powered insights, security reviews, and optimizations.
              </p>
            </motion.div>
          ) : isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-4"
              >
                  <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin relative z-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-300 font-medium">Processing code...</p>
                    <p className="text-xs text-gray-500">Scanning for vulnerabilities & patterns</p>
                  </div>
              </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {activeTab === "visualize" ? (
                <FlowVisualizer data={aiInsights?.visualize || "[]"} />
              ) : (
                <div className="prose prose-invert prose-xs max-w-none">
                   {/* Simplified markdown rendering for code output */}
                   {aiInsights && aiInsights[activeTab] ? (
                      <div className="text-xs text-gray-300 leading-relaxed space-y-3 whitespace-pre-wrap">
                        {aiInsights[activeTab].split('```').map((block, i) => {
                          if (i % 2 === 1) {
                            const lines = block.split('\n');
                            const lang = lines[0].trim();
                            const content = lines.slice(1).join('\n').trim();
                            return (
                              <div key={i} className="rounded-lg overflow-hidden my-2 border border-white/[0.05]">
                                <ReactSyntaxHighlighter
                                  language={lang || 'text'}
                                  style={atomOneDark}
                                  customStyle={{ margin: 0, padding: '12px', fontSize: '11px', background: '#050505' }}
                                >
                                  {content}
                                </ReactSyntaxHighlighter>
                              </div>
                            );
                          }
                          return <span key={i}>{block}</span>;
                        })}
                      </div>
                   ) : null}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
          <div className="size-1.5 rounded-full bg-green-500/50 animate-pulse" />
          Powered by Llama 3.3
        </div>
        <div className="text-[10px] text-gray-600">
           Real-time Code Intelligence
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
