import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { TypewriterText } from '../../atoms/TypewriterText';
import { slugify } from '../../../utils/slugify';
import Lanyard from '../../Lanyard';

const titleTranslations = {
  'teknik informatika': 'Informatics Engineering',
  'rekayasa perangkat lunak': 'Software Engineering',
  's1 teknik informatika': 'B.S. in Informatics Engineering',
  'sistem informasi': 'Information Systems',
  'ilmu komputer': 'Computer Science'
};

const formatPeriod = (period) => {
  if (!period) return '';
  return period.replace(/\bsekarang\b/gi, 'PRESENT');
};

const formatTitle = (rawTitle, t) => {
  if (!rawTitle) return '';
  const key = `education.${slugify(rawTitle)}.title`;
  if (t) {
    const val = t(key, '');
    if (val && val !== key) return val;
  }
  const clean = rawTitle.trim().toLowerCase();
  return titleTranslations[clean] || rawTitle;
};

const formatInstitution = (rawInst, rawTitle, t) => {
  if (!rawInst) return '';
  if (rawTitle && t) {
    const key = `education.${slugify(rawTitle)}.institution`;
    const val = t(key, '');
    if (val && val !== key) return val;
  }
  return rawInst.replace(/\buniversitas kuningan\b/gi, 'Universitas Kuningan');
};

export function AboutMeSection({ avatarImage, fullName, aboutBio, educationList = [], sectionData }) {
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px 0px -40px 0px' });

  // Keep Lanyard container clean and positioned at -top-20 so anchor sits behind navbar
  const sectionTitle = sectionData?.title || 'about me';
  const customBio = sectionData?.content?.bio;
  const educationTitle = sectionData?.content?.education_title || 'Education';
  const languagesTitle = sectionData?.content?.languages_title || 'Languages & Specialization';
  const statusBadge = sectionData?.content?.status_badge || 'Available for Full-Time & Contracts';
  const effectiveBio = customBio || aboutBio;

  return (
    <section
      id="about"
      className="relative scroll-mt-20 py-14 sm:py-28 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto overflow-visible"
    >
      {/* 3D LANYARD INTERACTIVE CANVAS LAYER (Anchor permanently behind navbar, elastic stretch on scroll up, physical drop on enter) */}
      <div
        ref={containerRef}
        className="absolute -top-14 sm:-top-20 inset-x-0 bottom-0 z-0 overflow-visible pointer-events-none"
      >
        <Lanyard
          frontImage="/id-card-front.png"
          backImage="/id-card-back.png"
          strapImage="/id-card-strap.png"
          cardColor="#ffffff"
          finish="glossy"
          metal="silver"
          strapColor="#18181B"
          strapWidth={0.65}
          size={w => (w >= 1024 ? 0.46 : 0.33)}
          anchor={w => (w >= 1024 ? 0.208 : 0.5)}
          strapLength={w => (w >= 1024 ? 0.60 : 0.28)}
          cornerRadius={0.3}
          intro={true}
          gravity={1.2}
          damping={0.65}
          elasticity={0.45}
          breeze={0.16}
          interactive={true}
          className="w-full h-full pointer-events-auto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-16 items-start sm:items-center">
        {/* LEFT COLUMN: Spacer (Full height for 3D Lanyard Card) */}
        <ScrollReveal
          delay={0.1}
          y={36}
          className="lg:col-span-5 flex flex-col items-center justify-end relative self-stretch min-h-[300px] sm:min-h-[380px] lg:min-h-[640px] pointer-events-none"
        >
          {/* Spacer so the card in Layer 0 is unobstructed and directly interactive */}
          <div className="flex-1 w-full" />
        </ScrollReveal>

        {/* RIGHT COLUMN: Selection Highlight Header, Bio, Education, Languages */}
        <ScrollReveal
          delay={0.25}
          y={36}
          className="lg:col-span-7 flex flex-col justify-center space-y-7 sm:space-y-8 relative z-10 pointer-events-auto"
        >
          {/* SELECTION-HIGHLIGHTED HEADER */}
          <div
            ref={headerRef}
            data-builder-field="title"
            data-builder-label="About Heading"
            className="inline-flex items-center relative select-none self-start"
          >
            {/* Left selection handle with top circle pin */}
            <div className="absolute -left-[2px] top-0 bottom-0 flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white -translate-y-1/2" />
              <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
            </div>

            {/* Selection highlight box with text */}
            <div className="bg-[#FFF2EB] border-y border-[#FF5500]/30 px-5 sm:px-7 py-2 sm:py-2.5 flex items-center whitespace-nowrap">
              <h2
                aria-label={sectionTitle}
                className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#141414] lowercase leading-none whitespace-nowrap flex items-center"
              >
                <TypewriterText text={sectionTitle} trigger={isHeaderInView} delay={650} speed={90} />
              </h2>
            </div>

            {/* Right selection handle with bottom circle pin */}
            <div className="absolute -right-[2px] top-0 bottom-0 flex flex-col items-center">
              <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white translate-y-1/2" />
            </div>
          </div>

          {/* Bio Narrative Paragraph */}
          <div
            data-builder-field="bio"
            data-builder-label="Bio Narrative Paragraph"
            className="text-[14.5px] sm:text-[15.5px] text-gray-600 leading-relaxed space-y-3 font-normal max-w-2xl text-justify [&>p]:leading-relaxed [&>p]:text-justify [&>strong]:text-gray-900 [&>strong]:font-semibold"
          >
            {effectiveBio ? (
              <ReactMarkdown>{effectiveBio}</ReactMarkdown>
            ) : (
              <p>
                As a Fullstack Web Developer and IoT Engineer, I design end-to-end technological solutions from the ground up. My technical scope encompasses scalable cloud architectures, high-performance web applications, edge computing, LoRa network telemetry, and custom PCB hardware design.
              </p>
            )}
          </div>

          {/* EDUCATION */}
          <div className="pt-2">
            <h3
              data-builder-field="education_title"
              data-builder-label="Education Heading"
              className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2"
            >
              <span>{educationTitle}</span>
            </h3>
            <div className="space-y-3.5">
              {educationList.map((edu, idx) => (
                <div key={edu.id || idx} className="flex items-start gap-3.5 group">
                  {/* Clean Folder Icon */}
                  <div className="shrink-0 pt-0.5">
                    <svg className="w-9 h-7 sm:w-10 sm:h-8 drop-shadow-2xs group-hover:scale-105 transition-transform" viewBox="0 0 48 38" fill="none">
                      <path d="M4 6C4 3.79086 5.79086 2 8 2H18.5858C19.6466 2 20.664 2.42143 21.4142 3.17157L24.8284 6.58579C25.5786 7.33593 26.596 7.75736 27.6569 7.75736H40C42.2091 7.75736 44 9.54822 44 11.7574V14H4V6Z" fill="#FFA06B" />
                      <rect x="2" y="10" width="44" height="26" rx="4" fill="#FF5500" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[14px] sm:text-[14.5px] text-gray-900 leading-snug">
                      {formatTitle(edu.title, t)}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-gray-500 italic mt-0.5">
                      {formatInstitution(edu.institution, edu.title, t)}{' '}
                      {edu.period && <span>({formatPeriod(edu.period)})</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LANGUAGES & SPECIALIZATION */}
          <div className="pt-2 space-y-2.5 sm:space-y-3">
            <h3
              data-builder-field="languages_title"
              data-builder-label="Languages Heading"
              className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight flex items-center gap-2"
            >
              <span>{languagesTitle}</span>
            </h3>

            {/* Languages Row */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
              <div className="relative inline-flex items-center gap-2 bg-[#FF5500] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-br-xs shadow-xs hover:bg-[#E04B00] transition-colors cursor-default select-none">
                <span>Indonesian - Native</span>
              </div>

              <div className="relative inline-flex items-center gap-2 bg-[#18181B] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-bl-xs shadow-xs hover:bg-black transition-colors cursor-default select-none">
                <span>English - Professional Working</span>
              </div>
            </div>

            {/* Availability Badge Row */}
            <div className="pt-0.5">
              <div
                data-builder-field="status_badge"
                data-builder-label="Availability Badge"
                className="relative inline-flex items-center gap-2 bg-white text-gray-800 text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors select-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{statusBadge}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
