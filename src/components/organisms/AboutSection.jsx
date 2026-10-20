import React from 'react';
import { useSupabaseSingle, useSupabaseData } from '../../hooks/useSupabaseData';

export function AboutSection({ onMoreAboutMe }) {
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: projects } = useSupabaseData('projects');
  const { data: qualifications } = useSupabaseData('qualifications');

  const fullName = info?.full_name || 'Haikal Jibran Al-Ghiffarry';
  const projectCount = projects?.length ? String(projects.length).padStart(3, '0') : '024';
  const awardCount = qualifications?.length ? String(qualifications.length).padStart(2, '0') : '14';

  return (
    <section id="about" className="max-w-[1600px] mx-auto border-b border-[#D6D4CC]">
      {/* Section Header Row */}
      <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#D6D4CC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
          {/* Left Index Marker */}
          <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
            <div>[ 01 / 06 ]</div>
            <div>ABOUT</div>
          </div>
          {/* Right Editorial Headline */}
          <div className="lg:col-span-10">
            <h2 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
              A practice of one. <span className="editorial-serif text-[#D14B30] font-normal text-[1.08em]">Built around obsession</span>, run like<br className="hidden sm:inline" /> a system.
            </h2>
          </div>
        </div>
      </div>

      {/* Split Profile Content: Left Bio & Stats / Right Low-Key Monochrome Portrait */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column (5 cols on desktop) */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D6D4CC]">
          <div>
            {/* Red Tag */}
            <div className="font-mono text-[10px] tracking-[0.15em] text-[#D14B30] uppercase mb-4">
              [ ENGINEER · KUNINGAN / REMOTE ]
            </div>

            {/* Name & Sub-caption */}
            <h3 className="editorial-serif text-3xl sm:text-4xl text-[#121210] leading-none mb-1.5">
              {fullName}
            </h3>
            <div className="font-mono text-[9px] tracking-[0.16em] text-[#6E6D68] uppercase mb-8">
              INDEPENDENT IOT &amp; FULLSTACK DEVELOPER · SINCE 2022
            </div>

            {/* Main Pull Quote */}
            <blockquote className="text-base sm:text-lg md:text-[19px] font-semibold text-[#121210] leading-[1.42] tracking-[-0.015em] mb-6">
              "I believe technology should not just live inside screens — it must directly interact with and transform the real physical world, bridging bits and atoms."
            </blockquote>

            {/* Supporting Paragraph */}
            <p className="text-xs sm:text-[13px] text-[#6E6D68] leading-relaxed mb-10">
              Spanning embedded telemetry, custom PCB design, to scalable cloud architectures. From automated credit underwriting engines to LoRa smart irrigation networks in the field.
            </p>
          </div>

          {/* Bottom 3 Metrics Row */}
          <div className="border-t border-[#D6D4CC] pt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="editorial-serif text-3xl sm:text-4xl text-[#121210] leading-none mb-1.5">
                {projectCount}<span className="text-[#D14B30]">.</span>
              </div>
              <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                PROJECTS SHIPPED
              </div>
            </div>
            <div>
              <div className="editorial-serif text-3xl sm:text-4xl text-[#121210] leading-none mb-1.5">
                {awardCount}<span className="text-[#D14B30] text-2xl align-top">×</span>
              </div>
              <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                AWARDS / CERTS
              </div>
            </div>
            <div>
              <div className="editorial-serif text-3xl sm:text-4xl text-[#121210] leading-none mb-1.5">
                04<span className="text-[#D14B30]">yr</span>
              </div>
              <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                ENGINEERING PRACTICE
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols on desktop): Monochrome Portrait on Pure Black Background */}
        <div className="lg:col-span-7 bg-[#0E0E0E] relative min-h-[420px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden group">
          {/* Top Right Tag */}
          <div className="relative z-10 p-5 sm:p-6 flex justify-end">
            <span className="font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">[ GHIFFA ]</span>
          </div>

          {/* Portrait Image Centered */}
          <div className="absolute inset-0 flex items-end justify-center pt-10">
            <img 
              src="/ghiffa.jpeg" 
              alt={fullName} 
              className="h-[92%] w-auto object-cover object-top grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85';
              }}
            />
            {/* Subtle Vignette to blend into #0E0E0E */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-[#0E0E0E]/40 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E] via-transparent to-[#0E0E0E] pointer-events-none"></div>
          </div>

          {/* Bottom Overlay Bar inside Portrait */}
          <button 
            onClick={onMoreAboutMe} 
            className="w-full relative z-10 border-t border-white/15 px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase">MORE ABOUT ME</span>
            <span className="text-sm transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
