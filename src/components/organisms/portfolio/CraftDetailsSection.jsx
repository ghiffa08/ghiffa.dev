import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function CraftDetailsSection({ onOpenContact }) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Text */}
        <ScrollReveal delay={0.05} y={32} className="lg:col-span-5 space-y-4 sm:space-y-5">
          <h2 className="text-2xl min-[360px]:text-3xl sm:text-[42px] font-bold tracking-tight text-[#141414] leading-[1.12]">
            Details are<br />not details
          </h2>
          <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed">
            They make the product. We obsess over micro-interactions, typography, accessibility, and millisecond load times so your brand stands out effortlessly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenContact('Design & Craft')}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-all cursor-pointer"
            >
              See our craft &rarr;
            </button>
          </div>
        </ScrollReveal>

        {/* Right Layered Visual Cards */}
        <ScrollReveal delay={0.2} y={36} className="lg:col-span-7 relative flex items-center justify-center min-h-[300px] sm:min-h-[380px] overflow-hidden sm:overflow-visible py-4">
          {/* Left tilted background card */}
          <div className="w-28 min-[380px]:w-36 sm:w-52 h-44 min-[380px]:h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg -rotate-6 -mr-6 min-[380px]:-mr-8 sm:-mr-10 z-10 border border-gray-200 bg-zinc-900 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"
              alt="Detail 1"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

          {/* Center main portrait card */}
          <div className="w-40 min-[380px]:w-48 sm:w-64 h-60 min-[380px]:h-72 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-20 border-2 border-white bg-zinc-950 relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
              alt="Main Portrait"
              className="w-full h-full object-cover contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#FF5500] font-mono">Pixel Precision</span>
              <p className="text-xs sm:text-sm font-semibold mt-0.5">Crafted for human connection</p>
            </div>
          </div>

          {/* Right tilted background card */}
          <div className="w-28 min-[380px]:w-36 sm:w-52 h-44 min-[380px]:h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg rotate-6 -ml-6 min-[380px]:-ml-8 sm:-ml-10 z-10 border border-gray-200 bg-zinc-900 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80"
              alt="Detail 2"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

          {/* Floating Comment Tag Top-Right */}
          <div className="hidden sm:flex items-center gap-2.5 absolute top-6 right-8 z-30 bg-white px-3.5 py-2 rounded-xl comment-shadow border border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
            <span className="text-[11.5px] font-medium text-gray-800">60fps smooth animations</span>
          </div>

          {/* Floating Comment Tag Bottom */}
          <div className="hidden sm:flex items-center gap-2.5 absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 bg-white px-4 py-2 rounded-xl comment-shadow border border-gray-100">
            <div className="w-5 h-5 rounded-full bg-black text-white text-[7px] font-bold flex items-center justify-center">gh</div>
            <span className="text-[11.5px] font-medium text-gray-800">Every breakpoint tested</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
