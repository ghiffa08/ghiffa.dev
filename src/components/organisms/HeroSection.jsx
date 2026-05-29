import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function HeroSection() {
  const { data: hero, isLoading } = useSupabaseSingle('hero_section');

  if (isLoading || !hero) {
    return (
      <section className="min-h-screen w-full flex flex-col justify-end pb-12 pt-32 px-4 md:px-8 relative">
        <div className="w-[80vw] h-[12vw] md:h-[9.5vw] bg-gray-200 animate-pulse mb-4"></div>
        <div className="w-[60vw] h-[12vw] md:h-[9.5vw] bg-gray-200 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 mt-12 md:mt-24">
          <div className="md:col-span-8"></div>
          <div className="md:col-span-4 border-t border-gray-200 pt-4">
            <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full flex flex-col justify-end pb-12 pt-32 px-4 md:px-8 relative">
      <div className="clip-text">
        <h1 className="hero-text-line text-[12vw] md:text-[9.5vw] font-black leading-[0.85] tracking-tighter uppercase text-[#111111]">
          {hero.headline_1}
        </h1>
      </div>
      <div className="clip-text">
        <h1 className="hero-text-line text-[12vw] md:text-[9.5vw] font-black leading-[0.85] tracking-tighter uppercase text-[#111111]">
          {hero.headline_2}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 mt-12 md:mt-24 font-mono text-xs md:text-sm fade-up">
        <div className="md:col-span-8"></div>
        <div className="md:col-span-4 border-t border-[#111111] pt-4">
          <p className="max-w-md leading-relaxed uppercase font-bold text-base md:text-lg">
            {hero.subtitle}
          </p>
          <p className="mt-2 text-gray-500 tracking-wider">
            {hero.role}
          </p>
        </div>
      </div>
    </section>
  );
}
