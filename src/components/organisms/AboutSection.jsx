import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ReactMarkdown from 'react-markdown';
import { VelocityScroll } from '../atoms/VelocityScroll';

export function AboutSection({ onDownloadCV }) {
  const { t, i18n } = useTranslation();
  const { data: info, isLoading, error } = useSupabaseSingle('personal_info');
  const { ref: sectionRef, isInView } = useScrollAnimation({ margin: '-100px' });

  if (isLoading) {
    return (
      <section id="about" className="py-24 md:py-32 hairline-t scroll-fade bg-[#FAFAFA] px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-12"></div>
      </section>
    );
  }

  if (error || !info) {
    return null;
  }

  const currentLang = i18n.language || 'id';
  const dbContent = currentLang === 'en' && info?.about_content_en ? info.about_content_en : info?.about_content;
  const displayContent = dbContent ? dbContent : t('personal.about_content');
  
  let mainText = 'Transforming your digital ideas into scalable reality.';
  let subText = '';

  const paragraphs = (displayContent || '').split(/\n\n+/).filter(p => p.trim() !== '');
  if (paragraphs.length > 0) {
    mainText = paragraphs[0].replace(/[*_#`~-]/g, '').trim();
    subText = paragraphs.slice(1).join('\n\n');
  }

  return (
    <section id="about" className="relative z-10 w-full h-auto bg-[#FAFAFA] pt-12 md:pt-16 flex flex-col overflow-hidden scroll-fade">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeader number="01" title={t('about.title')} />
      </div>

      {/* Main Editorial Content */}
      <motion.div 
        ref={sectionRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col mt-6 md:mt-10 mb-20 md:mb-24"
      >
        {/* Massive Pull Quote spans almost full width */}
        <div className="container mx-auto px-6 md:px-12 mb-10 md:mb-14">
          <h2 className="font-serif-editorial text-[10vw] md:text-[7.5vw] lg:text-[6.5vw] leading-[0.85] text-[#111111] tracking-tighter pr-4 md:pr-12 text-justify">
            <span className="italic">&ldquo;{mainText}&rdquo;</span>
          </h2>
        </div>

        {/* Asymmetrical Split: Photo & Bio */}
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
          
          {/* Left: Bleed Portrait Photo with Rotated Caption */}
          <div className="lg:col-span-5 relative w-full max-w-lg mx-auto lg:mx-0">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#E5E5E5] relative group">
              <img 
                src="/ghiffa.jpeg" 
                alt={`${info.full_name || 'Haikal Jibran'}, ${info.role}`} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/800x1000/E5E5E5/111111?text=EDITORIAL+PORTRAIT";
                }}
              />
            </div>
            {/* Rotated Caption (visible on desktop) */}
            <div className="hidden lg:flex absolute -right-8 bottom-32 rotate-90 origin-bottom-right items-center gap-4 opacity-70">
              <span className="w-16 h-[1px] bg-[#111111]"></span>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-[#111111] whitespace-nowrap">
                {info.full_name || 'Haikal Jibran'} — {info.role || 'Architect'}
              </span>
            </div>
            {/* Mobile Caption */}
            <div className="lg:hidden mt-4 flex items-center justify-center gap-4 opacity-70">
              <span className="w-8 h-[1px] bg-[#111111]"></span>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold text-[#111111]">
                {info.full_name || 'Haikal Jibran'}
              </span>
              <span className="w-8 h-[1px] bg-[#111111]"></span>
            </div>
          </div>

          {/* Right: Multi-column Bio & CTA */}
          <div className="lg:col-span-7 flex flex-col pt-0 lg:pl-12 -mt-2">
            
            {/* Multi-column Markdown Text */}
            <div className="columns-1 md:columns-2 gap-10 text-sm md:text-base text-[#333333] leading-loose text-justify
              first-letter:float-left first-letter:text-[5.5rem] first-letter:font-serif-editorial first-letter:italic first-letter:leading-[0.7] first-letter:pr-4 first-letter:text-[#111111]
              prose prose-neutral max-w-none 
              [&>p]:mt-0 [&>p]:mb-6 md:[&>p]:mb-8 [&>p]:break-inside-avoid
              [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:mb-4 [&>ul>li]:border-b [&>ul>li]:border-[#E5E5E5] [&>ul>li]:pb-2
              [&>strong]:font-bold [&>strong]:text-[#111111] [&>strong]:tracking-tight">
              <ReactMarkdown>{subText}</ReactMarkdown>
            </div>
            
            {/* Elegant Minimal CTA */}
            <div className="mt-12 md:mt-16 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="font-serif-editorial italic text-2xl md:text-3xl text-[#111111]">Curriculum Vitae</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#666666] mt-2">Full professional history (PDF)</span>
              </div>
              
              <button 
                onClick={onDownloadCV}
                className="group relative inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#111111] bg-transparent hover:bg-[#111111] transition-colors duration-500 overflow-hidden shrink-0"
              >
                <div className="font-mono text-xl text-[#111111] group-hover:text-white transition-all duration-500 transform group-hover:translate-y-[150%] absolute">↓</div>
                <div className="font-mono text-xl text-white transition-all duration-500 transform -translate-y-[150%] group-hover:translate-y-0 absolute">↓</div>
              </button>
            </div>

          </div>
        </div>
      </motion.div>

      {/* 2. SLANTED MARQUEE AREA */}
      <div className="w-full mt-auto pt-4 pb-16 md:pb-24 relative z-10 bg-[#FAFAFA]">
        <div className="transform -rotate-2 scale-[1.05]">
          {info?.skills ? (
            <VelocityScroll baseVelocity={0.5} text={info.skills.join(" • ")} />
          ) : (
            <div className="py-4 border-y border-[#111111] bg-[#FAFAFA] font-bold uppercase text-center">LOADING STACK...</div>
          )}
        </div>
      </div>
    </section>
  );
}
