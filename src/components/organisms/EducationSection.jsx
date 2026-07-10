import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import { slugify } from '../../utils/slugify';

const dynamicTranslations = {
  "Juara 1 PILMAPRES Universitas Kuningan": {
    en: "1st Place Winner PILMAPRES Universitas Kuningan",
    id: "Juara 1 PILMAPRES Universitas Kuningan"
  },
  "2nd Place Winner – International Digital Mathematics Game Competition 2025": {
    en: "2nd Place Winner – International Digital Mathematics Game Competition 2025",
    id: "Juara 2 – Kompetisi Game Matematika Digital Internasional 2025"
  },
  "Nilai Tertinggi Pertama Uji Kompetensi": {
    en: "Highest Score in Competency Test",
    id: "Nilai Tertinggi Pertama Uji Kompetensi"
  },
  "Juara 1 Business Plan Competition": {
    en: "1st Place Winner Business Plan Competition",
    id: "Juara 1 Business Plan Competition"
  }
};

export function EducationSection() {
  const { t, i18n } = useTranslation();
  const { data: qualifications, isLoading, error } = useSupabaseList('qualifications', {
    order: { column: 'order_index', ascending: true }
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLang = i18n.language || 'id';
  const getTranslatedText = (originalText) => {
    if (dynamicTranslations[originalText]) {
      return dynamicTranslations[originalText][currentLang] || originalText;
    }
    return originalText;
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 hairline-t scroll-fade bg-white px-6 md:px-12">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-12"></div>
      </section>
    );
  }

  if (error || !qualifications || qualifications.length === 0) {
    return null;
  }

  const educations = qualifications.filter(q => q.type === 'education');
  const honors = qualifications.filter(q => q.type === 'honor');
  const certs = qualifications.filter(q => q.type === 'certification');
  const hakis = qualifications.filter(q => q.type === 'haki');
  const jurnals = qualifications.filter(q => q.type === 'jurnal' || q.type === 'journal');
  const patens = qualifications.filter(q => q.type === 'paten' || q.type === 'patent');

  const combined = [...hakis, ...certs];
  const displayedItems = isExpanded ? combined : combined.slice(0, 6);

  return (
    <section id="achievements" className="py-16 md:py-24 hairline-t scroll-fade bg-white">
      <SectionHeader number="04" title={t('education.title')} />
      
      <div className="w-full px-6 md:px-12 mt-8">
        
        {/* 1. EDUCATION: Classic Editorial Linear Flow */}
        {educations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-t py-16">
            <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 md:mb-0">
              [ {t('education.section.education')} ]
            </div>
            <div className="md:col-span-9 space-y-16">
              {educations.map((item) => {
                const titleKey = `education.${slugify(item.title)}.title`;
                const instKey = `education.${slugify(item.title)}.institution`;
                const descKey = `education.${slugify(item.title)}.description`;
                return (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative group">
                    <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-[#111111] font-bold tracking-widest pt-2 uppercase">
                      {item.period}
                    </div>
                    <div className="md:col-span-9">
                      <h5 className="text-[2rem] md:text-[3rem] font-black uppercase leading-[0.9] tracking-tighter text-[#111111] group-hover:text-[#666666] transition-colors duration-500">
                        {t(titleKey, item.title)}
                      </h5>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-4 max-w-xl font-medium">
                        {t(instKey, item.institution)}
                        {item.description && (
                          <span className="block mt-2 text-gray-500 font-normal">
                            {t(descKey, item.description)}
                          </span>
                        )}
                        {item.certificate_url && (
                          <a 
                            href={item.certificate_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 mt-3 text-[10px] font-mono font-bold tracking-wider uppercase border-b border-[#111111] hover:text-[#666666] hover:border-[#666666] transition-colors block w-fit"
                          >
                            {t('view_certificate')} ↗
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. PUBLICATIONS & PATENTS: Split 50/50 Grid (Magazine Feature) */}
        {(jurnals.length > 0 || patens.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 hairline-t">
            {jurnals.length > 0 && (
              <div className="py-16 md:pr-12 md:hairline-r">
                <div className="font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-12">
                  [ {t('education.section.journals')} ]
                </div>
                <div className="space-y-12">
                  {jurnals.map((item, i) => {
                    const titleKey = `education.${slugify(item.title)}.title`;
                    const instKey = `education.${slugify(item.title)}.institution`;
                    const descKey = `education.${slugify(item.title)}.description`;
                    return (
                      <div key={item.id} className="relative pl-6 md:pl-8 border-l border-[#111111]">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-[#666666]"></div>
                        <h5 className="text-lg md:text-xl font-bold leading-tight tracking-tight text-[#111111] mb-2">
                          {t(titleKey, item.title)}
                        </h5>
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                          {t(instKey, item.institution)} — {item.period}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {t(descKey, item.description)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {patens.length > 0 && (
              <div className="py-16 md:pl-12 hairline-t md:border-t-0">
                <div className="font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-12">
                  [ {t('education.section.patents')} ]
                </div>
                <div className="space-y-12">
                  {patens.map((item, i) => {
                    const titleKey = `education.${slugify(item.title)}.title`;
                    const instKey = `education.${slugify(item.title)}.institution`;
                    const descKey = `education.${slugify(item.title)}.description`;
                    return (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="font-serif-editorial italic text-3xl text-[#E5E5E5] group-hover:text-[#666666] transition-colors">0{i+1}</span>
                          <h5 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-[#111111]">
                            {t(titleKey, item.title)}
                          </h5>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 pl-12 mb-2">
                          {t(instKey, item.institution)} — {item.period}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600 pl-12">
                            {t(descKey, item.description)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. HONORS & AWARDS: Large Serif Typography in Swiss Grid */}
        {honors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-t py-16">
            <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-8 md:mb-0">
              [ {t('education.section.honors')} ]
            </div>
            <div className="md:col-span-9 flex flex-col">
              {honors.map((item, idx) => {
                const titleKey = `education.${slugify(item.title)}.title`;
                const instKey = `education.${slugify(item.title)}.institution`;
                const descKey = `education.${slugify(item.title)}.description`;
                return (
                  <div key={item.id} className={`flex flex-col md:flex-row md:items-end justify-between py-10 ${idx !== 0 ? 'hairline-t' : 'pt-0'}`}>
                    <div className="md:pr-8">
                      <h5 className="text-[2rem] md:text-[3rem] lg:text-[4rem] font-serif-editorial italic leading-[0.9] tracking-tight text-[#111111]">
                        {getTranslatedText(t(titleKey, item.title))}
                      </h5>
                      <div className="mt-4 flex items-center gap-4">
                        <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                          {t(instKey, item.institution)}
                        </span>
                        {item.description && (
                          <span className="text-sm text-gray-600 line-clamp-1">
                            {t(descKey, item.description)}
                          </span>
                        )}
                      </div>
                      {item.certificate_url && (
                        <a 
                          href={item.certificate_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 mt-3 text-[10px] font-mono font-bold tracking-wider uppercase border-b border-[#111111] hover:text-[#666666] hover:border-[#666666] transition-colors block w-fit"
                        >
                          {t('view_certificate')} ↗
                        </a>
                      )}
                    </div>
                    <div className="font-mono text-[10px] md:text-xs text-[#111111] font-bold tracking-[0.2em] uppercase mt-6 md:mt-0 text-left md:text-right shrink-0">
                      {item.period}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. INTELLECTUAL PROPERTY & CERTIFICATIONS: Dense Grid */}
        {combined.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 hairline-t py-16 gap-y-12">
            <div className="md:col-span-3 font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase">
              [ {t('education.section.ipCertifications')} ]
            </div>
            
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedItems.map((item) => {
                  const titleKey = `education.${slugify(item.title)}.title`;
                  const instKey = `education.${slugify(item.title)}.institution`;
                  const isHaki = item.type === 'haki';
                  
                  if (isHaki) {
                    return (
                      <div key={item.id} className="p-6 border border-[#E5E5E5] hover:border-[#111111] transition-colors bg-white group">
                        <div className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center text-[10px] font-mono font-bold mb-4 group-hover:bg-[#111111] group-hover:text-white transition-colors">IP</div>
                        <h5 className="text-sm font-bold uppercase tracking-tight text-[#111111] mb-2">
                          {t(titleKey, item.title)}
                        </h5>
                        <p className="text-xs text-gray-500">{t(instKey, item.institution)}</p>
                        <p className="text-[10px] font-mono mt-4 text-gray-400 uppercase tracking-widest">{item.period}</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={item.id} className="p-6 bg-[#FAFAFA] hover:bg-[#111111] hover:text-white transition-colors group flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-white/20 flex items-center justify-center text-[10px] font-mono font-bold mb-4">CRT</div>
                        <h5 className="text-sm font-bold uppercase tracking-tight mb-2">
                          {t(titleKey, item.title)}
                        </h5>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400">{t(instKey, item.institution)}</p>
                        <p className="text-[10px] font-mono mt-4 text-gray-400 uppercase tracking-widest">{item.period}</p>
                      </div>
                      {item.certificate_url && (
                        <a 
                          href={item.certificate_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 mt-4 text-[10px] font-mono font-bold tracking-wider uppercase border-b border-current hover:text-[#666666] transition-colors block w-fit"
                        >
                          {t('view_certificate')} ↗
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {combined.length > 6 && (
                <div className="mt-8 flex justify-start">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-6 py-3 border-2 border-[#111111] hover:bg-[#111111] hover:text-white font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer"
                  >
                    {isExpanded ? 'SHOW LESS ↑' : 'SEE ALL CERTIFICATES ↘'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
