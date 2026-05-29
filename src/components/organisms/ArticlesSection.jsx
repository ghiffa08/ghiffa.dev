import { useSupabaseList } from '../../hooks/useSupabaseData';

export function ArticlesSection({ setActiveDetail, setHoveredArticleImg }) {
  const { data: rawArticles, isLoading } = useSupabaseList('articles', {
    eq: { column: 'status', value: 'published' },
    order: { column: 'published_at', ascending: false }
  });

  const articles = rawArticles.map((a, index) => ({
    ...a,
    id: String(index + 1).padStart(2, '0'),
    db_id: a.id,
    type: 'article',
    img: a.cover_image,
    date: a.published_at ? new Date(a.published_at).toLocaleDateString() : '',
    readTime: a.read_time,
    desc: a.description
  }));

  if (isLoading) {
    return (
      <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[50vh]">
        <div className="px-4 md:px-8 py-12 hairline-b">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="hairline-b flex flex-col md:flex-row md:items-center justify-between p-4 md:p-8">
              <div className="flex items-center space-x-6 md:space-x-12 w-full md:w-2/3">
                <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-8 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="mt-4 md:mt-0 w-32 h-4 bg-gray-200 animate-pulse hidden md:block"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="hairline-t fade-up bg-[#FAFAFA]">
      <div className="px-4 md:px-8 py-12 hairline-b">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">05.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Articles & Thoughts</h3>
      </div>
      
      <div className="font-mono text-xs md:text-base w-full">
        {articles.map((article) => (
          <div 
            key={article.id}
            onClick={() => setActiveDetail(article)}
            className="hairline-b flex flex-col md:flex-row md:items-center justify-between p-4 md:p-8 hover:bg-[#111111] hover:text-[#FAFAFA] transition-colors duration-300 cursor-pointer group relative overflow-hidden"
            onMouseEnter={() => setHoveredArticleImg(article.img)}
            onMouseLeave={() => setHoveredArticleImg(null)}
          >
            <div className="flex items-center space-x-6 md:space-x-12 relative z-10">
              <span className="text-gray-400 group-hover:text-[#3B82F6] transition-colors">{article.id}.</span>
              <span className="font-sans font-bold text-lg md:text-2xl tracking-tight uppercase">{article.title}</span>
            </div>
            <div className="mt-4 md:mt-0 text-gray-400 group-hover:text-[#FAFAFA] tracking-widest hidden md:block relative z-10">
              ...... [ READ ARTICLE ]
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="p-8 text-center text-gray-500 uppercase tracking-widest">No articles published yet.</div>
        )}
      </div>
    </section>
  );
}
