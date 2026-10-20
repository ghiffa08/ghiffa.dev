import React from 'react';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function HeroSection({ onOpenWork }) {
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: settings } = useSupabaseSingle('general_settings');

  // Display nickname / title: 'Ghiffa.' or first name
  const displayName = info?.full_name ? info.full_name.split(' ')[0] + '.' : 'Ghiffa.';
  const subtitle = info?.headline || "Quiet design and engineering that earns attention — and keeps working long after launch.";

  return (
    <section id="home" className="relative max-w-[1600px] mx-auto border-b border-[#D6D4CC]">
      {/* Vertical 12-Column Grid Area */}
      <div className="hero-grid-bg relative min-h-[540px] sm:min-h-[640px] lg:min-h-[730px] flex flex-col justify-between px-4 sm:px-6 pt-3 pb-16">
        
        {/* Top Micro-Metadata Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
          <div>S 6°58'38" E 108°29'00" · FOLIO/01</div>
          <div>GHIFFA — INDEPENDENT ENGINEERING PRACTICE, EST. 2022</div>
        </div>

        {/* Centerpiece Logo + Title Typography */}
        <div className="my-auto py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-start-2 lg:col-span-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 md:gap-9">
                {/* Large Geometric Pill Emblem */}
                <div className="shrink-0">
                  <svg className="w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48 lg:w-[152px] lg:h-[206px]" viewBox="0 0 152 206" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Black Upper & Left Pill Body */}
                    <path d="M76 0C34.0264 0 0 34.0264 0 76V130C0 171.974 34.0264 206 76 206V103H152V76C152 34.0264 117.974 0 76 0Z" fill="#121210"/>
                    {/* Orange Bottom-Right Quadrant */}
                    <path d="M76 103H152V130C152 171.974 117.974 206 76 206V103Z" fill="#FF441F"/>
                  </svg>
                </div>

                {/* Massive Display Heading + Underline Subtitle */}
                <div className="flex-1 w-full">
                  <h1 className="akira-title text-[78px] sm:text-[128px] md:text-[168px] lg:text-[205px] text-[#121210] select-none">
                    {displayName}
                  </h1>
                  
                  {/* Thin Horizontal Rule under title extending right */}
                  <div className="mt-3 sm:mt-4 border-t border-[#121210]/80 pt-3 sm:pt-3.5 max-w-[780px]">
                    <p className="text-sm sm:text-base md:text-[17px] font-medium text-[#121210] tracking-[-0.01em]">
                      {subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Spacer inside Hero Grid */}
        <div className="h-2"></div>
      </div>

      {/* 4-COLUMN HERO FOOTER SPEC BAR */}
      <div className="border-t border-[#D6D4CC] bg-[#F0EFE9] px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* [01] DISCIPLINE */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[01] DISCIPLINE</div>
            <div className="text-xs font-bold text-[#121210]">IoT &amp; Hardware</div>
            <p className="text-xs text-[#6E6D68] leading-relaxed">Sensors, telemetry, custom PCB. Built end-to-end.</p>
          </div>

          {/* [02] PRACTICE */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[02] PRACTICE</div>
            <div className="text-xs font-bold text-[#121210]">Fullstack &amp; Edge Systems</div>
            <p className="text-xs text-[#6E6D68] leading-relaxed">Web, APIs, embedded firmware. One engineer of one.</p>
          </div>

          {/* [03] CURRENTLY */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[03] CURRENTLY</div>
            <div className="text-xs font-bold text-[#121210]">{info?.availability_status || 'Open for Q3/Q4 2026'}</div>
            <p className="text-xs text-[#6E6D68] leading-relaxed">Client slots open. Reply within 24h.</p>
          </div>

          {/* [04] ARCHIVE */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[04] ARCHIVE</div>
            <div className="text-xs font-bold text-[#121210]">The folio · 2022→2026</div>
            <p className="text-xs text-[#6E6D68] leading-relaxed">Hardware, web interface, IoT telemetry.</p>
            <div className="pt-0.5">
              <button 
                onClick={onOpenWork} 
                className="inline-block font-mono text-[10px] tracking-[0.12em] uppercase text-[#121210] underline underline-offset-4 hover:text-[#FF441F] transition-colors cursor-pointer"
              >
                OPEN THE INDEX
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
