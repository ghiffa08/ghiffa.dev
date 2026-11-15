import React, { Suspense, lazy, useState } from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { PcbSkeleton } from '../../atoms/PcbSkeleton';
import { ErrorBoundary } from '../../atoms/ErrorBoundary';

const PcbViewer3D = lazy(() => import('./PcbViewer3D'));

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const CheckItem = ({ children }) => (
  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] text-white/90 leading-snug">
    <span className="mt-[1px] w-[18px] h-[18px] shrink-0 rounded-full bg-white text-[#FF5500] shadow-[0_1px_3px_rgba(0,0,0,0.15)] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="#FF5500" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
    {children}
  </li>
);

const StackTile = ({ icon, label, rotate }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-[18px] bg-white text-[#141414] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),inset_0_-2px_0_rgba(0,0,0,0.06)] flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:rotate-0 hover:scale-110 ${rotate}`}
    >
      <img src={icon} alt={label} className="w-9 h-9 sm:w-10 sm:h-10 select-none pointer-events-none" loading="lazy" />
    </div>
    <span className="text-[12px] font-medium text-white/90 tracking-wide">{label}</span>
  </div>
);

export function ServiceCardsSection({ sectionData }) {
  const content = sectionData?.content || {};
  const [copied, setCopied] = useState(false);
  const email = content.contact_email || 'hello@ghiffa.dev';

  const copyEmail = () => {
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const cardBase =
    'relative h-full bg-skillstreak-orange-grid text-white rounded-3xl overflow-hidden group transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_-12px_rgba(255,85,0,0.35)]';

  return (
    <section id="services" className="relative w-full bg-white py-16 lg:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto">
        <ScrollReveal delay={0.05} y={20}>
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-2 block select-none">
              // Capabilities &amp; Services
            </span>
            <h2
              data-builder-field="heading"
              data-builder-label="Services Heading"
              className="text-3xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-[#141414]"
            >
              {content.heading || 'Everything you need to ship.'}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:auto-rows-[minmax(300px,auto)]">
          {/* ── Card 1: Mobile (tall, 2 rows) ── */}
          <ScrollReveal delay={0.1} y={40} className="md:row-span-2 h-full">
            <div
              data-builder-field="card1_title"
              data-builder-label="Card 1: Mobile App"
              className={`${cardBase} min-h-[560px] flex flex-col`}
            >
              <div className="relative z-10 p-7 sm:p-8">
                <h3
                  data-builder-field="card1_title"
                  data-builder-label="Card 1 Title"
                  className="text-[24px] sm:text-[28px] lg:text-[30px] font-semibold leading-[1.15] tracking-tight text-white mb-2"
                >
                  {content.card1_title || 'Mobile app services'}
                </h3>
                <p
                  data-builder-field="card1_desc"
                  data-builder-label="Card 1 Description"
                  className="text-white/85 text-[13.5px] leading-relaxed mb-4"
                >
                  {content.card1_desc || 'Crafting intuitive, responsive, and high-performance mobile applications across iOS & Android.'}
                </p>
                <ul className="space-y-2.5">
                  <CheckItem>iOS &amp; Android from one codebase</CheckItem>
                  <CheckItem>Pixel-perfect UI &amp; smooth motion</CheckItem>
                  <CheckItem>Fast, offline-ready experience</CheckItem>
                  <CheckItem>Store deployment included</CheckItem>
                </ul>
              </div>

              <div className="relative mt-auto flex justify-center">
                <img
                  src="/mobile.svg"
                  alt="Mobile App Services Mockup"
                  width="250"
                  height="490"
                  className="w-[230px] sm:w-[250px] h-auto translate-y-[18%] drop-shadow-2xl select-none pointer-events-none transition-transform duration-500 ease-out group-hover:translate-y-[12%]"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* ── Card 2: Web (top middle) ── */}
          <ScrollReveal delay={0.2} y={40} className="h-full">
            <div
              data-builder-field="card2_title"
              data-builder-label="Card 2: Web Systems"
              className={`${cardBase} min-h-[300px] flex flex-col`}
            >
              <div className="relative z-10 p-7 sm:p-8 pb-0">
                <h3
                  data-builder-field="card2_title"
                  data-builder-label="Card 2 Title"
                  className="text-[24px] sm:text-[26px] font-semibold leading-[1.15] tracking-tight text-white"
                >
                  {content.card2_title || 'Web development'}
                </h3>
                <p
                  data-builder-field="card2_desc"
                  data-builder-label="Card 2 Description"
                  className="mt-2 text-[13px] leading-relaxed text-white/85 max-w-[290px]"
                >
                  {content.card2_desc || 'Self-manageable websites & web apps on modern stacks — fast, secure, built to scale.'}
                </p>
              </div>
              <div className="relative mt-auto px-6 pt-4 flex justify-center">
                <img
                  src="/dekstop.svg"
                  alt="Web Development Services Desktop Mockup"
                  width="330"
                  height="210"
                  className="w-full max-w-[330px] h-auto translate-y-[14%] drop-shadow-2xl select-none pointer-events-none transition-transform duration-500 ease-out group-hover:translate-y-[8%]"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* ── Card 3: Tech Stack (top right) ── */}
          <ScrollReveal delay={0.3} y={40} className="h-full">
            <div
              data-builder-field="stack_title"
              data-builder-label="Card: Tech Stack"
              className={`${cardBase} min-h-[300px] flex flex-col p-7 sm:p-8`}
            >
              <h3 className="text-[24px] sm:text-[26px] font-semibold leading-[1.15] tracking-tight text-white">
                {content.stack_title || 'Built to ship. Made to last.'}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/85 max-w-[280px]">
                {content.stack_desc || 'One engineer across the whole stack — app, web, and the hardware underneath.'}
              </p>
              <div className="mt-auto pt-6 flex items-end justify-around">
                <StackTile icon={`${DEVICON}/flutter/flutter-original.svg`} label="Mobile" rotate="-rotate-[4deg]" />
                <StackTile icon={`${DEVICON}/react/react-original.svg`} label="Web" rotate="rotate-[3deg]" />
                <StackTile icon={`${DEVICON}/arduino/arduino-original.svg`} label="IoT" rotate="-rotate-[2deg]" />
              </div>
            </div>
          </ScrollReveal>

          {/* ── Card 4: IoT & Hardware (wide bottom) ── */}
          <ScrollReveal delay={0.4} y={40} className="md:col-span-2 h-full">
            <div
              data-builder-field="card3_title"
              data-builder-label="Card 3: IoT & Hardware"
              className={`${cardBase} min-h-[300px] grid grid-cols-1 sm:grid-cols-2 items-center`}
            >
              <div className="relative z-10 p-7 sm:p-9">
                <h3
                  data-builder-field="card3_title"
                  data-builder-label="Card 3 Title"
                  className="text-[24px] sm:text-[28px] font-semibold leading-[1.15] tracking-tight text-white"
                >
                  {content.card3_title || 'IoT & hardware services'}
                </h3>
                <p
                  data-builder-field="card3_desc"
                  data-builder-label="Card 3 Description"
                  className="mt-3 text-[13.5px] leading-relaxed text-white/85 max-w-[340px]"
                >
                  {content.card3_desc || 'Custom PCB schematic & layout, embedded firmware, sensor telemetry, and continuous support — from prototype to production.'}
                </p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="mt-6 inline-flex items-center gap-3 pl-4 pr-2 py-2 rounded-xl bg-white text-[#141414] hover:bg-white/95 shadow-md font-mono text-[12.5px] transition-all cursor-pointer active:scale-95"
                  aria-label="Copy email"
                >
                  <span className="font-semibold">{email}</span>
                  <span className="w-7 h-7 rounded-lg bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center">
                    {copied ? (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                    )}
                  </span>
                </button>
              </div>

              <div className="relative h-full min-h-[240px] flex items-center justify-center">
                <ErrorBoundary
                  fallback={
                    <div className="relative w-full h-[240px] flex items-center justify-center">
                      <PcbSkeleton />
                    </div>
                  }
                >
                  <Suspense
                    fallback={
                      <div className="relative w-full h-[240px] flex items-center justify-center">
                        <PcbSkeleton />
                      </div>
                    }
                  >
                    <PcbViewer3D />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
