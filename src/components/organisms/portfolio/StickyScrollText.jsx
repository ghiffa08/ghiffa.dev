import React, { useEffect } from 'react';

export function StickyScrollText({ sectionData }) {
  const rawHeadline = sectionData?.content?.headline || sectionData?.title;
  const rawSubtitle = sectionData?.content?.subtitle || sectionData?.subtitle;

  const rawDefaultHeadline = 'Building the bridge between bits and atoms for companies, governments, and organizations.';
  const rawDefaultSubtitle = 'Following our goal of making the internet a better place.';

  const headlineText =
    rawHeadline && !rawHeadline.toLowerCase().includes('precision') && !rawHeadline.toLowerCase().includes('attoms')
      ? rawHeadline
      : rawDefaultHeadline;

  const subtitleText =
    rawSubtitle && rawSubtitle.trim().toLowerCase() !== 'tagline'
      ? rawSubtitle
      : rawDefaultSubtitle;

  // Clean trailing spaces before punctuation (e.g. "companies ," -> "companies,")
  const cleanHeadline = headlineText.replace(/\s+([,.:;?!])/g, '$1').trim();
  const cleanSubtitle = subtitleText.replace(/\s+([,.:;?!])/g, '$1').trim();

  const headlineWords = cleanHeadline.split(/\s+/).filter(Boolean);
  const subtitleWords = cleanSubtitle.split(/\s+/).filter(Boolean);

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
          const builderScrollEl = document.getElementById('builder-canvas-scroll');
          const containerTop = builderScrollEl ? builderScrollEl.getBoundingClientRect().top : 0;
          const windowHeight = builderScrollEl ? builderScrollEl.clientHeight : window.innerHeight;
          const totalScrollDistance = track.offsetHeight - windowHeight;

          // Track scroll progress: 0 when header enters sticky, 1 when scrolling past track
          const rawProgress = -(rect.top - containerTop) / (totalScrollDistance || 1);
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

    window.addEventListener('scroll', updateScrollTextReveal, { passive: true, capture: true });
    window.addEventListener('resize', updateScrollTextReveal, { passive: true });
    updateScrollTextReveal();

    return () => {
      window.removeEventListener('scroll', updateScrollTextReveal, { capture: true });
      window.removeEventListener('resize', updateScrollTextReveal);
    };
  }, [cleanHeadline, cleanSubtitle]);

  return (
    <section id="scroll-text-track" className="relative h-[160vh] sm:h-[210vh] lg:h-[260vh] bg-white">
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-12 sm:pt-0">
        <div className="max-w-[1280px] w-full mx-auto text-center relative z-10 px-3 sm:px-6">
          {/* Main Animated Headline: ALL words start in faded gray (#D4D4D8), activating to deep ink */}
          <h2
            id="animated-scroll-title"
            data-builder-field="title"
            data-builder-label="Main Headline Sentence"
            className="text-[21px] min-[360px]:text-[24px] min-[400px]:text-[27px] sm:text-[46px] md:text-[60px] lg:text-[72px] font-bold tracking-[-0.03em] leading-[1.26] sm:leading-[1.14] max-w-[1140px] mx-auto [text-wrap:balance]"
          >
            {headlineWords.map((word, idx) => (
              <React.Fragment key={idx}>
                <span className="reveal-word">{word}</span>{' '}
              </React.Fragment>
            ))}
          </h2>

          {/* Subtext Below Headline: Single clean line on desktop */}
          <p
            id="animated-scroll-subtitle"
            data-builder-field="subtitle"
            data-builder-label="Subtext Sentence"
            className="mt-4 sm:mt-8 text-[12.5px] min-[360px]:text-[13.5px] sm:text-[17px] md:text-[20px] font-medium tracking-[-0.015em] leading-[1.48] max-w-xs sm:max-w-none text-center mx-auto whitespace-normal sm:whitespace-nowrap text-[#52525B]"
          >
            {subtitleWords.map((word, idx) => (
              <React.Fragment key={idx}>
                <span className="reveal-subword">{word}</span>{' '}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
