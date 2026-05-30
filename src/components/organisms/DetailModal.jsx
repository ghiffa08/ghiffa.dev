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
      <div className="sticky top-0 w-full px-6 py-4 flex justify-between items-center bg-[#FAFAFA]/95 backdrop-blur-md z-50 hairline-b">
        <div className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          {activeDetail.type === 'project' ? 'Featured Project' : 'Editorial Article'}
        </div>
        <button 
          onClick={() => setActiveDetail(null)} 
          className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] hover:text-[#666666] transition-colors flex items-center gap-2 group uppercase"
        >
          Close <span className="group-hover:rotate-90 transition-transform text-base md:text-lg leading-none">✕</span>
        </button>
      </div>

      {/* Modal Content - Magazine Layout */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Title & Meta Data Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
          <div className="md:col-span-8 lg:col-span-9">
            <h1 className={`text-5xl md:text-[6vw] leading-[0.9] tracking-tighter uppercase ${activeDetail.type === 'article' ? 'font-serif-editorial font-bold normal-case' : 'font-black'}`}>
              {activeDetail.title}
            </h1>
          </div>
          <div className="md:col-span-4 lg:col-span-3 font-mono text-[10px] md:text-xs uppercase md:border-l border-[#E5E5E5] pt-6 md:pt-0 md:pl-8 space-y-8 tracking-widest">
            {activeDetail.type === 'project' ? (
              <>
                <div>
                  <p className="text-gray-400 mb-1">CLIENT</p>
                  <p className="font-bold text-[#111111]">{activeDetail.client || activeDetail.category || 'Personal'}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">YEAR</p>
                  <p className="font-bold text-[#111111]">{activeDetail.year || new Date().getFullYear()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">TECH STACK</p>
                  <p className="font-bold text-[#666666]">{activeDetail.stack ? activeDetail.stack.join(', ') : ''}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400 mb-1">PUBLISHED</p>
                  <p className="font-bold text-[#111111]">{activeDetail.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">READ TIME</p>
                  <p className="font-bold text-[#111111]">{activeDetail.readTime || '5 min'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="w-full h-[40vh] md:h-[70vh] bg-[#E5E5E5] mb-16 overflow-hidden border border-[#E5E5E5] p-1 shadow-sm group">
          <img 
            src={activeDetail.img} 
            alt={activeDetail.title} 
            loading="lazy"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
          />
        </div>

        {/* Article Content - Split Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 hairline-t pt-16">
          {/* Left Pull-Quote / Abstract */}
          <div className="md:col-span-4 lg:col-span-3">
            <p className="text-xl md:text-2xl font-serif-editorial font-medium italic leading-relaxed text-gray-900 border-l-4 border-[#111111] pl-6 py-2">
              "{activeDetail.desc}"
            </p>
            {activeDetail.link && (
              <div className="mt-16 hidden md:block">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#666666] transition-colors border-b border-[#111111] hover:border-[#666666] pb-1">
                  <span>Visit Live Link</span>
                  <span className="text-sm leading-none">↗</span>
                </a>
              </div>
            )}
          </div>
          
          {/* Right Body Text */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Magazine Layout for both Projects & Articles */}
            <div className="columns-1 md:columns-2 gap-12 text-base md:text-lg text-gray-700 leading-relaxed drop-cap text-justify prose md:prose-lg max-w-none prose-p:font-sans prose-headings:font-sans prose-a:text-[#666666] hover:prose-a:text-[#111111] transition-colors">
              <ReactMarkdown>{activeDetail.content || ''}</ReactMarkdown>
            </div>
            
            {/* Mobile Link Fallback */}
            {activeDetail.link && (
              <div className="mt-12 md:hidden">
                <a href={activeDetail.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase hover:text-[#666666] transition-colors border-b border-[#111111] hover:border-[#666666] pb-1">
                  <span>Visit Live Link</span>
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
