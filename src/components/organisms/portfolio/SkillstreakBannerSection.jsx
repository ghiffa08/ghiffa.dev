import React from 'react';

export function SkillstreakBannerSection({ bannerRef, isBannerDark }) {
  return (
    <section
      ref={bannerRef}
      id="skillstreak-banner"
      className={`min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-12 relative z-10 transition-colors duration-700 ease-in-out select-none ${
        isBannerDark ? 'bg-[#F8A065]' : 'bg-white'
      }`}
    >
      <div className="w-full max-w-[1140px] mx-auto">
        {/* Centered White Card (Clean, modern aesthetic on soft orange background) */}
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-white border border-black/[0.06] shadow-2xl shadow-orange-950/15 overflow-hidden min-h-[460px] lg:h-[530px] flex items-center">
          {/* Inner Grid: Left Content (52%) + Right Laptop (48%) */}
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
            {/* Left Column: Clean Typography, Figma selection box & Skillstreak Orange CTA */}
            <div className="lg:col-span-6 px-6 sm:px-12 lg:pl-14 lg:pr-4 py-8 sm:py-10 lg:py-12 flex flex-col justify-center">
              {/* Figma Dashed Bounding Box */}
              <div className="relative inline-block border border-dashed border-gray-400 px-3 min-[400px]:px-3.5 py-1.5 -ml-1 sm:-ml-2 rounded-[1px] select-none self-start">
                {/* 4 Corner Handles */}
                <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                {/* 4 Midpoint Handles */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 border border-white rounded-[1px]" />

                <h2 className="text-[28px] min-[360px]:text-[34px] sm:text-[46px] lg:text-[50px] font-bold tracking-tight text-[#111111] leading-none">
                  skillstreak.id
                </h2>
              </div>

              {/* Primary bold lead text */}
              <p className="text-[#18181B] text-[15px] sm:text-[18px] font-medium leading-[1.48] mt-5 sm:mt-6 max-w-[430px]">
                The fastest path from zero to deployable engineer, built like a game and engineered for the real world.
              </p>

              {/* Secondary muted text */}
              <p className="text-[#666666] text-[12.5px] sm:text-[13.5px] leading-[1.6] mt-3.5 sm:mt-4 max-w-[400px]">
                Most developers quit because learning feels like a grind with no visible progress. skillstreak.id changes the feedback loop with XP rewards, daily streak accountability, and real-time code evaluations.
              </p>

              {/* Fiery Skillstreak Orange Pill CTA Button */}
              <div className="mt-6 sm:mt-8">
                <a
                  href="https://skillstreak.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FF5500] hover:bg-[#E64D00] text-white text-[13.5px] sm:text-[14px] font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-orange-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Get Early Access
                </a>
              </div>
            </div>

            {/* Right Column: Dark Laptop with skillstreak-dekstop.png on screen */}
            <div className="lg:col-span-6 h-full flex items-center justify-center lg:justify-end relative overflow-hidden px-4 sm:px-6 lg:pl-4 lg:pr-0 pb-8 lg:pb-0">
              {/* Laptop Mockup Wrapper */}
              <div className="w-full max-w-[340px] min-[400px]:max-w-[420px] sm:max-w-[480px] lg:w-[480px] xl:w-[560px] mx-auto lg:mx-0 translate-x-0 lg:translate-x-6 xl:translate-x-8 pointer-events-none select-none">
                {/* Dark MacBook Lid / Screen Frame */}
                <div className="bg-[#0e0e10] p-2 sm:p-2.5 sm:p-3 rounded-t-[18px] sm:rounded-t-[20px] border-2 border-[#262628] shadow-2xl relative">
                  {/* Camera Notch protruding into screen */}
                  <div className="w-12 sm:w-14 h-2 sm:h-2.5 bg-[#0e0e10] mx-auto rounded-b-md flex items-center justify-center -mt-1 mb-1 z-20 relative">
                    <div className="w-1 h-1 rounded-full bg-[#1c1c20]" />
                  </div>

                  {/* Screen with skillstreak-dekstop.png */}
                  <div
                    className="w-full rounded-[6px] sm:rounded-[8px] overflow-hidden relative shadow-inner bg-[#141416]"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <img
                      src="/skillstreak-dekstop.png"
                      alt="Skillstreak Desktop Platform"
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Laptop Base / Deck with center thumb indent and hinge */}
                <div
                  className="h-[14px] sm:h-[18px] -mx-2 sm:-mx-2.5 rounded-b-[14px] sm:rounded-b-[16px] border-t border-[#303034] shadow-xl flex items-center justify-center relative z-10"
                  style={{ background: 'linear-gradient(to bottom, #242426 0%, #151517 100%)' }}
                >
                  <div className="w-12 sm:w-14 h-1 rounded-full bg-[#08080a]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtext below card */}
        <p className="text-[12px] text-neutral-900/80 font-medium mt-4 pl-1 max-w-lg leading-relaxed">
          * Early members receive Founder Badge + lifetime discounted access on skillstreak.id
        </p>
      </div>
    </section>
  );
}
