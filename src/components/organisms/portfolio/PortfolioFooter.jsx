import React from 'react';
import { ArrowUpRight, ArrowRight, ArrowUp } from 'lucide-react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function PortfolioFooter({ emailAddress, onOpenContact }) {
  const email = emailAddress || 'hello@ghiffa.dev';
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Selected Works', href: '#works' },
    { label: 'Articles', href: '#articles' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/ghiffa08' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry' },
    { label: 'Instagram', href: 'https://www.instagram.com/haikaljibraan' },
  ];

  return (
    <footer className="relative bg-white text-[#141414] border-t border-gray-100 overflow-hidden">
      <ScrollReveal delay={0.05} y={24}>
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16 border-b border-gray-100">
            {/* Brand Column (Left) */}
            <div className="md:col-span-5 lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTop();
                  }}
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] hover:opacity-80 transition-opacity select-none"
                >
                  ghiffa.dev
                </a>
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium select-none">
                  v2.0
                </span>
              </div>

              <p className="text-sm sm:text-[15px] text-gray-600 font-medium">
                Fullstack Web Developer &amp; IoT Engineer
              </p>

              <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed max-w-md font-normal">
                Crafting robust web applications, responsive digital products, and connected IoT systems from Kuningan, West Java.
              </p>

            </div>

            {/* Navigation Column */}
            <div className="md:col-span-3 lg:col-span-3 space-y-3.5">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-semibold text-gray-400">
                Navigation
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-gray-600 hover:text-black hover:translate-x-1 transition-all inline-block font-medium"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact Column */}
            <div className="md:col-span-4 lg:col-span-3 space-y-3.5">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-semibold text-gray-400">
                Connect
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-gray-600 hover:text-black font-medium transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="group inline-flex items-center gap-1.5 text-gray-600 hover:text-black font-medium transition-colors"
                  >
                    <span>Email Me</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF5500] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
              </ul>

              {onOpenContact && (
                <div className="pt-2">
                  <button
                    onClick={() => onOpenContact('Footer Inquiry')}
                    className="group inline-flex items-center gap-2 text-xs font-mono font-medium text-[#141414] hover:text-[#FF5500] transition-colors cursor-pointer select-none"
                  >
                    <span>Start a conversation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Copyright, Location, Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
              <span>&copy; {currentYear} Haikal Jibran Al-Ghiffarry.</span>
              <span className="hidden sm:inline text-gray-300">&middot;</span>
              <span>All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4 text-center">
              <span className="text-gray-400">Kuningan, West Java, ID</span>
              <span className="text-gray-300">&middot;</span>
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center gap-1 text-gray-600 hover:text-black transition-colors cursor-pointer"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
