import React from 'react';

export function CollaboratorsSection() {
  const collaborators = [
    { no: '01', name: 'Bengkel Aplikasi', sub: 'PT. BAN NUSANTARA', font: 'font-semibold text-base sm:text-lg tracking-tight' },
    { no: '02', name: 'BPR RAKSA', sub: 'WACANA AGRI PURNAMA', font: 'font-bold text-sm sm:text-base tracking-[0.06em] uppercase' },
    { no: '03', name: 'LSP-P1 SMKN 2', sub: 'KUNINGAN CERTIFICATION', font: 'font-semibold text-base sm:text-lg tracking-tight' },
    { no: '04', name: 'FKOM UNIKU', sub: 'UNIVERSITAS KUNINGAN', font: 'font-bold text-xs sm:text-sm tracking-[0.08em] uppercase' },
    { no: '05', name: 'HIMA-TI', sub: 'DEPARTMENT PLATFORMS', font: 'font-semibold text-base sm:text-lg tracking-tight' },
    { no: '06', name: 'AgriNex Lab', sub: 'SMART DRIP TELEMETRY', font: 'font-bold text-base sm:text-lg tracking-tight' },
    { no: '07', name: 'BNSP KOMINFO', sub: 'NATIONAL CERTIFICATION', font: 'font-bold text-xs sm:text-sm tracking-[0.1em] uppercase' },
    { no: '08', name: 'DJKI Kemenkumham', sub: 'IP & COPYRIGHT REGISTRY', font: 'editorial-serif text-xl sm:text-2xl' },
    { no: '09', name: 'Univ. Syiah Kuala', sub: 'DIGITAL MATH RESEARCH', font: 'font-bold text-xs sm:text-sm tracking-[0.08em] uppercase' },
    { no: '10', name: 'REThreee', sub: 'ECO MARKETPLACE', font: 'font-semibold text-base sm:text-lg tracking-tight' },
    { no: '11', name: 'Plesiranku', sub: 'WEST JAVA TOURISM', font: 'editorial-serif text-xl sm:text-2xl' },
    { no: '12', name: 'SCADA.01', sub: 'LORA TELEMETRY HUB', font: 'font-mono text-xs sm:text-sm font-medium tracking-[0.12em] uppercase' },
  ];

  return (
    <section className="max-w-[1600px] mx-auto border-b border-[#D6D4CC]">
      {/* Header Row */}
      <div className="px-4 sm:px-6 py-8 sm:py-10 border-b border-[#D6D4CC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
          <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
            <div>[ 02 / 06 ]</div>
            <div>ABOUT</div>
          </div>
          <div className="lg:col-span-10">
            <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-none text-[#121210]">
              Selected <span className="editorial-serif text-[#D14B30] font-normal text-[1.08em]">collaborators</span>.
            </h2>
          </div>
        </div>
      </div>

      {/* 6x2 Grid of Collaborators (01 to 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {collaborators.map((c, idx) => {
          // Compute right & bottom border utilities matching design
          const isRightEdge = (idx + 1) % 6 === 0;
          return (
            <div 
              key={c.no} 
              className={`collaborator-cell border-b border-[#D6D4CC] p-4 sm:p-5 h-32 sm:h-36 flex flex-col justify-between ${
                !isRightEdge ? 'border-r' : 'lg:border-r-0 border-r'
              }`}
            >
              <span className="font-mono text-[10px] text-[#6E6D68]">{c.no}</span>
              <div className="my-auto text-center">
                <div className={`${c.font} text-[#121210]`}>
                  {c.name}
                </div>
              </div>
              <div className="h-2"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
