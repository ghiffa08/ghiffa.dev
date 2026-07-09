import { useTranslation } from 'react-i18next';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import ReactMarkdown from 'react-markdown';

export function AboutSection() {
  const { t } = useTranslation();
  const { data: info, isLoading, error } = useSupabaseSingle('personal_info');

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

  const translatedAboutContent = t('personal.about_content', info.about_content);
  
  let mainText = 'Transforming your digital ideas into scalable reality.';
  let subText = '';

  const paragraphs = (translatedAboutContent || '').split(/\n\n+/).filter(p => p.trim() !== '');
  if (paragraphs.length > 0) {
    // Left side: first paragraph without any markdown symbols (like bold/asterisks)
    mainText = paragraphs[0].replace(/[*_#`~\-]/g, '').trim();
    // Right side: the remaining paragraphs as markdown content
    subText = paragraphs.slice(1).join('\n\n');
  }

  return (
    <section id="about" className="py-16 md:py-24 hairline-t scroll-fade bg-white">
      <SectionHeader number="01" title={t('about.title')} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 px-6 md:px-12 items-start">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.2] mb-8 text-[#111111]">
            {mainText}
          </h2>
          {/* Profile Capsule Badge */}
          <div className="inline-flex items-center gap-3 bg-[#FAFAFA] rounded-full px-4 py-2 border border-[#E5E5E5]">
            <span className="font-mono text-sm text-gray-400">+</span>
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white font-serif-editorial italic text-sm">
              {info.full_name ? info.full_name.charAt(0) : 'H'}
            </div>
            <span className="font-mono text-sm text-gray-400">*</span>
          </div>
        </div>
        
        <div className="md:col-span-6 lg:col-span-7 lg:pl-12">
          <div className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 text-justify md:text-left prose prose-neutral max-w-none 
            [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>ul>li]:pl-1 
            [&>strong]:font-bold [&>strong]:text-[#111111] 
            [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-6 [&>ol>li]:mb-3 [&>p]:mb-6">
            <ReactMarkdown>{subText}</ReactMarkdown>
          </div>
          
          <a 
            href={info.cv_url || '#'} 
            target={info.cv_url ? '_blank' : '_self'}
            rel="noreferrer"
            className="inline-flex items-center gap-3 border-b-2 border-[#111111] pb-1 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#666666] hover:border-[#666666] transition-colors"
          >
            <span>{t('about.downloadResume')}</span>
            <span className="text-sm leading-none">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
