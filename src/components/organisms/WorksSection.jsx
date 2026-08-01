import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { slugify } from '../../utils/slugify';
import { SectionHeader } from '../atoms/SectionHeader';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function WorksSection({ setActiveDetail }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const { ref, isInView } = useScrollAnimation({ margin: '0px' });
  const { data: rawProjects, isLoading, error } = useSupabaseList('projects', {
    order: { column: 'order_index', ascending: true },
    limit: 50
  });

  if (isLoading) {
    return (
      <section id="works" className="relative z-20 w-full bg-[#FAFAFA] border-t border-gray-200 py-12 md:py-16 scroll-fade px-6 md:px-12">
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

  const visibleProjects = isExpanded ? projects : projects.slice(0, 5);

  return (
    <section id="works" className="relative z-20 w-full bg-[#FAFAFA] border-t border-gray-200 py-12 md:py-16 scroll-fade">
      <SectionHeader number="02" title={t('works.title')} />
      
      <motion.div 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col hairline-t"
      >
        {visibleProjects.map((project, idx) => {
          const titleKey = `project.${slugify(project.title)}.title`;
          const categoryKey = `project.${slugify(project.title)}.category`;
          return (
            <motion.div 
              key={project.db_id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
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
            </motion.div>
          );
        })}
      </motion.div>
      
      {projects.length > 5 && (
        <div className="flex justify-center px-6 md:px-12 pt-12 md:pt-16">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center border border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-[#FAFAFA] transition-all duration-300 font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer"
          >
            {isExpanded ? t('show_less') : t('see_all_works')}
          </button>
        </div>
      )}
    </section>
  );
}
