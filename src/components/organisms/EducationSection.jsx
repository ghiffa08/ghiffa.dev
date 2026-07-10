import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseList } from '../../hooks/useSupabaseData';
import { SectionHeader } from '../atoms/SectionHeader';
import { slugify } from '../../utils/slugify';

function CertificateCard({ item }) {
  const { t } = useTranslation();

  const titleKey = `education.${slugify(item.title)}.title`;
  const instKey = `education.${slugify(item.title)}.institution`;

  const hasMedia = !!item.certificate_url;
  const isPdf = hasMedia && item.certificate_url.toLowerCase().endsWith('.pdf');
  const externalUrl = item.credential_url || item.external_url || null;

  if (!hasMedia) {
    return (
      <div className="break-inside-avoid mb-4 p-6 border-2 border-black bg-white flex flex-col justify-between">
        <div>
          <div className="w-8 h-8 rounded-full bg-[#FAFAFA] border border-black flex items-center justify-center text-[10px] font-mono font-bold mb-4 uppercase">
            {item.type === 'haki' ? 'IP' : 'CRT'}
          </div>
          <h5 className="text-sm font-bold uppercase tracking-tight text-[#111111] mb-2 line-clamp-2">
            {t(titleKey, item.title)}
          </h5>
          <p className="text-xs text-gray-500 line-clamp-2">{t(instKey, item.institution)}</p>
        </div>
        <div className="flex justify-between items-end mt-4">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{item.period}</p>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono font-bold tracking-wider uppercase border-b border-[#111111] hover:text-[#666666] hover:border-[#666666] transition-colors"
            >
              {t('view_certificate')} ↗
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="break-inside-avoid mb-4 relative overflow-hidden border-2 border-black group bg-gray-100 flex flex-col">
      {isPdf ? (
        <div className="w-full aspect-[3/4] bg-white flex flex-col items-center justify-center p-6 border-b-2 border-black grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-16 h-20 border-2 border-black relative flex items-center justify-center bg-gray-100 mb-4">
            <span className="font-bold text-black text-xl absolute font-mono">PDF</span>
          </div>
          <span className="text-center font-bold uppercase text-xs line-clamp-2 text-[#111111]">Document Attached</span>
        </div>
      ) : (
        <img
          src={item.certificate_url}
          alt={t(titleKey, item.title)}
          className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
        />
      )}

      {/* Clickable media area overlay */}
      {hasMedia && (
        <a
          href={item.certificate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0"
        ></a>
      )}

      {/* Caption overlay sliding up on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
        <span className="absolute -top-3 left-4 bg-black text-white text-[8px] font-mono font-bold px-2 py-0.5 border border-black uppercase">
          {item.type === 'haki' ? 'IP' : 'CRT'}
        </span>
        <h6 className="font-bold uppercase text-sm text-[#111111] line-clamp-2">
          {t(titleKey, item.title)}
        </h6>
        <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
          {t(instKey, item.institution)}
        </p>
        <p className="text-[10px] tracking-widest mt-2 font-mono text-gray-500 uppercase">
          {item.period}
        </p>

        {/* Action Links container */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t-2 border-gray-200">
          {hasMedia && (
            <a
              href={item.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors uppercase flex items-center gap-1 z-20"
            >
              {isPdf ? 'BUKA PDF' : 'LIHAT GAMBAR'}
            </a>
          )}
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors uppercase flex items-center gap-1 z-20"
            >
              🔗 VERIFIKASI
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function EducationSection() {
  const { t } = useTranslation();
  const { data: qualifications, isLoading, error } = useSupabaseList('qualifications', {
    order: { column: 'order_index', ascending: true }
  });
  const [isExpanded, setIsExpanded] = useState(false);

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
                      <div key={item.id} className="group">
                        <div className="font-mono text-[10px] md:text-xs text-[#111111] font-bold tracking-[0.25em] uppercase mb-4">
                          {item.period}
                        </div>
                        <h5 className="text-[1.5rem] font-black uppercase leading-[1.0] tracking-tighter text-[#111111] group-hover:text-[#666666] transition-colors duration-300">
                          {t(titleKey, item.title)}
                        </h5>
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          {t(instKey, item.institution)}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-3 leading-relaxed max-w-md">
                            {t(descKey, item.description)}
                          </p>
                        )}
                        {item.certificate_url && (
                          <a
                            href={item.certificate_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 mt-4 text-[10px] font-mono font-bold tracking-wider uppercase border-b border-[#111111] hover:text-[#666666] hover:border-[#666666] transition-colors block w-fit"
                          >
                            {t('view_certificate')} ↗
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {patens.length > 0 && (
              <div className="py-16 md:pl-12">
                <div className="font-mono text-[10px] md:text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-12">
                  [ {t('education.section.patents')} ]
                </div>
                <div className="space-y-12">
                  {patens.map((item, i) => {
                    const titleKey = `education.${slugify(item.title)}.title`;
                    const instKey = `education.${slugify(item.title)}.institution`;
                    return (
                      <div key={item.id} className="group">
                        <div className="font-mono text-[10px] md:text-xs text-[#111111] font-bold tracking-[0.25em] uppercase mb-4">
                          {item.period}
                        </div>
                        <h5 className="text-[1.5rem] font-black uppercase leading-[1.0] tracking-tighter text-[#111111] group-hover:text-[#666666] transition-colors duration-300">
                          {t(titleKey, item.title)}
                        </h5>
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          {t(instKey, item.institution)}
                        </p>
                        {item.certificate_url && (
                          <a
                            href={item.certificate_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 mt-4 text-[10px] font-mono font-bold tracking-wider uppercase border-b border-[#111111] hover:text-[#666666] hover:border-[#666666] transition-colors block w-fit"
                          >
                            {t('view_certificate')} ↗
                          </a>
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
                        {t(item.title)}
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
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                {displayedItems.map((item) => (
                  <CertificateCard key={item.id} item={item} />
                ))}
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
