import React from 'react';

/**
 * Animated Cursor Badge with silky smooth crossfade transition between Human team & AI frontier model
 */
export function CursorBadge({ color, humanLabel, aiModel, aiActive, isYellow = false }) {
  return (
    <div
      className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-[5px] whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none overflow-hidden ${
        isYellow ? 'text-[#111111]' : 'text-white'
      } ${
        aiActive
          ? 'shadow-[0_0_16px_rgba(255,85,0,0.4)] ring-1 ring-white/40 scale-[1.02]'
          : 'shadow-sm scale-100'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="relative flex items-center justify-center">
        {/* Human Team Role Label */}
        <span
          className={`inline-flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            aiActive
              ? 'opacity-0 -translate-y-2.5 pointer-events-none absolute'
              : 'opacity-100 translate-y-0 relative'
          }`}
        >
          <span>{humanLabel}</span>
        </span>

        {/* Cutting-edge AI Model Agent Label */}
        <span
          className={`inline-flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            aiActive
              ? 'opacity-100 translate-y-0 relative'
              : 'opacity-0 translate-y-2.5 pointer-events-none absolute'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0 shadow-xs" />
          <span className="font-semibold tracking-tight">{aiModel}</span>
        </span>
      </div>
    </div>
  );
}
