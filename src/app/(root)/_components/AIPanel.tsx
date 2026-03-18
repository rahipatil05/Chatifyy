"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { BrainCircuit, ShieldAlert, Zap, Activity, Loader2, Sparkles, Copy, Check, FileText, Send, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactSyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import FlowVisualizer from "./FlowVisualizer";

const AICodeBlock = ({ content, lang }: { content: string; lang: string }) => {
  const { editor, setCode } = useCodeEditorStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    
    // Also apply to editor as requested
    if (editor) {
      editor.setValue(content);
      setCode(content);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_code_${lang || 'txt'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group relative rounded-lg overflow-hidden my-3 border border-white/[0.05] bg-[#050505]">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-b border-white/[0.05]">
         <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{lang || 'text'}</span>
         <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${copied ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-white/[0.05] hover:bg-white/[0.1] hover:text-white'}`}
              title={copied ? "Copied & Applied!" : "Copy & Apply to Editor"}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span className="text-[10px] font-medium">{copied ? "Applied!" : "Copy & Apply"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-[10px] font-medium"
              title="Download for Notepad"
            >
              <FileText className="w-3 h-3" />
              Notepad
            </button>
         </div>
      </div>
      <ReactSyntaxHighlighter
        language={lang || 'text'}
        style={atomOneDark}
        customStyle={{ margin: 0, padding: '12px', fontSize: '11px', background: 'transparent' }}
      >
        {content}
      </ReactSyntaxHighlighter>
    </div>
  );
};

const AIPanel = () => {
  const { aiInsights, isAnalyzing, analyzeCode, chatMessages, isChatting, sendChatMessage, error } = useCodeEditorStore();
  const [activeTab, setActiveTab] = useState<"explain" | "security" | "optimize" | "visualize" | "chat">("explain");
  const [inputMessage, setInputMessage ] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAIError = error?.startsWith("AI Analysis Failed");

  const tabs = [
    { id: "explain", label: "Explain", icon: BrainCircuit, color: "text-blue-400" },
    { id: "chat", label: "Chat", icon: Sparkles, color: "text-cyan-400" },
    { id: "security", label: "Security", icon: ShieldAlert, color: "text-red-400" },
    { id: "optimize", label: "Optimize", icon: Zap, color: "text-yellow-400" },
    { id: "visualize", label: "Visualizer", icon: Activity, color: "text-purple-400" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatting]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isChatting) return;
    sendChatMessage(inputMessage);
    setInputMessage("");
  };

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
            onClick={() => setActiveTab(tab.id as "explain" | "security" | "optimize" | "visualize" | "chat")}
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
                {error?.replace("AI Analysis Failed:", "").trim() || "An unknown error occurred"}
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
                Click &quot;Analyze Code&quot; to get AI-powered insights, security reviews, and optimizations.
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
              ) : activeTab === "chat" ? (
                 <div className="flex flex-col h-full space-y-4">
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
                        {chatMessages.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <Sparkles className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                                <p className="text-xs">Ask me anything about your code or output.</p>
                            </div>
                        )}
                        {chatMessages.map((msg, i) => (
                           <motion.div
                             key={i}
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                           >
                             <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                               msg.role === 'user' 
                                 ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20' 
                                 : 'bg-white/[0.05] text-gray-300 border border-white/[0.05]'
                             }`}>
                                <div className="flex items-center gap-2 mb-1 opacity-50">
                                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                    <span className="text-[10px] font-medium uppercase tracking-wider">{msg.role}</span>
                                </div>
                                <div className="whitespace-pre-wrap">
                                    {msg.content.split('```').map((block: string, i: number) => {
                                        if (i % 2 === 1) {
                                            const lines = block.split('\n');
                                            const lang = lines[0].trim();
                                            const content = lines.slice(1).join('\n').trim();
                                            return <AICodeBlock key={i} content={content} lang={lang} />;
                                        }
                                        return <span key={i}>{block}</span>;
                                    })}
                                </div>
                             </div>
                           </motion.div>
                        ))}
                        {isChatting && (
                             <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                             >
                                <div className="bg-white/[0.05] rounded-2xl px-4 py-3 border border-white/[0.05]">
                                    <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                                </div>
                             </motion.div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="relative mt-2">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Ask a question..."
                            className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-xs 
                            focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none min-h-[44px] max-h-[120px]"
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isChatting}
                            className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 
                            hover:bg-cyan-500/20 disabled:opacity-30 transition-all"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                 </div>
              ) : (
                <div className="prose prose-invert prose-xs max-w-none">
                   {/* Simplified markdown rendering for code output */}
                    {aiInsights && aiInsights[activeTab as keyof typeof aiInsights] ? (
                      <div className="text-xs text-gray-300 leading-relaxed space-y-3 whitespace-pre-wrap">
                        {(aiInsights[activeTab as keyof typeof aiInsights] as string).split('```').map((block: string, i: number) => {
                          if (i % 2 === 1) {
                            const lines = block.split('\n');
                            const lang = lines[0].trim();
                            const content = lines.slice(1).join('\n').trim();
                            
                            return <AICodeBlock key={i} content={content} lang={lang} />;
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
