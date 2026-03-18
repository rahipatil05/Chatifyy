"use client";

import { useState, useEffect, useCallback } from "react";

interface ResizerProps {
  onResize: (deltaX: number) => void;
  direction?: "horizontal" | "vertical";
}

const Resizer = ({ onResize }: ResizerProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        onResize(e.movementX);
      }
    },
    [isResizing, onResize]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div
      onMouseDown={startResizing}
      className={`group relative w-1.5 h-full cursor-col-resize flex-shrink-0 transition-all duration-300
        ${isResizing ? "bg-blue-500/50" : "bg-transparent hover:bg-blue-500/20"}`}
    >
      {/* Visual handle */}
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] transition-all duration-300
        ${isResizing ? "bg-blue-400" : "bg-white/5 group-hover:bg-blue-400/50"}`} 
      />
      
      {/* Hover effect area */}
      <div className="absolute inset-y-0 -left-1 -right-1 z-20" />
    </div>
  );
};

export default Resizer;
