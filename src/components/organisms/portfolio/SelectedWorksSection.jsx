import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowUpRight } from 'lucide-react';
import { slugify } from '../../../utils/slugify';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { getOptimizedImageUrl } from '../../../utils/cloudinary';
import { CertPaper } from './CertPaper';
import { GlossyBrochure } from './GlossyBrochure';

/* ─── Die-Cut Stickers & Stamp Artwork Matching Reference ────────────────── */

// Coral-Red Cat Die-Cut Sticker (Front-Right of Left Folder)
function CoralCatPocketSticker({ className = '' }) {
  return (
    <div
      className={`filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)] drop-shadow-[0_8px_16px_rgba(244,63,94,0.22)] select-none pointer-events-none ${className}`}
    >
      <svg width="100%" height="100%" viewBox="0 0 110 105" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White Die-Cut Vinyl Outline */}
        <path
          d="M28 46 L33 14 L50 34 C54 33 58 33 62 34 L79 14 L84 46 C92 55 92 70 83 80 C72 90 40 90 29 80 C20 70 20 55 28 46 Z"
          fill="white"
          stroke="white"
          strokeWidth="11"
          strokeLinejoin="round"
        />
        {/* Whiskers White Backing */}
        <g stroke="white" strokeWidth="8" strokeLinecap="round">
          <line x1="25" y1="62" x2="10" y2="57" />
          <line x1="24" y1="68" x2="9" y2="68" />
          <line x1="26" y1="74" x2="12" y2="78" />
          <line x1="85" y1="62" x2="100" y2="57" />
          <line x1="86" y1="68" x2="101" y2="68" />
          <line x1="84" y1="74" x2="98" y2="78" />
        </g>
        {/* Coral-Red Cat Head */}
        <path
          d="M29 47 L34 17 L50 36 C54 35 58 35 62 36 L78 17 L83 47 C90 55 90 69 81 78 C71 87 41 87 31 78 C22 69 22 55 29 47 Z"
          fill="#F45B69"
        />
        {/* Cute Wide Eyes Looking Slightly Left */}
        <circle cx="43" cy="61" r="6" fill="white" />
        <circle cx="68" cy="61" r="6" fill="white" />
        <circle cx="41.5" cy="61" r="3" fill="#4A151B" />
        <circle cx="66.5" cy="61" r="3" fill="#4A151B" />
        {/* Tiny Pink Nose */}
        <ellipse cx="55.5" cy="67.5" rx="2.5" ry="1.8" fill="#FFB3BA" />
        {/* Coral Whiskers */}
        <g stroke="#F45B69" strokeWidth="2.6" strokeLinecap="round">
          <line x1="26" y1="62" x2="12" y2="58" />
          <line x1="25" y1="68" x2="11" y2="68" />
          <line x1="27" y1="74" x2="14" y2="77" />
          <line x1="84" y1="62" x2="98" y2="58" />
          <line x1="85" y1="68" x2="99" y2="68" />
          <line x1="83" y1="74" x2="96" y2="77" />
        </g>
      </svg>
    </div>
  );
}

// Perforated Scenic Postage Stamp Sticker (Front-Right of Right Folder)
function PostageStampSticker({ className = '' }) {
  return (
    <div
      className={`filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.20)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] select-none pointer-events-none ${className}`}
    >
      <svg width="100%" height="100%" viewBox="0 0 96 116" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stampSky" x1="48" y1="12" x2="48" y2="104" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60B6F7" />
            <stop offset="65%" stopColor="#A8DCFA" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <clipPath id="stampInnerClip">
            <rect x="11" y="11" width="74" height="94" rx="2" />
          </clipPath>
        </defs>

        {/* Outer Coral-Red Serrated Stamp Base */}
        <rect
          x="5"
          y="5"
          width="86"
          height="106"
          rx="3"
          fill="#F45B69"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeDasharray="4 4"
        />
        {/* Inner White Frame */}
        <rect x="8.5" y="8.5" width="79" height="99" rx="2" fill="#FFFFFF" />
        {/* Inner Red Hairline Frame */}
        <rect x="10.5" y="10.5" width="75" height="95" rx="1.5" stroke="#F45B69" strokeWidth="1.5" fill="url(#stampSky)" />

        <g clipPath="url(#stampInnerClip)">
          {/* Fluffy White Clouds */}
          <path
            d="M10 42 Q22 36 32 41 Q42 35 54 42 L54 50 L10 50 Z"
            fill="white"
            opacity="0.85"
          />
          <ellipse cx="28" cy="28" rx="16" ry="4.5" fill="white" opacity="0.75" />

          {/* Distant Blue Mountains & Lake */}
          <path d="M10 78 L34 62 L58 76 L86 64 L86 106 L10 106 Z" fill="#3B82F6" opacity="0.55" />
          <rect x="10" y="80" width="76" height="26" fill="#2563EB" opacity="0.45" />

          {/* Multi-Tiered Pagoda / Temple on Right (Matching Reference Stamp) */}
          <g transform="translate(46, 22)">
            {/* Spire */}
            <line x1="22" y1="0" x2="22" y2="14" stroke="#991B1B" strokeWidth="2.5" />
            {/* Tier 1 Roof */}
            <path d="M8 16 Q22 10 36 16 L32 21 L12 21 Z" fill="#334155" />
            <rect x="14" y="21" width="16" height="6" fill="#DC2626" />
            {/* Tier 2 Roof */}
            <path d="M5 29 Q22 23 39 29 L34 35 L10 35 Z" fill="#334155" />
            <rect x="12" y="35" width="20" height="7" fill="#DC2626" />
            {/* Tier 3 Roof */}
            <path d="M2 44 Q22 37 42 44 L36 50 L8 50 Z" fill="#334155" />
            <rect x="10" y="50" width="24" height="8" fill="#DC2626" />
            {/* Tier 4 Roof */}
            <path d="M0 60 Q22 52 44 60 L38 67 L6 67 Z" fill="#334155" />
            <rect x="8" y="67" width="28" height="12" fill="#B91C1C" />
          </g>

          {/* Pink Cherry Blossom Foreground */}
          <circle cx="22" cy="96" r="10" fill="#F472B6" />
          <circle cx="34" cy="99" r="9" fill="#FB7185" />
          <circle cx="15" cy="88" r="7" fill="#FBCFE8" />
          <circle cx="27" cy="91" r="6" fill="#F9A8D4" />
        </g>
      </svg>
    </div>
  );
}

// Mini Flame Sticker
function MiniFlameIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 6 C32 6 48 22 48 37 C48 49 39 58 28 58 C17 58 12 48 12 38 C12 27 22 18 24 10 C24 10 30 16 30 22 C30 15 32 6 32 6 Z"
        fill="#FF6B00"
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M30 28 C30 28 38 36 38 44 C38 50 34 54 28 54 C23 54 20 49 20 44 C20 38 26 34 30 28 Z"
        fill="#FFD43B"
      />
    </svg>
  );
}

// Mini Purple Star Sticker
function MiniStarIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 6 L39 23 L57 25 L43 37 L47 55 L32 45 L17 55 L21 37 L7 25 L25 23 Z"
        fill="#6366F1"
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="31" r="2.2" fill="white" />
      <circle cx="37" cy="31" r="2.2" fill="white" />
    </svg>
  );
}

// Mini Berries Icon
function MiniBerriesIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="36" r="14" fill="#6366F1" stroke="white" strokeWidth="3" />
      <circle cx="43" cy="38" r="11" fill="#F43F5E" stroke="white" strokeWidth="3" />
      <ellipse cx="32" cy="19" rx="8" ry="4.5" transform="rotate(-18 32 19)" fill="#10B981" />
    </svg>
  );
}

// Mini Purple Cat Icon
function MiniPurpleCatIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 26 L18 10 L29 19 C31 18 33 18 35 19 L46 10 L50 26 C55 33 55 43 49 50 C41 56 23 56 15 50 C9 43 9 33 14 26 Z"
        fill="#6366F1"
        stroke="white"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="35" r="2.5" fill="white" />
      <circle cx="39" cy="35" r="2.5" fill="white" />
    </svg>
  );
}

// Mini Globe Icon with Cute Eyes
function MiniGlobeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" fill="white" stroke="#2563EB" strokeWidth="3.5" />
      <ellipse cx="32" cy="32" rx="11" ry="22" stroke="#2563EB" strokeWidth="2.5" />
      <line x1="10" y1="32" x2="54" y2="32" stroke="#2563EB" strokeWidth="2.5" />
      <line x1="13" y1="21" x2="51" y2="21" stroke="#2563EB" strokeWidth="2" />
      <line x1="13" y1="43" x2="51" y2="43" stroke="#2563EB" strokeWidth="2" />
      <circle cx="27" cy="29" r="3.5" fill="white" stroke="#1E3A8A" strokeWidth="2" />
      <circle cx="37" cy="29" r="3.5" fill="white" stroke="#1E3A8A" strokeWidth="2" />
      <circle cx="27.5" cy="29" r="1.5" fill="#1E3A8A" />
      <circle cx="37.5" cy="29" r="1.5" fill="#1E3A8A" />
    </svg>
  );
}

/* ─── Main Unified Folder Showcase Component ─────────────────────────────── */

export const SelectedWorksSection = React.memo(function SelectedWorksSection({
  projectsList = [],
  bentoCertificates = [],
  onSelectCert,
  isBannerDark,
  sectionData
}) {
  const navigate = useNavigate();
  const [showCertsDrawer, setShowCertsDrawer] = useState(false);

  const rawTitle = sectionData?.title;
  const headingText =
    rawTitle && rawTitle.toLowerCase() !== 'selected works'
      ? rawTitle
      : "Things I've built & earned.";

  // Top 3 projects for Left Folder ("Selected works")
  const topProjects = projectsList.slice(0, 3);

  // Top 3 certificates for Right Folder ("Certifications & HAKI")
  const topCerts = bentoCertificates.slice(0, 3);

  const getProjImg = (proj) => {
    if (!proj) return null;
    const raw =
      proj.thumbnail_url ||
      proj.thumbnail ||
      proj.image_url ||
      (Array.isArray(proj.image_urls) && proj.image_urls.length > 0 ? proj.image_urls[0] : null);
    return getOptimizedImageUrl(raw, { width: 500 });
  };

  return (
    <section
      id="works"
      className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-[1280px] mx-auto overflow-visible transition-colors duration-700 ease-in-out"
    >
      {/* Anchor targets so both #works and #certifications navbar links scroll here */}
      <div id="work" className="absolute -top-24" />
      <div id="certifications" className="absolute -top-24" />

      {/* Centered Section Title */}
      <ScrollReveal delay={0.05} y={20}>
        <div className="text-center mb-14 sm:mb-20">
          <h2
            data-builder-field="title"
            data-builder-label="Showcase Section Title"
            className={`text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight transition-colors duration-500 ${
              isBannerDark ? 'text-black' : 'text-[#141414]'
            }`}
          >
            {headingText}
          </h2>
        </div>
      </ScrollReveal>

      {/* ─── Two Side-by-Side Interactive Folder Pockets ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 sm:gap-12 lg:gap-16 max-w-[1020px] mx-auto items-end">
        {/* =====================================================================
            FOLDER 1 (LEFT): SELECTED WORKS (Browser Cards Fanned Out)
           ===================================================================== */}
        <ScrollReveal delay={0.1} y={28}>
          <div
            onClick={() => navigate('/works')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/works');
            }}
            className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none"
          >
            {/* Folder Container */}
            <div className="relative w-full max-w-[440px] pt-16 sm:pt-20">
              {/* Back Folder Flap / Wall */}
              <div
                className="absolute inset-x-2 top-8 sm:top-10 h-[220px] sm:h-[250px] rounded-[28px] transition-transform duration-500 group-hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(180deg, #E8EAEE 0%, #DCDFE5 100%)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)'
                }}
              />

              {/* 3 Fanned-Out Portrait Glossy Brochures Sticking Out of Pocket */}
              <div className="relative h-[135px] sm:h-[155px] w-full flex items-end justify-center z-10 pointer-events-auto">
                {/* 3 portrait glossy brochures tucked in the pocket */}
                {[0, 1, 2].map((i) => {
                  const proj = topProjects[i];
                  const slug = proj ? proj.slug || slugify(proj.title) : null;
                  const pos = [
                    'left-2 sm:left-4 bottom-[-58px] origin-bottom-left -rotate-[7deg] group-hover:-rotate-[12deg] group-hover:-translate-x-3 group-hover:-translate-y-6 z-10',
                    'left-1/2 -ml-[76px] sm:-ml-[84px] bottom-[-44px] origin-bottom rotate-[1deg] group-hover:rotate-0 group-hover:-translate-y-10 z-20',
                    'right-2 sm:right-4 bottom-[-60px] origin-bottom-right rotate-[7deg] group-hover:rotate-[12deg] group-hover:translate-x-3 group-hover:-translate-y-6 z-30'
                  ][i];
                  return (
                    <div
                      key={proj?.id || i}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (slug) navigate(`/project/${slug}`);
                        else navigate('/works');
                      }}
                      className={`absolute w-[152px] sm:w-[168px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!scale-105 ${pos}`}
                    >
                      <GlossyBrochure
                        project={proj}
                        image={getProjImg(proj)}
                        accent={['#FF5500', '#1D3B8B', '#0F766E'][i]}

                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>

              {/* ─── Front Tactile Cardstock Pocket Flap ─── */}
              <div
                className="relative z-40 w-full h-[195px] sm:h-[220px] rounded-[26px] border border-black/[0.07] border-t-[2px] border-t-white overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_-6px_20px_rgba(0,0,0,0.05),0_28px_50px_-12px_rgba(0,0,0,0.16)]"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 45%, #EBEEF3 100%)',
                  boxShadow:
                    '0 -4px 12px rgba(0,0,0,0.03), 0 20px 38px -12px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.04)'
                }}
              >
                {/* Subtle Paper Grain Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-multiply"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pNoise)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Top-Right Coral Cat Die-Cut Sticker (Exact Match to Reference) */}
                <div className="absolute top-3.5 right-6 sm:right-8 w-16 h-16 sm:w-20 sm:h-20 rotate-[10deg] transition-transform duration-500 group-hover:rotate-[16deg] group-hover:scale-105">
                  <CoralCatPocketSticker className="w-full h-full" />
                </div>

                {/* Bottom-Left 3 Overlapping Circular Sticker Pills + Count */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-3">
                  <div className="flex items-center -space-x-2.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FCE7F3] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
                      <MiniBerriesIcon className="w-5 h-5" />
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E0E7FF] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 delay-75 group-hover:-translate-y-1">
                      <MiniStarIcon className="w-5 h-5" />
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#DCFCE7] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 delay-150 group-hover:-translate-y-0.5">
                      <MiniFlameIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                    Explore {projectsList.length} works <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5500]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Folder Label Below */}
            <h3 className="mt-6 text-xl sm:text-[22px] font-medium tracking-tight text-[#4B5563] group-hover:text-[#141414] transition-colors">
              Selected works
            </h3>
          </div>
        </ScrollReveal>

        {/* =====================================================================
            FOLDER 2 (RIGHT): CERTIFICATIONS & HAKI (Credential Cards Fanned Out)
           ===================================================================== */}
        <ScrollReveal delay={0.18} y={28}>
          <div
            onClick={() => setShowCertsDrawer(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setShowCertsDrawer(true);
            }}
            className="group relative flex flex-col items-center cursor-pointer select-none focus:outline-none"
          >
            {/* Folder Container */}
            <div className="relative w-full max-w-[440px] pt-16 sm:pt-20">
              {/* Back Folder Flap / Wall */}
              <div
                className="absolute inset-x-2 top-8 sm:top-10 h-[220px] sm:h-[250px] rounded-[28px] transition-transform duration-500 group-hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(180deg, #E8EAEE 0%, #DCDFE5 100%)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)'
                }}
              />

              {/* 3 Fanned-Out Mobile / Credential Cards Sticking Out of Pocket */}
              <div className="relative h-[135px] sm:h-[155px] w-full flex items-end justify-center z-10 pointer-events-auto">
                {/* 3 real certificate sheets — original shape, no frame, real paper texture */}
                {[0, 1, 2].map((i) => {
                  const cert = topCerts[i];
                  const pos = [
                    'left-1 sm:left-3 bottom-[-46px] origin-bottom-left -rotate-[8deg] group-hover:-rotate-[13deg] group-hover:-translate-x-3 group-hover:-translate-y-6 z-10',
                    'left-1/2 -ml-[86px] sm:-ml-[96px] bottom-[-34px] origin-bottom rotate-[1deg] group-hover:rotate-0 group-hover:-translate-y-10 z-20',
                    'right-1 sm:right-3 bottom-[-48px] origin-bottom-right rotate-[8deg] group-hover:rotate-[13deg] group-hover:translate-x-3 group-hover:-translate-y-6 z-30'
                  ][i];
                  return (
                    <div
                      key={cert?.id || i}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectCert && cert?.image) onSelectCert(cert);
                        else setShowCertsDrawer(true);
                      }}
                      className={`absolute w-[172px] sm:w-[192px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!scale-105 ${pos}`}
                    >
                      <CertPaper
                        src={cert?.image ? getOptimizedImageUrl(cert.image, { width: 480 }) : null}
                        alt={cert?.title || 'Certificate'}
                        className="w-full max-h-[205px] sm:max-h-[230px]"
                      />
                    </div>
                  );
                })}
              </div>

              {/* ─── Front Tactile Cardstock Pocket Flap ─── */}
              <div
                className="relative z-40 w-full h-[195px] sm:h-[220px] rounded-[26px] border border-black/[0.07] border-t-[2px] border-t-white overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_-6px_20px_rgba(0,0,0,0.05),0_28px_50px_-12px_rgba(0,0,0,0.16)]"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 45%, #EBEEF3 100%)',
                  boxShadow:
                    '0 -4px 12px rgba(0,0,0,0.03), 0 20px 38px -12px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.04)'
                }}
              >
                {/* Subtle Paper Grain Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-multiply"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pNoise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pNoise2)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Top-Right Perforated Postage Stamp Sticker (Exact Match to Reference) */}
                <div className="absolute top-3 right-6 sm:right-8 w-16 h-20 sm:w-[74px] sm:h-[90px] rotate-[1deg] transition-transform duration-500 group-hover:rotate-[6deg] group-hover:scale-105">
                  <PostageStampSticker className="w-full h-full" />
                </div>

                {/* Bottom-Left 3 Overlapping Circular Sticker Pills + Count */}
                <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-3">
                  <div className="flex items-center -space-x-2.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFEDD5] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
                      <MiniPurpleCatIcon className="w-5 h-5" />
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#DBEAFE] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 delay-75 group-hover:-translate-y-1">
                      <MiniGlobeIcon className="w-5 h-5" />
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F3E8FF] border-[2.5px] border-white shadow-sm flex items-center justify-center transition-transform duration-300 delay-150 group-hover:-translate-y-0.5">
                      <MiniFlameIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                    View {bentoCertificates.length} credentials <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5500]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Folder Label Below */}
            <h3 className="mt-6 text-xl sm:text-[22px] font-medium tracking-tight text-[#4B5563] group-hover:text-[#141414] transition-colors">
              Certifications &amp; HAKI
            </h3>
          </div>
        </ScrollReveal>
      </div>

      {/* ─── Ultra-clean Certifications & HAKI Gallery (When Right Folder Clicked) ─── */}
      {showCertsDrawer && (
        <div
          className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setShowCertsDrawer(false)}
        >
          <button
            type="button"
            onClick={() => setShowCertsDrawer(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close certifications gallery"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Masonry: every certificate keeps its natural portrait/landscape shape */}
          <div className="max-w-[1180px] mx-auto px-5 sm:px-10 pt-20 pb-16 columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
            {bentoCertificates.map((cert, idx) => (
              <button
                type="button"
                key={cert.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCert) onSelectCert(cert);
                }}
                aria-label={cert.title}
                className="block w-full mb-6 sm:mb-8 break-inside-avoid cursor-zoom-in transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.015] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
              >
                <CertPaper
                  src={getOptimizedImageUrl(cert.image, { width: 800 })}
                  alt={cert.title}
                  className="w-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
});
