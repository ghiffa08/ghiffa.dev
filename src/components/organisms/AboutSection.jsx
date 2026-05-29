import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function AboutSection() {
  const { data: about, isLoading } = useSupabaseSingle('about_section');

  if (isLoading || !about) {
    return (
      <section className="hairline-t px-4 md:px-8 py-24 fade-up bg-[#FAFAFA]/90 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-48 h-6 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="md:col-span-8 lg:col-span-7">
            <div className="w-full h-8 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-5/6 h-8 bg-gray-200 animate-pulse mb-12"></div>
            <div className="w-full h-32 bg-gray-200 animate-pulse mb-6"></div>
            <div className="w-48 h-12 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Memisahkan teks berdasarkan newline ganda (jika ada) untuk memisahkan teks utama dan sub-teks
  const paragraphs = (about.content || '').split('\n').filter(p => p.trim() !== '');
  const mainText = paragraphs.length > 0 ? paragraphs[0] : '';
  const subText = paragraphs.length > 1 ? paragraphs.slice(1).join('\n') : '';

  return (
    <section className="hairline-t px-4 md:px-8 py-24 fade-up bg-[#FAFAFA]/90 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">01.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">About & Expertise</h3>
        </div>
        
        <div className="md:col-span-8 lg:col-span-7">
          {/* Teks utama yang diperbesar posisinya */}
          <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-4xl mb-6 text-gray-900 tracking-tight">
            {mainText}
          </p>
          
          {subText && (
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mb-12 text-justify">
              {subText}
            </p>
          )}

          {/* Tombol Download CV - Swiss Minimalist Style */}
          <a 
            href={about.cv_url || '#'} 
            target={about.cv_url ? '_blank' : '_self'}
            rel="noreferrer"
            className="inline-flex items-center space-x-4 bg-[#111111] text-[#FAFAFA] px-8 py-5 hover:bg-[#3B82F6] transition-colors duration-500 group"
          >
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              [ Download CV / Resume ]
            </span>
            <span className="font-mono text-lg transform group-hover:translate-y-1 transition-transform duration-300 leading-none">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
