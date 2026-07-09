import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { SEO } from '../atoms/SEO';
import { slugify } from '../../utils/slugify';

export function DetailModal({ activeDetail, setActiveDetail }) {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (activeDetail) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      setActiveSlide(0); // Reset slide on open
    } else {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    }
    const modalElement = document.getElementById('detail-modal');
    if (modalElement) modalElement.scrollTop = 0;
  }, [activeDetail]);

  if (!activeDetail) return null;

  const isProject = activeDetail.type === 'project';
  const prefix = isProject ? 'project' : 'article';
  const slug = slugify(activeDetail.title || '');

  const titleKey = `${prefix}.${slug}.title`;
  const descKey = `${prefix}.${slug}.description`;
  const contentKey = `${prefix}.${slug}.content`;
  const clientKey = isProject ? `${prefix}.${slug}.client` : '';
  const categoryKey = isProject ? `${prefix}.${slug}.category` : '';

  const images = Array.isArray(activeDetail.image_urls) && activeDetail.image_urls.length > 0 
    ? activeDetail.image_urls 
    : (activeDetail.img ? [activeDetail.img] : (activeDetail.image_url ? [activeDetail.image_url] : []));

  const handleScroll = (e) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollPosition / width);
      setActiveSlide(index);
    }
  };

  const slideLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const schema = isProject 
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": t(titleKey, activeDetail.title),
        "description": t(descKey, activeDetail.desc),
        "image": images[0] || '',
        "programmingLanguage": activeDetail.stack,
        "author": {
          "@type": "Person",
          "name": "Haikal Jibran Al Ghiffarry"
        }
      }
    : {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": t(titleKey, activeDetail.title),
        "description": t(descKey, activeDetail.desc),
        "image": images[0] || '',
        "datePublished": activeDetail.published_at || activeDetail.date,
        "author": {
          "@type": "Person",
          "name": "Haikal Jibran Al Ghiffarry"
        }
      };

  return (
    <div id="detail-modal" data-lenis-prevent="true" className="fixed inset-0 z-[100] bg-[#FAFAFA] text-[#111111] overflow-y-auto animate-fade-in">
      <SEO 
        title={t(titleKey, activeDetail.title)} 
        description={t(descKey, activeDetail.desc)} 
        image={images[0] || ''}
        type={activeDetail.type === 'article' ? 'article' : 'website'}
        publishedDate={activeDetail.published_at || activeDetail.date}
        jsonLd={schema}
      />
      
      {/* Modal Header Navbar */}
      <div className="sticky top-0 w-full px-6 py-4 flex justify-between items-center bg-[#FAFAFA]/95 backdrop-blur-md z-50 hairline-b">
        <div className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          {isProject ? t('detail.featuredProject') : t('detail.editorialArticle')}
        </div>
        <button 
          onClick={() => setActiveDetail(null)} 
          className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] hover:text-[#666666] transition-colors flex items-center gap-2 group uppercase"
        >
          {t('detail.close')} <span className="group-hover:rotate-90 transition-transform text-base md:text-lg leading-none">✕</span>
        </button>
      </div>

      {/* Modal Content - Magazine Layout */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Title & Meta Data Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
          <div className="md:col-span-8 lg:col-span-9">
            <h1 className={`text-5xl md:text-[6vw] leading-[0.9] tracking-tighter uppercase ${activeDetail.type === 'article' ? 'font-serif-editorial font-bold normal-case' : 'font-black'}`}>
              {t(titleKey, activeDetail.title)}
            </h1>
          </div>
          <div className="md:col-span-4 lg:col-span-3 font-mono text-[10px] md:text-xs uppercase md:border-l border-[#E5E5E5] pt-6 md:pt-0 md:pl-8 space-y-8 tracking-widest">
            {isProject ? (
              <>
                <div>
                  <p className="text-gray-400 mb-1">{t('detail.client')}</p>
                  <p className="font-bold text-[#111111]">{t(clientKey, activeDetail.client) || t(categoryKey, activeDetail.category) || 'Personal'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">{t('detail.year')}</p>
                  <p className="font-bold text-[#111111]">{activeDetail.year || new Date().getFullYear()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">{t('detail.techStack')}</p>
                  <p className="font-bold text-[#666666]">{activeDetail.stack ? activeDetail.stack.join(', ') : ''}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400 mb-1">{t('detail.published')}</p>
                  <p className="font-bold text-[#111111]">{activeDetail.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">{t('detail.readTime')}</p>
                  <p className="font-bold text-[#111111]">{activeDetail.readTime || '5 min'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Block / Editorial Snap Carousel */}
        <div className="w-full h-[40vh] md:h-[70vh] mb-16 border border-[#E5E5E5] p-1 bg-[#FAFAFA] relative group">
          {images.length > 0 ? (
            <>
              {/* Snap Container */}
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
              >
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="w-full h-full shrink-0 snap-start bg-[#E5E5E5]">
                    <img 
                      src={imgUrl} 
                      alt={`${t(titleKey, activeDetail.title)} - slide ${idx + 1}`} 
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next Minimal Buttons */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={slideLeft}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-black hover:text-white transition-all border border-[#E5E5E5] flex items-center justify-center font-mono text-sm shadow-sm md:opacity-0 group-hover:opacity-100 duration-300 z-10"
                  >
                    ←
                  </button>
                  <button 
                    onClick={slideRight}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-black hover:text-white transition-all border border-[#E5E5E5] flex items-center justify-center font-mono text-sm shadow-sm md:opacity-0 group-hover:opacity-100 duration-300 z-10"
                  >
                    →
                  </button>
                  
                  {/* Monospace Paginated Slide counter */}
                  <div className="absolute bottom-6 right-6 bg-[#111111] text-[#FAFAFA] font-mono text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-bold shadow-md z-10">
                    [ {activeSlide + 1} / {images.length} ]
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-[#E5E5E5] flex items-center justify-center font-mono text-xs text-gray-400">
              NO IMAGE AVAILABLE
            </div>
          )}
        </div>

        {/* Article Content - Split Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 hairline-t pt-16">
          {/* Left Pull-Quote / Abstract */}
          <div className="md:col-span-4 lg:col-span-3">
            <p className="text-xl md:text-2xl font-serif-editorial font-medium italic leading-relaxed text-gray-900 border-l-4 border-[#111111] pl-6 py-2">
              "{t(descKey, activeDetail.desc)}"
            </p>
            {activeDetail.link && (
              <div className="mt-16 hidden md:block">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#666666] transition-colors border-b border-[#111111] hover:border-[#666666] pb-1">
                  <span>{t('detail.visitLive')}</span>
                  <span className="text-sm leading-none">↗</span>
                </a>
              </div>
            )}
          </div>
          
          {/* Right Body Text */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Magazine Layout for both Projects & Articles */}
            <div className="columns-1 md:columns-2 gap-12 text-base md:text-lg text-gray-700 leading-relaxed drop-cap text-justify prose md:prose-lg max-w-none prose-p:font-sans prose-headings:font-sans prose-a:text-[#666666] hover:prose-a:text-[#111111] transition-colors">
              <ReactMarkdown>{t(contentKey, activeDetail.content) || ''}</ReactMarkdown>
            </div>
            
            {/* Mobile Link Fallback */}
            {activeDetail.link && (
              <div className="mt-12 md:hidden">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#666666] transition-colors border-b border-[#111111] hover:border-[#666666] pb-1">
                  <span>{t('detail.visitLive')}</span>
                  <span className="text-sm leading-none">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
