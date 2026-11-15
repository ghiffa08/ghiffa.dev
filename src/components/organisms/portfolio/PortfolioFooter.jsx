import React from 'react';
import { ArrowUp } from 'lucide-react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

/* ─── Programming Languages Die-Cut Vector Stickers ──────────────────────── */

// 1. React Sticker (Cyan atomic orbits on dark navy badge)
function ReactSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_12px_24px_rgba(180,50,0,0.22)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White vinyl die-cut border */}
        <circle cx="50" cy="50" r="42" fill="white" stroke="white" strokeWidth="10" strokeLinejoin="round" />
        {/* Dark Navy Badge Body */}
        <circle cx="50" cy="50" r="40" fill="#20232A" />
        {/* React Orbits */}
        <ellipse cx="50" cy="50" rx="30" ry="11" stroke="#61DAFB" strokeWidth="3.5" fill="none" />
        <ellipse cx="50" cy="50" rx="30" ry="11" transform="rotate(60 50 50)" stroke="#61DAFB" strokeWidth="3.5" fill="none" />
        <ellipse cx="50" cy="50" rx="30" ry="11" transform="rotate(120 50 50)" stroke="#61DAFB" strokeWidth="3.5" fill="none" />
        {/* React Nucleus */}
        <circle cx="50" cy="50" r="5.5" fill="#61DAFB" />
      </svg>
    </div>
  );
}

// 2. JavaScript Sticker (Iconic yellow square with black JS)
function JavaScriptSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_12px_24px_rgba(180,50,0,0.22)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut vinyl border */}
        <rect x="10" y="10" width="80" height="80" rx="20" fill="white" stroke="white" strokeWidth="12" strokeLinejoin="round" />
        {/* JavaScript Yellow Body */}
        <rect x="12" y="12" width="76" height="76" rx="16" fill="#F7DF1E" />
        {/* J letter */}
        <path d="M42 40 V60 C42 66 38 68 32 66 C28 64 26 60 26 60" stroke="#111111" strokeWidth="6.5" strokeLinecap="square" fill="none" />
        {/* S letter */}
        <path d="M68 44 C65 40 57 40 54 43 C50 48 68 50 68 59 C68 66 58 68 52 65 C48 62 46 58 46 58" stroke="#111111" strokeWidth="6.5" strokeLinecap="square" fill="none" />
      </svg>
    </div>
  );
}

// 3. Python Sticker (Blue & Yellow intertwining snakes)
function PythonSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_12px_24px_rgba(180,50,0,0.22)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut vinyl outline */}
        <g stroke="white" strokeWidth="12" strokeLinejoin="round">
          <circle cx="50" cy="50" r="38" fill="white" />
        </g>
        {/* Dark circular sticker base */}
        <circle cx="50" cy="50" r="38" fill="#182736" />
        {/* Blue Top Snake */}
        <path
          d="M49 18 C33 18 34 25 34 25 L34 32 L49 32 L49 34 L28 34 C28 34 21 34 21 44 C21 53 27 53 27 53 L32 53 L32 46 C32 40 37 40 37 40 L52 40 C58 40 63 35 63 29 C63 23 58 18 49 18 Z M43 23 C45 23 46 24 46 26 C46 27 45 28 43 28 C42 28 41 27 41 26 C41 24 42 23 43 23 Z"
          fill="#387EB8"
        />
        {/* Yellow Bottom Snake */}
        <path
          d="M51 82 C67 82 66 75 66 75 L66 68 L51 68 L51 66 L72 66 C72 66 79 66 79 56 C79 47 73 47 73 47 L68 47 L68 54 C68 60 63 60 63 60 L48 60 C42 60 37 65 37 71 C37 77 42 82 51 82 Z M57 77 C55 77 54 76 54 74 C54 73 55 72 57 72 C58 72 59 73 59 74 C59 76 58 77 57 77 Z"
          fill="#FFE873"
        />
      </svg>
    </div>
  );
}

// 4. TypeScript Sticker (Blue square badge with white TS)
function TypeScriptSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_12px_24px_rgba(180,50,0,0.22)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut vinyl border */}
        <rect x="10" y="10" width="80" height="80" rx="20" fill="white" stroke="white" strokeWidth="12" strokeLinejoin="round" />
        {/* TypeScript Blue Rounded Square */}
        <rect x="12" y="12" width="76" height="76" rx="16" fill="#3178C6" />
        {/* T letter */}
        <path d="M30 40 H48 M39 40 V68" stroke="white" strokeWidth="6" strokeLinecap="square" />
        {/* S letter */}
        <path d="M68 44 C66 40 56 39 54 44 C52 49 67 51 67 58 C67 65 56 68 52 64" stroke="white" strokeWidth="6" strokeLinecap="square" fill="none" />
      </svg>
    </div>
  );
}

// 5. Arduino / C++ Sticker (Teal circle with infinity and + - for hardware/IoT)
function ArduinoSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_12px_24px_rgba(180,50,0,0.22)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut vinyl border */}
        <circle cx="50" cy="50" r="42" fill="white" stroke="white" strokeWidth="10" strokeLinejoin="round" />
        {/* Arduino Teal Body */}
        <circle cx="50" cy="50" r="40" fill="#00979D" />
        {/* Infinity Loop */}
        <circle cx="36" cy="50" r="14" stroke="white" strokeWidth="5.5" fill="none" />
        <circle cx="64" cy="50" r="14" stroke="white" strokeWidth="5.5" fill="none" />
        {/* Minus Sign in Left Loop */}
        <line x1="31" y1="50" x2="41" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
        {/* Plus Sign in Right Loop */}
        <line x1="59" y1="50" x2="69" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <line x1="64" y1="45" x2="64" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Main PortfolioFooter Component ─────────────────────────────────────── */

export function PortfolioFooter({ emailAddress, onOpenContact, sectionData }) {
  const email = emailAddress || sectionData?.content?.email || 'hello@ghiffa.dev';
  const currentYear = new Date().getFullYear();

  const footerTitle = sectionData?.title || 'ghiffa.dev';
  const taglineLine1 = sectionData?.content?.tagline_1 || 'Think it through.';
  const taglineLine2 = sectionData?.content?.tagline_2 || 'Ship it fun ✌️';
  const rawCopyright = sectionData?.content?.copyright || 'Haikal Jibran';

  const cleanCopyright = rawCopyright
    .replace(/^©\s*/i, '')
    .replace(/\s*all rights reserved\.?/gi, '')
    .replace(/\.+$/, '')
    .trim() || 'Haikal Jibran';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Selected Works', href: '/works' },
    { label: 'Articles', href: '/articles' },
    { label: 'Certifications', href: '/#certifications' },
  ];

  const serviceLinks = [
    { label: 'Fullstack Web', href: '/#services' },
    { label: 'Mobile Apps', href: '/#services' },
    { label: 'IoT & Hardware', href: '/#hardware' },
    { label: 'UI/UX Architecture', href: '/#services' },
  ];

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/ghiffa08', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry', external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/haikaljibraan', external: true },
    { label: 'Email', href: `mailto:${email}`, external: false },
  ];

  return (
    <footer
      className="relative text-[#141414] overflow-hidden transition-colors"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 15%, #FFF0E5 30%, #FFDECC 45%, #FFC2A0 60%, #FFA16F 75%, #FF7530 88%, #FF5500 100%)'
      }}
    >
      {/* Subtle Fine Grain Noise Texture Overlay for Rich Poster Feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Soft Bottom Radial Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[320px] pointer-events-none opacity-40 blur-2xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #FF5500 0%, #FF8F50 40%, transparent 75%)'
        }}
      />

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-6px) rotate(calc(var(--rot, 0deg) + 2deg)); }
        }
        @keyframes floatAlt {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-7px) rotate(calc(var(--rot, 0deg) - 2deg)); }
        }
        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-float-alt {
          animation: floatAlt 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Section: Tagline + 4 Navigation Columns */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pt-16 sm:pt-24 pb-8 sm:pb-12">
        <ScrollReveal delay={0.05} y={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Big Punchy Tagline + Copyright Subtext */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#141414] leading-[1.18] select-none">
                  <span className="block">{taglineLine1}</span>
                  <span className="block">{taglineLine2}</span>
                </h2>

                <div
                  data-builder-field="copyright"
                  data-builder-label="Copyright Notice"
                  className="mt-6 sm:mt-8 space-y-1 text-xs text-[#52525B] font-normal leading-relaxed"
                >
                  <p>&copy; {currentYear} {footerTitle}. All rights reserved.</p>
                  <p>
                    Made with care by{' '}
                    <span className="font-medium text-[#18181B]">{cleanCopyright}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: 4 Clean Columns matching reference (PRODUCT, EXPERTISE, CONNECT, LEGAL) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
              {/* Col 1: PRODUCT / PAGES */}
              <div className="space-y-3.5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500/80">
                  Product
                </h3>
                <ul className="space-y-2.5 text-[13px] sm:text-sm">
                  {navLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-black transition-colors block font-normal"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: EXPERTISE / SERVICES */}
              <div className="space-y-3.5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500/80">
                  Expertise
                </h3>
                <ul className="space-y-2.5 text-[13px] sm:text-sm">
                  {serviceLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-gray-700 hover:text-black transition-colors block font-normal"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: CONNECT */}
              <div className="space-y-3.5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500/80">
                  Connect
                </h3>
                <ul className="space-y-2.5 text-[13px] sm:text-sm">
                  {socialLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="text-gray-700 hover:text-black transition-colors block font-normal"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  {onOpenContact && (
                    <li>
                      <button
                        type="button"
                        onClick={() => onOpenContact('Footer Inquiry')}
                        className="text-gray-700 hover:text-black transition-colors text-left font-normal cursor-pointer"
                      >
                        Let&apos;s Talk
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Col 4: LEGAL / DETAILS */}
              <div className="space-y-3.5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-gray-500/80">
                  Legal
                </h3>
                <ul className="space-y-2.5 text-[13px] sm:text-sm">
                  <li>
                    <span className="text-gray-700 block font-normal">
                      MIT License
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-700 block font-normal">
                      Kuningan, ID 🇮🇩
                    </span>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={scrollToTop}
                      className="group inline-flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors cursor-pointer font-normal pt-1"
                    >
                      <span>Back to top</span>
                      <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─── Bottom Area: Giant Display Typography with 5 Die-Cut Code Stickers ─── */}
      <div className="relative w-full pt-16 sm:pt-24 lg:pt-28 select-none">
        {/* Floating Die-Cut Tech Stickers Layer */}
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pointer-events-auto h-0 z-10">
          {/* Sticker 1: React (far left overlapping top of 'g') */}
          <div
            className="absolute top-[-18px] sm:top-[-28px] lg:top-[-36px] left-[3%] sm:left-[5%] lg:left-[6%] animate-float-slow z-10"
            style={{ '--rot': '-14deg' }}
            title="React.js"
          >
            <ReactSticker className="w-12 h-12 sm:w-16 sm:h-16 lg:w-22 lg:h-22" />
          </div>

          {/* Sticker 2: JavaScript (left-center overlapping 'h') */}
          <div
            className="absolute top-[6px] sm:top-[2px] lg:top-[-4px] left-[24%] sm:left-[26%] lg:left-[27%] animate-float-alt z-10"
            style={{ '--rot': '-6deg' }}
            title="JavaScript"
          >
            <JavaScriptSticker className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18" />
          </div>

          {/* Sticker 3: Python (center resting right on the 'i' dot) */}
          <div
            className="absolute top-[-22px] sm:top-[-34px] lg:top-[-42px] left-[46%] sm:left-[47%] lg:left-[47.5%] animate-float-slow z-10"
            style={{ '--rot': '6deg' }}
            title="Python"
          >
            <PythonSticker className="w-11 h-11 sm:w-15 sm:h-15 lg:w-20 lg:h-20" />
          </div>

          {/* Sticker 4: TypeScript (right-center overlapping 'f' / 'a') */}
          <div
            className="absolute top-[-8px] sm:top-[-12px] lg:top-[-18px] right-[27%] sm:right-[26%] lg:right-[27%] animate-float-alt z-10"
            style={{ '--rot': '12deg' }}
            title="TypeScript"
          >
            <TypeScriptSticker className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18" />
          </div>

          {/* Sticker 5: Arduino / C++ (far right floating above 'd' / 'v') */}
          <div
            className="absolute top-[-16px] sm:top-[-24px] lg:top-[-32px] right-[4%] sm:right-[6%] lg:right-[8%] animate-float-slow z-10"
            style={{ '--rot': '14deg' }}
            title="C++ & Arduino Hardware"
          >
            <ArduinoSticker className="w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24" />
          </div>
        </div>

        {/* Giant Cropped Title overflowing bottom border */}
        <div className="w-full flex justify-center text-center overflow-hidden pointer-events-none">
          <h1
            data-builder-field="title"
            data-builder-label="Footer Brand Title"
            className="text-[15.5vw] sm:text-[16vw] lg:text-[16.5vw] font-black tracking-tighter leading-[0.78] text-white select-none whitespace-nowrap drop-shadow-[0_16px_36px_rgba(150,40,0,0.18)] transform translate-y-[10%]"
          >
            {footerTitle}
          </h1>
        </div>
      </div>
    </footer>
  );
}

export default PortfolioFooter;
