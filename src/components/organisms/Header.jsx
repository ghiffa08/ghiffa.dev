import { LanguageSwitcher } from '../molecules/LanguageSwitcher';

export function Header() {
  return (
    <header className="fixed top-0 w-full max-w-screen-2xl bg-[#FAFAFA]/90 backdrop-blur-md text-[#111111] z-40 hairline-b border-[#E5E5E5] transition-all notranslate" translate="no">
      <div className="grid grid-cols-3 text-xs md:text-sm font-mono p-4 font-bold tracking-wider items-center">
        <div>GHIIFA.DEV</div>
        <div className="text-center uppercase hidden md:block">PERSONAL WEBSITE</div>
        <div className="text-right">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
