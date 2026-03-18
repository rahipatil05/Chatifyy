"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Activity, GitBranch, LogOut, Download, ArrowDown } from 'lucide-react';

interface Step {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'io';
  label: string;
  description: string;
  next: string[];
}

interface FlowVisualizerProps {
  data: string;
}

const FlowVisualizer = ({ data }: FlowVisualizerProps) => {
  let steps: Step[] = [];
  
  // Clean the data - sometimes the AI might include markdown code blocks even if told not to
  const cleanData = data.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    steps = JSON.parse(cleanData);
  } catch (e) {
    console.error("Parse Error:", e, cleanData);
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-red-500/60" />
        </div>
        <h3 className="text-sm font-medium text-red-400 mb-1">Visualization Error</h3>
        <p className="text-xs text-gray-500 max-w-[200px]">
          The AI provided unstructured data. Please try re-analyzing the code.
        </p>
      </div>
    );
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 italic text-sm">
        No flow steps identified for this code.
      </div>
    );
  }

  return (
    <div className="relative p-6 space-y-8 max-w-md mx-auto">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="relative"
        >
          {/* Node Wrapper */}
          <div className={`
            group p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300
            ${step.type === 'decision' ? 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40' : 
              step.type === 'start' || step.type === 'end' ? 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40' :
              'bg-white/[0.03] border-white/[0.08] hover:border-white/20'}
            shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
          `}
          >
            <div className="flex items-start gap-4">
              {/* Icon Container */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                ${step.type === 'decision' ? 'bg-purple-500/20 text-purple-400' :
                  step.type === 'start' ? 'bg-blue-500/20 text-blue-400' :
                  step.type === 'end' ? 'bg-red-500/20 text-red-400' :
                  'bg-emerald-500/20 text-emerald-400'}
              `}>
                {step.type === 'start' && <Play className="size-5 fill-current" />}
                {step.type === 'process' && <Activity className="size-5" />}
                {step.type === 'decision' && <GitBranch className="size-5" />}
                {step.type === 'io' && <Download className="size-5" />}
                {step.type === 'end' && <LogOut className="size-5" />}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {step.label}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Glowing background effect for current/hover node */}
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </div>

          {/* Connection Line & Arrow */}
          {index < steps.length - 1 && (
            <div className="absolute -bottom-8 left-[30px] w-px h-8 bg-gradient-to-b from-blue-500/50 to-transparent">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.1 }}
                className="absolute bottom-0 -left-1.5"
              >
                <ArrowDown className="size-3 text-blue-500/50" />
              </motion.div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FlowVisualizer;
