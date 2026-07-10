import React from 'react';

export function EditorialResume({ data }) {
  if (!data) return null;
  const { info, experiences = [], qualifications = [] } = data;

  const educations = qualifications.filter(q => q.type === 'education');
  const honors = qualifications.filter(q => q.type === 'honor');
  const certs = qualifications.filter(q => q.type === 'certification');

  return (
    <div className="w-[210mm] min-h-[297mm] p-[16mm] bg-[#FAFAFA] text-[#111111] font-sans text-xs leading-relaxed border-8 border-[#111111]" style={{ boxSizing: 'border-box' }}>
      {/* Top Banner */}
      <div className="grid grid-cols-12 gap-6 items-end pb-8 border-b-4 border-[#111111] mb-8">
        <div className="col-span-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{info?.full_name || 'Haikal Jibran Al Ghiffarry'}</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 font-mono">{info?.role || 'Systems Architect & Full-stack Developer'}</p>
        </div>
        <div className="col-span-4 text-right font-mono text-[9px] uppercase tracking-wider space-y-1 text-gray-700">
          <p>{info?.email || 'hello@ghiffa.dev'}</p>
          {info?.phone_number && <p>{info.phone_number}</p>}
          {info?.social_links?.linkedin && <p>{info.social_links.linkedin.replace('https://', '')}</p>}
          {info?.social_links?.github && <p>{info.social_links.github.replace('https://', '')}</p>}
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Summary and Experience */}
        <div className="col-span-8 space-y-8">
          {/* Summary */}
          <div>
            <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">[ 01/ PROFILE ]</h2>
            <p className="text-sm text-gray-700 font-medium leading-relaxed text-justify pr-4">{info?.about_content || ''}</p>
          </div>

          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">[ 02/ EXPERIENCE ]</h2>
              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative pl-6 border-l-2 border-[#111111]">
                    <div className="absolute left-0 top-0.5 -translate-x-1/2 w-2.5 h-2.5 bg-[#111111]"></div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-sm font-black uppercase tracking-tight text-[#111111]">{exp.role}</h3>
                      <span className="font-mono text-[9px] font-bold text-gray-500">{exp.period}</span>
                    </div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-2">{exp.company}</h4>
                    <p className="text-[10px] text-gray-600 leading-relaxed text-justify pr-4">{exp.description}</p>
                    {exp.tech_stack && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(Array.isArray(exp.tech_stack) ? exp.tech_stack : JSON.parse(exp.tech_stack || '[]')).map((tech, i) => (
                          <span key={i} className="font-mono text-[8px] bg-white border border-[#E5E5E5] px-1.5 py-0.5 uppercase tracking-wider text-gray-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Skills, Education, Certs */}
        <div className="col-span-4 space-y-8 border-l border-gray-200 pl-6 h-full">
          {/* Skills */}
          {info?.skills && (
            <div>
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">[ 03/ SKILLS ]</h2>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(info.skills) ? info.skills : JSON.parse(info.skills || '[]')).map((skill, i) => (
                  <span key={i} className="font-mono text-[9px] font-bold bg-[#111111] text-white px-2 py-1 uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div>
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">[ 04/ EDUCATION ]</h2>
              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div key={edu.id || idx}>
                    <p className="font-mono text-[9px] font-bold text-gray-500">{edu.period}</p>
                    <h3 className="text-[11px] font-bold uppercase tracking-tight text-[#111111]">{edu.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honors */}
          {honors.length > 0 && (
            <div>
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">[ 05/ HONORS ]</h2>
              <div className="space-y-3">
                {honors.map((honor, idx) => (
                  <div key={honor.id || idx} className="p-3 border border-[#E5E5E5] bg-white">
                    <h3 className="text-[10px] font-bold uppercase tracking-tight text-[#111111] mb-1">{honor.title}</h3>
                    <p className="text-[9px] font-mono text-gray-400">{honor.institution} — {honor.period}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certs.length > 0 && (
            <div>
              <h2 className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">[ 06/ CERTS ]</h2>
              <div className="space-y-2">
                {certs.map((cert, idx) => (
                  <div key={cert.id || idx} className="flex justify-between items-baseline border-b border-gray-100 pb-1.5">
                    <span className="font-semibold text-[#111111] text-[10px] uppercase truncate max-w-[120px]">{cert.title}</span>
                    <span className="font-mono text-[8px] text-gray-400 shrink-0">{cert.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
