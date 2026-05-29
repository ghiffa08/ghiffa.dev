import { useSupabaseList } from '../../hooks/useSupabaseData';

export function ExperienceSection() {
  const { data: experiences, isLoading } = useSupabaseList('experiences', {
    order: { column: 'order_index', ascending: true }
  });

  if (isLoading) {
    return (
      <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[50vh]">
        <div className="px-4 md:px-8 py-12 hairline-b">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 hairline-b">
              <div className="md:col-span-3 p-4 md:p-8 md:hairline-r">
                 <div className="w-32 h-4 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="md:col-span-9 p-4 md:p-8">
                <div className="w-64 h-8 bg-gray-200 animate-pulse mb-4"></div>
                <div className="w-48 h-4 bg-gray-200 animate-pulse mb-6"></div>
                <div className="w-full h-24 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="hairline-t fade-up bg-[#FAFAFA]">
      <div className="px-4 md:px-8 py-12 hairline-b">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">02.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Professional Experience</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
            <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r">
              [ {exp.period} ]
            </div>
            <div className="md:col-span-9 p-4 md:p-8">
              <h4 className="text-2xl font-bold uppercase mb-2">{exp.role}</h4>
              <div className="font-mono text-sm text-[#3B82F6] mb-4">{exp.company}</div>
              <p className="text-gray-700 max-w-3xl">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
