import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function ClientLogosStrip() {
  return (
    <section className="py-10 sm:py-12 border-t border-b border-gray-100 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
      <ScrollReveal delay={0.05} y={20}>
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-8 opacity-45 grayscale">
          <span className="text-base sm:text-lg font-bold tracking-tight">VERCEL</span>
          <span className="text-base sm:text-lg font-bold tracking-widest">STRIPE</span>
          <span className="text-base sm:text-lg font-semibold font-serif italic">Chronicle</span>
          <span className="text-base sm:text-lg font-extrabold tracking-tighter">LINEAR</span>
          <span className="text-base sm:text-lg font-mono font-bold">SUPABASE</span>
          <span className="text-base sm:text-lg font-bold tracking-tight">RAYCAST</span>
          <span className="text-base sm:text-lg font-semibold">NOTION</span>
        </div>
      </ScrollReveal>
    </section>
  );
}
