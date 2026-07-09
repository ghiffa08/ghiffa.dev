import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInstagramFeed } from '../../hooks/useInstagramFeed';
import { SectionHeader } from '../atoms/SectionHeader';

/**
 * Helper to truncate the Instagram post caption.
 */
const truncateCaption = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Helper to format ISO timestamp into monospace Swiss Design friendly format (e.g. "10 JUL 2026").
 */
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

export function InstagramFeed({ setHoveredArticleImg }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: posts, isLoading, error } = useInstagramFeed(50);

  if (isLoading) {
    return (
      <section id="journal" className="py-16 md:py-24 hairline-t bg-[#FAFAFA]">
        <SectionHeader number="05" title={t('instagram.title')} />
        <div className="px-6 md:px-12 flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#111111] animate-pulse">
              Loading Instagram Feed...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="journal" className="py-16 md:py-24 hairline-t bg-[#FAFAFA]">
        <SectionHeader number="05" title={t('instagram.title')} />
        <div className="mx-6 md:mx-12 py-12 px-6 border border-[#E5E5E5] bg-white text-center shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-red-500 mb-2 font-bold">
            Failed to load Instagram feed
          </p>
          <p className="text-xs text-gray-500 font-mono max-w-md mx-auto">
            {error.message || 'Please check your VITE_INSTAGRAM_TOKEN configuration in .env.local.'}
          </p>
        </div>
      </section>
    );
  }

  const visiblePosts = isExpanded ? posts : posts.slice(0, 6);

  return (
    <section id="journal" className="py-16 md:py-24 hairline-t bg-[#FAFAFA] scroll-fade">
      <SectionHeader number="05" title={t('instagram.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E5E5E5]">
        {visiblePosts.map((post, idx) => {
          // If media_type is VIDEO, we must use the thumbnail_url for video preview
          const imgSrc = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
          const isNewItem = idx >= 6;
          
          return (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredArticleImg && setHoveredArticleImg(imgSrc)}
              onMouseLeave={() => setHoveredArticleImg && setHoveredArticleImg(null)}
              className={`group flex flex-col p-6 md:p-8 bg-white hover:bg-[#FAFAFA] transition-all duration-300 border-b border-[#E5E5E5] ${
                idx % 3 !== 2 ? 'md:border-r border-[#E5E5E5]' : ''
              } ${isNewItem ? 'animate-fade-in' : ''}`}
            >
              {/* Media Card Wrapper */}
              <div className="w-full aspect-square overflow-hidden mb-6 bg-[#E5E5E5] border border-[#E5E5E5] p-1 shadow-sm relative">
                <img
                  src={imgSrc}
                  alt={post.caption || 'Instagram Post'}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500 ease-out"
                />
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-3 right-3 bg-[#111111]/80 text-white font-mono text-[9px] px-1.5 py-0.5 tracking-wider uppercase">
                    Video
                  </div>
                )}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-3 right-3 bg-[#111111]/80 text-white font-mono text-[9px] px-1.5 py-0.5 tracking-wider uppercase">
                    Carousel
                  </div>
                )}
              </div>

              {/* Text / Metadata */}
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                    {formatDate(post.timestamp)}
                  </span>
                  <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] border border-[#E5E5E5] px-2 py-0.5 bg-[#FAFAFA]">
                    {post.media_type}
                  </span>
                </div>

                <p className="text-base md:text-lg font-serif-editorial font-bold tracking-tight mb-6 leading-snug text-[#111111] group-hover:text-[#666666] transition-colors line-clamp-3">
                  {truncateCaption(post.caption) || 'No caption provided.'}
                </p>

                <div className="mt-auto pt-4 border-t border-dashed border-[#E5E5E5] flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666] transition-colors">
                  {t('view_on_instagram')} <span className="transform group-hover:translate-x-1.5 transition-transform text-sm leading-none">↗</span>
                </div>
              </div>
            </a>
          );
        })}
        
        {visiblePosts.length === 0 && (
          <div className="col-span-1 md:col-span-3 p-12 text-center text-gray-500 uppercase tracking-widest font-mono border-b border-[#E5E5E5]">
            No Instagram posts found.
          </div>
        )}
      </div>

      {posts.length > 6 && (
        <div className="flex justify-center px-6 md:px-12 pt-12 md:pt-16">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer"
          >
            {isExpanded ? t('show_less') : t('see_all_journal')}
          </button>
        </div>
      )}
    </section>
  );
}
