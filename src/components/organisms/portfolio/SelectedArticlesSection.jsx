import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../../../utils/slugify';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { getOptimizedImageUrl } from '../../../utils/cloudinary';

export const SelectedArticlesSection = React.memo(function SelectedArticlesSection({
  articlesList,
  sectionData
}) {
  const sectionTitle = sectionData?.title || 'selected articles';
  const ctaText = sectionData?.content?.cta_text || 'Explore all articles →';
  const articlesCarouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafMomentumRef = useRef(null);

  // Smooth mouse-wheel horizontal scrolling
  useEffect(() => {
    const el = articlesCarouselRef.current;
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

  const handlePointerDown = (e) => {
    if (e.button !== 0 || !articlesCarouselRef.current) return;
    if (rafMomentumRef.current) {
      cancelAnimationFrame(rafMomentumRef.current);
      rafMomentumRef.current = null;
    }
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    scrollLeftRef.current = articlesCarouselRef.current.scrollLeft;
    articlesCarouselRef.current.style.scrollSnapType = 'none';
    articlesCarouselRef.current.style.scrollBehavior = 'auto';

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !articlesCarouselRef.current) return;
    const walk = (e.clientX - startXRef.current) * 1.35;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    velocityRef.current = (e.clientX - lastXRef.current) * 1.2;
    lastXRef.current = e.clientX;
    articlesCarouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current || !articlesCarouselRef.current) return;
    isDraggingRef.current = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    // Fluid inertia release
    let v = velocityRef.current * 1.6;
    const decay = () => {
      if (Math.abs(v) > 0.5 && articlesCarouselRef.current) {
        articlesCarouselRef.current.scrollLeft -= v;
        v *= 0.93; // smooth exponential decay
        rafMomentumRef.current = requestAnimationFrame(decay);
      } else {
        if (articlesCarouselRef.current) {
          articlesCarouselRef.current.style.scrollSnapType = 'x proximity';
        }
        rafMomentumRef.current = null;
      }
    };

    if (Math.abs(v) > 1) {
      rafMomentumRef.current = requestAnimationFrame(decay);
    } else if (articlesCarouselRef.current) {
      articlesCarouselRef.current.style.scrollSnapType = 'x proximity';
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  const scrollArticlesCarousel = (direction) => {
    if (!articlesCarouselRef.current) return;
    const scrollAmount = articlesCarouselRef.current.clientWidth * 0.75;
    articlesCarouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section id="articles" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden">
      <div id="insights" className="absolute -top-24" />
      <div id="blog" className="absolute -top-24" />

      <ScrollReveal delay={0.05} y={24}>
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1" />
            <h2
              data-builder-field="title"
              data-builder-label="Articles Section Title"
              className="text-2xl sm:text-[38px] font-bold tracking-tight text-[#141414]"
            >
              {sectionTitle}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollArticlesCarousel('left')}
                aria-label="Previous article"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 text-gray-700 hover:text-black hover:bg-gray-100"
              >
                <span className="text-base leading-none">←</span>
              </button>
              <button
                type="button"
                onClick={() => scrollArticlesCarousel('right')}
                aria-label="Next article"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 text-gray-700 hover:text-black hover:bg-gray-100"
              >
                <span className="text-base leading-none">→</span>
              </button>
            </div>

            <Link
              to="/articles"
              data-builder-field="cta_text"
              data-builder-label="Explore Articles Button"
              className="text-xs font-medium px-4 py-2 rounded-full transition-colors duration-300 hidden sm:inline-block cursor-pointer shadow-xs text-gray-600 hover:text-black hover:bg-gray-100 bg-white"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Draggable Smooth Carousel */}
      <ScrollReveal delay={0.15} y={32}>
        <div
          ref={articlesCarouselRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 touch-pan-y scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x proximity'
          }}
        >
        {articlesList.map((article, idx) => {
          const rawArticleImg = article.cover_image || article.image_url;
          const articleImg = getOptimizedImageUrl(rawArticleImg, { width: 800 });
          const articleSlug = article.slug || (article.title ? slugify(article.title) : '');
          const isExternal = !article.slug && article.link && article.link.startsWith('http');
          const targetUrl = isExternal ? article.link : (articleSlug ? `/article/${articleSlug}` : '/articles');

          const cardContent = (
            <article className="w-full flex flex-col select-none">
              {/* Clean Card Visual (Tall 4:3 aspect ratio matching Selected Works, 100% full image, borderless) */}
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 relative bg-[#18181B] shadow-md select-none pointer-events-none border-0">
                {articleImg ? (
                  <img
                    src={articleImg}
                    alt={article.title}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full block object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-wider">
                    ghiffa.dev editorial
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[19px] sm:text-[20px] lg:text-[21px] font-semibold leading-[1.3] mb-2.5 transition-colors duration-300 text-[#141414] group-hover:text-[#FF5500] line-clamp-2">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] sm:text-[13.5px] leading-[1.6] line-clamp-3 font-normal text-[#71717A]">
                {article.description}
              </p>
            </article>
          );

          if (isExternal) {
            return (
              <a
                key={article.id || idx}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start group cursor-pointer flex flex-col select-none no-underline"
                onClick={(e) => {
                  if (hasDraggedRef.current) {
                    e.preventDefault();
                  }
                }}
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link
              key={article.id || idx}
              to={targetUrl}
              className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start group cursor-pointer flex flex-col select-none no-underline"
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  e.preventDefault();
                }
              }}
            >
              {cardContent}
            </Link>
          );
        })}
        </div>
      </ScrollReveal>
    </section>
  );
});
