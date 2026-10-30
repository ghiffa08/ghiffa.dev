import React, { useState, useMemo } from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { RefineImage } from '../../RefineImage';

const FIGMA_THEMES = [
  {
    color: '#0D99FF', // Electric Blue
    hoverBorder: 'hover:border-[#0D99FF]',
    hoverRing: 'hover:ring-[#0D99FF]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(13,153,255,0.18)]',
  },
  {
    color: '#FF5500', // Skillstreak Flame Orange
    hoverBorder: 'hover:border-[#FF5500]',
    hoverRing: 'hover:ring-[#FF5500]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(255,85,0,0.18)]',
  },
  {
    color: '#A259FF', // Figma Purple
    hoverBorder: 'hover:border-[#A259FF]',
    hoverRing: 'hover:ring-[#A259FF]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(162,89,255,0.18)]',
  },
  {
    color: '#0ACF83', // Figma Green
    hoverBorder: 'hover:border-[#0ACF83]',
    hoverRing: 'hover:ring-[#0ACF83]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(10,207,131,0.18)]',
  },
  {
    color: '#F43F5E', // Rose Pink
    hoverBorder: 'hover:border-[#F43F5E]',
    hoverRing: 'hover:ring-[#F43F5E]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(244,63,94,0.18)]',
  },
  {
    color: '#F59E0B', // Amber Gold
    hoverBorder: 'hover:border-[#F59E0B]',
    hoverRing: 'hover:ring-[#F59E0B]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(245,158,11,0.18)]',
  },
  {
    color: '#06B6D4', // Cyan Teal
    hoverBorder: 'hover:border-[#06B6D4]',
    hoverRing: 'hover:ring-[#06B6D4]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(6,182,212,0.18)]',
  },
  {
    color: '#7C3AED', // Deep Violet
    hoverBorder: 'hover:border-[#7C3AED]',
    hoverRing: 'hover:ring-[#7C3AED]/25',
    shadow: 'hover:shadow-[0_20px_45px_rgba(124,58,237,0.18)]',
  },
];

const isPortraitCert = (cert) => {
  if (!cert) return false;
  if (cert.orientation === 'portrait') return true;
  if (cert.orientation === 'landscape') return false;
  const t = (cert.title || '').toLowerCase();
  const img = (cert.image || '').toLowerCase();
  if (
    img.includes('f2p9oyiqe0hvurgsevhx') || // Pilmapres (Mahasiswa Berprestasi)
    img.includes('dbbffblvvangiizxkudh') || // BNSP (Junior Web Developer)
    img.includes('qx9gf4vizsixumclht13') || // HAKI Ciptaan
    img.includes('hm8tuornm6btvrvexk1v')    // Junior Web Programmer
  ) {
    return true;
  }
  if (
    t.includes('mahasiswa berprestasi') ||
    t.includes('pilmapres') ||
    (t.includes('bnsp') && !t.includes('vsga')) ||
    t.includes('ciptaan') ||
    t.includes('haki') ||
    (t.includes('programmer') && !t.includes('developer'))
  ) {
    return true;
  }
  return false;
};

export const CertificationsSection = React.memo(function CertificationsSection({ bentoCertificates, onSelectCert, sectionData }) {
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Robust Bento layout: Tall (portrait) certificates on the sides, 2 stacked landscapes in the middle
  const { row1, row2, remainingCerts } = useMemo(() => {
    const list = Array.isArray(bentoCertificates) ? [...bentoCertificates] : [];
    const portraits = [];
    const landscapes = [];

    list.forEach((c) => {
      if (isPortraitCert(c)) {
        portraits.push(c);
      } else {
        landscapes.push(c);
      }
    });

    // Row 1:
    // Left: Pilmapres (Portrait)
    // Middle: Business Plan (Landscape) & Mathematics (Landscape)
    // Right: BNSP (Portrait)
    const r1Left = portraits[0] || landscapes.shift();
    const r1Mid1 = landscapes[0];
    const r1Mid2 = landscapes[1];
    const r1Right = portraits[1] || landscapes[2];

    // Row 2:
    // Left: Junior Web Programmer (Portrait)
    // Middle: Peringkat 1 UKK (Landscape) & Astra Vocapreneur (Landscape)
    // Right: HAKI Ciptaan (Portrait)
    const r2Left = portraits[3] || portraits[2] || landscapes[4];
    const r2Mid1 = landscapes[2];
    const r2Mid2 = landscapes[3];
    const r2Right = portraits[2] || portraits[3] || landscapes[5];

    const usedIds = new Set(
      [r1Left, r1Mid1, r1Mid2, r1Right, r2Left, r2Mid1, r2Mid2, r2Right]
        .filter(Boolean)
        .map((c) => c.id)
    );

    const remaining = list.filter((c) => !usedIds.has(c.id));

    return {
      row1: { left: r1Left, midTop: r1Mid1, midBottom: r1Mid2, right: r1Right },
      row2: { left: r2Left, midTop: r2Mid1, midBottom: r2Mid2, right: r2Right },
      remainingCerts: remaining,
    };
  }, [bentoCertificates]);

  const renderCertCard = (cert, idx = 0) => {
    if (!cert) return null;
    const theme = FIGMA_THEMES[idx % FIGMA_THEMES.length];

    return (
      <div
        key={cert.id}
        onClick={() => onSelectCert(cert)}
        className={`group relative rounded-2xl overflow-hidden bg-white border border-gray-200/90 ${theme.hoverBorder} hover:ring-2 ${theme.hoverRing} shadow-[0_4px_22px_rgba(0,0,0,0.06)] ${theme.shadow} transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none`}
      >
        {/* Full Sharp Uncropped Certificate Image with RefineFrame Loader */}
        <RefineImage
          src={cert.image}
          alt={cert.title}
          aspectRatio="auto"
          background="transparent"
          radius={0}
          className="w-full h-auto block select-none"
          imgClassName="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.012]"
        />

        {/* Figma Community File Card Hover Overlay (Light Theme + Multicolor) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between pointer-events-none">
          {/* Preview Canvas: Colored Figma Multiplayer Cursor */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <div className="flex items-start gap-1 transform translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
              {/* Figma Colored Cursor Arrow */}
              <svg className="w-5 h-5 shrink-0" style={{ color: theme.color }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2l16 11.5-7.5 1.5-3.5 7z" />
              </svg>
              {/* Figma Colored Pill Tag */}
              <div
                className="text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-[3px] shadow-sm tracking-wide"
                style={{ backgroundColor: theme.color }}
              >
                Inspect
              </div>
            </div>
          </div>

          {/* Bottom: Light Figma File Metadata Bar */}
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 p-3 sm:p-3.5 flex items-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-sm">
            {/* Colorful Square with Figma Pen Tool Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white"
              style={{ backgroundColor: theme.color }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>

            {/* Title & Subtitle (Crisp dark text in Light Theme) */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-[13px] font-bold text-gray-950 truncate leading-snug">
                {cert.title}
              </h3>
              <p className="text-[11px] text-gray-500 truncate mt-0.5 font-normal">
                {cert.institution} {cert.period && <span>&bull; {cert.period}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="haki-certifications"
      className="relative py-12 sm:py-16 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto"
    >
      <div id="credentials" className="absolute -top-24" />
      <div id="certifications" className="absolute -top-24" />

      {/* 3-Column Bento Grid: Dynamic 8 Initial / All Database Certificates */}
      <div className="space-y-7 sm:space-y-9">
        {/* Row 1: Left Portrait, Middle 2 Landscapes, Right Portrait */}
        <ScrollReveal delay={0.05} y={32}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
            {/* Left: Pilmapres (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(row1.left, 0)}
            </div>

            {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
            <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
              {renderCertCard(row1.midTop, 1)}
              {renderCertCard(row1.midBottom, 2)}
            </div>

            {/* Right: BNSP (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(row1.right, 3)}
            </div>
          </div>
        </ScrollReveal>

        {/* Row 2: Left Portrait, Middle 2 Landscapes, Right Portrait */}
        <ScrollReveal delay={0.15} y={32}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
            {/* Left: Cakrawala / Junior Web Programmer (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(row2.left, 4)}
            </div>

            {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
            <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
              {renderCertCard(row2.midTop, 5)}
              {renderCertCard(row2.midBottom, 6)}
            </div>

            {/* Right: HAKI Ciptaan (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(row2.right, 7)}
            </div>
          </div>
        </ScrollReveal>

        {/* Show All: Additional certificates from database */}
        {showAllCerts && remainingCerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-start pt-2">
            {remainingCerts.map((cert, i) => (
              <div key={cert.id} className="flex flex-col">
                {renderCertCard(cert, 8 + i)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show All / Show Less Button */}
      {remainingCerts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAllCerts(!showAllCerts)}
            className="inline-flex items-center gap-2.5 text-xs font-semibold px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
          >
            <span>{showAllCerts ? 'Show less' : `Show all certificates (${bentoCertificates.length})`}</span>
            <svg
              className={`w-3.5 h-3.5 stroke-current transition-transform duration-200 ${showAllCerts ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
});
