import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { slugify } from '../../utils/slugify';

export function ExperienceSection() {
  const { t } = useTranslation();
  const [activeExp, setActiveExp] = useState(0);
  const { ref: leftRef, isInView: leftInView } = useScrollAnimation({ margin: '0px' });
  const { ref: rightRef, isInView: rightInView } = useScrollAnimation({ margin: '0px' });
  const { data: experiences, isLoading, error } = useSupabaseList('experiences', {
    order: { column: 'order_index', ascending: true }
  });

  if (isLoading) {
    return (
      <section id="experience" className="relative z-20 w-full bg-white border-t border-gray-200 py-12 md:py-16 scroll-fade px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-8"></div>
      </section>
    );
  }

  if (error || !experiences || experiences.length === 0) {
    return null;
  }

  const groupedExperiences = experiences.reduce((acc, exp) => {
    const existing = acc.find(item => item.company === exp.company);
    if (existing) {
      existing.roles.push(exp);
    } else {
      acc.push({
        company: exp.company,
        roles: [exp]
      });
    }
    return acc;
  }, []);

  const activeGroup = groupedExperiences[activeExp] || groupedExperiences[0];

  return (
    <section id="process" className="relative z-20 w-full bg-white py-12 md:py-16 scroll-fade">
      <SectionHeader number="03" title={t('experience.title')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 px-6 md:px-12">
        {/* Vertical Navigation Tab */}
        <motion.div 
          ref={leftRef}
          initial={{ opacity: 0, x: -30 }}
          animate={leftInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col space-y-4 md:space-y-6 hairline-l pl-6 md:pl-10"
        >
            {groupedExperiences.map((group, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveExp(idx)}
                className={`text-left text-2xl md:text-3xl font-medium tracking-tight transition-all duration-300 ${activeExp === idx ? 'text-[#111111]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {group.company}
              </button>
            ))}
          </motion.div>

        {/* Dynamic Content Detail */}
        <motion.div 
          ref={rightRef}
          initial={{ opacity: 0, x: 30 }}
          animate={rightInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="pt-2 md:pt-0"
        >
            {activeGroup.roles.map((roleExp, idx) => {
              const roleKey = `experience.${slugify(roleExp.company)}.${slugify(roleExp.role)}.role`;
              const descKey = `experience.${slugify(roleExp.company)}.${slugify(roleExp.role)}.description`;

              return (
                <div key={idx} className={idx > 0 ? "mt-12 pt-8 hairline-t" : ""}>
                  <h4 className="text-xl md:text-2xl font-bold mb-2 text-[#111111] uppercase tracking-tight">
                    {t(roleKey, roleExp.role)}
                  </h4>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666666] mb-6 font-mono font-bold">
                    {roleExp.period}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-line">
                    {t(descKey, roleExp.description)}
                  </p>
                  
                  <div className="pt-6 hairline-t">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-mono font-bold">{t('experience.techStack')}</p>
                    <p className="text-[10px] md:text-xs font-bold text-[#111111] font-mono tracking-widest uppercase">
                      {roleExp.tech_stack || roleExp.tech || t('experience.variousTech')}
                    </p>
                  </div>
                </div>
              );
            })}
        </motion.div>
      </div>
    </section>
  );
}
