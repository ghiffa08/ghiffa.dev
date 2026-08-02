import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { SEO } from '../components/atoms/SEO';

/**
 * Format ISO timestamp into editorial-friendly format.
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

/**
 * Truncate text to a max length.
 */
const truncate = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export default function ArticlesPage() {
  useSmoothScroll();
  const { t } = useTranslation();
  const { data: settings } = useSupabaseSingle('general_settings');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
  const filtered = articles.filter(article => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(q) ||
      article.description?.toLowerCase().includes(q)
    );
  });

  const appName = settings?.app_name || 'ghiffa.dev';

  return (
    <>
      <SEO
        title={`${t('articles.title')} | ${appName}`}
        description={t('articles.subtitle')}
        url="https://ghiffa.dev/articles"
      />

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        
        :root {
          --bg-light: #FAFAFA;
          --bg-card: #FFFFFF;
          --text-dark: #111111;
          --border: #E5E5E5;
          --accent: #666666;
        }

        body {
          background-color: var(--bg-light);
          color: var(--text-dark);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif-editorial { font-family: 'Playfair Display', serif; }
        
        .hairline-b { border-bottom: 1px solid var(--border); }
        .hairline-t { border-top: 1px solid var(--border); }
        
        ::selection { background: var(--text-dark); color: var(--bg-light); }

        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      <main className="relative w-full z-10 min-h-screen flex flex-col selection:bg-[#111111] selection:text-[#FAFAFA]">
        <Header />

        {/* Hero Banner */}
        <section className="w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666] mb-4">
                  [ {t('articles.subtitle')} ]
                </p>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif-editorial font-bold tracking-tight leading-[0.9] text-[#111111]">
                  {t('articles.title')}
                </h1>
              </div>
              <div className="md:pb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666]">
                  {filtered.length} {filtered.length === 1 ? 'ARTICLE' : 'ARTICLES'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="w-full bg-white border-b border-[#E5E5E5] py-6">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-4 h-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('articles.search_placeholder')}
                className="w-full pl-11 pr-4 py-3 border border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] font-mono text-sm tracking-wide focus:outline-none focus:border-[#111111] transition-colors duration-200 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-xs text-[#666666] hover:text-[#111111] transition-colors uppercase tracking-wider font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="flex-1 w-full bg-[#FAFAFA] py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[#111111] animate-pulse">
                    Loading Articles...
                  </p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 border-2 border-[#E5E5E5] flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#E5E5E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 font-bold">
                  {t('articles.no_results')}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#111111] border-b border-[#111111] pb-0.5 hover:text-[#666666] hover:border-[#666666] transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-[#E5E5E5]">
                {filtered.map((article, idx) => (
                  <article key={article.id} className="group relative flex flex-col bg-white hover:bg-[#FAFAFA] transition-all duration-300 border-b border-r border-[#E5E5E5] animate-fade-in" style={{ animationDelay: `${idx * 80}ms`, opacity: 0 }}>
                    <Link
                      to={`/article/${article.slug}`}
                      className="flex flex-col h-full w-full outline-none focus:ring-2 focus:ring-[#111111]"
                    >
                      {/* Cover Image */}
                      <div className="w-full aspect-[16/10] overflow-hidden bg-[#E5E5E5] relative">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col flex-1 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                            {formatDate(article.published_at)}
                          </span>
                          <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] border border-[#E5E5E5] px-2 py-0.5 bg-[#FAFAFA]">
                            {article.read_time}
                          </span>
                        </div>

                        <h2 className="text-base md:text-lg font-serif-editorial font-bold tracking-tight mb-4 leading-snug text-[#111111] group-hover:text-[#666666] transition-colors line-clamp-2">
                          {article.title}
                        </h2>

                        <p className="text-sm text-[#666666] leading-relaxed mb-6 font-light line-clamp-3 flex-1">
                          {truncate(article.description, 150)}
                        </p>

                        <div className="mt-auto pt-4 border-t border-dashed border-[#E5E5E5] flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666] transition-colors">
                          {t('articles.read_more')} <span className="transform group-hover:translate-x-1.5 transition-transform text-sm leading-none">→</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
