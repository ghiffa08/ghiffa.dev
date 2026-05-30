import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function SkillsSection() {
  const { data: info, isLoading, error } = useSupabaseSingle('personal_info');

  if (isLoading || error || !info || !info.skills || info.skills.length === 0) {
    return null;
  }

  const skills = info.skills;

  return (
    <section className="py-8 md:py-12 hairline-t hairline-b overflow-hidden bg-[#FAFAFA]">
      <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
        {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
          <span key={index} className="text-4xl md:text-6xl font-black tracking-tighter text-[#E5E5E5] hover:text-[#111111] transition-colors duration-300 cursor-default uppercase">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
