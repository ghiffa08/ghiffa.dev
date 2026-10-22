import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function PortfolioFooter({ emailAddress }) {
  return (
    <footer className="border-t border-gray-200/80 py-10 sm:py-12 px-4 sm:px-12 lg:px-20 text-xs text-gray-500">
      <ScrollReveal delay={0.05} y={16}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#111111]">ghiffa.dev</div>
            <p>2026 All rights reserved. ghiffa.dev</p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-gray-600">
            <a href="#services" className="hover:text-black transition-colors">Services</a>
            <a href={`mailto:${emailAddress}`} className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
