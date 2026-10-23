import React, { useState } from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function CertificationsSection({ bentoCertificates, onSelectCert }) {
  const [showAllCerts, setShowAllCerts] = useState(false);

  const renderCertCard = (cert) => {
    if (!cert) return null;
    return (
      <div
        key={cert.id}
        onClick={() => onSelectCert(cert)}
        className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200/90 hover:border-[#0D99FF] hover:ring-2 hover:ring-[#0D99FF]/25 shadow-[0_4px_22px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(13,153,255,0.18)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
      >
        {/* Full Sharp Uncropped Certificate Image */}
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.015]"
          loading="lazy"
        />

        {/* Figma Community File Card Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between pointer-events-none">
          {/* Preview Canvas: Blue Figma Multiplayer Cursor */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <div className="flex items-start gap-1 transform translate-x-3 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-lg">
              {/* Figma Blue Cursor Arrow */}
              <svg className="w-5 h-5 text-[#0D99FF] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2l16 11.5-7.5 1.5-3.5 7z" />
              </svg>
              {/* Figma Blue Pill Tag */}
              <div className="bg-[#0D99FF] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-[3px] shadow-sm tracking-wide">
                Inspect
              </div>
            </div>
          </div>

          {/* Bottom: Dark Figma File Metadata Bar (matches reference) */}
          <div className="bg-[#242424] border-t border-white/10 p-3 sm:p-3.5 flex items-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {/* Blue Square with Figma Pen Tool Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#0D99FF] flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-[13px] font-semibold text-white truncate leading-snug">
                {cert.title}
              </h3>
              <p className="text-[11px] text-[#8F8F8F] truncate mt-0.5 font-normal">
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
        {/* Row 1: Left Portrait (0), Middle 2 Landscapes (1 & 3), Right Portrait (2) */}
        <ScrollReveal delay={0.05} y={32}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
            {/* Left: Pilmapres (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(bentoCertificates[0])}
            </div>

            {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
            <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
              {renderCertCard(bentoCertificates[1])}
              {renderCertCard(bentoCertificates[3])}
            </div>

            {/* Right: BNSP (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(bentoCertificates[2])}
            </div>
          </div>
        </ScrollReveal>

        {/* Row 2: Left Portrait (5), Middle 2 Landscapes (6 & 7), Right Portrait (4) */}
        <ScrollReveal delay={0.15} y={32}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
            {/* Left: Cakrawala (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(bentoCertificates[5])}
            </div>

            {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
            <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
              {renderCertCard(bentoCertificates[6])}
              {renderCertCard(bentoCertificates[7])}
            </div>

            {/* Right: HAKI Ciptaan (Portrait) */}
            <div className="flex flex-col">
              {renderCertCard(bentoCertificates[4])}
            </div>
          </div>
        </ScrollReveal>

        {/* Show All: Additional certificates from database */}
        {showAllCerts && bentoCertificates.length > 8 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-start pt-2">
            {bentoCertificates.slice(8).map((cert) => (
              <div key={cert.id} className="flex flex-col">
                {renderCertCard(cert)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show All / Show Less Button */}
      {bentoCertificates.length > 8 && (
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
}
