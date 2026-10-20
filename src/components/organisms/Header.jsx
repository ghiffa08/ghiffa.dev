import React from 'react';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function Header({ activePage = 'home', setActivePage, onGetInTouch }) {
  const { data: settings } = useSupabaseSingle('general_settings');
  const rawName = settings?.app_name || 'GHIFFA';
  const brandName = rawName.replace('.dev', '').toUpperCase();

  const handleNavClick = (pageId) => {
    if (setActivePage) {
      setActivePage(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (onGetInTouch) {
      onGetInTouch();
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F0EFE9]/95 backdrop-blur-sm border-b border-[#D6D4CC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
        >
          {/* Lequon Pill-Cutout Icon */}
          <svg className="w-4 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16V26C0 34.8366 7.16344 42 16 42V21H32V16C32 7.16344 24.8366 0 16 0Z" fill="#121210"/>
            <path d="M16 21H32V26C32 34.8366 24.8366 42 16 42V21Z" fill="#FF441F"/>
          </svg>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold tracking-tight text-sm uppercase text-[#121210] font-sans">
              {brandName || 'LEQUON'}
            </span>
            <span className="font-mono text-[9px] tracking-[0.16em] text-[#6E6D68] uppercase">
              STUDIO
            </span>
          </div>
        </button>

        {/* Center Navigation Links (Multi-Page Switcher) */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-[0.14em] uppercase">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`nav-item transition-colors cursor-pointer ${activePage === 'home' ? 'text-[#FF441F] font-semibold' : 'text-[#121210] hover:text-[#FF441F]'}`}
          >
            <span className="text-[#6E6D68] mr-1">00</span>HOME
          </button>
          <button 
            onClick={() => handleNavClick('about')} 
            className={`nav-item transition-colors cursor-pointer ${activePage === 'about' ? 'text-[#FF441F] font-semibold' : 'text-[#121210] hover:text-[#FF441F]'}`}
          >
            <span className="text-[#6E6D68] mr-1">01</span>ABOUT
          </button>
          <button 
            onClick={() => handleNavClick('work')} 
            className={`nav-item transition-colors cursor-pointer ${activePage === 'work' ? 'text-[#FF441F] font-semibold' : 'text-[#121210] hover:text-[#FF441F]'}`}
          >
            <span className="text-[#6E6D68] mr-1">02</span>WORK
          </button>
        </nav>

        {/* Right CTA Button & Mobile Page Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Quick Nav */}
          <div className="flex md:hidden items-center border border-[#D6D4CC] bg-[#EAE8E0]/70 p-0.5 font-mono text-[9px] uppercase">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`px-2 py-1 transition-colors ${activePage === 'home' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
            >
              00
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`px-2 py-1 transition-colors ${activePage === 'about' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
            >
              01 ABOUT
            </button>
            <button 
              onClick={() => handleNavClick('work')} 
              className={`px-2 py-1 transition-colors ${activePage === 'work' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
            >
              02 WORK
            </button>
          </div>

          <a 
            href="#contact" 
            onClick={handleContactClick}
            className="border border-[#121210] px-3 sm:px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors flex items-center gap-1.5"
          >
            <span>GET IN TOUCH</span>
            <span className="text-[11px] leading-none">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
