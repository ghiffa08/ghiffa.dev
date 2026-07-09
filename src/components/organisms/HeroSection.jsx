import { useTranslation } from 'react-i18next';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function HeroSection() {
  const { t } = useTranslation();
  const { data: info, isLoading, error } = useSupabaseSingle('personal_info');

  if (isLoading) {
    return (
      <section className="min-h-screen w-full flex flex-col justify-center pb-12 pt-32 px-6 md:px-12 relative">
        <div className="max-w-screen-2xl w-full mx-auto">
          <div className="w-full max-w-3xl h-[10vw] md:h-[7.5vw] lg:h-[120px] bg-gray-200 animate-pulse mb-4"></div>
          <div className="w-[85%] max-w-2xl h-[10vw] md:h-[7.5vw] lg:h-[120px] bg-gray-200 animate-pulse"></div>
          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-5 lg:col-span-4 flex items-center gap-4">
              <div className="w-48 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="md:col-span-7 lg:col-span-8 md:pl-12 lg:border-l border-[#E5E5E5]">
              <div className="w-full max-w-lg h-16 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !info) {
    return <section className="min-h-[100svh] flex items-center justify-center text-gray-400 font-mono text-sm uppercase tracking-widest px-6 pt-32 pb-16">{error ? 'Error loading data' : 'Please configure Personal Info in Admin'}</section>;
  }

  return (
    <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 md:pb-24 relative">
      <div className="max-w-screen-2xl w-full mx-auto">
        <h1 className="text-6xl sm:text-[10vw] md:text-[9vw] lg:text-[140px] font-black leading-[0.85] tracking-tighter uppercase anim-fade-up text-[#111111] mb-2 max-w-6xl break-words">
          {t(info.headline)}
        </h1>
        
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end anim-fade-up">
          <div className="md:col-span-5 lg:col-span-4 flex items-center gap-4">
            <a href="#contact" className="inline-flex items-center gap-3 rounded-full border border-[#E5E5E5] bg-white px-5 py-3 md:px-8 md:py-4 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:border-[#111111] shadow-sm transition-all duration-300">
              <span>{t('contact.connect')}</span>
            </a>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#111111] text-[#111111] flex items-center justify-center transform -rotate-45 font-mono text-sm hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
              →
            </div>
          </div>
          <div className="md:col-span-7 lg:col-span-8 md:pl-12 lg:border-l border-[#E5E5E5]">
            <p className="text-gray-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-lg">
              <strong className="text-[#111111]">{info.full_name}</strong><br/>
              {t(info.role)}<br/>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
