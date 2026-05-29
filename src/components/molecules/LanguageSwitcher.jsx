import { useState, useCallback, useEffect } from 'react';

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('id'); // Default is Indonesian
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Read active language from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }
  }, []);

  // Lazy load Google Translate script only when needed for performance
  const loadTranslateScript = useCallback(() => {
    if (isScriptLoaded || document.querySelector('#google-translate-script')) return;
    
    const initScript = document.createElement('script');
    initScript.innerHTML = `
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'id',
          includedLanguages: 'en,id',
          autoDisplay: false
        }, 'google_translate_element');
      }
    `;
    document.head.appendChild(initScript);

    const loadScript = document.createElement('script');
    loadScript.id = 'google-translate-script';
    loadScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    loadScript.async = true;
    loadScript.defer = true;
    document.head.appendChild(loadScript);
    
    setIsScriptLoaded(true);
  }, [isScriptLoaded]);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    
    if (!isScriptLoaded) {
      loadTranslateScript();
      // Wait for the script and combo box to initialize
      const checkInterval = setInterval(() => {
        if (document.querySelector('.goog-te-combo')) {
          clearInterval(checkInterval);
          triggerTranslation(langCode);
        }
      }, 100);
      
      // Fallback timeout to prevent infinite loops
      setTimeout(() => clearInterval(checkInterval), 5000);
      return;
    }
    
    triggerTranslation(langCode);
  };

  const triggerTranslation = (langCode) => {
    const select = document.querySelector('.goog-te-combo');
    if (!select) return;

    if (langCode === 'id') {
      // To revert to original (ID), we select the default empty option
      select.value = '';
      select.dispatchEvent(new Event('change'));
      
      // Force clear the translation cookies
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
      
      // Sometimes the DOM doesn't revert cleanly in SPAs, hard reload ensures pristine state
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div 
      className="flex items-center justify-end space-x-2"
      onMouseEnter={loadTranslateScript} // Pre-load on hover for better UX
    >
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      <div className="flex space-x-2 items-center text-[10px] md:text-xs tracking-widest uppercase notranslate" translate="no">
        <button 
          onClick={() => changeLanguage('id')}
          className={`hover:text-[#3B82F6] transition-colors ${currentLang === 'id' ? 'font-black text-[#3B82F6]' : 'text-gray-500'}`}
        >
          ID
        </button>
        <span className="text-gray-300">/</span>
        <button 
          onClick={() => changeLanguage('en')}
          className={`hover:text-[#3B82F6] transition-colors ${currentLang === 'en' ? 'font-black text-[#3B82F6]' : 'text-gray-500'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
