import { useState, useEffect } from 'react';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function Header() {
  const { data: settings } = useSupabaseSingle('general_settings');
  const appName = settings?.app_name || 'ghiffa.dev';
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'works', 'process', 'journal'];
      let current = '';
      
      // Calculate active section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is currently visible in the upper part of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(targetId, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-[#FAFAFA]/90 backdrop-blur-md z-40 fixed top-0 hairline-b transition-all notranslate" translate="no">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-4 cursor-pointer" onClick={(e) => handleScrollTo(e, 'body')}>
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase">{appName}</span>
        </div>
        
        <div className="hidden md:flex space-x-12 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
          <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className={`transition-colors ${activeSection === 'about' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>About</a>
          <a href="#works" onClick={(e) => handleScrollTo(e, '#works')} className={`transition-colors ${activeSection === 'works' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>Works</a>
          <a href="#process" onClick={(e) => handleScrollTo(e, '#process')} className={`transition-colors ${activeSection === 'process' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>Experience</a>
          <a href="#journal" onClick={(e) => handleScrollTo(e, '#journal')} className={`transition-colors ${activeSection === 'journal' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>Journal</a>
        </div>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold hover:text-[#666666] transition-colors flex items-center gap-2">
            LET'S CONNECT <span className="text-base leading-none">↗</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
