import React, { useEffect } from 'react';

export function StickyScrollText() {
  // Word-by-Word Scroll Reveal Animation (Phase 1: Headline -> Phase 2: Subtitle)
  useEffect(() => {
    let ticking = false;
    const updateScrollTextReveal = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const track = document.getElementById('scroll-text-track');
          if (!track) {
            ticking = false;
            return;
          }

          const rect = track.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollDistance = track.offsetHeight - windowHeight;

          // Track scroll progress: 0 when header enters sticky, 1 when scrolling past track
          const rawProgress = -rect.top / (totalScrollDistance || 1);
          const progress = Math.max(0, Math.min(1, rawProgress));

          const mainWords = document.querySelectorAll('#animated-scroll-title .reveal-word');
          const subWords = document.querySelectorAll('#animated-scroll-subtitle .reveal-subword');

          // Phase 1: Headline words reveal sequentially from progress 0.05 to 0.58
          const headlineStart = 0.05;
          const headlineEnd = 0.58;
          const headlineProgress = Math.max(0, Math.min(1, (progress - headlineStart) / (headlineEnd - headlineStart)));
          const activeMainCount = Math.floor(headlineProgress * (mainWords.length + 1));

          mainWords.forEach((word, index) => {
            if (index < activeMainCount) {
              word.classList.add('active');
            } else {
              word.classList.remove('active');
            }
          });

          // Phase 2: Subtitle words reveal sequentially from progress 0.52 to 0.95
          const subStart = 0.52;
          const subEnd = 0.95;
          const subProgress = Math.max(0, Math.min(1, (progress - subStart) / (subEnd - subStart)));
          const activeSubCount = Math.floor(subProgress * (subWords.length + 1));

          subWords.forEach((word, index) => {
            if (index < activeSubCount) {
              word.classList.add('active');
            } else {
              word.classList.remove('active');
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScrollTextReveal, { passive: true });
    window.addEventListener('resize', updateScrollTextReveal, { passive: true });
    updateScrollTextReveal();

    return () => {
      window.removeEventListener('scroll', updateScrollTextReveal);
      window.removeEventListener('resize', updateScrollTextReveal);
    };
  }, []);

  return (
    <section id="scroll-text-track" className="relative h-[260vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="max-w-[960px] mx-auto text-center relative z-10">
          {/* Main Animated Headline: ALL words start in faded gray (#ECEEEF) */}
          <h2 id="animated-scroll-title" className="text-[28px] min-[360px]:text-[34px] min-[420px]:text-[40px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold tracking-[-0.035em] leading-[1.1]">
            <span className="reveal-word">Building</span>{' '}
            <span className="reveal-word">the</span>{' '}
            <span className="reveal-word">bridge</span>{' '}
            <span className="reveal-word">between</span>{' '}
            <span className="reveal-word">bits</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">atoms</span>{' '}
            <span className="reveal-word">for</span>{' '}
            <span className="reveal-word">companies,</span>{' '}
            <span className="reveal-word">governments,</span>{' '}
            <span className="reveal-word">and</span>{' '}
            <span className="reveal-word">organizations.</span>
          </h2>

          {/* Subtext Below Headline */}
          <p id="animated-scroll-subtitle" className="mt-6 sm:mt-10 text-[16px] sm:text-[22px] font-semibold tracking-[-0.015em] leading-[1.35] max-w-[520px] mx-auto">
            <span className="reveal-subword">Following</span>{' '}
            <span className="reveal-subword">our</span>{' '}
            <span className="reveal-subword">goal</span>{' '}
            <span className="reveal-subword">of</span>{' '}
            <span className="reveal-subword">making</span>{' '}
            <span className="reveal-subword">the</span>{' '}
            <span className="reveal-subword">internet</span>{' '}
            <span className="reveal-subword">a</span>{' '}
            <span className="reveal-subword">better</span>{' '}
            <span className="reveal-subword">place.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
