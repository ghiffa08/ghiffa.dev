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
  const { ref: leftRef, isInView: leftInView } = useScrollAnimation({ margin: '0px' });
  const { ref: rightRef, isInView: rightInView } = useScrollAnimation({ margin: '0px' });

  if (isLoading) {
    return (
      <section id="about" className="py-24 md:py-32 hairline-t scroll-fade bg-white px-6 md:px-12">
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
    // Left side: first paragraph without any markdown symbols (like bold/asterisks)
    mainText = paragraphs[0].replace(/[*_#`~-]/g, '').trim();
    // Right side: the remaining paragraphs as markdown content
    subText = paragraphs.slice(1).join('\n\n');
  }

  return (
    <section id="about" className="relative z-10 w-full h-auto bg-white border-t border-gray-200 flex flex-col overflow-hidden scroll-fade">
      
      {/* 1. CONTENT AREA: Breathes naturally, pushes marquee down */}
      <div className="container mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-16 md:pb-20 flex-grow flex flex-col justify-start relative z-20 bg-white">
        <SectionHeader number="01" title={t('about.title')} />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 px-6 md:px-12 items-start mt-4 md:mt-10">
          <motion.div 
            ref={leftRef}
            initial={{ opacity: 0, x: -30 }}
            animate={leftInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:col-span-5 lg:col-span-5 md:pr-12"
          >
            <h2 className="text-3xl md:text-3xl lg:text-[40px] font-medium tracking-tighter leading-[1.1] mb-10 text-[#111111] text-justify md:text-left">
              {mainText}
            </h2>
            
            {/* Profile Photo - Editorial Portrait */}
            <div className="w-full max-w-[260px] mx-auto mt-10 md:mt-16">
              <div className="aspect-square bg-gray-100 overflow-hidden relative group border border-[#E5E5E5]">
                <img 
                  src="/ghiffa.jpeg" 
                  alt={`${info.full_name || 'Haikal Jibran Al-Ghiffarry'}, ${info.role || 'IoT Engineer & Full-stack Developer'}`} 
                  title={`${info.full_name || 'Haikal Jibran Al-Ghiffarry'} - Profile`}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/400x400/E5E5E5/111111?text=ADD+PHOTO";
                  }}
                />
              </div>
              {/* Journalistic Caption */}
              <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex flex-col gap-1.5 text-center md:text-left">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#111111] font-bold">
                  {info.full_name || 'Haikal Jibran'}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#666666] leading-relaxed">
                  {info.role || 'System Architect'}
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            ref={rightRef}
            initial={{ opacity: 0, x: 30 }}
            animate={rightInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="md:col-span-7 lg:col-span-7 md:pl-12 md:border-l border-[#E5E5E5] h-full"
          >
            <div className="drop-cap text-sm md:text-base text-[#333333] leading-[1.8] mb-12 text-justify prose prose-neutral max-w-prose 
              [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>ul>li]:pl-1 [&>ul>li]:marker:text-[#111111]
              [&>strong]:font-bold [&>strong]:text-[#111111] 
              [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-6 [&>ol>li]:mb-3 [&>p]:mb-6">
              <ReactMarkdown>{subText}</ReactMarkdown>
            </div>
            
            <div className="pt-8 border-t border-[#E5E5E5] inline-block w-full max-w-prose">
              <button 
                onClick={onDownloadCV}
                className="inline-flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-[#111111] flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                  <span className="font-mono text-sm leading-none">↓</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#666666] transition-colors">
                    {t('about.downloadResume')}
                  </span>
                  <span className="text-[10px] text-[#666666] uppercase tracking-widest mt-1">
                    PDF FORMAT
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. SLANTED MARQUEE AREA: Positioned at the bottom */}
      <div className="w-full mt-auto pt-4 pb-12 md:pb-16 relative z-10">
        {/* The transform rotates the banner and scales it slightly so corners don't show gaps */}
        <div className="transform -rotate-2 scale-[1.05]">
          {info?.skills ? (
            <VelocityScroll baseVelocity={0.5} text={info.skills.join(" • ")} />
          ) : (
            <div className="py-4 border-y border-gray-200 bg-white font-bold uppercase text-center">LOADING STACK...</div>
          )}
        </div>
      </div>

    </section>
  );
}
