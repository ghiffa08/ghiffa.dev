import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <div className="flex space-x-2 items-center text-[10px] md:text-xs tracking-widest uppercase notranslate" translate="no">
        <button 
          onClick={() => changeLanguage('id')}
          className={`hover:text-[#111111] transition-colors cursor-pointer ${currentLang === 'id' ? 'font-black text-[#111111]' : 'text-gray-400'}`}
        >
          ID
        </button>
        <span className="text-gray-300">/</span>
        <button 
          onClick={() => changeLanguage('en')}
          className={`hover:text-[#111111] transition-colors cursor-pointer ${currentLang === 'en' ? 'font-black text-[#111111]' : 'text-gray-400'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
