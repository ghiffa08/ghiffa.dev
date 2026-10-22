import React, { useState } from 'react';

export function CertificationsSection({ bentoCertificates, onSelectCert }) {
  const [showAllCerts, setShowAllCerts] = useState(false);

  const renderCertCard = (cert) => {
    if (!cert) return null;
    return (
      <div
        key={cert.id}
        onClick={() => onSelectCert(cert)}
        className="group relative overflow-hidden bg-white shadow-[0_4px_22px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      >
        {/* Full Sharp Uncropped Certificate Image */}
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-auto block select-none"
          loading="lazy"
        />

        {/* Clean Theme Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 text-white">
          {/* Top: Tag & Period */}
          <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              {cert.tag || 'CRT'}
            </span>
            <span className="font-mono text-[11px] text-white/75 tracking-wider uppercase">
              {cert.period}
            </span>
          </div>

          {/* Bottom: Institution, Title & Action */}
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-xs text-white/80 font-medium mb-1 truncate">
              {cert.institution}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2 sm:line-clamp-3">
              {cert.title}
            </h3>
            <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px] text-white/90 font-medium">
              <span>View Full Document</span>
              <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
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

        {/* Row 2: Left Portrait (5), Middle 2 Landscapes (6 & 7), Right Portrait (4) */}
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
