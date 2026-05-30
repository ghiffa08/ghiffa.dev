export function SectionHeader({ number, title }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-16 md:mb-24 px-6 md:px-12">
      <h2 className="text-7xl md:text-[8rem] font-light text-[#E5E5E5] tracking-tighter leading-none select-none">
        {number}.
      </h2>
      <h3 className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#111111] pb-2 md:pb-4 border-b border-[#111111] flex-1">
        [ {title} ]
      </h3>
    </div>
  );
}
