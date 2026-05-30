import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';

export function ArticlesSection({ setActiveDetail, setHoveredArticleImg }) {
  const { data: rawArticles, isLoading, error } = useSupabaseList('articles', {
    eq: { column: 'status', value: 'published' },
    order: { column: 'published_at', ascending: false }
  });

  if (isLoading) {
    return (
      <section id="journal" className="py-16 md:py-24 hairline-t scroll-fade bg-[#FAFAFA] px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-12"></div>
      </section>
    );
  }

  const articles = (rawArticles || []).map((a, index) => ({
    ...a,
    id: String(index + 1).padStart(2, '0'),
    db_id: a.id,
    type: 'article',
    img: a.cover_image,
    date: a.published_at ? new Date(a.published_at).toLocaleDateString() : '',
    readTime: a.read_time,
    desc: a.description
  }));

  return (
    <section id="journal" className="py-16 md:py-24 hairline-t scroll-fade bg-[#FAFAFA]">
      <SectionHeader number="05" title="Articles & Journal" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
        {articles.map((article) => (
          <div 
            key={article.db_id}
            onClick={() => setActiveDetail(article)}
            onMouseEnter={() => setHoveredArticleImg && setHoveredArticleImg(article.img)}
            onMouseLeave={() => setHoveredArticleImg && setHoveredArticleImg(null)}
            className="group cursor-pointer flex flex-col bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] transition-all duration-300 p-4 md:p-6 shadow-sm hover:shadow-xl"
          >
            <div className="w-full h-48 md:h-60 overflow-hidden mb-8 bg-[#E5E5E5] border border-[#E5E5E5]">
              <img 
                src={article.img} 
                alt={article.title} 
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#666666]">{article.date}</span>
                <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] border border-[#E5E5E5] px-2 py-1">{article.readTime}</span>
              </div>
              {/* Menggunakan font Serif untuk judul Artikel agar berasa seperti Koran/Majalah */}
              <h4 className="text-xl md:text-2xl font-serif-editorial font-bold tracking-tight mb-4 leading-snug text-[#111111] group-hover:text-[#666666] transition-colors">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-8">
                {article.desc}
              </p>
              
              <div className="mt-auto pt-4 hairline-t flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]">
                Read Article <span className="transform group-hover:translate-x-2 transition-transform text-sm leading-none">→</span>
              </div>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="col-span-1 md:col-span-3 p-8 text-center text-gray-500 uppercase tracking-widest font-mono">No articles published yet.</div>
        )}
      </div>
    </section>
  );
}
