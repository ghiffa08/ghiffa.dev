import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { SEO } from '../components/atoms/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Format ISO timestamp into long readable format (e.g. "10 July 2026").
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

export default function ArticleDetailPage() {
  useSmoothScroll();
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: settings } = useSupabaseSingle('general_settings');

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [igStoryCopied, setIgStoryCopied] = useState(false);
  const [igDmCopied, setIgDmCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await ArticleRepository.getArticleBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchArticle();
  }, [slug]);

  const appName = settings?.app_name || 'ghiffa.dev';

  if (loading) {
    return (
      <>
        <main className="relative w-full z-10 min-h-screen flex flex-col items-center justify-center selection:bg-[#111111] selection:text-[#FAFAFA]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#111111] animate-pulse">
              Loading Article...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <main className="relative w-full z-10 min-h-screen flex flex-col items-center justify-center selection:bg-[#111111] selection:text-[#FAFAFA]">
          <Header />
          <div className="flex flex-col items-center gap-6 pt-32">
            <h1 className="text-6xl md:text-8xl font-serif-editorial font-bold tracking-tight text-[#E5E5E5]">404</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[#666666] font-bold">
              Article not found
            </p>
            <Link
              to="/articles"
              className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#111111] border border-[#111111] px-6 py-3 hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300"
            >
              ← {t('articles.back')}
            </Link>
          </div>
        </main>
      </>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.cover_image,
    "datePublished": article.published_at,
    "author": {
      "@type": "Person",
      "name": "Haikal Jibran Al Ghiffarry",
      "url": "https://ghiffa.dev"
    }
  };

  const articleUrl = `https://ghiffa.dev/article/${article.slug}`;

  return (
    <>
      <SEO
        title={`${article.title} — ${appName}`}
        description={article.description}
        image={article.cover_image}
        url={articleUrl}
        type="article"
        publishedDate={article.published_at}
        jsonLd={articleSchema}
      />

      <style dangerouslySetInnerHTML={{__html: `
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
        
        ::selection { background: var(--text-dark); color: var(--bg-light); }

        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .article-content h1 { font-family: 'Playfair Display', serif; font-size: 2.25rem; font-weight: 700; margin: 2.75rem 0 1.25rem; color: #111111; line-height: 1.25; }
        .article-content h2 { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 700; margin: 2.5rem 0 1rem; color: #111111; line-height: 1.3; }
        .article-content h3 { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; color: #111111; }
        .article-content p { margin: 0 0 1.75rem; line-height: 1.85; color: #222222; font-size: 1.125rem; font-weight: 300; }
        .article-content ul, .article-content ol { margin: 0 0 1.75rem; padding-left: 1.75rem; color: #222222; font-size: 1.125rem; font-weight: 300; }
        .article-content li { margin-bottom: 0.6rem; line-height: 1.8; }
        .article-content strong, .article-content b { font-weight: 700; color: #111111; }
        .article-content em, .article-content i { font-style: italic; }
        .article-content blockquote { border-left: 3px solid #111111; margin: 2.25rem 0; padding: 1.25rem 1.75rem; background: #F5F5F5; font-style: italic; color: #444444; font-size: 1.15rem; }
        .article-content code { font-family: 'JetBrains Mono', monospace; background: #F0F0F0; padding: 0.15rem 0.45rem; font-size: 0.9rem; border: 1px solid #E5E5E5; }
        .article-content pre { background: #111111; color: #FAFAFA; padding: 1.5rem; overflow-x: auto; margin: 2rem 0; border: 1px solid #333; }
        .article-content pre code { background: transparent; border: none; color: inherit; padding: 0; }
        .article-content img { max-width: 100%; height: auto; margin: 2.5rem 0; border: 1px solid #E5E5E5; }
        .article-content a { color: #111111; text-decoration: underline; text-underline-offset: 4px; transition: color 0.2s; }
        .article-content a:hover { color: #666666; }
        .article-content hr { border: none; border-top: 1px solid #E5E5E5; margin: 3rem 0; }
        .article-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.9375rem; overflow-x: auto; display: block; }
        .article-content th, .article-content td { border: 1px solid #E5E5E5; padding: 0.75rem 1rem; text-align: left; }
        .article-content th { background: #F5F5F5; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .article-content iframe, .article-content div[data-youtube-video] > iframe { width: 100%; aspect-ratio: 16 / 9; margin: 2.5rem 0; border: 1px solid #E5E5E5; display: block; }

        .drop-cap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem;
          font-weight: 700;
          float: left;
          line-height: 0.8;
          padding-right: 0.75rem;
          padding-top: 0.25rem;
          color: #111111;
        }
      `}} />

      <main className="relative w-full z-10 min-h-screen flex flex-col selection:bg-[#111111] selection:text-[#FAFAFA]">
        <Header />

        {/* Back Navigation */}
        <div className="w-full pt-28 md:pt-32 bg-[#FAFAFA]">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#666666] hover:text-[#111111] transition-colors pb-6 border-b border-transparent hover:border-[#111111]"
            >
              ← {t('articles.back')}
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="w-full">
          <section className="w-full bg-[#FAFAFA] pt-6 pb-10 md:pt-8 md:pb-12">
            <div className="max-w-3xl mx-auto px-6 md:px-8 animate-fade-in">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                {formatDate(article.published_at)}
              </span>
              <span className="w-1 h-1 bg-[#E5E5E5] rounded-full"></span>
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">
                {article.read_time}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif-editorial font-bold tracking-tight leading-[1.12] text-[#111111] mb-6">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#666666] leading-relaxed font-light">
              {article.description}
            </p>
          </div>
        </section>

        {/* Cover Image */}
        <section className="w-full bg-[#FAFAFA] pb-8 md:pb-12">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <div className="w-full aspect-[16/9] overflow-hidden bg-[#E5E5E5] border border-[#E5E5E5]">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
                fetchpriority="high"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="w-full bg-[#FAFAFA] py-8 md:py-12 flex-1">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <div className="article-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-[#E5E5E5]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666666] font-bold mb-1">
                    {t('detail.published')}
                  </p>
                  <p className="text-sm text-[#111111]">
                    {formatDateLong(article.published_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="inline-flex items-center justify-center border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 cursor-pointer"
                  >
                    SHARE ARTICLE
                  </button>
                  <Link
                    to="/articles"
                    className="inline-flex items-center justify-center border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3"
                  >
                    ← {t('articles.back')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        </article>

        <Footer />
      </main>

      {/* ── SHARE MODAL ─────────────────────────────────── */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center"
          onClick={() => setShowShareModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-none border-t sm:border border-[#E5E5E5] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F0F0F0]">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#999999] mb-1">Bagikan artikel</p>
                <h3 className="font-serif-editorial text-xl font-bold text-[#111111] leading-tight line-clamp-1">{article.title}</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#999999] hover:text-[#111111] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Share Options */}
            <div className="px-6 py-5 grid grid-cols-4 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + '\n' + articleUrl)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#F5F5F5] group-hover:bg-[#25D366]/10 rounded-2xl transition-colors">
                  <svg className="w-7 h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">WhatsApp</span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShowShareModal(false)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#F5F5F5] group-hover:bg-black/10 rounded-2xl transition-colors">
                  <svg className="w-6 h-6 text-[#111111]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">Twitter</span>
              </a>

              {/* IG DM — pakai anchor href dengan deep link, bukan window.location */}
              <a
                href="instagram://direct-v2"
                onClick={(e) => {
                  navigator.clipboard.writeText(articleUrl);
                  setIgDmCopied(true);
                  setTimeout(() => setIgDmCopied(false), 3000);
                  // Fallback ke web jika deep link gagal (desktop)
                  setTimeout(() => {
                    const ua = navigator.userAgent;
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
                    if (!isMobile) {
                      e.preventDefault();
                      window.open('https://www.instagram.com/direct/inbox/', '_blank');
                    }
                  }, 200);
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#F5F5F5] group-hover:bg-[#E1306C]/10 rounded-2xl transition-colors">
                  <svg className="w-7 h-7 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">
                  {igDmCopied ? 'TERSALIN!' : 'IG DM'}
                </span>
              </a>

              {/* IG Story / Native Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.description,
                      url: articleUrl,
                    }).then(() => setShowShareModal(false)).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(articleUrl);
                    setIgStoryCopied(true);
                    setTimeout(() => setIgStoryCopied(false), 3000);
                  }
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#F5F5F5] group-hover:bg-purple-50 rounded-2xl transition-colors">
                  <svg className="w-6 h-6 text-[#833AB4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                </div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#666666]">
                  {igStoryCopied ? 'TERSALIN!' : 'IG Story'}
                </span>
              </button>
            </div>

            {/* Copy Link Row */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 bg-[#F8F8F8] border border-[#EBEBEB] rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-[#999999] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <p className="flex-1 font-mono text-[10px] text-[#666666] truncate">{articleUrl}</p>
                <button
                  onClick={handleCopyLink}
                  className="flex-shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#111111] hover:text-[#666666] transition-colors"
                >
                  {copied ? '✓ DISALIN' : 'SALIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

