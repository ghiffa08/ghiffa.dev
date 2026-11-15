import React from 'react';

// Very fine coating grain (glossy coated stock still has micro texture)
const COAT_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

/**
 * Portrait brochure (A-series ratio) printed on glossy coated paper.
 * Used inside the "Selected works" folder pocket.
 */
export function GlossyBrochure({ project, image, accent = '#FF5500', className = '' }) {
  const title = project?.title || 'Untitled Project';
  const category = project?.category || 'Case Study';

  return (
    <div
      className={`relative aspect-[1/1.414] overflow-hidden rounded-[3px] bg-white ${className}`}
      style={{
        boxShadow:
          '0 1px 1px rgba(0,0,0,0.10), 0 8px 16px -6px rgba(0,0,0,0.25), 0 22px 36px -18px rgba(0,0,0,0.30)'
      }}
    >
      {/* ── Printed content ── */}
      <div className="absolute inset-0 flex flex-col">
        {/* Hero image (full-bleed) */}
        <div className="relative h-[66%] w-full overflow-hidden bg-[#F2F2F0]">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover select-none saturate-[1.08] contrast-[1.04]"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `radial-gradient(120% 90% at 20% 10%, #ffffff55, transparent 60%), ${accent}` }}
            />
          )}
        </div>

        {/* Ultra-clean editorial copy */}
        <div className="flex-1 flex flex-col justify-center px-3.5 text-left">
          <div className="w-5 h-px bg-[#111]/70 mb-2" />
          <p className="text-[10.5px] sm:text-[11.5px] font-medium leading-[1.2] tracking-[-0.01em] text-[#111] line-clamp-2">
            {title}
          </p>
          <span className="mt-1.5 text-[5.5px] uppercase tracking-[0.32em] text-[#111]/45 truncate">
            {category}
          </span>
        </div>
      </div>

      {/* ── Glossy coating layers ── */}
      {/* Coating micro-grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: COAT_GRAIN, backgroundSize: '160px 160px' }}
      />
      {/* Broad environment reflection (top-left lit) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.10) 22%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.08) 100%)'
        }}
      />
      {/* Sharp specular streak — slides across on hover */}
      <div
        className="absolute -inset-y-6 -left-[60%] w-[55%] pointer-events-none rotate-[18deg] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[260%]"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0) 100%)',
          mixBlendMode: 'soft-light'
        }}
      />
      {/* Static secondary glint */}
      <div
        className="absolute top-[8%] right-[-20%] w-[70%] h-[22%] pointer-events-none rotate-[-24deg] opacity-60"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.45), rgba(255,255,255,0))' }}
      />
      {/* Paper edge highlight */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[3px]"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(0,0,0,0.10)' }}
      />
    </div>
  );
}
