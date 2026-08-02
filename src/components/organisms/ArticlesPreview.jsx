import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';

/**
 * Format ISO timestamp into editorial-friendly format (e.g. "10 JUL 2026").
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

export function ArticlesPreview() {
  const { t } = useTranslation();
  const { data: articles, isLoading } = useSupabaseList('articles');

  // Only show up to 3 latest articles
  const latestArticles = (articles || []).slice(0, 3);
  const featured = latestArticles[0];
  const secondary = latestArticles.slice(1, 3);

  if (isLoading) {
    return (
      <section id="articles-preview" className="relative z-20 w-full bg-[#FAFAFA] border-t border-gray-200 py-12 md:py-16">
        <SectionHeader number="06" title={t('articles.latest')} />
        <div className="px-6 md:px-12 flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#111111] animate-pulse">
              Loading Articles...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!latestArticles || latestArticles.length === 0) {
    return null; // Don't render section if no articles
  }

  return (
    <section id="articles-preview" className="relative z-20 w-full bg-[#FAFAFA] border-t border-gray-200 py-12 md:py-16 scroll-fade">
      <SectionHeader number="06" title={t('articles.latest')} />

      {/* Editorial Grid: Featured + Secondary */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#E5E5E5]">
          
          {/* Featured Article (Large) */}
          {featured && (
            <article className="group relative flex flex-col bg-white hover:bg-[#FAFAFA] transition-all duration-300 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
              <Link 
                to={`/article/${featured.slug}`}
                className="flex flex-col h-full w-full outline-none focus:ring-2 focus:ring-[#111111]"
              >
                {/* Cover Image */}
                <div className="w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-[#E5E5E5] relative border-b border-[#E5E5E5]">
                  <img
                    src={featured.cover_image}
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-[#111111] text-[#FAFAFA] font-mono text-[9px] px-2.5 py-1 tracking-[0.2em] uppercase font-bold">
                    {t('articles.featured')}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                      {formatDate(featured.published_at)}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] border border-[#E5E5E5] px-2 py-0.5 bg-[#FAFAFA]">
                      {featured.read_time}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif-editorial font-bold tracking-tight mb-4 leading-snug text-[#111111] group-hover:text-[#666666] transition-colors">
                    {featured.title}
                  </h3>

                  <p className="text-sm text-[#666666] leading-relaxed mb-6 font-light flex-1">
                    {truncate(featured.description, 200)}
                  </p>

                  <div className="mt-auto pt-4 border-t border-dashed border-[#E5E5E5] flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666] transition-colors">
                    {t('articles.read_more')} <span className="transform group-hover:translate-x-1.5 transition-transform text-sm leading-none">→</span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Secondary Articles (Stacked) */}
          <div className="flex flex-col">
            {secondary.map((article, idx) => (
              <article
                key={article.id}
                className={`group flex flex-col md:flex-row bg-white hover:bg-[#FAFAFA] transition-all duration-300 flex-1 ${
                  idx === 0 ? 'border-b border-[#E5E5E5]' : ''
                }`}
              >
                <Link
                  to={`/article/${article.slug}`}
                  className="flex flex-col md:flex-row w-full h-full outline-none focus:ring-2 focus:ring-[#111111]"
                >
                  {/* Cover Image */}
                  <div className="w-full md:w-2/5 aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-[#E5E5E5] relative shrink-0 border-b md:border-b-0 md:border-r border-[#E5E5E5]">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col flex-1 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                        {formatDate(article.published_at)}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 font-bold uppercase tracking-[0.15em] border border-[#E5E5E5] px-2 py-0.5 bg-[#FAFAFA]">
                        {article.read_time}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-serif-editorial font-bold tracking-tight mb-3 leading-snug text-[#111111] group-hover:text-[#666666] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-sm text-[#666666] leading-relaxed mb-4 font-light line-clamp-2">
                      {truncate(article.description, 100)}
                    </p>

                    <div className="mt-auto pt-3 border-t border-dashed border-[#E5E5E5] flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666] transition-colors">
                      {t('articles.read_more')} <span className="transform group-hover:translate-x-1.5 transition-transform text-sm leading-none">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}

            {/* If only 1 article exists, fill remaining space */}
            {secondary.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-12 text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  More articles coming soon...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-12 md:pt-16">
          <Link
            to="/articles"
            className="inline-flex items-center justify-center border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer"
          >
            {t('articles.read_all')} <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
