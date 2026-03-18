"use client";

import { useRef, useState, useEffect } from "react";
import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";
import AIPanel from "./_components/AIPanel";
import Resizer from "./_components/Resizer";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export default function Home() {
  const { showAI, editorWidth, aiWidth, setEditorWidth, setAIWidth } = useCodeEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorResize = (deltaX: number) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const deltaPercentage = (deltaX / containerWidth) * 100;
    
    // Clamp editor width between 20% and 70%
    const newWidth = Math.min(Math.max(editorWidth + deltaPercentage, 20), 70);
    setEditorWidth(newWidth);
  };

  const handleAIResize = (deltaX: number) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const deltaPercentage = (deltaX / containerWidth) * 100;
    
    // Reverse delta for right-to-left resizing
    const newWidth = Math.min(Math.max(aiWidth - deltaPercentage, 20), 50);
    setAIWidth(newWidth);
  };

  return (
    <div className="min-h-screen bg-[#030303] overflow-hidden">
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6 h-screen flex flex-col">
        <Header />

        <div 
          ref={containerRef}
          className="flex-1 flex gap-0 h-[calc(100vh-140px)] min-h-0"
        >
          {/* Editor Panel */}
          <div 
            style={{ width: `${mounted ? editorWidth : 45}%` }}
            className="h-full flex-shrink-0"
          >
             <EditorPanel />
          </div>

          <Resizer onResize={handleEditorResize} />

          {/* Output Panel (Takes remaining space) */}
          <div className="flex-1 h-full flex flex-col min-w-0">
             <OutputPanel />
          </div>

          {showAI && (
            <>
              <Resizer onResize={handleAIResize} />
              <div 
                style={{ width: `${mounted ? aiWidth : 30}%` }}
                className="h-full flex-shrink-0 animate-in fade-in slide-in-from-right-5 duration-500"
              >
                 <AIPanel />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
