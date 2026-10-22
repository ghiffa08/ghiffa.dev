import React from 'react';

export function BottomCtaSection({ emailAddress, onOpenContact }) {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Mini Floating Collage */}
        <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[280px] bg-square-grid rounded-3xl border border-gray-100 p-6 flex items-center justify-center overflow-hidden">
          {/* Handwritten style note */}
          <div className="absolute top-5 sm:top-6 left-6 sm:left-8 -rotate-6 font-serif italic text-[#FF5500] text-base sm:text-lg">
            Let&apos;s launch! &nearr;
          </div>

          {/* Mini photo 1 */}
          <div className="w-32 min-[400px]:w-40 h-24 min-[400px]:h-28 rounded-xl overflow-hidden shadow-md rotate-3 border-2 border-white bg-zinc-800 z-10">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
              alt="Collaboration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mini photo 2 */}
          <div className="w-28 min-[400px]:w-36 h-20 min-[400px]:h-24 rounded-xl overflow-hidden shadow-lg -rotate-6 -ml-5 sm:-ml-6 mt-12 sm:mt-16 border-2 border-white bg-zinc-900 z-20">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
              alt="Code"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating tool badges */}
          <div className="absolute bottom-5 sm:bottom-6 left-6 sm:left-10 w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center">
            <span className="text-xs font-bold text-[#FF5500]">&lt;/&gt;</span>
          </div>
          <div className="absolute top-6 sm:top-8 right-6 sm:right-12 w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* Right CTA Heading & Button */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <h2 className="text-2xl min-[360px]:text-3xl sm:text-[44px] font-bold tracking-tight text-[#141414] leading-[1.12]">
            Let&apos;s build a<br />project together
          </h2>
          <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed max-w-md">
            Tell us about your vision, timeline, and goals. Our team is ready to design and engineer your next flagship web experience.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenContact('New Project')}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-[13.5px] px-7 sm:px-8 py-3 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Let&apos;s talk
            </button>
            <a href={`mailto:${emailAddress}`} className="text-xs text-gray-400 font-mono hover:text-black transition-colors break-all">
              {emailAddress}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
