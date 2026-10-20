import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Globe, 
  Dribbble, 
  Plus, 
  Minus, 
  CornerDownRight,
  ExternalLink
} from 'lucide-react';

const SERVICES_DATA = [
  { 
    id: '01', 
    title: 'WEB DESIGN', 
    desc: 'Bespoke visual identities, high-converting landing pages, and editorial layouts tailored for bold brands.' 
  },
  { 
    id: '02', 
    title: 'WEB DEVELOPMENT', 
    desc: 'Clean, semantic, and blazing-fast frontend architecture with fluid animations and responsive precision.' 
  },
  { 
    id: '03', 
    title: 'BRANDING', 
    desc: 'Strategic visual systems, typography direction, and brand guidelines that cut through digital noise.' 
  },
  { 
    id: '04', 
    title: 'UI/UX DESIGN', 
    desc: 'User-centric wireframing, interactive prototyping, and intuitive design systems built for scale.' 
  },
  { 
    id: '05', 
    title: 'CMS & E-COMMERCE', 
    desc: 'Scalable content management and seamless shopping experiences on Webflow, Shopify, and WordPress.' 
  },
  { 
    id: '06', 
    title: 'MAINTENANCE & SUPPORT', 
    desc: 'Ongoing performance optimization, continuous updates, and technical peace of mind.' 
  },
];

const TECH_STACK = [
  'FIGMA',
  'WEBFLOW',
  'HTML / CSS',
  'JAVASCRIPT',
  'GSAP',
  'WORDPRESS',
  'SHOPIFY'
];

const CrosshairIcon = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="opacity-75">
    <circle cx="23" cy="23" r="14" stroke="#1c1c1a" strokeWidth="1" />
    <circle cx="23" cy="23" r="7" stroke="#1c1c1a" strokeWidth="1" />
    <line x1="23" y1="0" x2="23" y2="46" stroke="#1c1c1a" strokeWidth="1" />
    <line x1="0" y1="23" x2="46" y2="23" stroke="#1c1c1a" strokeWidth="1" />
  </svg>
);

const WireframeGlobe = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="shrink-0">
    <circle cx="23" cy="23" r="21" stroke="#1c1c1a" strokeWidth="1.2" />
    <ellipse cx="23" cy="23" rx="10" ry="21" stroke="#1c1c1a" strokeWidth="1.2" />
    <line x1="2" y1="23" x2="44" y2="23" stroke="#1c1c1a" strokeWidth="1.2" />
    <path d="M5 13C15 16 31 16 41 13" stroke="#1c1c1a" strokeWidth="1.2" />
    <path d="M5 33C15 30 31 30 41 33" stroke="#1c1c1a" strokeWidth="1.2" />
    <line x1="23" y1="2" x2="23" y2="44" stroke="#1c1c1a" strokeWidth="1.2" />
  </svg>
);

const RotatingStamp = () => (
  <div className="relative w-32 h-32 flex items-center justify-center select-none group">
    <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
      <circle cx="60" cy="60" r="56" stroke="#EAE6DF" strokeWidth="1.2" fill="none" opacity="0.85" />
      <circle cx="60" cy="60" r="38" stroke="#EAE6DF" strokeWidth="1" fill="none" opacity="0.6" />
      <defs>
        <path
          id="stampTextPath"
          d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
        />
      </defs>
      <text fill="#EAE6DF" fontSize="7.2" fontFamily="JetBrains Mono, monospace" letterSpacing="2.6px" fontWeight="600">
        <textPath href="#stampTextPath" startOffset="0%">
          STRATEGY • DESIGN • EXPERIENCE •
        </textPath>
      </text>
    </svg>
    {/* Center Geometric M Logo */}
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="34" height="30" viewBox="0 0 34 30" fill="none" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M2 28V2L17 16L32 2V28H25V14L17 22L9 14V28H2Z" fill="#E84E0F" />
        <rect x="14" y="2" width="6" height="6" fill="#EAE6DF" />
      </svg>
    </div>
  </div>
);

const BarcodeGraphic = () => {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2];
  return (
    <div className="flex items-stretch h-8 gap-[2px] opacity-85 bg-[#141413] p-1">
      {bars.map((width, idx) => (
        <div
          key={idx}
          className="bg-[#EAE6DF]"
          style={{ width: `${width * 1.6}px` }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [expandedService, setExpandedService] = useState(null);
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);

  const toggleService = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#111110] py-0 sm:py-8 px-0 sm:px-4 flex justify-center items-start font-mono text-[#1c1c1a] selection:bg-[#E84E0F] selection:text-[#EAE6DF]">
      {/* Google Fonts & Custom Brutalist Grunge Styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Syne:wght@600;700;800&display=swap');

        .font-anton {
          font-family: 'Anton', Impact, sans-serif;
        }
        .font-mono-tech {
          font-family: 'JetBrains Mono', monospace;
        }
        .font-syne {
          font-family: 'Syne', sans-serif;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 24s linear infinite;
        }

        /* Subtle distressed ink texture on giant headline */
        .grunge-headline {
          position: relative;
        }
      `}</style>

      {/* SVG Filters for Paper Noise & Grunge Distress */}
      <svg className="hidden">
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* MAIN POSTER CONTAINER */}
      <div className="w-full max-w-[1040px] bg-[#EAE6DF] relative shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden border border-[#2c2c2a]">
        
        {/* Global Fine Noise Texture Overlay */}
        <div 
          className="pointer-events-none absolute inset-0 z-40 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* =========================================================
            1. TOP NAVIGATION / STATUS BAR
        ========================================================= */}
        <header className="relative z-20 px-6 sm:px-12 pt-7 pb-4 flex justify-between items-start text-[11px] sm:text-xs leading-[1.35] tracking-[0.06em] font-mono-tech font-medium uppercase">
          {/* Top Left */}
          <div>
            <div className="w-3.5 h-[3px] bg-[#E84E0F] mb-2" />
            <p className="text-[#1c1c1a]">WEB DESIGNER</p>
            <p className="text-[#4a4946]">DIGITAL CREATOR</p>
          </div>

          {/* Top Center */}
          <div className="text-center">
            <div className="h-[3px] mb-2 opacity-0" />
            <p className="text-[#1c1c1a]">BASED IN</p>
            <p className="text-[#4a4946]">EVERYWHERE</p>
          </div>

          {/* Top Right */}
          <div className="text-right flex flex-col items-end">
            <div className="w-3.5 h-[3px] bg-[#E84E0F] mb-2" />
            <p className="text-[#1c1c1a]">AVAILABLE FOR</p>
            <p className="text-[#4a4946]">NEW PROJECTS</p>
          </div>
        </header>

        {/* =========================================================
            2. HERO SECTION (TYPOGRAPHY + PORTRAIT + ABOUT ME)
        ========================================================= */}
        <section className="relative z-10 px-6 sm:px-12 pt-3 pb-10 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
            
            {/* LEFT COLUMN: STACKED BRUTALIST HEADLINE & ABOUT ME */}
            <div className="lg:col-span-7 relative z-20 flex flex-col justify-between">
              
              {/* Giant Stacked Headline */}
              <div className="select-none pt-1">
                <h1 className="font-anton uppercase tracking-[-0.02em] flex flex-col">
                  <span 
                    className="text-[21vw] sm:text-[152px] lg:text-[168px] leading-[0.87] text-[#222220] relative"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(234, 230, 223, 0.14) 1px, transparent 0)',
                      backgroundSize: '6px 6px'
                    }}
                  >
                    DESIGN
                  </span>
                  <span className="text-[21vw] sm:text-[152px] lg:text-[168px] leading-[0.87] text-[#222220] mt-1">
                    WITH
                  </span>
                  <span className="text-[21vw] sm:text-[152px] lg:text-[168px] leading-[0.87] text-[#E84E0F] mt-1 inline-flex items-baseline">
                    INTENT.
                    {/* Distinct black square next to the orange period */}
                    <span className="inline-block w-5 h-5 sm:w-[26px] sm:h-[26px] bg-[#1c1c1a] ml-2 sm:ml-3 mb-2 sm:mb-3 shrink-0" />
                  </span>
                </h1>
              </div>

              {/* ABOUT ME & WORLDWIDE COLLABS ROW */}
              <div className="mt-8 sm:mt-10 pb-8 lg:pb-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
                {/* About Me Text */}
                <div className="sm:col-span-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-anton text-xl sm:text-[22px] tracking-wide uppercase text-[#1c1c1a]">
                      ABOUT ME
                    </h2>
                    <span className="w-6 h-[2.5px] bg-[#1c1c1a]" />
                  </div>
                  <p className="text-[11.5px] leading-[1.55] text-[#2b2b29] font-mono-tech mb-4 max-w-[240px]">
                    I craft bold, user-centered web experiences that merge strategy, aesthetics and performance.
                  </p>
                  <p className="text-[11.5px] leading-[1.5] text-[#1c1c1a] font-mono-tech font-medium">
                    Minimal noise.<br />
                    Maximum impact.
                  </p>
                </div>

                {/* Available Worldwide Globe Badge */}
                <div className="sm:col-span-6 flex flex-col justify-end">
                  <div className="w-full h-[1px] bg-[#1c1c1a]/60 mb-4" />
                  <div className="flex items-center gap-3.5">
                    <WireframeGlobe />
                    <div className="text-[10px] leading-[1.45] font-mono-tech uppercase tracking-[0.04em] text-[#1c1c1a] font-semibold">
                      <p>AVAILABLE WORLDWIDE</p>
                      <p>FOR FREELANCE</p>
                      <p>&amp; REMOTE COLLABS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PORTRAIT WITH GEOMETRIC ORANGE BACKDROP */}
            <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[560px] lg:min-h-[635px] flex items-end justify-center lg: -ml-14">
              
              {/* Crosshair Target Graphic Top Right */}
              <div className="absolute top-12 right-2 sm:right-4 z-20">
                <CrosshairIcon />
              </div>

              {/* Bold Orange Brutalist Geometric Shapes Behind Subject */}
              <div 
                className="w-[215px] sm:w-[245px] h-[125px] bg-[#E84E0F] absolute top-[18px] left-[22px] sm:left-[40px] z-0"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              />
              <div 
                className="w-[150px] sm:w-[175px] h-[185px] bg-[#E84E0F] absolute top-[145px] right-0 sm:right-2 z-0"
                style={{
                  clipPath: 'polygon(0 0, 74% 0, 100% 24%, 100% 100%, 0 100%)'
                }}
              />

              {/* High-Contrast B&W Editorial Portrait */}
              <div className="relative z-10 w-full h-[460px] sm:h-[555px] lg:h-[615px] flex items-end justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
                  alt="Mariana Napolitani - Web Designer"
                  className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 select-none"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
                  }}
                />
                {/* Dark Blazer Visual Framing Overlay for Authentic Look */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Floating Dark Name Tag Card */}
              <div className="absolute bottom-[95px] sm:bottom-[115px] right-0 z-30 bg-[#181817]/95 border border-[#2e2e2c] px-5 py-3.5 shadow-2xl backdrop-blur-xs">
                <div className="w-8 h-[2px] bg-[#EAE6DF] mb-2 opacity-80" />
                <p className="font-mono-tech text-[#EAE6DF] text-xs sm:text-[13px] tracking-[0.14em] leading-tight uppercase font-medium">
                  MARIANA<br />
                  NAPOLITANI
                </p>
                <p className="font-mono-tech text-[#E84E0F] text-[10px] tracking-[0.14em] uppercase mt-1.5 font-semibold">
                  WEB DESIGNER
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            3. SELECTED WORK BAR (DARK BAND + VERTICAL ORANGE SIDEBAR)
        ========================================================= */}
        <section className="relative z-20 bg-[#181816] text-[#EAE6DF] flex flex-col md:flex-row border-t border-b border-[#2b2b28]">
          
          {/* Left Vertical Orange Sidebar */}
          <div className="bg-[#E84E0F] text-[#181816] md:w-[68px] py-3.5 px-6 md:py-6 md:px-0 flex md:flex-col items-center justify-between md:justify-center shrink-0 select-none">
            <div 
              className="font-mono-tech font-bold text-sm sm:text-[15px] tracking-[0.22em] uppercase flex items-center gap-3 md: [writing-mode:vertical-rl] md:rotate-180"
            >
              <span>SELECTED WORK</span>
              <span className="inline-block w-[10px] h-[2.5px] md:w-[2.5px] md:h-[14px] bg-[#181816]" />
            </div>
          </div>

          {/* 3 Project Cards Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-7 p-6 sm:p-8 lg:px-10 lg:py-8">
            
            {/* PROJECT 01: NEXUS STUDIO */}
            <div 
              onClick={() => setSelectedProjectModal({
                num: '01/',
                title: 'NEXUS STUDIO',
                category: 'WEBSITE DESIGN',
                desc: 'A brutalist 3D architectural and creative direction studio website featuring WebGL shaders and smooth scroll choreography.'
              })}
              className="group cursor-pointer flex flex-col"
            >
              <span className="text-[#E84E0F] font-mono-tech text-xs font-semibold mb-2 tracking-wider">
                01/
              </span>
              {/* Custom Designed Thumbnail 01 */}
              <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] border border-[#2e2e2b] overflow-hidden mb-3">
                {/* Abstract Dark Sculptural Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-150 brightness-75 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                
                {/* Fake Micro UI Header inside thumbnail */}
                <div className="absolute top-2.5 left-3 right-3 flex justify-between items-center text-[6px] text-white/60 font-mono-tech">
                  <span>NEXUS</span>
                  <span className="px-1.5 py-0.5 bg-white text-black font-bold rounded-[1px]">MENU</span>
                </div>

                {/* Thumbnail Overlay Typography */}
                <div className="absolute inset-0 p-4 flex flex-col justify-center">
                  <h4 className="font-syne text-white text-xl sm:text-[22px] font-bold leading-[1.05] tracking-tight">
                    NEXUS<br />
                    STUDIO<span className="text-xs align-top ml-0.5">®</span>
                  </h4>
                </div>

                {/* Bottom Right Orange Action Tag */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <CornerDownRight className="w-4 h-4 text-[#181816] stroke-[2.5]" />
                </div>
              </div>

              <h3 className="font-mono-tech text-xs font-semibold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors">
                NEXUS STUDIO
              </h3>
              <p className="font-mono-tech text-[10px] tracking-wider text-[#8e8d87] uppercase mt-0.5">
                WEBSITE DESIGN
              </p>
            </div>

            {/* PROJECT 02: ELEVATE DIGITAL */}
            <div 
              onClick={() => setSelectedProjectModal({
                num: '02/',
                title: 'ELEVATE DIGITAL',
                category: 'BRAND & WEBSITE',
                desc: 'Complete rebrand and interactive web platform for a next-generation digital product agency.'
              })}
              className="group cursor-pointer flex flex-col"
            >
              <span className="text-[#E84E0F] font-mono-tech text-xs font-semibold mb-2 tracking-wider">
                02/
              </span>
              {/* Custom Designed Thumbnail 02 */}
              <div className="relative aspect-[16/10] w-full bg-[#d8d5ce] border border-[#2e2e2b] overflow-hidden mb-3 text-[#181816]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#e5e2dc] to-[#bdb9b0] transition-transform duration-500 group-hover:scale-105" />
                
                {/* Fake Micro UI Header */}
                <div className="absolute top-2.5 left-3 right-3 flex justify-between items-center text-[6px] text-black/60 font-mono-tech">
                  <span>• ELEVATE</span>
                  <span>INDEX / WORK</span>
                </div>

                {/* Editorial Typography + Brutalist Sphere */}
                <div className="absolute inset-0 p-3.5 pt-5 flex flex-col justify-between">
                  <h4 className="font-syne text-[#181816] text-lg sm:text-[19px] font-semibold leading-none tracking-tight">
                    ELEVATE<br />
                    <span className="ml-8 font-normal text-[#4a4946]">DIGITAL</span>
                  </h4>

                  {/* 3D Metallic Sphere Graphic */}
                  <div className="self-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#181816] via-[#6e6d68] to-[#dfdcd5] shadow-inner -mb-6 border border-black/10" />
                </div>

                {/* Bottom Right Orange Action Tag */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <CornerDownRight className="w-4 h-4 text-[#181816] stroke-[2.5]" />
                </div>
              </div>

              <h3 className="font-mono-tech text-xs font-semibold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors">
                ELEVATE DIGITAL
              </h3>
              <p className="font-mono-tech text-[10px] tracking-wider text-[#8e8d87] uppercase mt-0.5">
                BRAND &amp; WEBSITE
              </p>
            </div>

            {/* PROJECT 03: AURORA ARCHITECTS */}
            <div 
              onClick={() => setSelectedProjectModal({
                num: '03/',
                title: 'AURORA ARCHITECTS',
                category: 'WEB DEVELOPMENT',
                desc: 'Minimalist grid-driven portfolio for an international contemporary architecture practice.'
              })}
              className="group cursor-pointer flex flex-col"
            >
              <span className="text-[#E84E0F] font-mono-tech text-xs font-semibold mb-2 tracking-wider">
                03/
              </span>
              {/* Custom Designed Thumbnail 03 */}
              <div className="relative aspect-[16/10] w-full bg-[#121212] border border-[#2e2e2b] overflow-hidden mb-3">
                {/* Architectural Brutalist Facade */}
                <div 
                  className="absolute inset-0 bg-cover bg-bottom grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/45 to-black/20" />

                {/* Overlay Typography */}
                <div className="absolute inset-0 p-3.5 flex flex-col justify-start">
                  <h4 className="font-syne text-white text-base sm:text-[17px] font-medium leading-[1.15] tracking-wide">
                    AURORA<br />
                    ARCHITECTS
                  </h4>
                </div>

                {/* Bottom Right Orange Action Tag */}
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <CornerDownRight className="w-4 h-4 text-[#181816] stroke-[2.5]" />
                </div>
              </div>

              <h3 className="font-mono-tech text-xs font-semibold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors">
                AURORA ARCHITECTS
              </h3>
              <p className="font-mono-tech text-[10px] tracking-wider text-[#8e8d87] uppercase mt-0.5">
                WEB DEVELOPMENT
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================
            4. SERVICES / DESIGN MANIFESTO / TECH STACK (3 COLUMNS)
        ========================================================= */}
        <section className="relative z-20 grid grid-cols-1 lg:grid-cols-12 bg-[#EAE6DF]">
          
          {/* COLUMN 1: SERVICES ACCORDION LIST */}
          <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <h2 className="font-anton text-2xl sm:text-[28px] tracking-wide uppercase text-[#1c1c1a]">
                  SERVICES
                </h2>
                <span className="w-6 h-[2.5px] bg-[#1c1c1a]" />
              </div>

              <div className="divide-y divide-[#1c1c1a]/30 border-b border-[#1c1c1a]/30">
                {SERVICES_DATA.map((item) => {
                  const isOpen = expandedService === item.id;
                  return (
                    <div key={item.id} className="py-2.5">
                      <button
                        onClick={() => toggleService(item.id)}
                        className="w-full flex items-center justify-between text-left group focus:outline-none"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono-tech text-xs font-extrabold text-[#1c1c1a]">
                            {item.id}
                          </span>
                          <span className="font-mono-tech text-[11px] sm:text-xs font-medium tracking-wider text-[#1c1c1a] group-hover:text-[#E84E0F] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[#1c1c1a] group-hover:text-[#E84E0F] transition-colors">
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="mt-2 pl-7 text-[11px] leading-relaxed text-[#4a4946] font-mono-tech">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: DESIGN MANIFESTO (ORANGE BLOCK) */}
          <div className="lg:col-span-4 bg-[#E84E0F] text-[#181816] p-6 sm:p-10 relative flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-end gap-3 mb-5">
                <h2 className="font-anton text-xl sm:text-[23px] leading-[1.08] tracking-wide uppercase text-[#181816]">
                  DESIGN<br />
                  MANIFESTO
                </h2>
                <span className="w-5 h-[2px] bg-[#181816] mb-1.5" />
              </div>

              <div className="font-mono-tech text-[11px] leading-[1.55] tracking-[0.02em] uppercase space-y-4 font-medium text-[#181816]">
                <p>
                  GOOD DESIGN ISN&apos;T JUST<br />
                  ABOUT HOW IT LOOKS.<br />
                  IT&apos;S ABOUT HOW IT WORKS,<br />
                  WHO IT SERVES, AND<br />
                  WHAT IT STANDS FOR.
                </p>
                <p>
                  I DESIGN WITH PURPOSE.<br />
                  I BUILD WITH PRECISION.<br />
                  I DELIVER WITH PRIDE.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-2">
              <p className="font-mono-tech text-[10.5px] leading-[1.4] uppercase italic font-semibold text-[#181816]">
                NO TRENDS.<br />
                ONLY SOLUTIONS.
              </p>
            </div>

            {/* Signature Black Cutout Triangle in Bottom Right */}
            <div 
              className="w-20 h-11 bg-[#181816] absolute bottom-2.5 right-3"
              style={{
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
              }}
            />
          </div>

          {/* COLUMN 3: TECH STACK */}
          <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <h2 className="font-anton text-2xl sm:text-[26px] tracking-wide uppercase text-[#1c1c1a]">
                  TECH STACK
                </h2>
                <span className="w-5 h-[2.5px] bg-[#1c1c1a]" />
              </div>

              <ul className="space-y-2.5">
                {TECH_STACK.map((tech) => (
                  <li 
                    key={tech} 
                    className="flex items-center justify-between font-mono-tech text-[11.5px] tracking-wider font-medium text-[#1c1c1a] group cursor-default"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {tech}
                    </span>
                    <span className="w-1.5 h-1.5 bg-[#1c1c1a] group-hover:bg-[#E84E0F] transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </section>

        {/* =========================================================
            5. FOOTER (CTA + CONTACT DETAILS + ROTATING STAMP & BARCODE)
        ========================================================= */}
        <footer className="relative z-20 bg-[#141413] text-[#EAE6DF] px-6 sm:px-10 py-9 border-t border-[#2b2b28]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: VERTICAL TEXT + CTA HEADLINE */}
            <div className="lg:col-span-5 flex items-stretch gap-5">
              
              {/* Vertical "LET'S BUILD SOMETHING BOLD." */}
              <div className="hidden sm:flex items-center pr-4 border-r border-[#EAE6DF]/25 select-none">
                <div className="font-mono-tech text-[10px] tracking-[0.18em] uppercase [writing-mode:vertical-rl] rotate-180 flex items-center gap-2 text-[#EAE6DF]/90">
                  <span>LET&apos;S BUILD</span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-[#E84E0F]" />
                    <span>SOMETHING BOLD.</span>
                  </span>
                </div>
              </div>

              {/* Main Orange Footer Headline */}
              <div className="flex flex-col justify-between">
                <h2 className="font-anton text-3xl sm:text-[36px] leading-[1.03] tracking-wide uppercase text-[#E84E0F]">
                  READY TO<br />
                  ELEVATE YOUR<br />
                  DIGITAL PRESENCE?
                </h2>

                {/* Chalk/Brush White Underline Stroke */}
                <svg className="w-48 h-3 my-2.5" viewBox="0 0 200 12" fill="none">
                  <path 
                    d="M2 7.5C45 3.5 135 2.5 198 6.5" 
                    stroke="#EAE6DF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                </svg>

                <p className="font-mono-tech text-[10px] leading-[1.45] tracking-[0.08em] text-[#b8b5ad] uppercase">
                  I&apos;M ALWAYS OPEN TO<br />
                  NEW CHALLENGES AND<br />
                  EXCITING PROJECTS.
                </p>
              </div>
            </div>

            {/* CENTER: CONTACT LINKS */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <h3 className="font-anton text-base tracking-wider uppercase text-[#EAE6DF] pb-2 mb-3 border-b border-[#EAE6DF]/20">
                CONTACT
              </h3>

              <ul className="space-y-2.5 font-mono-tech text-[10.5px] tracking-[0.06em] text-[#d6d3cb]">
                <li>
                  <a href="mailto:hello@marianadesign.com" className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Mail className="w-2.5 h-2.5" />
                    </span>
                    <span>HELLO@MARIANADESIGN.COM</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+15559876543" className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Phone className="w-2.5 h-2.5" />
                    </span>
                    <span>+1 (555) 987-6543</span>
                  </a>
                </li>
                <li>
                  <a href="#website" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                    </span>
                    <span>MARIANADESIGN.COM</span>
                  </a>
                </li>
                <li>
                  <a href="#dribbble" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Dribbble className="w-2.5 h-2.5" />
                    </span>
                    <span>DRIBBBLE.COM/MARIANADESIGN</span>
                  </a>
                </li>
                <li>
                  <a href="#behance" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0 text-[8px] font-bold">
                      Be
                    </span>
                    <span>BEHANCE.NET/MARIANADESIGN</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* RIGHT: CIRCULAR STRATEGY STAMP & BARCODE */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-between gap-4">
              <RotatingStamp />
              <BarcodeGraphic />
            </div>

          </div>
        </footer>

        {/* =========================================================
            INTERACTIVE PROJECT CASE STUDY PREVIEW MODAL
        ========================================================= */}
        {selectedProjectModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedProjectModal(null)}
          >
            <div 
              className="bg-[#EAE6DF] border-2 border-[#181816] max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono-tech text-xs font-bold text-[#E84E0F] bg-[#181816] px-2.5 py-1">
                  {selectedProjectModal.num} {selectedProjectModal.category}
                </span>
                <button 
                  onClick={() => setSelectedProjectModal(null)}
                  className="font-mono-tech text-xs font-bold text-[#181816] hover:text-[#E84E0F]"
                >
                  [CLOSE X]
                </button>
              </div>
              <h3 className="font-anton text-3xl uppercase text-[#181816] mb-3">
                {selectedProjectModal.title}
              </h3>
              <p className="font-mono-tech text-xs leading-relaxed text-[#2b2b29] mb-6">
                {selectedProjectModal.desc}
              </p>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="w-full py-3 bg-[#E84E0F] text-[#181816] font-mono-tech text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#181816] hover:text-[#EAE6DF] transition-colors"
              >
                <span>LIVE CASE STUDY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}