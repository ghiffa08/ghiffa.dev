import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowUpRight, BookOpen } from 'lucide-react';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import { ScrollReveal } from '../components/atoms/ScrollReveal';
import { ArticlesHeader, PortfolioFooter } from '../components/organisms/portfolio';

/**
 * Format ISO timestamp into clean editorial format (e.g., "12 OKT 2024").
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

export default function ArticlesPage() {
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const email = info?.email || 'hello@ghiffa.dev';
  const appName = settings?.app_name || 'ghiffa.dev';

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchArticles() {
      try {
        const data = await ArticleRepository.getAllArticles();
        setArticles(data);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Filter articles by search query
  const filtered = articles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(q) ||
      article.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#FF5500] selection:text-white">
      <SEO
        title={`Articles & Insights | ${appName}`}
        description="Engineering deep-dives, architectural notes, and tutorials on fullstack web development, IoT systems, and modern software design by Haikal Jibran Al-Ghiffarry."
        url="https://ghiffa.dev/articles"
      />

      {/* Reusable Portfolio-Styled Header */}
      <ArticlesHeader emailAddress={email} />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-20 sm:pb-28">
        {/* Section Header */}
        <ScrollReveal delay={0.05} y={24}>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-4 select-none">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-gray-500">
                Writings &amp; Insights
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141414] leading-[1.05] mb-4">
              articles
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl font-normal">
              Thoughts, engineering deep-dives, and behind-the-scenes on building scalable web applications, embedded IoT systems, and interactive digital products.
            </p>
          </div>
        </ScrollReveal>

        {/* Search & Meta Toolbar */}
        <ScrollReveal delay={0.1} y={20}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 sm:mb-12 pb-6 border-b border-gray-100">
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title or topic..."
                className="w-full pl-11 pr-10 py-2.5 rounded-full border border-gray-200 bg-[#FAFAFA] text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Total count pill */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-mono text-xs text-gray-500">
                Showing <strong className="text-black font-semibold">{filtered.length}</strong> {filtered.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Articles Grid or States */}
        {loading ? (
          /* Loading Skeletons matching Card Dimensions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex flex-col animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 mb-5" />
                <div className="h-3 bg-gray-100 rounded-md w-1/3 mb-3" />
                <div className="h-5 bg-gray-100 rounded-md w-4/5 mb-2.5" />
                <div className="h-3.5 bg-gray-100 rounded-md w-full mb-1.5" />
                <div className="h-3.5 bg-gray-100 rounded-md w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty Search Results */
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#141414] mb-1">No articles found</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-5">
              We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try another search term.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono font-medium text-black underline underline-offset-4 hover:text-[#FF5500] transition-colors"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          /* Real Articles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filtered.map((article, idx) => {
              const articleImg = article.cover_image || article.image_url;

              return (
                <ScrollReveal key={article.id || idx} delay={idx * 0.05} y={24}>
                  <Link
                    to={`/article/${article.slug}`}
                    className="group flex flex-col cursor-pointer select-none"
                  >
                    {/* Visual Cover (matching Selected Works & Selected Articles) */}
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-[#F4F4F5] shadow-xs border border-black/5">
                      {articleImg ? (
                        <img
                          src={articleImg}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-wider">
                          ghiffa.dev editorial
                        </div>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                      <span>{formatDate(article.published_at)}</span>
                      {article.read_time && (
                        <>
                          <span className="text-gray-300">&middot;</span>
                          <span>{article.read_time}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-[19.5px] font-semibold leading-[1.3] mb-2 text-[#141414] group-hover:text-[#FF5500] transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-[#71717A] line-clamp-3 font-normal mb-3">
                      {article.description}
                    </p>

                    {/* Read Article Pill Action */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#141414] group-hover:text-[#FF5500] transition-colors mt-auto pt-1">
                      <span>Read article</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </main>

      {/* Reusable Portfolio Footer */}
      <PortfolioFooter emailAddress={email} />
    </div>
  );
}
