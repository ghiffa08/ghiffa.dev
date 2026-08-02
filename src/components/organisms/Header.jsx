import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function Header() {
  const { t } = useTranslation();
  const { data: settings } = useSupabaseSingle('general_settings');
  const appName = settings?.app_name || 'ghiffa.dev';
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'works', 'process', 'journal'];
      let current = '';
      
      // Check if scrolled past hero (threshold 100px)
      setIsScrolled(window.scrollY > 100);
      
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
    
    if (location.pathname !== '/') {
      // If we're not on the homepage, navigate to the homepage with the hash.
      // Portfolio.jsx now has a useEffect to handle scrolling to the hash on mount.
      navigate(targetId === 'body' ? '/' : `/${targetId}`);
      return;
    }

    // Same-page smooth scroll
    const target = targetId === 'body' ? 0 : targetId;
    if (window.lenis) {
      if (target === 0 || document.querySelector(target)) {
        window.lenis.scrollTo(target, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    } else {
      if (targetId !== 'body') {
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`w-full z-40 fixed top-0 transition-all duration-300 notranslate border-b ${
      isScrolled 
        ? 'bg-[#FAFAFA]/90 backdrop-blur-md border-[var(--border)]' 
        : 'bg-transparent border-transparent'
    }`} translate="no">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center gap-4 cursor-pointer" onClick={(e) => handleScrollTo(e, 'body')}>
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase">{appName}</span>
        </div>
        
        <div className="hidden md:flex space-x-12 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">
          <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className={`transition-colors ${activeSection === 'about' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>{t('nav.about')}</a>
          <a href="#works" onClick={(e) => handleScrollTo(e, '#works')} className={`transition-colors ${activeSection === 'works' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>{t('nav.works')}</a>
          <a href="#process" onClick={(e) => handleScrollTo(e, '#process')} className={`transition-colors ${activeSection === 'process' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>{t('nav.experience')}</a>
          <a href="#journal" onClick={(e) => handleScrollTo(e, '#journal')} className={`transition-colors ${activeSection === 'journal' ? 'text-[#111111]' : 'hover:text-[#111111]'}`}>{t('nav.journal')}</a>
          <Link to="/articles" className="transition-colors hover:text-[#111111]">{t('nav.articles')}</Link>
        </div>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
