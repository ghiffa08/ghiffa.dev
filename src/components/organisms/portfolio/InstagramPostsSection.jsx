import React, { useRef } from 'react';
import { useInstagramFeed } from '../../../hooks/useInstagramFeed';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

export function InstagramPostsSection({ isBannerDark }) {
  const { data: posts, isLoading, error } = useInstagramFeed();
  const carouselRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const rafDragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.button !== 0 || !carouselRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    scrollLeftRef.current = carouselRef.current.scrollLeft;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    const walk = e.clientX - startXRef.current;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }

    if (!rafDragRef.current) {
      rafDragRef.current = requestAnimationFrame(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
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

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (error && (!posts || posts.length === 0)) {
    return null;
  }

  return (
    <section id="instagram-feed" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden transition-colors duration-700 ease-in-out">
      <div id="instagram" className="absolute -top-24" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
            // VISUAL JOURNAL
          </div>
          <h2 className={`text-2xl sm:text-[38px] font-bold tracking-tight transition-colors duration-700 ${isBannerDark ? 'text-black' : 'text-[#141414]'}`}>
            instagram posts
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              aria-label="Previous instagram post"
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
              onClick={() => scrollCarousel('right')}
              aria-label="Next instagram post"
              className={`w-9 h-9 rounded-full border bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isBannerDark
                  ? 'border-black/20 text-black hover:bg-black hover:text-white'
                  : 'border-gray-200 hover:border-gray-900 text-gray-700 hover:text-black'
              }`}
            >
              <span className="text-base leading-none">&rarr;</span>
            </button>
          </div>

          <a
            href="https://instagram.com/haikaljibraan"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-medium border px-4 py-2 rounded-full transition-colors duration-500 hidden sm:inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isBannerDark
                ? 'bg-white text-black border-black/20 hover:bg-black hover:text-white'
                : 'text-gray-600 hover:text-black border-gray-200 hover:border-gray-300'
            }`}
          >
            <span>@haikaljibraan</span>
            <span>&nearr;</span>
          </a>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (!posts || posts.length === 0) ? (
        <div className="flex gap-6 overflow-hidden pb-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 animate-pulse">
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 mb-5" />
              <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-2.5" />
              <div className="h-3 bg-gray-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        /* Draggable Carousel */
        <div
          ref={carouselRef}
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
          {posts.map((post, idx) => {
            const imgSrc = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;

            return (
              <article
                key={post.id || idx}
                className="w-[85vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 group cursor-pointer flex flex-col select-none"
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  if (post.permalink) {
                    window.open(post.permalink, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {/* Clean Card Visual (Tall 4:3 aspect ratio matching Selected Works & Articles) */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-[#F4F4F5] shadow-xs border border-black/5 select-none pointer-events-none">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={post.caption || 'Instagram Post'}
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white font-mono text-xs">
                      Instagram Post
                    </div>
                  )}

                  {/* Media Type & Date Badge */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {post.media_type === 'CAROUSEL_ALBUM' ? 'Album' : post.media_type === 'VIDEO' ? 'Reel' : 'Post'}
                    </span>
                    {post.timestamp && (
                      <span className="bg-white/80 backdrop-blur-md text-gray-900 font-mono text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {formatDate(post.timestamp)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Caption Title */}
                <h3 className={`text-[17px] sm:text-[18px] lg:text-[19px] font-semibold leading-[1.35] mb-2 transition-colors duration-500 line-clamp-2 ${
                  isBannerDark
                    ? 'text-black group-hover:text-black/75'
                    : 'text-[#141414] group-hover:text-[#FF5500]'
                }`}>
                  {post.caption ? post.caption.split('\n')[0] : 'Instagram Update'}
                </h3>

                {/* Caption Snippet */}
                <p className={`text-[13px] sm:text-[13.5px] leading-[1.6] line-clamp-2 font-normal transition-colors duration-500 ${
                  isBannerDark
                    ? 'text-neutral-900 font-medium'
                    : 'text-[#71717A]'
                }`}>
                  {post.caption || 'View full post and discussion on Instagram.'}
                </p>

                {/* Action Link */}
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#FF5500] group-hover:underline">
                  <span>View on Instagram</span>
                  <span>&rarr;</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
