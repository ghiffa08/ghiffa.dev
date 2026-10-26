import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function PortfolioHeader({
  splashActive,
  splashFade,
  heroRevealed,
  isBannerDark,
  onOpenContact
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Works', href: '/works' },
    { label: 'Articles', href: '/articles' },
    { label: 'About', href: '/#about' },
    { label: 'Links', href: '/links' },
  ];

  return (
    <>
      {/* SEAMLESS SPLASH SCREEN: ONLY ghiffa.dev IN IDENTICAL PIXEL-PERFECT POSITION */}
      {splashActive && (
        <div
          id="splash-screen"
          className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-300 ease-out select-none pointer-events-none ${
            splashFade ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden={splashFade}
        >
          <div className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] pt-[64px] sm:pt-[72px] overflow-hidden select-none">
            <div className="relative w-full h-full">
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-2 sm:px-4 w-full max-w-[96vw] sm:max-w-none flex justify-center">
                <div className="will-change-transform">
                  <div className="px-3 min-[400px]:px-6 sm:px-12 pt-2 sm:pt-4 pb-2.5 sm:pb-6 overflow-visible relative border border-transparent">
                    <h1 className="text-[34px] min-[360px]:text-[40px] min-[400px]:text-[48px] sm:text-[84px] md:text-[112px] lg:text-[138px] font-bold tracking-[-0.04em] leading-[1.08] text-[#141414] select-none whitespace-nowrap block pb-1 sm:pb-2">
                      ghiffa.dev
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-WIDTH HEADER WITH SEMANTIC NAVIGATION */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-700 ease-in-out ${
          heroRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
        } ${
          isBannerDark
            ? 'bg-[#F8A065]/85 border-black/10 text-[#111111]'
            : 'bg-white/95 border-gray-100/80 text-[#111111]'
        }`}
      >
        <div className="w-full px-4 sm:px-16 lg:px-[12.8vw] h-[64px] sm:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-[18px] sm:text-[20px] font-bold tracking-tight leading-none text-[#111111] hover:opacity-80 transition-opacity duration-300 select-none"
          >
            ghiffa.dev
          </Link>

          {/* Desktop & Tablet Sitelinks Navigation (Crucial for Google Sitelinks Algorithm) */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider font-semibold">
            {navItems.map((item) => (
              item.href.startsWith('/#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Action: Let's talk + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenContact('Header Inquiry')}
              className={`text-[12px] sm:text-[12.5px] font-medium px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs ${
                isBannerDark
                  ? 'bg-[#18181B] text-white hover:bg-black'
                  : 'bg-[#18181B] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Let&apos;s talk
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 font-mono text-xs uppercase tracking-wider font-bold animate-in slide-in-from-top-2 duration-200"
          >
            {navItems.map((item) => (
              item.href.startsWith('/#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-[#FF5500] border-b border-gray-100 last:border-b-0"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-[#FF5500] border-b border-gray-100 last:border-b-0"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
