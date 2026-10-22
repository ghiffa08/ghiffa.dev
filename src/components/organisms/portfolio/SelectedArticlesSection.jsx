import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function SelectedArticlesSection({
  articlesList,
  isBannerDark
}) {
  const navigate = useNavigate();
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

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !articlesCarouselRef.current) return;
    const walk = e.clientX - startXRef.current;
    if (Math.abs(walk) > 5) {
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

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    if (rafDragRef.current) {
      cancelAnimationFrame(rafDragRef.current);
      rafDragRef.current = null;
    }
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
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

      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1" />
          <h2 className={`text-2xl sm:text-[38px] font-bold tracking-tight transition-colors duration-700 ${isBannerDark ? 'text-black' : 'text-[#141414]'}`}>
            selected articles
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
              <span className="text-base leading-none">&larr;</span>
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
              <span className="text-base leading-none">&rarr;</span>
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
            Explore all articles &rarr;
          </Link>
        </div>
      </div>

      {/* Draggable Carousel */}
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

          return (
            <article
              key={article.id || idx}
              className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 group cursor-pointer flex flex-col select-none"
              onClick={() => {
                if (hasDraggedRef.current) return;
                if (article.slug) {
                  navigate(`/article/${article.slug}`);
                } else if (article.link && article.link.startsWith('http')) {
                  window.open(article.link, '_blank', 'noopener,noreferrer');
                } else {
                  navigate('/articles');
                }
              }}
            >
              {/* Clean Card Visual (Tall 4:3 aspect ratio matching Selected Works) */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-[#F4F4F5] shadow-xs border border-black/5 select-none pointer-events-none">
                {articleImg ? (
                  <img
                    src={articleImg}
                    alt={article.title}
                    draggable={false}
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
        })}
      </div>
    </section>
  );
}
