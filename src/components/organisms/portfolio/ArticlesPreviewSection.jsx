import React from 'react';
import { Link } from 'react-router-dom';

export function ArticlesPreviewSection({ onOpenContact }) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
            // PERSPECTIVES &amp; DISPATCHES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
            Selected insights &amp; publications
          </h2>
        </div>
        <Link
          to="/articles"
          className="text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-4 py-2 rounded-full transition-colors hidden sm:inline-block"
        >
          View all articles &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
        {/* Article 1 */}
        <article
          className="group cursor-pointer"
          onClick={() => onOpenContact('Design Systems')}
        >
          <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 relative shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
          </div>
          <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
            Scalable Design Systems for Modern Enterprises
          </h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            How we unify tokens, Figma libraries, and production React components to ship products twice as fast.
          </p>
        </article>

        {/* Article 2 */}
        <article
          className="group cursor-pointer"
          onClick={() => onOpenContact('Web Performance')}
        >
          <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-[#FF5500] via-amber-600 to-zinc-900 relative shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,85,0,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
          </div>
          <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
            Engineering High-Performance Web Architecture
          </h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Why Core Web Vitals, edge caching, and clean semantic markup are essential for conversion and SEO.
          </p>
        </article>

        {/* Article 3 */}
        <article
          className="group cursor-pointer"
          onClick={() => onOpenContact('AI + Web')}
        >
          <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-red-700 via-rose-900 to-neutral-950 relative shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,rgba(251,113,133,0.3),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
          </div>
          <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
            Bridging Bits and Atoms in the Age of AI
          </h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            Blending physical brand identity with intelligent digital interfaces that adapt to every user.
          </p>
        </article>
      </div>
    </section>
  );
}
