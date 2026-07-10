import React from 'react';

export function ATSResume({ data }) {
  if (!data) return null;
  const { info, experiences = [], qualifications = [] } = data;

  const educations = qualifications.filter(q => q.type === 'education');
  const honors = qualifications.filter(q => q.type === 'honor');
  const certs = qualifications.filter(q => q.type === 'certification');

  return (
    <div className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-black font-sans text-xs leading-relaxed" style={{ boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-tight mb-1">{info?.full_name || 'Haikal Jibran Al Ghiffarry'}</h1>
        <p className="text-sm font-semibold text-gray-700 uppercase mb-2">{info?.role || 'Systems Architect & Full-stack Developer'}</p>
        <div className="flex flex-wrap justify-center gap-x-4 text-[10px] text-gray-600 font-mono">
          <span>{info?.email || 'hello@ghiffa.dev'}</span>
          {info?.phone_number && <span>{info.phone_number}</span>}
          {info?.social_links?.linkedin && <span>LinkedIn: {info.social_links.linkedin.replace('https://', '')}</span>}
          {info?.social_links?.github && <span>GitHub: {info.social_links.github.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">Professional Summary</h2>
        <p className="text-[11px] text-gray-800 text-justify">{info?.about_content || ''}</p>
      </div>

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between font-bold text-[11px]">
                  <span>{exp.role.toUpperCase()} — {exp.company.toUpperCase()}</span>
                  <span className="font-mono text-[10px] text-gray-600">{exp.period}</span>
                </div>
                <p className="text-[10px] text-gray-700 mt-1 whitespace-pre-line text-justify">{exp.description}</p>
                {exp.tech_stack && (
                  <p className="text-[9px] text-gray-500 font-mono mt-1">
                    Technologies: {Array.isArray(exp.tech_stack) ? exp.tech_stack.join(', ') : exp.tech_stack}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {educations.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-start text-[11px]">
                <div>
                  <span className="font-bold">{edu.title}</span>
                  <span className="text-gray-600"> - {edu.institution}</span>
                  {edu.description && <p className="text-[10px] text-gray-600 mt-0.5">{edu.description}</p>}
                </div>
                <span className="font-mono text-[10px] text-gray-600 shrink-0">{edu.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {info?.skills && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">Key Skills</h2>
          <p className="text-[11px] text-gray-800 leading-relaxed font-mono">
            {Array.isArray(info.skills) ? info.skills.join(' • ') : JSON.parse(info.skills || '[]').join(' • ')}
          </p>
        </div>
      )}

      {/* Honors & Certifications */}
      <div className="grid grid-cols-2 gap-8">
        {/* Certifications */}
        {certs.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">Certifications</h2>
            <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-800">
              {certs.map((cert, idx) => (
                <li key={cert.id || idx}>
                  <span className="font-semibold">{cert.title}</span> ({cert.institution} — {cert.period})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Honors */}
        {honors.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-1 mb-2">Honors & Awards</h2>
            <ul className="list-disc pl-4 space-y-1 text-[10px] text-gray-800">
              {honors.map((honor, idx) => (
                <li key={honor.id || idx}>
                  <span className="font-semibold">{honor.title}</span> ({honor.institution} — {honor.period})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
