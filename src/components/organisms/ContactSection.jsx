import { useSupabaseSingle } from '../../hooks/useSupabaseData';
import { BusinessCard3D } from '../molecules/BusinessCard3D';

export function ContactSection() {
  const { data: contact, isLoading: isLoadingContact } = useSupabaseSingle('contact_section');
  const { data: hero, isLoading: isLoadingHero } = useSupabaseSingle('hero_section');

  if (isLoadingContact || isLoadingHero || !contact || !hero) {
    return (
      <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[70vh] flex flex-col relative overflow-hidden">
        <div className="px-4 md:px-8 py-12 hairline-b relative z-10">
            <div className="w-24 h-16 md:w-32 md:h-24 bg-gray-200 animate-pulse mb-4"></div>
            <div className="w-64 h-6 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 text-center relative z-10">
          <div className="w-64 h-4 bg-gray-200 animate-pulse mb-8"></div>
          <div className="w-[80vw] md:w-[600px] h-[10vw] md:h-[100px] bg-gray-200 animate-pulse mb-8"></div>
          <div className="w-[340px] h-[200px] md:w-[420px] md:h-[240px] bg-gray-200 animate-pulse mt-16 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="hairline-t fade-up bg-[#FAFAFA] min-h-[70vh] flex flex-col relative overflow-hidden">
      <div className="px-4 md:px-8 py-12 hairline-b relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">06.</h2>
          <h3 className="text-xl font-bold mt-4 uppercase tracking-widest">Contact Me</h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 text-center relative z-10">
        <p className="font-mono text-sm md:text-base text-gray-500 mb-8 tracking-widest uppercase">
          [ {contact.availability} ]
        </p>
        <a 
          href={`mailto:${contact.email}`} 
          className="text-[10vw] md:text-8xl font-black tracking-tighter hover:text-[#3B82F6] transition-colors inline-block relative group"
        >
          {contact.display_text}
          <span className="absolute left-0 -bottom-2 w-full h-[6px] md:h-[10px] bg-[#3B82F6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
        </a>

        <BusinessCard3D 
          email={contact.email}
          phone={contact.phone_number}
          github={contact.github_url}
          linkedin={contact.linkedin_url}
          instagram={contact.instagram_url}
          hero={hero}
        />
      </div>
    </section>
  );
}
