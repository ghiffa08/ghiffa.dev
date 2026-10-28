import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../../../utils/slugify';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function SelectedArticlesSection({
  articlesList,
  isBannerDark,
  sectionData
}) {
  const sectionTitle = sectionData?.title || 'selected articles';
  const ctaText = sectionData?.content?.cta_text || 'Explore all articles →';
  const articlesCarouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafDragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.button !== 0 || !articlesCarouselRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftRef.current = articlesCarouselRef.current.scrollLeft;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !articlesCarouselRef.current) return;
    const walk = e.clientX - startXRef.current;
    if (Math.abs(walk) > 8) {
      hasDraggedRef.current = true;
    }

    if (!rafDragRef.current) {
      rafDragRef.current = requestAnimationFrame(() => {
        if (articlesCarouselRef.current) {
          articlesCarouselRef.current.scrollLeft = scrollLeftRef.current - walk;
        }
        rafDragRef.current = null;
      });
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    if (rafDragRef.current) {
      cancelAnimationFrame(rafDragRef.current);
      rafDragRef.current = null;
    }
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
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
    <section id="articles" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden transition-colors duration-700 ease-in-out">
      <div id="insights" className="absolute -top-24" />
      <div id="blog" className="absolute -top-24" />

      <ScrollReveal margin="250px 0px 50px 0px" duration={0.3} delay={0} y={12}>
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1" />
            <h2 className={`text-2xl sm:text-[38px] font-bold tracking-tight transition-colors duration-700 ${isBannerDark ? 'text-black' : 'text-[#141414]'}`}>
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
                className={`w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isBannerDark
                    ? 'border-black/20 text-black hover:bg-black hover:text-white'
                    : 'border-gray-200 hover:border-gray-900 text-gray-700 hover:text-black'
                }`}
              >
                <span className="text-base leading-none">←</span>
              </button>
              <button
                type="button"
                onClick={() => scrollArticlesCarousel('right')}
                aria-label="Next article"
                className={`w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isBannerDark
                    ? 'border-black/20 text-black hover:bg-black hover:text-white'
                    : 'border-gray-200 hover:border-gray-900 text-gray-700 hover:text-black'
                }`}
              >
                <span className="text-base leading-none">→</span>
              </button>
            </div>

            <Link
              to="/articles"
              className={`text-xs font-medium border px-4 py-2 rounded-full transition-colors duration-500 hidden sm:inline-block cursor-pointer shadow-2xs ${
                isBannerDark
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
      <ScrollReveal margin="350px 0px 50px 0px" duration={0.3} delay={0} y={16}>
        <div
          ref={articlesCarouselRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 touch-pan-y"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
        {articlesList.map((article, idx) => {
          const articleImg = article.cover_image || article.image_url;
          const articleSlug = article.slug || (article.title ? slugify(article.title) : '');
          const isExternal = !article.slug && article.link && article.link.startsWith('http');
          const targetUrl = isExternal ? article.link : (articleSlug ? `/article/${articleSlug}` : '/articles');

          const cardContent = (
            <article className="w-full flex flex-col select-none">
              {/* Clean Card Visual (Tall 4:3 aspect ratio matching Selected Works) */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-[#F4F4F5] shadow-xs border border-black/5 select-none pointer-events-none">
                {articleImg ? (
                  <img
                    src={articleImg}
                    alt={article.title}
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none"
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
              <h3 className={`text-[19px] sm:text-[20px] lg:text-[21px] font-semibold leading-[1.3] mb-2.5 transition-colors duration-500 line-clamp-2 ${
                isBannerDark
                  ? 'text-black group-hover:text-black/75'
                  : 'text-[#141414] group-hover:text-[#FF5500]'
              }`}>
                {article.title}
              </h3>

              {/* Description */}
              <p className={`text-[13px] sm:text-[13.5px] leading-[1.6] line-clamp-3 font-normal transition-colors duration-500 ${
                isBannerDark
                  ? 'text-neutral-900 font-medium'
                  : 'text-[#71717A]'
              }`}>
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
                className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 group cursor-pointer flex flex-col select-none no-underline"
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
              className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 group cursor-pointer flex flex-col select-none no-underline"
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
}
