import { useSupabaseSingle } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';

export function AboutSection() {
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

  const paragraphs = (info.about_content || '').split('\n').filter(p => p.trim() !== '');
  const mainText = paragraphs.length > 0 ? paragraphs[0] : 'Transforming your digital ideas into scalable reality.';
  // Jika paragraf lebih dari 1, gabungkan sisanya jadi subText. Jika hanya 1, biarkan kosong agar tidak duplikat.
  const subText = paragraphs.length > 1 ? paragraphs.slice(1).join('\n') : '';

  return (
    <section id="about" className="py-16 md:py-24 hairline-t scroll-fade bg-white">
      <SectionHeader number="01" title="About & Expertise" />
      
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
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 text-justify md:text-left whitespace-pre-line">
            {subText}
          </p>
          
          <a 
            href={info.cv_url || '#'} 
            target={info.cv_url ? '_blank' : '_self'}
            rel="noreferrer"
            className="inline-flex items-center gap-3 border-b-2 border-[#111111] pb-1 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#666666] hover:border-[#666666] transition-colors"
          >
            <span>Download Resume</span>
            <span className="text-sm leading-none">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
