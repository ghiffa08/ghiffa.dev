import React, { useState } from 'react';
import { useInstagramFeed } from '../../../hooks/useInstagramFeed';
import { ScrollReveal } from '../../atoms/ScrollReveal';

const POSTS_PER_PAGE = 6;

export function InstagramPostsSection({ isBannerDark }) {
  const { data: posts, isLoading, error } = useInstagramFeed();
  const [currentPage, setCurrentPage] = useState(1);

  if (error && (!posts || posts.length === 0)) {
    return null;
  }

  const allPosts = posts || [];
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const el = document.getElementById('instagram-feed');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="instagram-feed" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden transition-colors duration-700 ease-in-out">
      <div id="instagram" className="absolute -top-24" />

      {/* Header without // VISUAL JOURNAL */}
      <ScrollReveal delay={0.05} y={28}>
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className={`text-2xl sm:text-[38px] font-bold tracking-tight transition-colors duration-700 ${isBannerDark ? 'text-black' : 'text-[#141414]'}`}>
              instagram posts
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/haikaljibraan"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-medium border px-4 py-2 rounded-full transition-colors duration-500 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
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
      </ScrollReveal>

      {/* Loading Skeleton */}
      {isLoading && allPosts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="aspect-square rounded-2xl bg-gray-100 mb-5" />
              <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-2.5" />
              <div className="h-3 bg-gray-100 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Responsive 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {currentPosts.map((post, idx) => {
              const imgSrc = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;

              return (
                <ScrollReveal
                  key={post.id || idx}
                  delay={(idx % 3) * 0.1}
                  y={28}
                >
                  <article
                    className="group cursor-pointer flex flex-col select-none h-full"
                    onClick={() => {
                      if (post.permalink) {
                        window.open(post.permalink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {/* Clean Card Visual: Original uncropped aspect ratio without badges */}
                    <div className="rounded-2xl overflow-hidden mb-4 relative bg-[#F4F4F5] shadow-xs border border-black/5 select-none pointer-events-none">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={post.caption || 'Instagram Post'}
                          loading="lazy"
                          className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white font-mono text-xs">
                          Instagram Post
                        </div>
                      )}
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
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <ScrollReveal delay={0.1} y={20}>
              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-all bg-white shadow-2xs cursor-pointer active:scale-95"
                >
                  &larr; Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-label={`Go to page ${pageNum}`}
                      className={`w-8 h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-black hover:text-black'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-all bg-white shadow-2xs cursor-pointer active:scale-95"
                >
                  Next &rarr;
                </button>
              </div>
            </ScrollReveal>
          )}
        </>
      )}
    </section>
  );
}
