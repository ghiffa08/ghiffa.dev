import { useTranslation } from 'react-i18next';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function Footer() {
  const { t } = useTranslation();
  const { data: contact, isLoading } = useSupabaseSingle('contact_section');

  const email = contact?.email || 'hello@ghiffa.dev';
  const linkedin = contact?.linkedin_url;
  const instagram = contact?.instagram_url;
  const phone = contact?.phone_number;

  return (
    <footer className="border-t border-white/10 px-4 md:px-8 py-12 bg-[#111111] text-[#FAFAFA] flex flex-col md:flex-row justify-between items-center font-mono text-xs relative z-10">
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <p className="text-gray-400 mb-1">{t('footer.emailMe', 'EMAIL ME')}</p>
        {isLoading ? (
          <div className="w-48 h-6 bg-white/10 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-sm md:text-lg">{email}</p>
        )}
      </div>
      <div className="flex flex-col items-center md:items-end space-y-4">
        <div className="space-x-4 md:space-x-8 text-sm flex items-center">
          {isLoading ? (
            <div className="w-48 h-4 bg-white/10 animate-pulse rounded"></div>
          ) : (
            <>
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">LINKEDIN</a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">INSTAGRAM</a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">PHONE</a>
              )}
            </>
          )}
        </div>
        <div className="text-gray-600">
          © {new Date().getFullYear()} GHIFFFA.DEV. {t('footer.kuningan', 'WEST JAVA, INDONESIA')}
        </div>
      </div>
    </footer>
  );
}
