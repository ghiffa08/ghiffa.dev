import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../../../utils/slugify';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function SelectedWorksSection({
  projectsList,
  isBannerDark,
  sectionData
}) {
  const sectionTitle = sectionData?.title || 'selected works';
  const ctaText = sectionData?.content?.cta_text || 'Explore all works →';
  const worksCarouselRef = useRef(null);
  const isDraggingWorksRef = useRef(false);
  const startXWorksRef = useRef(0);
  const scrollLeftWorksRef = useRef(0);
  const hasDraggedWorksRef = useRef(false);
  const rafDragRef = useRef(null);

  const handleWorksPointerDown = (e) => {
    if (e.button !== 0 || !worksCarouselRef.current) return;
    isDraggingWorksRef.current = true;
    hasDraggedWorksRef.current = false;
    startXWorksRef.current = e.clientX;
    scrollLeftWorksRef.current = worksCarouselRef.current.scrollLeft;
  };

  const handleWorksPointerMove = (e) => {
    if (!isDraggingWorksRef.current || !worksCarouselRef.current) return;
    const walk = e.clientX - startXWorksRef.current;
    if (Math.abs(walk) > 8) {
      hasDraggedWorksRef.current = true;
    }

    if (!rafDragRef.current) {
      rafDragRef.current = requestAnimationFrame(() => {
        if (worksCarouselRef.current) {
          worksCarouselRef.current.scrollLeft = scrollLeftWorksRef.current - walk;
        }
        rafDragRef.current = null;
      });
    }
  };

  const handleWorksPointerUp = () => {
    isDraggingWorksRef.current = false;
    if (rafDragRef.current) {
      cancelAnimationFrame(rafDragRef.current);
      rafDragRef.current = null;
    }
    setTimeout(() => {
      hasDraggedWorksRef.current = false;
    }, 100);
  };

  const scrollWorksCarousel = (direction) => {
    if (!worksCarouselRef.current) return;
    const scrollAmount = worksCarouselRef.current.clientWidth * 0.75;
    worksCarouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section id="works" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden transition-colors duration-700 ease-in-out">
      <div id="work" className="absolute -top-24" />
      <div id="projects" className="absolute -top-24" />

      <ScrollReveal delay={0.05} y={28}>
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1" />
            <h2
              data-builder-field="title"
              data-builder-label="Works Section Title"
              className={`text-2xl sm:text-[38px] font-bold tracking-tight transition-colors duration-700 ${isBannerDark ? 'text-black' : 'text-[#141414]'}`}
            >
              {sectionTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollWorksCarousel('left')}
                aria-label="Previous project"
                className={`w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${isBannerDark
                    ? 'border-black/20 text-black hover:bg-black hover:text-white'
                    : 'border-gray-200 hover:border-gray-900 text-gray-700 hover:text-black'
                  }`}
              >
                <span className="text-base leading-none">←</span>
              </button>
              <button
                type="button"
                onClick={() => scrollWorksCarousel('right')}
                aria-label="Next project"
                className={`w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${isBannerDark
                    ? 'border-black/20 text-black hover:bg-black hover:text-white'
                    : 'border-gray-200 hover:border-gray-900 text-gray-700 hover:text-black'
                  }`}
              >
                <span className="text-base leading-none">→</span>
              </button>
            </div>

            <Link
              to="/works"
              data-builder-field="cta_text"
              data-builder-label="Explore Works Button"
              className={`text-xs font-medium border px-4 py-2 rounded-full transition-colors duration-500 hidden sm:inline-block cursor-pointer shadow-2xs ${isBannerDark
                  ? 'bg-white text-black border-black/20 hover:bg-black hover:text-white'
                  : 'text-gray-600 hover:text-black border-gray-200 hover:border-gray-300'
                }`}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Draggable Carousel */}
      <ScrollReveal delay={0.15} y={32}>
        <div
          ref={worksCarouselRef}
          onPointerDown={handleWorksPointerDown}
          onPointerMove={handleWorksPointerMove}
          onPointerUp={handleWorksPointerUp}
          onPointerCancel={handleWorksPointerUp}
          className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 touch-pan-y"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
        {projectsList.map((proj, idx) => {
          const projImg =
            proj.thumbnail_url ||
            proj.thumbnail ||
            proj.image_url ||
            (Array.isArray(proj.image_urls) && proj.image_urls.length > 0 ? proj.image_urls[0] : null);
          const projectSlug = proj.slug || slugify(proj.title);

          return (
            <Link
              key={proj.id || idx}
              to={`/project/${projectSlug}`}
              className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 group cursor-pointer flex flex-col select-none no-underline"
              onClick={(e) => {
                if (hasDraggedWorksRef.current) {
                  e.preventDefault();
                }
              }}
            >
              <article className="w-full flex flex-col select-none">
                {/* Clean Card Visual (Tall 4:3 aspect ratio, rounded-2xl) */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-[#18181B] shadow-xs border border-black/5 select-none pointer-events-none flex items-center justify-center">
                  {projImg ? (
                    <img
                      src={projImg}
                      alt={proj.title}
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{ display: projImg ? 'none' : 'flex' }}
                    className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-6 text-center text-white/70 select-none"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
                      {proj.category || 'PROJECT'}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white max-w-[220px] line-clamp-2">
                      {proj.title}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-[19px] sm:text-[20px] lg:text-[21px] font-semibold leading-[1.3] mb-2.5 transition-colors duration-500 line-clamp-2 ${isBannerDark
                    ? 'text-black group-hover:text-black/75'
                    : 'text-[#141414] group-hover:text-[#FF5500]'
                  }`}>
                  {proj.title}
                </h3>

                {/* Description */}
                <p className={`text-[13px] sm:text-[13.5px] leading-[1.6] line-clamp-3 font-normal transition-colors duration-500 ${isBannerDark
                    ? 'text-neutral-900 font-medium'
                    : 'text-[#71717A]'
                  }`}>
                  {proj.description}
                </p>
              </article>
            </Link>
          );
        })}
        </div>
      </ScrollReveal>
    </section>
  );
}
