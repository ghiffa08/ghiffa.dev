import React from 'react';

export function ProfessionalJourneySection({ experiencesList }) {
  return (
    <section id="journey" className="relative py-20 sm:py-28 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto border-t border-gray-100">
      <div id="experience" className="absolute -top-24" />

      {/* Section Header: Full-width display title matching reference */}
      <div className="mb-14 sm:mb-20">
        <h2 className="text-4xl min-[400px]:text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[124px] 2xl:text-[130px] lg:whitespace-nowrap font-bold text-[#141414] tracking-tight sm:tracking-tighter leading-[0.88] lowercase select-none">
          professional journey
        </h2>
      </div>

      {/* Clean Editorial Experience List (Non-card, consistent with theme) */}
      <div className="divide-y divide-gray-200/80">
        {experiencesList.map((exp, idx) => {
          const indexNumber = String(idx + 1).padStart(2, '0');
          return (
            <div
              key={exp.id || idx}
              className="group py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start hover:bg-gray-50/60 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-2xl transition-all duration-200"
            >
              {/* Column 1: Index Number (01), (02) & Period */}
              <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold text-gray-400 group-hover:text-[#FF5500] transition-colors">
                  ({indexNumber})
                </span>
                <div>
                  <span className="text-xs sm:text-[13px] font-mono font-medium text-gray-600 block">
                    {exp.period || '2023 - Present'}
                  </span>
                  {exp.location && (
                    <span className="text-[12px] text-gray-400 font-normal block mt-0.5">
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Column 2: Role & Company */}
              <div className="md:col-span-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#141414] group-hover:text-[#FF5500] transition-colors leading-snug">
                  {exp.role || exp.position}
                </h3>
                <div className="text-sm sm:text-base font-semibold text-gray-700 mt-1.5 flex items-center gap-2">
                  <span>{exp.company}</span>
                </div>
              </div>

              {/* Column 3: Description & Tech Stack */}
              <div className="md:col-span-5 space-y-3">
                <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed font-normal">
                  {exp.description}
                </p>

                {exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-mono font-medium bg-white text-gray-600 px-2.5 py-1 rounded-md border border-gray-200/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
