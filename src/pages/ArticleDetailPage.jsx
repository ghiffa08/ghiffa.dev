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
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
          :root { --bg-light: #FAFAFA; --text-dark: #111111; --border: #E5E5E5; }
          body { background-color: var(--bg-light); color: var(--text-dark); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .font-serif-editorial { font-family: 'Playfair Display', serif; }
          ::selection { background: var(--text-dark); color: var(--bg-light); }
        `}} />
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
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
          :root { --bg-light: #FAFAFA; --text-dark: #111111; --border: #E5E5E5; }
          body { background-color: var(--bg-light); color: var(--text-dark); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
          .font-serif-editorial { font-family: 'Playfair Display', serif; }
          ::selection { background: var(--text-dark); color: var(--bg-light); }
        `}} />
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

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-[#E5E5E5] w-full max-w-md p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-[#666666] hover:text-[#111111] p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <h3 className="font-serif-editorial text-2xl font-bold text-[#111111] mb-6">Share Article</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' - ' + articleUrl)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666]">WhatsApp</span>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666]">X / Twitter</span>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666]">LinkedIn</span>
                </a>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setIgDmCopied(true);
                    setTimeout(() => setIgDmCopied(false), 2000);
                    window.open('https://www.instagram.com/direct/inbox/', '_blank');
                  }}
                  className="flex items-center justify-center gap-2 py-3 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666]">
                    {igDmCopied ? 'COPIED! OPENING IG...' : 'IG DM'}
                  </span>
                </button>
                
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.description,
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      setIgStoryCopied(true);
                      setTimeout(() => setIgStoryCopied(false), 2000);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 border border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group col-span-2"
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666]">
                    {igStoryCopied ? 'LINK COPIED! PASTE IN IG STORY' : 'IG STORY / SHARE'}
                  </span>
                </button>
              </div>

              <div className="border-t border-[#E5E5E5] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666666] font-bold mb-3">Copy Link</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={articleUrl} 
                    className="flex-1 bg-[#FAFAFA] border border-[#E5E5E5] px-3 py-3 font-mono text-xs text-[#666666] outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="px-6 py-3 bg-[#111111] text-[#FAFAFA] font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors min-w-[120px]"
                  >
                    {copied ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
