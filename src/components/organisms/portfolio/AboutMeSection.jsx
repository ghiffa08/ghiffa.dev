import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function AboutMeSection({ avatarImage, fullName, aboutBio, educationList }) {
  return (
    <section id="about" className="relative py-20 sm:py-28 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start sm:items-center">
        {/* LEFT COLUMN: Uncropped Full-Height Person Cutout + Floating Tech Dock (No Background) */}
        <ScrollReveal delay={0.1} y={36} className="lg:col-span-5 flex flex-col items-center justify-end relative self-stretch">
          {/* Person Cutout: Full height, uncropped, zero background */}
          <div className="relative flex items-end justify-center w-full flex-1">
            <img
              src={avatarImage}
              alt={fullName}
              className="w-auto h-auto max-h-[520px] sm:max-h-[600px] lg:max-h-[680px] xl:max-h-[740px] object-contain object-bottom select-none pointer-events-none drop-shadow-xs transition-transform duration-500 hover:scale-[1.01]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                if (e.currentTarget.src.includes('.svg')) {
                  e.currentTarget.src = '/ghiffa.png';
                } else {
                  e.currentTarget.src = '/ghiffa.jpeg';
                }
              }}
            />
          </div>

          {/* FLOATING TECH DOCK (All Official Tech Brand Logos) */}
          <div className="-mt-5 sm:-mt-7 relative z-10 bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.08)] rounded-full px-4 sm:px-5 py-2.5 flex items-center justify-center gap-3 sm:gap-3.5 select-none hover:shadow-lg transition-shadow">
            {/* React */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="React">
              <svg className="w-5 h-5 text-[#00D8FE]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
                <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
                <g stroke="#00D8FE" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
            </div>

            {/* Next.js */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Next.js">
              <svg className="w-5 h-5 text-black" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="90" fill="black" />
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
                <rect x="115" y="54" width="12" height="72" fill="white" />
              </svg>
            </div>

            {/* TypeScript */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="TypeScript">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#3178C6" />
                <path d="M11.75 8.25H6.25v1.88h1.8v8.62h2.2v-8.62h1.5V8.25zm5.55 3.3c-1.3-.4-2.1-.8-2.1-1.6 0-.7.7-1.2 1.8-1.2 1.1 0 1.9.5 2.2 1.3l1.8-.8c-.6-1.4-1.9-2.3-3.9-2.3-2.4 0-4.1 1.5-4.1 3.5 0 2 1.4 2.8 3.3 3.4 1.4.4 2.1.9 2.1 1.7 0 .8-.8 1.4-2 1.4-1.5 0-2.3-.7-2.7-1.6l-1.9.8c.6 1.7 2.2 2.7 4.5 2.7 2.6 0 4.3-1.4 4.3-3.6 0-2.1-1.3-3-3.3-3.7z" fill="white" />
              </svg>
            </div>

            {/* Tailwind CSS */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Tailwind CSS">
              <svg className="w-5 h-5 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
              </svg>
            </div>

            {/* Node.js */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Node.js">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5FA04E">
                <path d="M11.998 1.5L2.616 6.92v10.84l9.382 5.42 9.386-5.42V6.92L11.998 1.5zm-.088 2.378l7.26 4.195v8.384l-7.26 4.191-7.256-4.191V8.073l7.256-4.195zm.088 3.513l-4.75 2.742v5.485l4.75 2.743 4.75-2.743V10.133l-4.75-2.742z" />
              </svg>
            </div>

            {/* Python */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Python">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M11.914 2c-5.042 0-4.726 2.186-4.726 2.186l.006 2.264h4.79v.678H5.196S2 6.764 2 11.838c0 5.075 2.784 4.887 2.784 4.887h1.66v-2.336s-.09-2.784 2.723-2.784h4.698v-.706H9.281s-2.66-.027-2.66-2.607c0-2.58 2.308-2.527 2.308-2.527h5.666S17.067 5.6 17.067 8.2v.735h1.737V4.24S18.995 2 11.914 2zm-2.583 1.488a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72z" fill="#3776AB" />
                <path d="M12.086 22c5.042 0 4.726-2.186 4.726-2.186l-.006-2.264h-4.79v-.678h6.788S22 17.236 22 12.162c0-5.075-2.784-4.887-2.784-4.887h-1.66v2.336s.09 2.784-2.723 2.784h-4.698v.706h4.582s2.66.027 2.66 2.607c0 2.58-2.308 2.527-2.308 2.527H7.405S4.933 18.4 4.933 15.8v-.735H3.196v4.695S5.005 22 12.086 22zm2.583-1.488a.86.86 0 1 1 0-1.72.86.86 0 0 1 0 1.72z" fill="#FFD43B" />
              </svg>
            </div>

            {/* Arduino */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Arduino & Embedded IoT">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00979C">
                <path d="M17.03 7C14.71 7 12.79 8.5 12 10.61 11.21 8.5 9.29 7 6.97 7 3.67 7 1 9.69 1 13s2.67 6 5.97 6c2.32 0 4.24-1.5 5.03-3.61.79 2.11 2.71 3.61 5.03 3.61 3.3 0 5.97-2.69 5.97-6s-2.67-6-5.97-6zm-10.06 9.6c-1.99 0-3.6-1.61-3.6-3.6 0-1.99 1.61-3.6 3.6-3.6 1.99 0 3.6 1.61 3.6 3.6 0 1.99-1.61 3.6-3.6 3.6zm10.06 0c-1.99 0-3.6-1.61-3.6-3.6 0-1.99 1.61-3.6 3.6-3.6 1.99 0 3.6 1.61 3.6 3.6 0 1.99-1.61 3.6-3.6 3.6zm-11.86-4.4h3.6v1.6H5.17v-1.6zm10.26-1.8h1.6v1.8h1.8v1.6h-1.8v1.8h-1.6v-1.8h-1.8v-1.6h1.8v-1.8z" />
              </svg>
            </div>

            {/* Laravel */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Laravel">
              <svg className="w-5 h-5 text-[#FF2D20]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.2 2.5L2 6.1l6.2 3.6 6.2-3.6-6.2-3.6zm0 18.9l-6.2-3.6V10.3l6.2 3.6v7.5zm7.6-7.5l6.2-3.6V2.5l-6.2 3.6v7.7zm0 7.5l6.2-3.6v-7.5l-6.2 3.6v7.5z" />
              </svg>
            </div>

            {/* Supabase */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Supabase">
              <svg className="w-5 h-5 text-[#3ECF8E]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.4 2.1a1 1 0 0 0-1.6.4L5.2 14.8a1 1 0 0 0 .9 1.4h5.3v5.7a1 1 0 0 0 1.6.8l7.6-11.8a1 1 0 0 0-.9-1.5h-6.3V2.1z" />
              </svg>
            </div>

            {/* Figma */}
            <div className="hover:scale-115 transition-transform cursor-pointer" title="Figma UI/UX">
              <svg className="w-4 h-5" viewBox="0 0 38 57" fill="none">
                <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
              </svg>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT COLUMN: Selection Highlight Header, Bio, Education, Languages */}
        <ScrollReveal delay={0.25} y={36} className="lg:col-span-7 flex flex-col justify-center space-y-7 sm:space-y-8">
          {/* SELECTION-HIGHLIGHTED HEADER */}
          <div className="inline-flex items-center relative select-none self-start">
            {/* Left selection handle with top circle pin */}
            <div className="absolute -left-[2px] top-0 bottom-0 flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white -translate-y-1/2" />
              <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
            </div>

            {/* Selection highlight box with text */}
            <div className="bg-[#FFF2EB] border-y border-[#FF5500]/30 px-5 sm:px-7 py-2 sm:py-2.5">
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#141414] lowercase leading-none">
                about me
              </h2>
            </div>

            {/* Right selection handle with bottom circle pin */}
            <div className="absolute -right-[2px] top-0 bottom-0 flex flex-col items-center">
              <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white translate-y-1/2" />
            </div>
          </div>

          {/* Bio Narrative Paragraph */}
          <div className="text-[14.5px] sm:text-[15.5px] text-gray-600 leading-relaxed space-y-3 font-normal max-w-2xl text-justify [&>p]:leading-relaxed [&>p]:text-justify [&>strong]:text-gray-900 [&>strong]:font-semibold">
            {aboutBio ? (
              <ReactMarkdown>{aboutBio}</ReactMarkdown>
            ) : (
              <p>
                As a Fullstack Web Developer and IoT Engineer, I design end-to-end technological solutions from the ground up. My technical scope encompasses scalable cloud architectures, high-performance web applications, edge computing, LoRa network telemetry, and custom PCB hardware design.
              </p>
            )}
          </div>

          {/* EDUCACIÓN / EDUCATION */}
          <div className="pt-2">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
              <span>Educación</span>
              <span className="text-xs font-normal text-gray-400 font-mono">/ Education</span>
            </h3>
            <div className="space-y-3.5">
              {educationList.map((edu, idx) => (
                <div key={edu.id || idx} className="flex items-start gap-3.5 group">
                  {/* Clean Folder Icon */}
                  <div className="shrink-0 pt-0.5">
                    <svg className="w-9 h-7 sm:w-10 sm:h-8 drop-shadow-2xs group-hover:scale-105 transition-transform" viewBox="0 0 48 38" fill="none">
                      <path d="M4 6C4 3.79086 5.79086 2 8 2H18.5858C19.6466 2 20.664 2.42143 21.4142 3.17157L24.8284 6.58579C25.5786 7.33593 26.596 7.75736 27.6569 7.75736H40C42.2091 7.75736 44 9.54822 44 11.7574V14H4V6Z" fill="#FFA06B" />
                      <rect x="2" y="10" width="44" height="26" rx="4" fill="#FF5500" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[14px] sm:text-[14.5px] text-gray-900 leading-snug">
                      {edu.title}
                    </div>
                    <div className="text-[12.5px] sm:text-[13px] text-gray-500 italic mt-0.5">
                      {edu.institution} {edu.period && <span>({edu.period})</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IDIOMAS / LANGUAGES & SPECIALIZATION */}
          <div className="pt-2">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
              <span>Idiomas &amp; Specialization</span>
            </h3>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 items-start sm:items-center">
              <div className="relative inline-flex items-center gap-2 bg-[#FF5500] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-br-xs shadow-xs hover:bg-[#E04B00] transition-colors cursor-default select-none">
                <span>Bahasa Indonesia - Native</span>
              </div>

              <div className="relative inline-flex items-center gap-2 bg-[#18181B] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-bl-xs shadow-xs hover:bg-black transition-colors cursor-default select-none">
                <span>English - Professional Working</span>
              </div>

              <div className="relative inline-flex items-center gap-2 bg-white text-gray-800 text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Full-Time &amp; Contracts</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
