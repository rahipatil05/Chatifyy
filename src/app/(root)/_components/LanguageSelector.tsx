"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [availableRuntimes, setAvailableRuntimes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRuntimes = async () => {
      try {
        const res = await fetch("/api/piston/runtimes");
        if (res.ok) {
          const data = await res.json();
          setAvailableRuntimes(data);
        }
      } catch (err) {
        console.error("Failed to fetch runtimes:", err);
      }
    };
    fetchRuntimes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  // Deduplicate availableRuntimes by language name, keeping the latest version
  const uniqueRuntimes = availableRuntimes.reduce((acc: any[], current: any) => {
    const existing = acc.find((r) => r.language === current.language);
    if (!existing || parseFloat(current.version) > parseFloat(existing.version)) {
      if (existing) {
        acc[acc.indexOf(existing)] = current;
      } else {
        acc.push(current);
      }
    }
    return acc;
  }, []);

  // Merge hardcoded config with dynamic runtimes, filtering by availability
  const allConfigLanguages = Object.values(LANGUAGE_CONFIG);
  
  // 1. Languages that are in our hardcoded config AND available in Piston
  // 2. Languages that are in our hardcoded config AND have Wandbox support (as fallback)
  // 3. Dynamic languages found in Piston but not in our config
  
  const availableInPiston = (lang: string) => uniqueRuntimes.some((r) => r.language === lang);

  const displayLanguages = [
    ...allConfigLanguages.filter(l => availableInPiston(l.pistonRuntime.language) || l.wandboxId),
    ...uniqueRuntimes
      .filter((r) => !allConfigLanguages.some(l => l.pistonRuntime.language === r.language))
      .map((r) => ({
        id: r.language,
        label: r.language.charAt(0).toUpperCase() + r.language.slice(1),
        logoPath: "/javascript.png", // Generic fallback logo
        pistonRuntime: { language: r.language, version: r.version },
        monacoLanguage: r.language === "node" ? "javascript" : r.language, // Best guess
        defaultCode: `// ${r.language} Playground\n// Version: ${r.version}\n\n`,
      }))
  ];

  const currentLanguageObj = displayLanguages.find((l) => l.id === language) || {
    id: language,
    label: language.charAt(0).toUpperCase() + language.slice(1),
    logoPath: "/javascript.png", // fallback
    pistonRuntime: { language, version: "*" },
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 py-2.5 bg-[#1e1e2e]/80 
      rounded-lg transition-all 
       duration-200 border border-gray-800/50 hover:border-gray-700"
      >
        {/* Decoration */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/5 
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
          <Image
            src={currentLanguageObj.logoPath}
            alt="programming language logo"
            width={24}
            height={24}
            className="w-full h-full object-contain relative z-10"
          />
        </div>

        <span className="text-gray-200 min-w-[80px] text-left group-hover:text-white transition-colors">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300
            ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2e]/95 backdrop-blur-xl
           rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">Select Language</p>
            </div>

            <div className="max-h-[280px] overflow-y-auto overflow-x-hidden">
              {displayLanguages.map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="relative group px-2"
                >
                  <button
                    className={`
                      relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300 hover:bg-[#262637]"}
                    `}
                    onClick={() => handleLanguageSelect(lang.id)}
                  >
                    {/* decorator */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    />

                    <div
                      className={`
                         relative size-8 rounded-lg p-1.5 group-hover:scale-110 transition-transform
                         ${language === lang.id ? "bg-blue-500/10" : "bg-gray-800/50"}
                       `}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <Image
                        width={24}
                        height={24}
                        src={lang.logoPath}
                        alt={`${lang.label} logo`}
                        className="w-full h-full object-contain relative z-10"
                      />
                    </div>

                    <span className="flex-1 text-left group-hover:text-white transition-colors">
                      {lang.label}
                    </span>

                    {language === lang.id && (
                      <>
                        <motion.div
                          className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                        <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default LanguageSelector;
