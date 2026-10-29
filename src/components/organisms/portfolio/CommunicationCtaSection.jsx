import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { TypewriterText } from '../../atoms/TypewriterText';

export function CommunicationCtaSection({ emailAddress, sectionData }) {
  const email = emailAddress || 'hello@ghiffa.dev';
  const ctaHighlightRef = useRef(null);
  const isCtaInView = useInView(ctaHighlightRef, { once: true, margin: '-60px 0px -40px 0px' });

  // Normalize titles to avoid repetition if saved with old duplicated strings
  let rawTitle = sectionData?.title || 'communication matters';
  let highlightText = sectionData?.content?.highlight_text || 'to start good things/';

  if (rawTitle.toLowerCase().includes('to start good things/')) {
    rawTitle = 'communication matters';
    highlightText = 'to start good things/';
  }

  const subtitle =
    sectionData?.content?.subtitle ||
    "I'm currently available for freelance worldwide and full-time engineering roles. Feel free to contact me if you want to collaborate on future projects or have a chat.";
  const buttonText = sectionData?.content?.button_text || "Let's Connect With Me";

  return (
    <section id="contact" className="relative py-16 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden">
      <ScrollReveal delay={0.05} y={32} className="flex flex-col items-center text-center">
        {/* Display Headline with Signature Selection Highlight */}
        <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-bold tracking-tight text-[#141414] leading-[1.1] sm:leading-[0.98] lowercase select-none max-w-5xl px-2">
          <span
            data-builder-field="title"
            data-builder-label="CTA Main Title"
            className="block"
          >
            {rawTitle}
          </span>
          <span className="inline-block mt-2 sm:mt-4 max-w-full">
            <span
              ref={ctaHighlightRef}
              data-builder-field="highlight_text"
              data-builder-label="Highlight Pill Text"
              className="relative inline-flex items-center justify-center max-w-full bg-[#FFF2EB] text-[#141414] px-2.5 sm:px-6 py-0.5 sm:py-1.5 border-y border-[#FF5500]/30 select-none text-lg min-[360px]:text-xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-normal"
            >
              {/* Left Pin */}
              <span className="absolute -left-[2px] top-0 bottom-0 flex flex-col items-center pointer-events-none">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white -translate-y-1/2" />
                <span className="w-[2px] sm:w-[2.5px] flex-1 bg-[#FF5500]" />
              </span>

              {/* Typing Animated Text */}
              <TypewriterText
                text={highlightText}
                trigger={isCtaInView}
                delay={450}
                speed={70}
                cursorClassName="w-[2px] sm:w-[4px] lg:w-[5px] h-[0.8em] bg-[#FF5500] ml-1 sm:ml-2"
                fadeCursorAfterMs={3000}
              />

              {/* Right Pin */}
              <span className="absolute -right-[2px] top-0 bottom-0 flex flex-col items-center pointer-events-none">
                <span className="w-[2px] sm:w-[2.5px] flex-1 bg-[#FF5500]" />
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white translate-y-1/2" />
              </span>
            </span>
          </span>
        </h2>

        {/* Good Communication Descriptive Paragraph */}
        <p
          data-builder-field="subtitle"
          data-builder-label="CTA Subtitle"
          className="text-gray-600 text-xs sm:text-base lg:text-[17px] max-w-xl mx-auto leading-relaxed mt-4 sm:mt-8 font-normal px-2"
        >
          {subtitle}
        </p>

        {/* Single Action Button linking directly to email */}
        <div className="mt-6 sm:mt-10 flex items-center justify-center">
          <a
            href={sectionData?.content?.button_url || `mailto:${email}`}
            data-builder-field="button_text"
            data-builder-label="CTA Action Button"
            className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold text-xs sm:text-[15px] px-6 sm:px-9 py-3 sm:py-4 rounded-full shadow-lg shadow-orange-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
