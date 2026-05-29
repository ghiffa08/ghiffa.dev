import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SEO } from '../atoms/SEO';

export function DetailModal({ activeDetail, setActiveDetail }) {
  useEffect(() => {
    if (activeDetail) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = 'auto';
      if (window.lenis) window.lenis.start();
    }
    const modalElement = document.getElementById('detail-modal');
    if (modalElement) modalElement.scrollTop = 0;
  }, [activeDetail]);

  if (!activeDetail) return null;

  const schema = activeDetail.type === 'project' 
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": activeDetail.title,
        "description": activeDetail.desc,
        "image": activeDetail.img,
        "programmingLanguage": activeDetail.stack,
        "author": {
          "@type": "Person",
          "name": "Haikal Jibran Al Ghiffarry"
        }
      }
    : {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": activeDetail.title,
        "description": activeDetail.desc,
        "image": activeDetail.img,
        "datePublished": activeDetail.published_at || activeDetail.date,
        "author": {
          "@type": "Person",
          "name": "Haikal Jibran Al Ghiffarry"
        }
      };

  return (
    <div id="detail-modal" data-lenis-prevent="true" className="fixed inset-0 z-[100] bg-[#FAFAFA] text-[#111111] overflow-y-auto animate-fade-in">
      <SEO 
        title={activeDetail.title} 
        description={activeDetail.desc} 
        image={activeDetail.img}
        type={activeDetail.type === 'article' ? 'article' : 'website'}
        publishedDate={activeDetail.published_at || activeDetail.date}
        jsonLd={schema}
      />
      
      {/* Modal Header Navbar */}
      <div className="sticky top-0 w-full p-4 md:p-6 flex justify-between items-center bg-[#FAFAFA]/95 backdrop-blur-md z-50 hairline-b">
        <div className="font-mono text-xs font-bold tracking-wider">
          {activeDetail.type === 'project' ? '[ FEATURED PROJECT ]' : '[ EDITORIAL ARTICLE ]'}
        </div>
        <button 
          onClick={() => setActiveDetail(null)} 
          className="font-mono text-xs font-bold tracking-wider hover:text-[#3B82F6] transition-colors group flex items-center gap-2"
        >
          [ CLOSE ] <span className="group-hover:rotate-90 transition-transform text-lg leading-none">✕</span>
        </button>
      </div>

      {/* Modal Content - Magazine Layout */}
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-24">
        
        {/* Title & Meta Data Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-12 md:mb-20">
          <div className="md:col-span-8 lg:col-span-9">
            <h1 className="text-5xl md:text-8xl lg:text-[8vw] font-black tracking-tighter uppercase leading-[0.85]">
              {activeDetail.title}
            </h1>
          </div>
          <div className="md:col-span-4 lg:col-span-3 font-mono text-xs uppercase border-t md:border-t-0 md:border-l border-[#111111] pt-6 md:pt-0 md:pl-6 space-y-6">
            {activeDetail.type === 'project' ? (
              <>
                <div>
                  <p className="text-gray-400 mb-1">CLIENT</p>
                  <p className="font-bold">{activeDetail.client}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">ROLE / YEAR</p>
                  <p className="font-bold">Fullstack Dev — {activeDetail.year}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">TECH STACK</p>
                  <p className="font-bold text-[#3B82F6]">{activeDetail.stack ? activeDetail.stack.join(', ') : ''}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400 mb-1">PUBLISHED</p>
                  <p className="font-bold">{activeDetail.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">READ TIME</p>
                  <p className="font-bold">{activeDetail.readTime}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="w-full h-[50vh] md:h-[75vh] bg-gray-200 mb-16 overflow-hidden relative group">
          <img 
            src={activeDetail.img} 
            alt={activeDetail.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
          />
        </div>

        {/* Article Content - Split Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-[#111111] pt-12">
          {/* Left Pull-Quote / Abstract */}
          <div className="md:col-span-4 lg:col-span-3">
            <p className="text-xl md:text-2xl font-serif-editorial font-medium italic leading-snug text-gray-900 border-l-4 border-[#3B82F6] pl-6">
              "{activeDetail.desc}"
            </p>
            {activeDetail.link && (
              <div className="mt-12 hidden md:block">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-block font-mono text-xs border-b border-[#111111] pb-1 font-bold uppercase hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors">
                  [ VISIT LIVE LINK ↗ ]
                </a>
              </div>
            )}
          </div>
          
          {/* Right Body Text */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Magazine Layout for both Projects & Articles */}
            <div className="columns-1 md:columns-2 gap-12 text-base md:text-lg text-gray-800 leading-relaxed drop-cap text-justify prose prose-lg max-w-none prose-p:font-sans prose-headings:font-sans prose-a:text-[#3B82F6] hover:prose-a:text-[#111111] transition-colors">
              <ReactMarkdown>{activeDetail.content}</ReactMarkdown>
            </div>
            
            {/* Mobile Link Fallback */}
            {activeDetail.link && (
              <div className="mt-12 md:hidden">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-block font-mono text-xs border-b border-[#111111] pb-1 font-bold uppercase hover:text-[#3B82F6] hover:border-[#3B82F6] transition-colors">
                  [ VISIT LIVE LINK ↗ ]
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
