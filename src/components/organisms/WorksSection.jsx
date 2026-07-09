import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { slugify } from '../../utils/slugify';
import { SectionHeader } from '../atoms/SectionHeader';

export function WorksSection({ setActiveDetail }) {
  const { t } = useTranslation();
  const [hoveredProject, setHoveredProject] = useState(null);
  const { data: rawProjects, isLoading, error } = useSupabaseList('projects', {
    order: { column: 'created_at', ascending: false },
    limit: 6
  });

  if (isLoading) {
    return (
      <section id="works" className="py-16 md:py-24 hairline-t scroll-fade bg-[#FAFAFA] px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
          <div className="h-64 bg-gray-200 animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (error || !rawProjects || rawProjects.length === 0) {
    return null;
  }

  const projects = rawProjects.map((p, index) => {
    const images = Array.isArray(p.image_urls) && p.image_urls.length > 0 
      ? p.image_urls 
      : (p.image_url ? [p.image_url] : []);
    return {
      ...p,
      id: String(index + 1).padStart(2, '0'),
      db_id: p.id,
      slug: slugify(p.title),
      type: 'project',
      img: images[0] || '',
      image_urls: images,
      stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
      desc: p.description
    };
  });

  return (
    <section id="works" className="py-16 md:py-24 hairline-t scroll-fade bg-[#FAFAFA]">
      <SectionHeader number="02" title={t('works.title')} />
      
      <div className="flex flex-col hairline-t">
        {projects.map((project, idx) => {
          const titleKey = `project.${slugify(project.title)}.title`;
          const categoryKey = `project.${slugify(project.title)}.category`;
          return (
            <div 
              key={project.db_id || idx}
              onMouseEnter={() => setHoveredProject(project.title)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setActiveDetail(project)}
              className="group flex flex-col md:flex-row md:items-center justify-between hairline-b py-10 md:py-16 cursor-pointer relative hover:bg-[#111111] transition-colors duration-500 px-6 md:px-12"
            >
              {/* Project Title */}
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#111111] group-hover:text-white transition-colors duration-500 z-10 relative uppercase">
                {t(titleKey, project.title)}
              </h3>
              
              {/* Project Category & Hover Reveal Image */}
              <div className="flex items-center justify-between md:justify-end mt-8 md:mt-0 z-10 relative w-full md:w-auto">
                {/* Image Reveal on Hover (Desktop) */}
                <div className={`hidden md:block absolute right-[280px] top-1/2 transform -translate-y-1/2 w-72 h-48 overflow-hidden transition-all duration-500 ease-out pointer-events-none origin-right border border-[#E5E5E5] p-1 bg-white ${hoveredProject === project.title ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <img src={project.img} alt={project.title} loading="lazy" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0" />
                </div>

                <span className="font-mono text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold border border-[#E5E5E5] px-3 py-1.5 group-hover:border-gray-500 group-hover:text-gray-300 transition-colors duration-300 md:mr-8">
                  {t(categoryKey, project.category)}
                </span>
                
                {/* Circular Arrow Button */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#E5E5E5] group-hover:border-white text-[#111111] group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45 font-mono text-sm">
                  ↗
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
