import React from 'react';
import { useSupabaseSingle } from '../../hooks/useSupabaseData';

export function MarqueeTicker() {
  const { data: info } = useSupabaseSingle('personal_info');
  
  const defaultItems = [
    'IoT Engineering',
    'Embedded Systems',
    'Fullstack Web',
    'LoRa Telemetry',
    'Circuit Design',
    'Laravel & Next.js',
    'Smart Agriculture',
    'Edge Computing',
    'Custom PCB',
    'Microcontroller Firmware'
  ];

  const items = (info?.skills && info.skills.length > 0) 
    ? info.skills.map(s => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())).slice(0, 10)
    : defaultItems;

  return (
    <div className="bg-[#121210] text-[#F0EFE9] py-4 sm:py-5 border-b border-[#D6D4CC] overflow-hidden select-none">
      <div className="animate-marquee flex items-center">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {items.map((item, idx) => (
            <React.Fragment key={`set1-${idx}`}>
              <span className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight mx-5 sm:mx-7 font-sans">
                {item}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF441F] mx-2 shrink-0"></span>
            </React.Fragment>
          ))}
        </div>
        {/* Set 2 (Duplicate for seamless loop) */}
        <div className="flex items-center shrink-0">
          {items.map((item, idx) => (
            <React.Fragment key={`set2-${idx}`}>
              <span className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight mx-5 sm:mx-7 font-sans">
                {item}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF441F] mx-2 shrink-0"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
