import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function CommunicationCtaSection({ emailAddress, onOpenContact }) {
  const email = emailAddress || 'hello@ghiffa.dev';

  return (
    <section id="contact" className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto overflow-hidden">
      <ScrollReveal delay={0.05} y={32} className="flex flex-col items-center text-center">
        {/* Subtle Category Eyebrow */}
        <div className="flex items-center gap-2 mb-6 select-none">
          <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-gray-500">
            Get In Touch
          </span>
        </div>

        {/* Display Headline with Signature Figma Selection Highlight */}
        <h2 className="text-3xl min-[400px]:text-4xl sm:text-6xl md:text-7xl lg:text-[82px] xl:text-[92px] font-bold tracking-tight text-[#141414] leading-[0.98] lowercase select-none max-w-5xl">
          communication matters
          <span className="block mt-2 sm:mt-3">
            <span className="relative inline-flex items-center bg-[#FFF2EB] text-[#141414] px-3 sm:px-6 py-1 sm:py-1.5 border-y border-[#FF5500]/30 select-none">
              {/* Left Pin */}
              <span className="absolute -left-[2px] top-0 bottom-0 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white -translate-y-1/2" />
                <span className="w-[2.5px] flex-1 bg-[#FF5500]" />
              </span>

              <span>to start good things/</span>

              {/* Right Pin */}
              <span className="absolute -right-[2px] top-0 bottom-0 flex flex-col items-center">
                <span className="w-[2.5px] flex-1 bg-[#FF5500]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white translate-y-1/2" />
              </span>
            </span>
          </span>
        </h2>

        {/* Good Communication Descriptive Paragraph */}
        <p className="text-gray-600 text-sm sm:text-base lg:text-[17px] max-w-xl mx-auto leading-relaxed mt-6 sm:mt-8 font-normal">
          I&apos;m currently available for freelance worldwide and full-time engineering roles. Feel free to contact me if you want to collaborate on future projects or have a chat.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          {/* Primary CTA Button */}
          <button
            onClick={() => onOpenContact('Communication & Project Collaboration')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold text-sm sm:text-[15px] px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-orange-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <span>Let&apos;s Connect With Me</span>
            <span className="text-base leading-none">&nearr;</span>
          </button>

        </div>

      </ScrollReveal>
    </section>
  );
}
