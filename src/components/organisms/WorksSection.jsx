import { useSupabaseList } from '../../hooks/useSupabaseData';
import { slugify } from '../../utils/slugify';

export function WorksSection({ setActiveDetail }) {
  const { data: rawProjects, isLoading } = useSupabaseList('projects', {
    order: { column: 'created_at', ascending: false }
  });

  const projects = rawProjects.map((p, index) => ({
    ...p,
    id: String(index + 1).padStart(2, '0'),
    db_id: p.id,
    slug: slugify(p.title),
    type: 'project',
    img: p.image_url,
    stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
    desc: p.description
  }));

  if (isLoading) {
    return (
      <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[50vh]">
        <div className="px-4 md:px-8 py-12 hairline-b">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 animate-pulse"></div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 hairline-b">
            <div className={`md:col-span-8 overflow-hidden h-[50vh] md:h-[80vh] relative bg-gray-200 animate-pulse ${i % 2 === 1 ? 'hairline-r order-1' : 'hairline-l order-1 md:order-2'}`}>
            </div>
            <div className={`md:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-[#FAFAFA] ${i % 2 === 1 ? 'order-2' : 'order-2 md:order-1'}`}>
              <div>
                <div className="w-32 h-4 bg-gray-200 animate-pulse mb-6"></div>
                <div className="w-64 h-10 bg-gray-200 animate-pulse mb-6"></div>
                <div className="w-full h-24 bg-gray-200 animate-pulse mb-8"></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-48 h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-16 h-16 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="hairline-t fade-up bg-[#FAFAFA]">
      <div className="px-4 md:px-8 py-12 hairline-b">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">03.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Selected Works</h3>
      </div>
      
      {projects.map((project, index) => (
        <div key={project.id} className="grid grid-cols-1 md:grid-cols-12 hairline-b group cursor-pointer" onClick={() => setActiveDetail(project)}>
          <div className={`md:col-span-8 overflow-hidden h-[50vh] md:h-[80vh] relative bg-gray-200 ${index % 2 === 0 ? 'hairline-r order-1' : 'hairline-l order-1 md:order-2'}`}>
            <img 
              src={project.img} 
              className="parallax-img absolute top-[-20%] left-0 w-full h-[140%] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
              alt={project.title} 
            />
          </div>
          <div className={`md:col-span-4 p-8 md:p-12 flex flex-col justify-between bg-[#FAFAFA] group-hover:bg-[#111111] group-hover:text-[#FAFAFA] transition-colors duration-500 ${index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}`}>
            <div>
              <div className="font-mono text-xs text-gray-500 mb-4">[ {project.category} ]</div>
              <h4 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 uppercase">{project.title}</h4>
              <p className="text-sm md:text-base text-gray-500 mb-8 font-serif-editorial italic">
                {project.description}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="font-mono text-xs space-x-2 text-[#3B82F6]">
                {project.stack.slice(0, 3).map((s, i) => <span key={i}>[ {s.toUpperCase()} ]</span>)}
              </div>
              <div className="font-mono text-4xl md:text-6xl font-black opacity-20">
                {project.id}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
