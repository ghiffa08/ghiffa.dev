import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Check,
  Copy,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import { ScrollReveal } from '../components/atoms/ScrollReveal';
import { ArticlesHeader, PortfolioFooter } from '../components/organisms/portfolio';

/**
 * Format ISO timestamp into clean long date format (e.g. "October 12, 2024").
 */
const formatDateLong = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Format ISO timestamp into short date format (e.g. "12 OKT 2024").
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
 * Clean and normalize article markdown/rich text.
 * Fixes raw unparsed markdown inside HTML tags (e.g. single-line <p> containing ### and bullet points).
 */
const cleanArticleMarkdown = (raw) => {
  if (!raw || typeof raw !== 'string') return { isHtml: false, content: '' };
  const trimmed = raw.trim();

  // If already full semantic HTML (with multiple h2, p, blockquote, table, etc.) and no markdown symbols
  const hasBlockHtml = /<(h[1-6]|table|blockquote|pre)[\s>]/i.test(trimmed);
  const hasMarkdownHeadings = /###|##|#\s/.test(trimmed);
  const hasNumberedBold = /\*\*\d+\.\s+[^*]+?\*\*/.test(trimmed);

  if (hasBlockHtml && !hasMarkdownHeadings && !hasNumberedBold) {
    return { isHtml: true, content: trimmed };
  }

  let text = trimmed;

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Strip wrapping and inner <p>
  text = text.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '');
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n\n');

  // Format ### Headings ending with ?: "### What's the vibe here? I wanted..."
  text = text.replace(/###\s*([^?\n]+?\?)\s*([A-Z])/g, '\n\n### $1\n\n$2');

  // Format other ### Headings: "### Under the Hood Since we're..."
  text = text.replace(
    /###\s*([A-Za-z0-9\s'&,-]+?)(?=\s+[A-Z][a-z]+ (?:we|you|I|they|it|is|are|was|were|all|about|have|can|will|would|could|should|bukan|dan|di|ke|ini|itu)\b|\n|$)/g,
    '\n\n### $1\n\n'
  );

  // Also catch any remaining ### that already have newlines or at end
  text = text.replace(/([^\n])\s*(###\s+[^\n]+)/g, '$1\n\n$2\n\n');

  // Format bold numbered items like "**1. Sistem Reward XP dan Leveling** Setiap kali..."
  text = text.replace(/([^\n]|^)\s*(\*\*\d+\.\s+[^*]+?\*\*)\s*([A-Z])/g, '$1\n\n### $2\n\n$3');
  // Clean up ### **1. ...** into ### 1. ...
  text = text.replace(/###\s*\*\*(\d+\.\s+[^*]+?)\*\*/g, '### $1');

  // Format bullet points "- **Frontend Core:** ..."
  text = text.replace(/([^\n])\s*(-\s+\*\*[^*]+?\*\*)/g, '$1\n\n$2');

  // Add paragraph breaks before key sentence transitions if stuck in giant block
  text = text.replace(/(\.|\?)\s+(Perkenalkan,\s+\*\*Skillstreak)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Tujuan utamanya)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Lalu, apa saja yang membedakan)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Saat ini,\s+Skillstreak)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Khusus untuk para member)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Jadi, pastikan kamu)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(So yeah, feel free to stick around)/g, '$1\n\n$2');
  text = text.replace(/(\.|\?)\s+(Here's what's powering this setup:)/g, '$1\n\n$2');

  // Clean excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return { isHtml: false, content: text };
};

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [igStoryCopied, setIgStoryCopied] = useState(false);
  const [igDmCopied, setIgDmCopied] = useState(false);

  const email = info?.email || 'hello@ghiffa.dev';
  const appName = settings?.app_name || 'ghiffa.dev';
  const authorName = info?.full_name || 'Haikal Jibran Al-Ghiffarry';
  const authorAvatar = info?.avatar_url || '/ghiffa.png';

  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://ghiffa.dev/article/${slug}`;

  const processedContent = useMemo(() => {
    return cleanArticleMarkdown(article?.content);
  }, [article?.content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchArticleAndMore() {
      setLoading(true);
      try {
        const data = await ArticleRepository.getArticleBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setArticle(data);
          setNotFound(false);

          // Fetch other recent articles for the bottom section
          try {
            const all = await ArticleRepository.getAllArticles(4);
            const others = (all || []).filter((item) => item.slug !== slug).slice(0, 3);
            setMoreArticles(others);
          } catch {
            // non-fatal
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchArticleAndMore();
  }, [slug]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col">
        <ArticlesHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-16 flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-3 border-[#111111] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 animate-pulse">
            Loading Article...
          </p>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  // Not Found State
  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col">
        <ArticlesHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-24 text-center flex flex-col items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-2">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-3">
            Article Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The article you are looking for doesn&apos;t exist, has been unpublished, or the URL might be incorrect.
          </p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium px-5 py-2.5 rounded-full bg-[#141414] text-white hover:bg-[#2b2b2b] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.cover_image,
    datePublished: article.published_at,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://ghiffa.dev'
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#FF5500] selection:text-white">
      <SEO
        title={`${article.title} | ${appName}`}
        description={article.description}
        image={article.cover_image}
        url={articleUrl}
        type="article"
        publishedDate={article.published_at}
        jsonLd={articleSchema}
      />

      {/* Reusable Header */}
      <ArticlesHeader currentTitle={article.title} showBack={true} emailAddress={email} />

      <main className="flex-1 w-full">
        {/* Article Header Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-14 pb-8">
          <ScrollReveal delay={0.05} y={16}>
            {/* Back Link */}
            <Link
              to="/articles"
              className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-black transition-colors mb-6 sm:mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to all articles</span>
            </Link>

            {/* Meta Tags line */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-5 select-none">
              <span className="inline-flex items-center gap-1.5 text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatDateLong(article.published_at)}</span>
              </span>

              {article.read_time && (
                <>
                  <span className="text-gray-300">&middot;</span>
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{article.read_time}</span>
                  </span>
                </>
              )}
            </div>

            {/* Article Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141414] leading-[1.08] mb-6">
              {article.title}
            </h1>

            {/* Description Subtitle */}
            {article.description && (
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed font-normal mb-8 max-w-4xl">
                {article.description}
              </p>
            )}

            {/* Author Profile Bar + Share Trigger */}
            <div className="pt-6 pb-2 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = '/ghiffa.png';
                  }}
                />
                <div>
                  <div className="text-sm font-semibold text-[#141414] flex items-center gap-1.5">
                    <span>{authorName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Verified author" />
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    Fullstack Web Developer &amp; IoT Engineer
                  </p>
                </div>
              </div>

              {/* Share Button Pill */}
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-mono px-4 py-2 rounded-full border border-gray-200 hover:border-black text-gray-700 hover:text-black transition-all cursor-pointer shadow-2xs select-none active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Article Cover Image - Natural height and spacious */}
        {article.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
            <ScrollReveal delay={0.1} y={24}>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-black/5 shadow-xs">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full max-h-[640px] object-cover sm:object-center"
                />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* Article Content Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 pb-20">
          <div className="prose-portfolio">
            {processedContent.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: processedContent.content }} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {processedContent.content}
              </ReactMarkdown>
            )}
          </div>

          {/* End of article actions */}
          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs font-mono text-gray-500">
              Published on <span className="font-semibold text-black">{formatDateLong(article.published_at)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-mono px-4 py-2 rounded-full bg-[#141414] text-white hover:bg-[#2c2c2c] transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>

              <Link
                to="/articles"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-mono px-4 py-2 rounded-full border border-gray-200 hover:border-black text-gray-700 hover:text-black transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </Link>
            </div>
          </div>
        </article>

        {/* More Articles Section */}
        {moreArticles.length > 0 && (
          <section className="border-t border-gray-100 bg-[#FAFAFA] py-16 sm:py-20">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#FF5500] block mb-1">
                    Continue Reading
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
                    more articles
                  </h2>
                </div>

                <Link
                  to="/articles"
                  className="text-xs font-mono text-gray-600 hover:text-black inline-flex items-center gap-1 font-medium"
                >
                  <span>Explore all</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {moreArticles.map((otherArticle, idx) => (
                  <Link
                    key={otherArticle.id || idx}
                    to={`/article/${otherArticle.slug}`}
                    className="group bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-gray-400 hover:shadow-xs transition-all flex flex-col"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-black/5">
                      {otherArticle.cover_image ? (
                        <img
                          src={otherArticle.cover_image}
                          alt={otherArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/30 font-mono text-xs">
                          ghiffa.dev
                        </div>
                      )}
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                      {formatDate(otherArticle.published_at)}
                    </span>

                    <h3 className="text-base font-semibold text-[#141414] group-hover:text-[#FF5500] transition-colors line-clamp-2 mb-2 leading-snug">
                      {otherArticle.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto pt-1">
                      {otherArticle.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Reusable Portfolio Footer */}
      <PortfolioFooter emailAddress={email} />

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-2xl border border-gray-200 shadow-2xl p-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400">
                  Share Article
                </p>
                <h3 className="text-sm font-semibold text-[#141414] line-clamp-1 mt-0.5">
                  {article.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Share Targets */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + '\n' + articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">Twitter/X</span>
              </a>

              {/* Instagram DM */}
              <a
                href="instagram://direct-v2"
                onClick={(e) => {
                  navigator.clipboard.writeText(articleUrl);
                  setIgDmCopied(true);
                  setTimeout(() => setIgDmCopied(false), 2500);
                  setTimeout(() => {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    if (!isMobile) {
                      e.preventDefault();
                      window.open('https://www.instagram.com/direct/inbox/', '_blank');
                    }
                  }, 200);
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-pink-50 text-[#E1306C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-gray-600">
                  {igDmCopied ? 'Copied!' : 'IG DM'}
                </span>
              </a>

              {/* Native / Device Share */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.description,
                      url: articleUrl,
                    }).then(() => setShowShareModal(false)).catch(() => {});
                  } else {
                    handleCopyLink();
                    setIgStoryCopied(true);
                    setTimeout(() => setIgStoryCopied(false), 2500);
                  }
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-[10px] text-gray-600">
                  {igStoryCopied ? 'Copied!' : 'More'}
                </span>
              </button>
            </div>

            {/* Copy Link Input Bar */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
              <input
                type="text"
                readOnly
                value={articleUrl}
                className="bg-transparent text-xs font-mono text-gray-600 flex-1 outline-none truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-black text-white hover:bg-[#2c2c2c] transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
