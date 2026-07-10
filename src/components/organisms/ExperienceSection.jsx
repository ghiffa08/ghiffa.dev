import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import { slugify } from '../../utils/slugify';

export function ExperienceSection() {
  const { t } = useTranslation();
  const [activeExp, setActiveExp] = useState(0);
  const { data: experiences, isLoading, error } = useSupabaseList('experiences', {
    order: { column: 'order_index', ascending: true }
  });

  if (isLoading) {
    return (
      <section id="experience" className="py-16 md:py-24 hairline-t scroll-fade bg-white px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-8"></div>
      </section>
    );
  }

  if (error || !experiences || experiences.length === 0) {
    return null;
  }

  const activeExperience = experiences[activeExp] || experiences[0];

  const roleKey = activeExperience ? `experience.${slugify(activeExperience.company)}.${slugify(activeExperience.role)}.role` : '';
  const descKey = activeExperience ? `experience.${slugify(activeExperience.company)}.${slugify(activeExperience.role)}.description` : '';

  return (
    <section id="process" className="py-24 md:py-32 hairline-t scroll-fade bg-[#FAFAFA]">
      <SectionHeader number="03" title={t('experience.title')} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 px-6 md:px-12">
        <div className="lg:col-span-4 hidden md:block"></div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Vertical Navigation Tab */}
          <div className="flex flex-col space-y-6 md:space-y-10 hairline-l pl-6 md:pl-10">
            {experiences.map((exp, idx) => (
              <button 
                key={exp.id || idx}
                onClick={() => setActiveExp(idx)}
                className={`text-left text-2xl md:text-3xl font-medium tracking-tight transition-all duration-300 ${activeExp === idx ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {exp.company}
              </button>
            ))}
          </div>

          {/* Dynamic Content Detail */}
          <div className="pt-2 md:pt-0">
            <h4 className="text-xl md:text-2xl font-bold mb-2 text-[#111111] uppercase tracking-tight">
              {t(roleKey, activeExperience.role)}
            </h4>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666666] mb-6 font-mono font-bold">
              {activeExperience.period}
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-line">
              {t(descKey, activeExperience.description)}
            </p>
            
            <div className="pt-6 hairline-t">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t('experience.techStack')}</p>
              <p className="text-[10px] md:text-xs font-bold text-[#111111] font-mono tracking-widest uppercase">
                {activeExperience.tech_stack || activeExperience.tech || t('experience.variousTech')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
