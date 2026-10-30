import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../../../utils/slugify';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { RefineImage } from '../../RefineImage';

export const SelectedWorksSection = React.memo(function SelectedWorksSection({
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
  const lastXWorksRef = useRef(0);
  const velocityWorksRef = useRef(0);
  const hasDraggedWorksRef = useRef(false);
  const rafMomentumRef = useRef(null);

  // Smooth mouse-wheel horizontal scrolling
  useEffect(() => {
    const el = worksCarouselRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const canScrollRight = e.deltaY > 0 && el.scrollLeft < maxScroll - 1;
      const canScrollLeft = e.deltaY < 0 && el.scrollLeft > 1;

      if (canScrollRight || canScrollLeft) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.35;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleWorksPointerDown = (e) => {
    if (e.button !== 0 || !worksCarouselRef.current) return;
    if (rafMomentumRef.current) {
      cancelAnimationFrame(rafMomentumRef.current);
      rafMomentumRef.current = null;
    }
    isDraggingWorksRef.current = true;
    hasDraggedWorksRef.current = false;
    startXWorksRef.current = e.clientX;
    lastXWorksRef.current = e.clientX;
    velocityWorksRef.current = 0;
    scrollLeftWorksRef.current = worksCarouselRef.current.scrollLeft;
    worksCarouselRef.current.style.scrollSnapType = 'none';
    worksCarouselRef.current.style.scrollBehavior = 'auto';

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleWorksPointerMove = (e) => {
    if (!isDraggingWorksRef.current || !worksCarouselRef.current) return;
    const walk = (e.clientX - startXWorksRef.current) * 1.35;
    if (Math.abs(walk) > 4) {
      hasDraggedWorksRef.current = true;
    }
    velocityWorksRef.current = (e.clientX - lastXWorksRef.current) * 1.2;
    lastXWorksRef.current = e.clientX;
    worksCarouselRef.current.scrollLeft = scrollLeftWorksRef.current - walk;
  };

  const handleWorksPointerUp = (e) => {
    if (!isDraggingWorksRef.current || !worksCarouselRef.current) return;
    isDraggingWorksRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    // Fluid inertia release
    let v = velocityWorksRef.current * 1.6;
    const decay = () => {
      if (Math.abs(v) > 0.5 && worksCarouselRef.current) {
        worksCarouselRef.current.scrollLeft -= v;
        v *= 0.93; // smooth exponential decay
        rafMomentumRef.current = requestAnimationFrame(decay);
      } else {
        if (worksCarouselRef.current) {
          worksCarouselRef.current.style.scrollSnapType = 'x proximity';
        }
        rafMomentumRef.current = null;
      }
    };

    if (Math.abs(v) > 1) {
      rafMomentumRef.current = requestAnimationFrame(decay);
    } else if (worksCarouselRef.current) {
      worksCarouselRef.current.style.scrollSnapType = 'x proximity';
    }

    setTimeout(() => {
      hasDraggedWorksRef.current = false;
    }, 120);
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
                className={`w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${isBannerDark
                    ? 'text-black hover:bg-black hover:text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`}
              >
                <span className="text-base leading-none">←</span>
              </button>
              <button
                type="button"
                onClick={() => scrollWorksCarousel('right')}
                aria-label="Next project"
                className={`w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${isBannerDark
                    ? 'text-black hover:bg-black hover:text-white'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                  }`}
              >
                <span className="text-base leading-none">→</span>
              </button>
            </div>

            <Link
              to="/works"
              data-builder-field="cta_text"
              data-builder-label="Explore Works Button"
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors duration-500 hidden sm:inline-block cursor-pointer shadow-xs ${isBannerDark
                  ? 'bg-white text-black hover:bg-black hover:text-white'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Draggable Smooth Carousel */}
      <ScrollReveal delay={0.15} y={32}>
        <div
          ref={worksCarouselRef}
          onPointerDown={handleWorksPointerDown}
          onPointerMove={handleWorksPointerMove}
          onPointerUp={handleWorksPointerUp}
          onPointerCancel={handleWorksPointerUp}
          className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 touch-pan-y scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x proximity'
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
              className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start group cursor-pointer flex flex-col select-none no-underline"
              onClick={(e) => {
                if (hasDraggedWorksRef.current) {
                  e.preventDefault();
                }
              }}
            >
              <article className="w-full flex flex-col select-none">
                {/* Clean Card Visual (Tall 4:3 aspect ratio, rounded-2xl, 100% full image, borderless) */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 relative bg-[#18181B] shadow-md select-none pointer-events-none border-0">
                  {projImg ? (
                    <RefineImage
                      src={projImg}
                      alt={proj.title}
                      aspectRatio="4 / 3"
                      width="100%"
                      radius={16}
                      draggable={false}
                      className="w-full h-full block"
                      imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-6 text-center text-white/70 select-none">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
                        {proj.category || 'PROJECT'}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white max-w-[220px] line-clamp-2">
                        {proj.title}
                      </span>
                    </div>
                  )}
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
});
