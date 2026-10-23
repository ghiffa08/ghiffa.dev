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
        className="group relative rounded-xl overflow-visible bg-white border border-gray-200/90 hover:border-[#FF5500] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_40px_rgba(255,85,0,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      >
        {/* 4 Corner Figma Selection Handles */}
        <span className="w-2.5 h-2.5 bg-white border-[1.5px] border-[#FF5500] rounded-[2px] absolute -top-1.5 -left-1.5 z-30 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xs" />
        <span className="w-2.5 h-2.5 bg-white border-[1.5px] border-[#FF5500] rounded-[2px] absolute -top-1.5 -right-1.5 z-30 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xs" />
        <span className="w-2.5 h-2.5 bg-white border-[1.5px] border-[#FF5500] rounded-[2px] absolute -bottom-1.5 -left-1.5 z-30 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xs" />
        <span className="w-2.5 h-2.5 bg-white border-[1.5px] border-[#FF5500] rounded-[2px] absolute -bottom-1.5 -right-1.5 z-30 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-200 pointer-events-none shadow-xs" />

        {/* Card Content Wrapper with overflow-hidden for image & overlay */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {/* Full Sharp Uncropped Certificate Image */}
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-auto block select-none transition-transform duration-500 group-hover:scale-[1.015]"
            loading="lazy"
          />

          {/* Top Figma Layer Badges (Reveal on Hover) */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
            {/* Left: Figma Frame Tag */}
            <div className="inline-flex items-center gap-1.5 bg-[#FF5500] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250">
              <svg className="w-3 h-3 stroke-current shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M4 8h16M4 16h16M8 4v16M16 4v16" />
              </svg>
              <span>{cert.badge || cert.tag || 'CREDENTIAL'}</span>
            </div>

            {/* Right: Figma Canvas Period / Year */}
            {cert.period && (
              <div className="bg-[#18181B]/85 backdrop-blur-md text-white font-mono text-[10px] font-medium px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider transform -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250">
                {cert.period}
              </div>
            )}
          </div>

          {/* Bottom Figma Floating Inspector Card */}
          <div className="absolute inset-x-2.5 sm:inset-x-3 bottom-2.5 sm:bottom-3 z-20 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-3.5 border border-gray-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
              <div className="text-[11px] text-gray-500 font-medium truncate mb-1">
                {cert.institution}
              </div>
              <h3 className="text-xs sm:text-[13.5px] font-bold text-gray-950 leading-snug line-clamp-2">
                {cert.title}
              </h3>

              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF5500] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                  <span>Inspect</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-800 group-hover:text-[#FF5500] transition-colors">
                  <span>View Document</span>
                  <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Gentle Bottom Gradient Scrim to ensure Floating Card Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
