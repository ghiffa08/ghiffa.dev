import React, { useState } from 'react';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export function WorksSection({ setActiveDetail, onViewAllWork }) {
  const { data: rawProjects } = useSupabaseData('projects');
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = rawProjects || [];

  // Filter projects by category
  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true;
    const cat = (p.category || '').toLowerCase();
    const stack = Array.isArray(p.tech_stack) ? p.tech_stack.join(' ').toLowerCase() : '';
    if (activeFilter === 'iot') {
      return cat.includes('iot') || cat.includes('agriculture') || stack.includes('esp32') || stack.includes('lora');
    }
    if (activeFilter === 'web') {
      return cat.includes('web') || cat.includes('organization') || stack.includes('laravel') || stack.includes('next.js') || stack.includes('react');
    }
    if (activeFilter === 'commercial') {
      return cat.includes('komersial') || cat.includes('business') || cat.includes('tourism');
    }
    return true;
  });

  // Display top 4 on home section like the template design
  const displayProjects = filteredProjects.slice(0, 4);

  return (
    <section id="work" className="max-w-[1600px] mx-auto border-b border-[#D6D4CC]">
      {/* Header Row */}
      <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#D6D4CC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
          <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
            <div>[ 03 / 06 ]</div>
            <div>SELECTED WORK</div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
              Considered <span className="editorial-serif text-[#D14B30] font-normal text-[1.08em]">case studies</span>,<br className="hidden sm:inline" /> built to endure.
            </h2>
          </div>
          <div className="lg:col-span-3 flex lg:justify-end">
            <button 
              onClick={onViewAllWork} 
              className="border border-[#121210] px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors uppercase cursor-pointer"
            >
              VIEW ALL WORK ({String(projects.length).padStart(2, '0')}) →
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-[#D6D4CC] flex flex-wrap items-center justify-between gap-4 bg-[#EAE8E0]/50">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
          <button 
            onClick={() => setActiveFilter('all')} 
            className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${activeFilter === 'all' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
          >
            ALL [{String(projects.length).padStart(2, '0')}]
          </button>
          <button 
            onClick={() => setActiveFilter('iot')} 
            className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${activeFilter === 'iot' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
          >
            IOT &amp; SMART HARDWARE
          </button>
          <button 
            onClick={() => setActiveFilter('web')} 
            className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${activeFilter === 'web' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
          >
            WEB PLATFORMS
          </button>
          <button 
            onClick={() => setActiveFilter('commercial')} 
            className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${activeFilter === 'commercial' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
          >
            COMMERCIAL SYSTEMS
          </button>
        </div>
        <div className="font-mono text-[10px] tracking-[0.12em] text-[#6E6D68] uppercase">
          CLICK ANY PROJECT TO INSPECT CASE STUDY ↗
        </div>
      </div>

      {/* Projects 2-Column Editorial Grid */}
      <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2">
        {displayProjects.map((p, idx) => {
          const folioNum = String(idx + 1).padStart(2, '0');
          const isLeft = idx % 2 === 0;
          const isBottomRow = idx >= displayProjects.length - (displayProjects.length % 2 === 0 ? 2 : 1);
          const imageUrl = p.image_url || p.image_urls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
          
          return (
            <article 
              key={p.id || idx}
              onClick={() => setActiveDetail(p)}
              className={`project-card cursor-pointer border-b border-[#D6D4CC] p-5 sm:p-8 flex flex-col justify-between group ${
                isLeft ? 'md:border-r' : ''
              }`}
            >
              <div>
                {/* Top Meta Row */}
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-4">
                  <span>[ FOLIO / {folioNum} ]</span>
                  <span>{(p.category || 'SYSTEM').toUpperCase()} · {p.year || '2024'}</span>
                </div>
                {/* Image Container */}
                <div className="relative aspect-[16/10] bg-[#121210] overflow-hidden mb-6 border border-[#D6D4CC]">
                  <img 
                    src={imageUrl} 
                    alt={p.title} 
                    className="project-img w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-[#121210]/90 text-[#F0EFE9] font-mono text-[9px] tracking-[0.14em] px-2.5 py-1 uppercase">
                    VIEW CASE STUDY ↗
                  </div>
                </div>
              </div>
              {/* Bottom Title & Specs */}
              <div className="flex items-end justify-between gap-4 pt-2 border-t border-[#D6D4CC]">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#6E6D68] mt-1 line-clamp-2">
                    {p.description || "End-to-end engineered system built for high reliability and tangible real-world impact."}
                  </p>
                </div>
                <span className="font-mono text-xs text-[#121210] group-hover:translate-x-1 transition-transform shrink-0">
                  →
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
