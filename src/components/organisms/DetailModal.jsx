import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DetailModal({ activeDetail, setActiveDetail, allProjects = [] }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDetail(null);
      }
    };
    if (activeDetail) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDetail, setActiveDetail]);

  if (!activeDetail) return null;

  const currentIdx = allProjects.findIndex(p => p.id === activeDetail.id || p.title === activeDetail.title);
  const folioNum = currentIdx >= 0 ? String(currentIdx + 1).padStart(2, '0') : '01';

  const handleNext = () => {
    if (allProjects.length > 0) {
      const nextIdx = (currentIdx + 1) % allProjects.length;
      setActiveDetail(allProjects[nextIdx]);
    }
  };

  const handleClose = () => {
    setActiveDetail(null);
  };

  const imageUrl = activeDetail.image_url || activeDetail.img || activeDetail.image_urls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85';
  const metaCategory = (activeDetail.category || 'SYSTEM').toUpperCase();
  const metaYear = activeDetail.year || '2024';
  const metaClient = (activeDetail.client || 'INDEPENDENT').toUpperCase();

  // Tech stack string
  const stackString = Array.isArray(activeDetail.tech_stack)
    ? activeDetail.tech_stack.filter(Boolean).join(' · ')
    : (activeDetail.tech_stack || 'HARDWARE · FIRMWARE · CLOUD');

  return (
    <div className="fixed inset-0 z-50 bg-[#121210]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#F0EFE9] border border-[#D6D4CC] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Top Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#F0EFE9] border-b border-[#D6D4CC] px-5 py-4 flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
            [ CASE STUDY / {folioNum} ]
          </div>
          <button 
            onClick={handleClose} 
            className="border border-[#121210] px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
          >
            CLOSE [ESC] ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.15em] text-[#D14B30] uppercase mb-2">
              {metaCategory} · {metaClient} · {metaYear}
            </div>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#121210] font-sans">
              {activeDetail.title}
            </h3>
            {stackString && (
              <div className="mt-2 font-mono text-[10px] text-[#6E6D68] tracking-widest uppercase">
                {stackString}
              </div>
            )}
          </div>

          <div className="aspect-[16/9] bg-[#121210] overflow-hidden border border-[#D6D4CC]">
            <img 
              src={imageUrl} 
              alt={activeDetail.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85';
              }}
            />
          </div>

          {/* Challenge & Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-[#D6D4CC] py-6">
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">
                [ 01 / THE CHALLENGE &amp; SCOPE ]
              </div>
              <p className="text-xs sm:text-sm text-[#121210]/90 leading-relaxed">
                {activeDetail.description || "Building an end-to-end robust architecture that solves concrete operational bottlenecks with high reliability, minimal maintenance, and intuitive usability."}
              </p>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">
                [ 02 / THE SYSTEM ARCHITECTURE ]
              </div>
              <p className="text-xs sm:text-sm text-[#121210]/90 leading-relaxed">
                Engineered with modular principles, low-latency telemetry processing, and clean maintainable code to ensure sustained operational performance across field environments.
              </p>
            </div>
          </div>

          {/* Full content if present */}
          {activeDetail.content && (
            <div className="prose prose-sm max-w-none text-[#121210]/90 border-b border-[#D6D4CC] pb-6 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeDetail.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Deliverables & Outcome */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <span className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase block mb-1">
                OUTCOME METRIC / STATUS
              </span>
              <span className="editorial-serif text-3xl text-[#121210]">
                {activeDetail.stat || "100% Shipped & Operational"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {activeDetail.link && activeDetail.link !== '#' && (
                <a 
                  href={activeDetail.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-[#121210] px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors"
                >
                  LIVE DEMO ↗
                </a>
              )}
              {allProjects.length > 1 && (
                <button 
                  onClick={handleNext} 
                  className="border border-[#121210] px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
                >
                  NEXT PROJECT →
                </button>
              )}
              <a 
                href="#contact" 
                onClick={handleClose} 
                className="bg-[#121210] text-[#F0EFE9] hover:bg-[#FF441F] px-5 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
              >
                COMMISSION SIMILAR WORK ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
