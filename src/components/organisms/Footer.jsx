import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function Footer() {
  const { data: contact, isLoading } = useSupabaseSingle('contact_section');

  if (isLoading || !contact) {
    return <footer className="hairline-t px-4 md:px-8 py-12 bg-[#111111] text-[#FAFAFA] flex flex-col md:flex-row justify-between items-center font-mono text-xs relative z-10"></footer>;
  }

  return (
    <footer className="hairline-t px-4 md:px-8 py-12 bg-[#111111] text-[#FAFAFA] flex flex-col md:flex-row justify-between items-center font-mono text-xs relative z-10">
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <p className="text-gray-400 mb-1">EMAIL ME DIRECTLY</p>
        <p className="text-sm md:text-lg">{contact.email}</p>
      </div>
      <div className="flex flex-col items-center md:items-end space-y-4">
        <div className="space-x-4 md:space-x-8 text-sm">
          {contact.linkedin_url && (
            <a href={contact.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">LINKEDIN</a>
          )}
          {contact.instagram_url && (
            <a href={contact.instagram_url} target="_blank" rel="noreferrer" className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">INSTAGRAM</a>
          )}
          {contact.phone_number && (
            <a href={`tel:${contact.phone_number}`} className="hover:text-[#666666] transition-colors border-b border-transparent hover:border-[#666666] pb-1">PHONE</a>
          )}
        </div>
        <div className="text-gray-600">
          © {new Date().getFullYear()} GHIFFFA.DEV. KUNINGAN, ID.
        </div>
      </div>
    </footer>
  );
}
