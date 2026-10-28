import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';

export function ArticlesHeader({ currentTitle, showBack = false, emailAddress }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const email = emailAddress || 'hello@ghiffa.dev';

  const navItems = [
    { label: 'Works', href: '/works' },
    { label: 'Articles', href: '/articles' },
    { label: 'About', href: '/#about' },
    { label: 'Links', href: '/links' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-100/80 text-[#111111] transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto h-[64px] sm:h-[72px] flex items-center justify-between">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to="/"
            className="text-[18px] sm:text-[20px] font-bold tracking-tight leading-none text-[#111111] hover:opacity-80 transition-opacity select-none"
          >
            ghiffa.dev
          </Link>
          <span className="text-gray-300 text-sm">/</span>
          <Link
            to="/articles"
            className="text-xs sm:text-[13px] font-mono uppercase tracking-wider text-gray-500 hover:text-black transition-colors font-medium"
          >
            articles
          </Link>
          {currentTitle && (
            <>
              <span className="hidden lg:inline text-gray-300 text-sm">/</span>
              <span className="hidden lg:inline text-xs font-mono text-gray-400 truncate max-w-[200px]">
                {currentTitle}
              </span>
            </>
          )}
        </div>

        {/* Desktop & Tablet Sitelinks Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-wider font-semibold">
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
                className={`transition-colors hover:underline underline-offset-4 ${
                  item.href === '/articles' ? 'text-black underline' : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* Action Controls & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showBack && (
            <Link
              to="/articles"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-black px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Articles</span>
            </Link>
          )}

          <a
            href={`mailto:${email}`}
            className="text-[12px] sm:text-[12.5px] font-medium px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#18181B] text-white hover:bg-[#2a2a2a] transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Let&apos;s talk
          </a>

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
  );
}
export default ArticlesHeader;
