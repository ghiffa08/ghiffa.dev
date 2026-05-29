import { useSupabaseList } from '../../hooks/useSupabaseData';

export function EducationSection() {
  const { data: qualifications, isLoading } = useSupabaseList('qualifications', {
    order: { column: 'order_index', ascending: true }
  });

  if (isLoading) {
    return (
      <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[50vh]">
        <div className="px-4 md:px-8 py-12 hairline-b">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b">
            <div className="md:col-span-3 p-4 md:p-8 md:hairline-r">
              <div className="w-32 h-4 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="md:col-span-9 p-4 md:p-8 space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 pt-1"><div className="w-24 h-4 bg-gray-200 animate-pulse"></div></div>
                  <div className="md:col-span-9">
                    <div className="w-64 h-6 bg-gray-200 animate-pulse mb-4"></div>
                    <div className="w-48 h-4 bg-gray-200 animate-pulse mb-4"></div>
                    <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const educations = qualifications.filter(q => q.type === 'education');
  const honors = qualifications.filter(q => q.type === 'honor');
  const certs = qualifications.filter(q => q.type === 'certification');

  return (
    <section className="hairline-t fade-up bg-[#FAFAFA]">
      <div className="px-4 md:px-8 py-12 hairline-b">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">04.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Education & Honors</h3>
      </div>
      
      <div className="w-full">
        {/* EDUCATION ROW */}
        {educations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
            <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
              [ Education ]
            </div>
            <div className="md:col-span-9 p-4 md:p-8 space-y-12">
              {educations.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">{item.period}</div>
                  <div className="md:col-span-9">
                    <h5 className="text-xl md:text-2xl font-bold uppercase mb-2">{item.institution}</h5>
                    <div className="font-bold mb-2 text-gray-800">{item.title}</div>
                    {item.description && <p className="text-base text-gray-600">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HONORS ROW */}
        {honors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-b hover:bg-gray-50 transition-colors">
            <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
              [ Honors ]
            </div>
            <div className="md:col-span-9 p-4 md:p-8 space-y-8">
              {honors.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-3 font-mono text-xs text-[#3B82F6] pt-1">{item.period}</div>
                  <div className="md:col-span-9">
                    <h5 className="text-lg font-bold uppercase mb-1">{item.title}</h5>
                    <div className="font-bold text-gray-800 mb-1">{item.institution}</div>
                    {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS ROW */}
        {certs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hover:bg-gray-50 transition-colors">
            <div className="md:col-span-3 p-4 md:p-8 font-mono text-sm text-gray-500 md:hairline-r tracking-widest uppercase">
              [ Certifications ]
            </div>
            <div className="md:col-span-9 p-4 md:p-8 space-y-4 font-mono text-sm">
              {certs.map(item => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-200 pb-4">
                  <div className="md:col-span-8 font-bold text-gray-800">{item.title}</div>
                  <div className="md:col-span-4 text-gray-500 md:text-right">{item.institution} ({item.period})</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
}
