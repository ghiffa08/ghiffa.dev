import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function ContactSection() {
  const { data: info, isLoading, error } = useSupabaseSingle('personal_info');

  if (isLoading) {
    return (
      <section id="contact" className="bg-[#111111] pt-32 pb-12 mt-12 scroll-fade px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto w-full h-[50vh] bg-[#222] animate-pulse rounded-2xl"></div>
      </section>
    );
  }

  if (error || !info) {
    return null;
  }

  const socialLinks = info.social_links || {};

  return (
    <section id="contact" className="bg-[#111111] text-[#FAFAFA] pt-32 pb-12 mt-12 scroll-fade">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        
        <h2 className="text-[11vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter mb-12 text-white uppercase">
          Communication matters<br/>to start good things/
        </h2>
        
        <p className="text-sm md:text-base text-gray-400 font-medium mb-16 max-w-md">
          {info.availability_status || "I'm currently available for freelance worldwide. Feel free to contact me if you want to collaborate on future projects or have a little chat."}
        </p>

        <a href={`mailto:${info.email}`} className="w-full max-w-xl rounded-full border border-white/20 bg-white/5 py-5 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all duration-500 flex justify-center items-center gap-3">
          <span>Let's Connect With Me</span>
          <span className="text-base leading-none">↗</span>
        </a>

        <div className="w-full border-t border-white/10 mt-32 pt-8 flex flex-col md:flex-row justify-between items-center font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 gap-8">
          
          <div className="flex gap-8">
            {socialLinks.linkedin && <a href={socialLinks.linkedin} className="hover:text-white transition-colors" target="_blank" rel="noreferrer">LinkedIn ↗</a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} className="hover:text-white transition-colors" target="_blank" rel="noreferrer">Instagram ↗</a>}
            {socialLinks.github && <a href={socialLinks.github} className="hover:text-white transition-colors" target="_blank" rel="noreferrer">GitHub ↗</a>}
          </div>
          
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} {info.full_name || 'Haikal Jibran'}. All Rights Reserved.
          </div>
          
        </div>

      </div>
    </section>
  );
}
