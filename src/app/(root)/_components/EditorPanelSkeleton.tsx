import { Terminal } from "lucide-react";

export function EditorPanelSkeleton() {
  return (
    <div className="h-full relative flex flex-col bg-[#0a0a0f]/80 backdrop-blur-xl rounded-xl border border-white/[0.05] p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-32 h-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Editor Area Skeleton */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-white/[0.05] bg-black/20 p-4">
        <div className="space-y-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-3 bg-white/5 rounded animate-pulse" />
              <div
                className="h-3 bg-white/5 rounded animate-pulse"
                style={{ width: `${Math.random() * 60 + 20}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OutputPanelSkeleton() {
  return (
    <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400/50" />
          </div>
          <div className={`w-16 h-4 bg-white/5 rounded`} />
        </div>
      </div>

      {/* Output Area Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e2e] to-[#1a1a2e] rounded-xl -z-10" />
        <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] rounded-xl p-4 h-[600px]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-4 bg-white/5 rounded-xl`} />
              <div className={`w-48 h-4 mx-auto bg-white/5 rounded`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading state for the entire editor view
export function EditorViewSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <EditorPanelSkeleton />
      <OutputPanelSkeleton />
    </div>
  );
}
