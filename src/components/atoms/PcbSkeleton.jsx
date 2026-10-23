import React from 'react';

/**
 * Premium Futuristic PCB Hardware Skeleton with shimmering circuit traces
 * Used as an engaging placeholder while the 3D WebGL model streams in.
 */
export function PcbSkeleton({ className = '' }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* 3D Angled PCB Board Plate */}
      <div className="relative w-[215px] sm:w-[245px] h-[130px] sm:h-[148px] rounded-xl sm:rounded-2xl border border-white/30 bg-gradient-to-br from-white/18 via-white/10 to-white/5 backdrop-blur-md shadow-2xl overflow-hidden transform -rotate-3 transition-transform duration-500">
        
        {/* Shimmer light sweep animation */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20" />

        {/* 4 Golden PCB Mounting Holes */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-amber-300/80 bg-amber-400/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full border border-amber-300/80 bg-amber-400/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-amber-300/80 bg-amber-400/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full border border-amber-300/80 bg-amber-400/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
        </div>

        {/* PCB Copper Bus Traces & Grid Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-35 stroke-white" viewBox="0 0 240 145" fill="none" strokeWidth="1.2">
          {/* Main Bus lines */}
          <path d="M 25 35 L 60 35 L 85 60 L 105 60" strokeDasharray="3 3" />
          <path d="M 25 50 L 55 50 L 75 70 L 105 70" />
          <path d="M 25 65 L 50 65 L 70 85 L 105 85" strokeDasharray="2 2" />
          <path d="M 215 35 L 180 35 L 155 60 L 135 60" strokeDasharray="3 3" />
          <path d="M 215 50 L 185 50 L 165 70 L 135 70" />
          <path d="M 215 65 L 190 65 L 170 85 L 135 85" strokeDasharray="2 2" />
          <path d="M 120 15 L 120 45" />
          <path d="M 105 130 L 105 105" />
          <path d="M 135 130 L 135 105" />
          {/* Surface mount pad dots */}
          <circle cx="60" cy="35" r="2" fill="white" />
          <circle cx="180" cy="35" r="2" fill="white" />
          <circle cx="75" cy="70" r="2" fill="white" />
          <circle cx="165" cy="70" r="2" fill="white" />
        </svg>

        {/* Central Microcontroller / SoC Chip Package */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-black/50 border border-white/30 flex flex-col items-center justify-center shadow-lg relative">
          {/* IC Chip Pin leads */}
          <div className="absolute -left-1.5 top-2 bottom-2 flex flex-col justify-between">
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
          </div>
          <div className="absolute -right-1.5 top-2 bottom-2 flex flex-col justify-between">
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
            <span className="w-1.5 h-0.5 bg-white/70 rounded-xs" />
          </div>
          <div className="absolute -top-1.5 left-2 right-2 flex justify-between">
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
          </div>
          <div className="absolute -bottom-1.5 left-2 right-2 flex justify-between">
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
            <span className="h-1.5 w-0.5 bg-white/70 rounded-xs" />
          </div>

          {/* Chip Center Die Mark */}
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 flex items-center justify-center mb-1">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-[8px] font-mono tracking-widest text-white/80 font-bold uppercase">
            MCU
          </span>
        </div>

        {/* Status Chip Badge */}
        <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/40 border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8.5px] font-mono text-white/90 tracking-wider font-medium uppercase">
            3D Hardware
          </span>
        </div>
      </div>
    </div>
  );
}
