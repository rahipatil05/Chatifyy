"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Zap, Check, Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EngineSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPistonOnline, setIsPistonOnline] = useState<boolean | null>(null);
  const { engine, setEngine } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/piston/status");
        const data = await res.json();
        setIsPistonOnline(data.online);
      } catch (error) {
        setIsPistonOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const engines = [
    { id: "wandbox", label: "Wandbox", icon: Globe, desc: "Public API (Stable)" },
    { id: "piston", label: "Local Piston", icon: Zap, desc: "Docker Sandbox" },
  ] as const;

  const currentEngine = engines.find((e) => e.id === engine) || engines[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 
          hover:bg-[#262637] border border-[#313244] hover:border-[#414155] rounded-xl 
          transition-all duration-200 min-w-[140px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <currentEngine.icon className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-200">{currentEngine.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-[#1e1e2e] border border-[#313244] 
              rounded-xl shadow-2xl p-2 z-50 backdrop-blur-xl"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Execution Engine
            </div>

            {engines.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setEngine(e.id);
                  setIsOpen(false);
                }}
                className={`
                  relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${engine === e.id ? "bg-blue-500/10 text-blue-400" : "text-gray-400 hover:bg-[#262637] hover:text-gray-200"}
                `}
              >
                <div className={`p-1.5 rounded-md ${engine === e.id ? "bg-blue-500/20" : "bg-gray-800"}`}>
                  <e.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {e.label}
                    {e.id === "piston" && isPistonOnline !== null && (
                      <div className={`size-1.5 rounded-full ${isPistonOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"}`} />
                    )}
                  </div>
                  <div className="text-[10px] opacity-60">
                    {e.id === "piston" && isPistonOnline === false ? "Disconnected" : e.desc}
                  </div>
                </div>
                {engine === e.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EngineSelector;
