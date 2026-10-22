import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ArticlesHeader({ currentTitle, showBack = false, emailAddress }) {
  const email = emailAddress || 'hello@ghiffa.dev';

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-100/80 text-[#111111] transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto h-[64px] sm:h-[72px] flex items-center justify-between">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className="text-[18px] sm:text-[20px] font-bold tracking-tight leading-none text-[#111111] hover:opacity-80 transition-opacity select-none"
          >
            ghiffa.dev
          </Link>
          <span className="text-gray-300 text-sm">/</span>
          <Link
            to="/articles"
            className="text-xs sm:text-[13px] font-mono uppercase tracking-wider text-gray-500 hover:text-black transition-colors font-medium"
          >
            articles
          </Link>
          {currentTitle && (
            <>
              <span className="hidden md:inline text-gray-300 text-sm">/</span>
              <span className="hidden md:inline text-xs font-mono text-gray-400 truncate max-w-[240px]">
                {currentTitle}
              </span>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-black px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Articles</span>
            </Link>
          )}

          <a
            href={`mailto:${email}`}
            className="text-[12px] sm:text-[12.5px] font-medium px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#18181B] text-white hover:bg-[#2a2a2a] transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Let&apos;s talk
          </a>
        </div>
      </div>
    </header>
  );
}
