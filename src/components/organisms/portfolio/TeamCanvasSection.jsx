import React from 'react';

export function TeamCanvasSection({ onOpenContact }) {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative min-h-[360px] sm:min-h-[460px] flex flex-col items-center justify-center">
        {/* Floating Team Member Avatars & Chat Bubbles */}
        <div className="hidden md:flex items-center gap-2.5 absolute top-[8%] left-[12%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Sarah"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <div className="font-semibold text-gray-900">Sarah — UX Lead</div>
            <div className="text-gray-400">Wireframes approved ✓</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 absolute top-[4%] left-[36%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            alt="Ghiffa"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <div className="font-semibold text-gray-900">Ghiffa — Tech Lead</div>
            <div className="text-gray-400">Deploying to edge...</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 absolute top-[12%] right-[14%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
            alt="Elena"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <div className="font-semibold text-gray-900">Elena — Art Director</div>
            <div className="text-gray-400">Typography refined</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 absolute bottom-[12%] left-[18%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
            alt="Marco"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <div className="font-semibold text-gray-900">Marco — Full-Stack</div>
            <div className="text-gray-400">99.9% Lighthouse score</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 absolute bottom-[10%] right-[16%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
            alt="Nadia"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="text-[11px]">
            <div className="font-semibold text-gray-900">Nadia — PM</div>
            <div className="text-gray-400">Sprint milestone ready</div>
          </div>
        </div>

        {/* Center Highlighted Headline with Selection Box */}
        <div className="text-center z-10 max-w-3xl px-2 sm:px-4">
          <h2 className="text-2xl min-[360px]:text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#141414] leading-tight">
            A team that{' '}
            <span className="relative inline-block bg-[#FFEDE5] text-[#141414] px-2.5 sm:px-3 py-0.5 mx-1 border border-[#FF5500]">
              {/* Corner selection squares */}
              <span className="w-2 h-2 bg-white border border-[#FF5500] absolute -top-1 -left-1" />
              <span className="w-2 h-2 bg-white border border-[#FF5500] absolute -top-1 -right-1" />
              <span className="w-2 h-2 bg-white border border-[#FF5500] absolute -bottom-1 -left-1" />
              <span className="w-2 h-2 bg-white border border-[#FF5500] absolute -bottom-1 -right-1" />
              loves the internet.
            </span>
          </h2>
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => onOpenContact('Meet the team')}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-[13px] px-6 sm:px-7 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
            >
              Meet our studio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
