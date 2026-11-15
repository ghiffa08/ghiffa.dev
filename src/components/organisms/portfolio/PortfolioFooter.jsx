import React from 'react';
import { ArrowUp } from 'lucide-react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

/* ─── Playful Die-Cut Vector Stickers Matching Reference ─────────────────── */

function StarSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut vinyl border */}
        <path
          d="M50 6 L62 33 L92 35 L69 56 L76 85 L50 71 L24 85 L31 56 L8 35 L38 33 Z"
          fill="white"
          stroke="white"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        {/* Purple Star Body */}
        <path
          d="M50 8 L61 34 L90 36 L68 55 L74 83 L50 69 L26 83 L32 55 L10 36 L39 34 Z"
          fill="#6366F1"
        />
        {/* Star highlight curve */}
        <path
          d="M50 14 L57 33 L35 33 Z"
          fill="white"
          opacity="0.3"
        />
        {/* Playful/Cool Eyes */}
        <ellipse cx="40" cy="50" rx="5.5" ry="4" transform="rotate(-15 40 50)" fill="white" />
        <ellipse cx="60" cy="50" rx="5.5" ry="4" transform="rotate(15 60 50)" fill="white" />
        <circle cx="41" cy="50" r="2.5" fill="#1E1B4B" />
        <circle cx="59" cy="50" r="2.5" fill="#1E1B4B" />
        {/* Mischievous smile */}
        <path d="M46 59 Q50 63 54 59" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

function BerriesSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White die-cut outline */}
        <g stroke="white" strokeWidth="12" strokeLinejoin="round">
          <circle cx="42" cy="58" r="26" fill="white" />
          <circle cx="68" cy="62" r="20" fill="white" />
          <ellipse cx="50" cy="30" rx="14" ry="8" transform="rotate(-20 50 30)" fill="white" />
        </g>
        {/* Green leaf stem */}
        <ellipse cx="50" cy="30" rx="14" ry="7" transform="rotate(-20 50 30)" fill="#10B981" />
        {/* Blueberry */}
        <circle cx="42" cy="58" r="24" fill="#3B82F6" />
        <circle cx="36" cy="50" r="6" fill="#93C5FD" opacity="0.6" />
        {/* Pink Raspberry / Berry */}
        <circle cx="68" cy="62" r="18" fill="#F43F5E" />
        <circle cx="64" cy="56" r="4.5" fill="#FDA4AF" opacity="0.6" />
      </svg>
    </div>
  );
}

function FlameSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White vinyl border */}
        <path
          d="M50 8 C50 8 68 35 68 55 C68 62 65 68 62 73 C66 69 70 62 70 55 C70 47 66 38 66 38 C66 38 88 56 88 78 C88 98 71 110 50 110 C29 110 12 96 12 76 C12 52 35 34 38 18 C38 18 50 8 50 8 Z"
          fill="white"
          stroke="white"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        {/* Orange Outer Flame */}
        <path
          d="M50 12 C50 12 66 37 66 55 C66 62 63 68 60 73 C64 69 68 62 68 55 C68 47 64 38 64 38 C64 38 84 56 84 76 C84 94 69 106 50 106 C31 106 16 93 16 74 C16 53 37 36 40 20 C40 20 50 12 50 12 Z"
          fill="url(#outerFlameGrad)"
        />
        {/* Yellow Inner Flame */}
        <path
          d="M50 50 C50 50 60 66 60 78 C60 88 55 96 48 98 C52 94 54 88 54 82 C54 74 48 68 48 68 C48 68 40 76 40 84 C40 94 45 98 48 98 C38 97 32 89 32 80 C32 68 44 58 50 50 Z"
          fill="#FDE047"
        />
        <defs>
          <linearGradient id="outerFlameGrad" x1="50" y1="12" x2="50" y2="106" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function FlowerBadgeSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White vinyl border */}
        <rect x="8" y="8" width="84" height="94" rx="22" fill="white" stroke="white" strokeWidth="12" strokeLinejoin="round" />
        {/* Lime green badge background */}
        <rect x="12" y="12" width="76" height="86" rx="18" fill="#D9F99D" />
        {/* Stem */}
        <path d="M50 78 C48 68 56 60 52 48" stroke="#166534" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Leaves */}
        <path d="M50 64 C42 63 38 68 42 72 C46 72 49 68 50 64 Z" fill="#166534" />
        {/* Petals */}
        <circle cx="52" cy="38" r="8" fill="#166534" />
        <circle cx="43" cy="32" r="7" fill="#166534" />
        <circle cx="61" cy="32" r="7" fill="#166534" />
        <circle cx="46" cy="22" r="7" fill="#166534" />
        <circle cx="58" cy="22" r="7" fill="#166534" />
        {/* Center */}
        <circle cx="52" cy="30" r="5" fill="#FEF08A" />
      </svg>
    </div>
  );
}

function CatSticker({ className = '' }) {
  return (
    <div className={`filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)] hover:scale-110 transition-transform duration-300 cursor-pointer ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White vinyl outline */}
        <path
          d="M24 38 L30 14 L48 26 C52 25 58 25 62 26 L80 14 L86 38 C94 48 94 62 86 74 C76 86 34 86 24 74 C16 62 16 48 24 38 Z"
          fill="white"
          stroke="white"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        {/* Purple Cat Head */}
        <path
          d="M26 40 L32 18 L48 28 C52 27 58 27 62 28 L78 18 L84 40 C91 49 91 61 84 72 C74 83 36 83 26 72 C19 61 19 49 26 40 Z"
          fill="#8B5CF6"
        />
        {/* Inner Ears */}
        <polygon points="34,25 44,30 36,36" fill="#F472B6" />
        <polygon points="76,25 74,36 66,30" fill="#F472B6" />
        {/* Stylized Eyes */}
        <ellipse cx="40" cy="52" rx="6" ry="4" transform="rotate(-10 40 52)" fill="white" />
        <ellipse cx="70" cy="52" rx="6" ry="4" transform="rotate(10 70 52)" fill="white" />
        <circle cx="42" cy="52" r="2.5" fill="#1E1B4B" />
        <circle cx="68" cy="52" r="2.5" fill="#1E1B4B" />
        {/* Nose & Mouth */}
        <polygon points="53,60 57,60 55,63" fill="#F472B6" />
        <path d="M51 64 Q55 67 59 64" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Whiskers */}
        <line x1="26" y1="56" x2="16" y2="54" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="62" x2="16" y2="64" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="84" y1="56" x2="94" y2="54" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="84" y1="62" x2="94" y2="64" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 22%, #B6DBFD 65%, #58B0F8 100%)'
      }}
    >
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

            {/* Right Side: 4 Clean Columns matching reference (PRODUCT, CONTRIBUTE, CONNECT, LEGAL) */}
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

      {/* ─── Bottom Area: Giant Display Typography with 5 Die-Cut Stickers ─── */}
      <div className="relative w-full pt-16 sm:pt-24 lg:pt-28 select-none">
        {/* Floating Die-Cut Stickers Layer */}
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pointer-events-auto h-0 z-10">
          {/* Sticker 1: Purple Star (far left overlapping top of 'g') */}
          <div
            className="absolute top-[-18px] sm:top-[-28px] lg:top-[-36px] left-[3%] sm:left-[5%] lg:left-[6%] animate-float-slow z-10"
            style={{ '--rot': '-14deg' }}
          >
            <StarSticker className="w-12 h-12 sm:w-16 sm:h-16 lg:w-22 lg:h-22" />
          </div>

          {/* Sticker 2: Berries (left-center overlapping 'h') */}
          <div
            className="absolute top-[6px] sm:top-[2px] lg:top-[-4px] left-[24%] sm:left-[26%] lg:left-[27%] animate-float-alt z-10"
            style={{ '--rot': '-6deg' }}
          >
            <BerriesSticker className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18" />
          </div>

          {/* Sticker 3: Flame (center resting right on the 'i' dot) */}
          <div
            className="absolute top-[-22px] sm:top-[-34px] lg:top-[-42px] left-[46%] sm:left-[47%] lg:left-[47.5%] animate-float-slow z-10"
            style={{ '--rot': '6deg' }}
          >
            <FlameSticker className="w-11 h-11 sm:w-15 sm:h-15 lg:w-20 lg:h-20" />
          </div>

          {/* Sticker 4: Green Flower Badge (right-center overlapping 'f' / 'a') */}
          <div
            className="absolute top-[-8px] sm:top-[-12px] lg:top-[-18px] right-[27%] sm:right-[26%] lg:right-[27%] animate-float-alt z-10"
            style={{ '--rot': '12deg' }}
          >
            <FlowerBadgeSticker className="w-10 h-10 sm:w-14 sm:h-14 lg:w-18 lg:h-18" />
          </div>

          {/* Sticker 5: Purple Cat (far right floating above 'd' / 'v') */}
          <div
            className="absolute top-[-16px] sm:top-[-24px] lg:top-[-32px] right-[4%] sm:right-[6%] lg:right-[8%] animate-float-slow z-10"
            style={{ '--rot': '14deg' }}
          >
            <CatSticker className="w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24" />
          </div>
        </div>

        {/* Giant Cropped Title overflowing bottom border */}
        <div className="w-full flex justify-center text-center overflow-hidden pointer-events-none">
          <h1
            data-builder-field="title"
            data-builder-label="Footer Brand Title"
            className="text-[15.5vw] sm:text-[16vw] lg:text-[16.5vw] font-black tracking-tighter leading-[0.78] text-white select-none whitespace-nowrap drop-shadow-[0_16px_36px_rgba(20,50,90,0.12)] transform translate-y-[10%]"
          >
            {footerTitle}
          </h1>
        </div>
      </div>
    </footer>
  );
}

export default PortfolioFooter;
