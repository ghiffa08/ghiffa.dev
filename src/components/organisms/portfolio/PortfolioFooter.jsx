import React from 'react';
import { ArrowUp } from 'lucide-react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

/* ─── HD Contoured Die-Cut Vinyl Programming Stickers ────────────────────── */

const stickerWrapperClass =
  'filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.36)] drop-shadow-[0_12px_22px_rgba(120,25,0,0.28)] hover:scale-110 transition-transform duration-300 cursor-pointer select-none';

// 1. React Sticker (True Atom-Shaped Contoured Die-Cut Vinyl Sticker)
function ReactSticker({ className = '' }) {
  return (
    <div className={`${stickerWrapperClass} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="reactCoreGrad" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#282C34" />
            <stop offset="100%" stopColor="#12151C" />
          </linearGradient>
          <linearGradient id="reactCyanGrad" x1="25" y1="25" x2="115" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7CE8FF" />
            <stop offset="50%" stopColor="#00D8FF" />
            <stop offset="100%" stopColor="#00A8E8" />
          </linearGradient>
          <linearGradient id="reactVinylGloss" x1="15" y1="15" x2="95" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.52" />
            <stop offset="32%" stopColor="white" stopOpacity="0.18" />
            <stop offset="48%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
          <clipPath id="reactStickerClip">
            <ellipse cx="70" cy="70" rx="50" ry="24" />
            <ellipse cx="70" cy="70" rx="50" ry="24" transform="rotate(60 70 70)" />
            <ellipse cx="70" cy="70" rx="50" ry="24" transform="rotate(120 70 70)" />
          </clipPath>
        </defs>

        {/* 3D Vinyl Paper Thickness Rim (bottom-right offset) */}
        <g transform="translate(0, 2.5)" stroke="#CBD5E1" strokeWidth="22" fill="#CBD5E1" strokeLinejoin="round">
          <ellipse cx="70" cy="70" rx="44" ry="18" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(60 70 70)" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(120 70 70)" />
        </g>

        {/* Pure White Die-Cut PVC Vinyl Border */}
        <g stroke="#FFFFFF" strokeWidth="20" fill="#FFFFFF" strokeLinejoin="round">
          <ellipse cx="70" cy="70" rx="44" ry="18" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(60 70 70)" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(120 70 70)" />
        </g>

        {/* Inner Dark Atom Silhouette Base */}
        <g stroke="url(#reactCoreGrad)" strokeWidth="8" fill="url(#reactCoreGrad)" strokeLinejoin="round">
          <ellipse cx="70" cy="70" rx="44" ry="18" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(60 70 70)" />
          <ellipse cx="70" cy="70" rx="44" ry="18" transform="rotate(120 70 70)" />
        </g>

        {/* Official HD React Atomic Orbits */}
        <ellipse cx="70" cy="70" rx="42" ry="16" stroke="url(#reactCyanGrad)" strokeWidth="4.8" />
        <ellipse cx="70" cy="70" rx="42" ry="16" transform="rotate(60 70 70)" stroke="url(#reactCyanGrad)" strokeWidth="4.8" />
        <ellipse cx="70" cy="70" rx="42" ry="16" transform="rotate(120 70 70)" stroke="url(#reactCyanGrad)" strokeWidth="4.8" />

        {/* Glowing Atomic Nucleus */}
        <circle cx="70" cy="70" r="8.5" fill="url(#reactCyanGrad)" />
        <circle cx="67.5" cy="67.5" r="2.8" fill="white" opacity="0.75" />

        {/* Laminated Vinyl Gloss Sheen Overlay */}
        <rect x="0" y="0" width="140" height="140" fill="url(#reactVinylGloss)" clipPath="url(#reactStickerClip)" pointerEvents="none" />
      </svg>
    </div>
  );
}

// 2. JavaScript Sticker (Official HD Devicon JS with Vinyl Gloss & 3D Paper Edge)
function JavaScriptSticker({ className = '' }) {
  return (
    <div className={`${stickerWrapperClass} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="jsGoldGrad" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFEA3D" />
            <stop offset="55%" stopColor="#F7DF1E" />
            <stop offset="100%" stopColor="#E2C700" />
          </linearGradient>
          <linearGradient id="jsVinylGloss" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="30%" stopColor="white" stopOpacity="0.22" />
            <stop offset="46%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.08" />
          </linearGradient>
          <clipPath id="jsStickerClip">
            <rect x="14" y="14" width="112" height="112" rx="26" />
          </clipPath>
        </defs>

        {/* 3D Vinyl Paper Thickness Rim */}
        <rect x="14" y="16.5" width="112" height="112" rx="26" fill="#CBD5E1" />

        {/* Pure White Die-Cut PVC Vinyl Base */}
        <rect x="14" y="14" width="112" height="112" rx="26" fill="#FFFFFF" />
        {/* Subtle Inner Print Cut Line */}
        <rect x="22" y="22" width="96" height="96" rx="19" fill="url(#jsGoldGrad)" stroke="#FFFBEB" strokeWidth="1.5" />

        {/* Official HD Devicon JavaScript Vector Typography */}
        <g transform="translate(14, 14) scale(0.84)">
          <path
            d="M72.49 98.44c2.72 4.44 6.26 7.71 12.52 7.71 5.26 0 8.62-2.63 8.62-6.26 0-4.35-3.45-5.89-9.25-8.43l-3.17-1.36c-9.16-3.9-15.24-8.79-15.24-19.13 0-9.52 7.25-16.77 18.59-16.77 8.07 0 13.87 2.81 18.04 10.16l-9.88 6.35c-2.18-3.9-4.53-5.44-8.16-5.44-3.72 0-6.08 2.36-6.08 5.44 0 3.81 2.36 5.35 7.8 7.71l3.17 1.36c10.79 4.62 16.87 9.34 16.87 19.95 0 11.43-8.98 17.68-21.04 17.68-11.79 0-19.41-5.62-23.12-12.97l10.33-6.00z"
            fill="#141413"
          />
          <path
            d="M28.38 99.53c1.99 3.54 3.81 6.53 8.16 6.53 4.17 0 6.8-1.63 6.8-7.98V54.92h12.69v43.34c0 13.15-7.71 19.13-18.95 19.13-10.16 0-16.05-5.26-19.04-11.61l10.34-6.25z"
            fill="#141413"
          />
        </g>

        {/* Glossy Vinyl Lamination Reflection Streak */}
        <g clipPath="url(#jsStickerClip)" pointerEvents="none">
          <rect x="14" y="14" width="112" height="112" fill="url(#jsVinylGloss)" />
          <path d="M10 14 L78 14 L34 126 L10 126 Z" fill="white" opacity="0.16" />
        </g>
      </svg>
    </div>
  );
}

// 3. Python Sticker (Official HD 3D-Gradient Snakes with True Contoured Die-Cut Border)
function PythonSticker({ className = '' }) {
  const topSnake =
    'M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z';
  const bottomSnake =
    'M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z';

  return (
    <div className={`${stickerWrapperClass} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pyBlueGrad" x1="19" y1="12" x2="82" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5A9FD4" />
            <stop offset="100%" stopColor="#306998" />
          </linearGradient>
          <linearGradient id="pyYellowGrad" x1="95" y1="96" x2="55" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#FFE873" />
          </linearGradient>
          <linearGradient id="pyVinylGloss" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.48" />
            <stop offset="38%" stopColor="white" stopOpacity="0.14" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <g transform="translate(10, 18)">
          {/* 3D Paper Thickness Rim */}
          <g transform="translate(0, 3)" stroke="#CBD5E1" strokeWidth="23" fill="#CBD5E1" strokeLinejoin="round" strokeLinecap="round">
            <path d={topSnake} />
            <path d={bottomSnake} />
          </g>

          {/* Pure White Die-Cut Vinyl Contour */}
          <g stroke="#FFFFFF" strokeWidth="21" fill="#FFFFFF" strokeLinejoin="round" strokeLinecap="round">
            <path d={topSnake} />
            <path d={bottomSnake} />
          </g>

          {/* Official HD 3D-Shaded Python Snakes */}
          <path d={topSnake} fill="url(#pyBlueGrad)" />
          <path d={bottomSnake} fill="url(#pyYellowGrad)" />

          {/* Specular Vinyl Gloss Highlight on Snakes */}
          <path d={topSnake} fill="url(#pyVinylGloss)" pointerEvents="none" />
          <path d={bottomSnake} fill="url(#pyVinylGloss)" pointerEvents="none" />
        </g>
      </svg>
    </div>
  );
}

// 4. TypeScript Sticker (Official HD Devicon TS with Vinyl Gloss & 3D Paper Edge)
function TypeScriptSticker({ className = '' }) {
  return (
    <div className={`${stickerWrapperClass} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tsBlueGrad" x1="20" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B88D8" />
            <stop offset="55%" stopColor="#3178C6" />
            <stop offset="100%" stopColor="#235A97" />
          </linearGradient>
          <linearGradient id="tsVinylGloss" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="30%" stopColor="white" stopOpacity="0.18" />
            <stop offset="46%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
          <clipPath id="tsStickerClip">
            <rect x="14" y="14" width="112" height="112" rx="26" />
          </clipPath>
        </defs>

        {/* 3D Vinyl Paper Thickness Rim */}
        <rect x="14" y="16.5" width="112" height="112" rx="26" fill="#CBD5E1" />

        {/* Pure White Die-Cut PVC Vinyl Base */}
        <rect x="14" y="14" width="112" height="112" rx="26" fill="#FFFFFF" />
        {/* Royal Blue TS Core */}
        <rect x="22" y="22" width="96" height="96" rx="19" fill="url(#tsBlueGrad)" stroke="#60A5FA" strokeWidth="1" strokeOpacity="0.4" />

        {/* Official HD Devicon TypeScript Vector Typography */}
        <g transform="translate(14, 14) scale(0.84)">
          <path
            d="M25.67 63.91h39.25v9.81H50.88v44.28H39.68V73.72H25.67v-9.81zm69.11 21.84c-3.15-1.57-6.4-2.82-8.71-4.18-2.09-1.26-3.15-2.62-3.15-4.4 0-1.99 1.47-3.56 4.19-3.56 2.52 0 5.35 1.05 8.18 3.25l5.45-7.13c-3.57-2.93-8.39-4.72-13.95-4.72-8.91 0-15.1 5.03-15.1 13.11 0 5.77 3.36 9.86 10.49 13.11 3.77 1.68 6.4 2.94 8.07 4.09 1.68 1.15 2.52 2.52 2.52 4.3 0 2.41-1.99 4.09-5.35 4.09-3.67 0-7.34-1.57-10.49-4.4l-5.98 6.92c3.88 3.98 9.65 6.4 16.67 6.4 9.65 0 16.36-5.03 16.36-13.74 0-5.98-3.36-10.07-9.21-13.14z"
            fill="#FFFFFF"
          />
        </g>

        {/* Glossy Vinyl Lamination Reflection Streak */}
        <g clipPath="url(#tsStickerClip)" pointerEvents="none">
          <rect x="14" y="14" width="112" height="112" fill="url(#tsVinylGloss)" />
          <path d="M10 14 L78 14 L34 126 L10 126 Z" fill="white" opacity="0.14" />
        </g>
      </svg>
    </div>
  );
}

// 5. C++ / Arduino Sticker (Official 3D-Faceted C++ Hexagon Shield Die-Cut Vinyl Sticker)
function ArduinoSticker({ className = '' }) {
  return (
    <div className={`${stickerWrapperClass} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cppVinylGloss" x1="20" y1="15" x2="110" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="32%" stopColor="white" stopOpacity="0.18" />
            <stop offset="48%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.14" />
          </linearGradient>
          <clipPath id="cppHexClip">
            <path d="M70 12 L118 39.5 V94.5 L70 122 L22 94.5 V39.5 Z" />
          </clipPath>
        </defs>

        {/* 3D Vinyl Paper Thickness Rim */}
        <path
          d="M70 14.5 L118 42 V97 L70 124.5 L22 97 V42 Z"
          fill="#CBD5E1"
          stroke="#CBD5E1"
          strokeWidth="16"
          strokeLinejoin="round"
        />

        {/* Pure White Die-Cut PVC Vinyl Hexagon Base */}
        <path
          d="M70 12 L118 39.5 V94.5 L70 122 L22 94.5 V39.5 Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="15"
          strokeLinejoin="round"
        />

        {/* Official 3D-Faceted C++ Hexagon Shield */}
        <g clipPath="url(#cppHexClip)">
          {/* Top-Left Light Blue Facet */}
          <path d="M70 12 L118 39.5 L70 67 L22 94.5 V39.5 Z" fill="#659AD2" />
          {/* Bottom Dark Navy Facet */}
          <path d="M70 67 L118 94.5 L70 122 L22 94.5 Z" fill="#004482" />
          {/* Right Medium Royal Blue Facet */}
          <path d="M70 67 L118 39.5 V94.5 Z" fill="#00599C" />

          {/* Official C Emblem */}
          <path
            d="M70 36 C52.88 36 39 49.88 39 67 C39 84.12 52.88 98 70 98 C80.8 98 90.3 92.46 95.85 84.08 L82.4 76.25 C79.64 80.59 75.12 83.4 70 83.4 C60.94 83.4 53.6 76.06 53.6 67 C53.6 57.94 60.94 50.6 70 50.6 C75.12 50.6 79.64 53.41 82.4 57.75 L95.85 49.92 C90.3 41.54 80.8 36 70 36 Z"
            fill="#FFFFFF"
          />

          {/* Plus 1 (+) */}
          <path d="M92 60 H96 V65 H101 V69 H96 V74 H92 V69 H87 V65 H92 V60 Z" fill="#FFFFFF" />
          {/* Plus 2 (+) */}
          <path d="M107 60 H111 V65 H116 V69 H111 V74 H107 V69 H102 V65 H107 V60 Z" fill="#FFFFFF" />

          {/* Glossy Vinyl Lamination Sheen */}
          <rect x="10" y="10" width="120" height="120" fill="url(#cppVinylGloss)" />
          <path d="M15 10 L75 10 L35 125 L15 125 Z" fill="white" opacity="0.16" />
        </g>
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
