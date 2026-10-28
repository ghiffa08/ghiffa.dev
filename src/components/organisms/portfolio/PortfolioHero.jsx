import React, { useEffect, useRef } from 'react';
import { CursorBadge } from '../../atoms/CursorBadge';
import { DraggableItem } from '../../atoms/DraggableItem';
import { smoothCosine, quadBezier, cursorConfigs } from '../../../utils/portfolioMath';

export function PortfolioHero({ heroRevealed, setHeroRevealed, aiActive, setAiActive, sectionData }) {
  const heroTitle = sectionData?.title || 'ghiffa.dev';
  const content = sectionData?.content || {};
  const aiActiveRef = useRef(aiActive);

  useEffect(() => {
    aiActiveRef.current = aiActive;
  }, [aiActive]);

  // Smooth 60fps Organic Multiplayer Cursors with realistic purposeful travel
  useEffect(() => {
    let animId;
    const agents = cursorConfigs
      .map((cfg, idx) => {
        const el = document.getElementById(cfg.id);
        const container = document.getElementById(cfg.containerId);
        if (!el || !container) return null;

        const startWp = cfg.waypoints[0];
        const nextWp = cfg.waypoints[1];
        const midX = (startWp.x + nextWp.x) / 2 + (Math.random() - 0.5) * 0.04;
        const midY = (startWp.y + nextWp.y) / 2 + (Math.random() - 0.5) * 0.04;

        return {
          el,
          container,
          waypoints: cfg.waypoints,
          wpIndex: 1,
          fromX: startWp.x,
          fromY: startWp.y,
          toX: nextWp.x,
          toY: nextWp.y,
          ctrlX: midX,
          ctrlY: midY,
          currX: startWp.x,
          currY: startWp.y,
          state: 'moving',
          stateStartTime: performance.now() + idx * 300,
          moveDuration: 1300 + Math.random() * 400,
          pauseDuration: 1400 + Math.random() * 1000,
          seed: idx * 1.7 + Math.random() * 5
        };
      })
      .filter(Boolean);

    let cachedW = window.innerWidth;
    let cachedH = window.innerHeight;

    const updateDimensions = () => {
      const container = document.getElementById('hero-canvas');
      if (container) {
        cachedW = container.clientWidth || window.innerWidth;
        cachedH = container.clientHeight || window.innerHeight;
      } else {
        cachedW = window.innerWidth;
        cachedH = window.innerHeight;
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });

    function animateCursors(now) {
      const w = cachedW;
      const h = cachedH;
      const isMobile = w < 640;
      const maxX = isMobile ? Math.max(0, w - 120) : Math.max(0, w - 160);
      const minX = 8;
      const maxY = Math.max(0, h - 35);
      const minY = 8;

      const clampX = (x) => Math.max(minX, Math.min(maxX, x * w));
      const clampY = (y) => Math.max(minY, Math.min(maxY, y * h));

      agents.forEach((agent) => {

        if (now < agent.stateStartTime) {
          const px = clampX(agent.currX);
          const py = clampY(agent.currY);
          agent.el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
          return;
        }

        const elapsed = now - agent.stateStartTime;

        if (agent.state === 'moving') {
          const rawT = Math.min(1, elapsed / agent.moveDuration);
          const easedT = smoothCosine(rawT);

          agent.currX = quadBezier(easedT, agent.fromX, agent.ctrlX, agent.toX);
          agent.currY = quadBezier(easedT, agent.fromY, agent.ctrlY, agent.toY);

          if (rawT >= 1) {
            agent.state = 'pausing';
            agent.stateStartTime = now;
            agent.currX = agent.toX;
            agent.currY = agent.toY;
          }
        } else {
          // Micro-organic breathing fidget while reading canvas
          const fidgetT = (now - agent.stateStartTime) * 0.002 + agent.seed;
          const jitterX = Math.sin(fidgetT * 1.4) * 0.0018 + Math.cos(fidgetT * 0.7) * 0.0012;
          const jitterY = Math.cos(fidgetT * 1.1) * 0.0018 + Math.sin(fidgetT * 0.9) * 0.0012;

          agent.currX = agent.toX + jitterX;
          agent.currY = agent.toY + jitterY;

          if (elapsed >= agent.pauseDuration) {
            agent.state = 'moving';
            agent.stateStartTime = now;
            agent.fromX = agent.toX;
            agent.fromY = agent.toY;

            agent.wpIndex = (agent.wpIndex + 1) % agent.waypoints.length;
            const targetWp = agent.waypoints[agent.wpIndex];

            // Introduce slight randomized jitter to waypoints
            const jitterTargetX = targetWp.x + (Math.random() - 0.5) * 0.035;
            const jitterTargetY = targetWp.y + (Math.random() - 0.5) * 0.035;

            if (isMobile) {
              agent.toX = Math.max(0.06, Math.min(0.68, jitterTargetX));
              agent.toY = Math.max(0.10, Math.min(0.88, jitterTargetY));
            } else {
              agent.toX = Math.max(0.04, Math.min(0.96, jitterTargetX));
              agent.toY = Math.max(0.12, Math.min(0.92, jitterTargetY));
            }

            const directMidX = (agent.fromX + agent.toX) / 2;
            const directMidY = (agent.fromY + agent.toY) / 2;
            const perpX = -(agent.toY - agent.fromY);
            const perpY = agent.toX - agent.fromX;
            const curveFactor = (Math.random() - 0.5) * 0.35;

            agent.ctrlX = directMidX + perpX * curveFactor;
            agent.ctrlY = directMidY + perpY * curveFactor;

            agent.moveDuration = 1200 + Math.random() * 500;
            agent.pauseDuration = 1200 + Math.random() * 1100;
          }
        }

        const finalX = clampX(agent.currX);
        const finalY = clampY(agent.currY);

        agent.el.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0)`;
      });

      animId = requestAnimationFrame(animateCursors);
    }

    let startTimer = setTimeout(() => {
      animId = requestAnimationFrame(animateCursors);
    }, 120);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Parallax Scroll Animation for Hero Components (Floating upwards on scroll)
  useEffect(() => {
    let ticking = false;
    const heroTitleInner = document.getElementById('hero-title-inner');
    const heroWorkspaceItems = document.getElementById('hero-workspace-items');
    const heroGrid = document.getElementById('hero-canvas');

    const updateHeroScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY <= vh * 1.3) {
        const progress = Math.min(1, Math.max(0, scrollY / (vh || 1)));

        // 1. Center Title smoothly ascends and scales slightly
        if (heroTitleInner) {
          const titleY = -scrollY * 0.42;
          const titleOpacity = Math.max(0, 1 - progress * 1.35);
          const titleScale = Math.max(0.88, 1 - progress * 0.12);
          heroTitleInner.style.transform = `translate3d(0, ${titleY.toFixed(1)}px, 0) scale(${titleScale.toFixed(3)})`;
          heroTitleInner.style.opacity = titleOpacity.toFixed(3);
        }

        // 2. Surrounding Workspace Items float upwards faster
        if (heroWorkspaceItems) {
          const itemsY = -scrollY * 0.65;
          const itemsOpacity = Math.max(0, 1 - progress * 1.45);
          heroWorkspaceItems.style.transform = `translate3d(0, ${itemsY.toFixed(1)}px, 0)`;
          heroWorkspaceItems.style.opacity = itemsOpacity.toFixed(3);
        }

        // 3. Canvas background grid subtle parallax
        if (heroGrid) {
          const bgY = -scrollY * 0.15;
          heroGrid.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0)`;
        }
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeroScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeroScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] pt-[64px] sm:pt-[72px] bg-architectural-dots overflow-hidden select-none">
      {/* Edge-to-Edge Full Viewport Interactive Canvas */}
      <div id="hero-canvas" className="relative w-full h-full will-change-transform overflow-hidden max-w-full">
        {/* 1. CENTER: Giant "ghiffa.dev" (Figma Canvas Selection with Skillstreak Orange Accent & Layer Badge) */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-2 sm:px-4 w-full max-w-[96vw] sm:max-w-none flex justify-center pointer-events-auto">
          <div id="hero-title-inner" className="will-change-transform">
            <div
              id="hero-bbox"
              className={`px-3 min-[400px]:px-6 sm:px-12 pt-2 sm:pt-4 pb-2.5 sm:pb-6 overflow-visible transition-all duration-700 ease-out relative ${heroRevealed ? 'figma-bbox' : 'border border-transparent'
                }`}
            >
              {/* 8 Figma Selection Handles with Skillstreak Orange stroke */}
              <span className={`figma-handle -top-1 -left-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle -top-1 left-1/2 -translate-x-1/2 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle -top-1 -right-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle top-1/2 -translate-y-1/2 -left-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle top-1/2 -translate-y-1/2 -right-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle -bottom-1 -left-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle -bottom-1 left-1/2 -translate-x-1/2 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />
              <span className={`figma-handle -bottom-1 -right-1 transition-all duration-500 ${heroRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`} />

              <h1
                id="hero-title"
                className="text-[34px] min-[360px]:text-[40px] min-[400px]:text-[48px] sm:text-[84px] md:text-[112px] lg:text-[138px] font-bold tracking-[-0.04em] leading-[1.08] text-[#141414] select-none whitespace-nowrap block pb-1 sm:pb-2 cursor-pointer"
                title="Click to toggle canvas items"
                onClick={() => setHeroRevealed((prev) => !prev)}
              >
                {heroTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* 2. SURROUNDING WORKSPACE ITEMS (Hidden on refresh, reveals smoothly) */}
        <div
          id="hero-workspace-items"
          className={`absolute inset-0 transition-all duration-1000 ease-out will-change-transform overflow-hidden max-w-full ${heroRevealed ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-[0.98] pointer-events-none'
            }`}
        >
          {/* Top Center: AI Mode Toggle Pill */}
          <DraggableItem className="absolute top-[12%] sm:top-[21.5%] left-1/2 -translate-x-1/2 z-30 bg-white rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 soft-card-shadow border border-gray-100/90 flex items-center gap-2.5 sm:gap-3 select-none">
            <span className={`text-[11px] sm:text-[12px] font-medium transition-colors duration-300 ${aiActive ? 'text-[#FF5500] font-semibold' : 'text-gray-800'}`}>
              {content.ai_mode_label || 'AI Mode'}
            </span>
            <button
              onClick={() => setAiActive(!aiActive)}
              aria-label="AI Mode"
              className={`w-9 sm:w-11 h-5 sm:h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center cursor-pointer shadow-inner ${aiActive ? 'bg-[#FF5500]' : 'bg-gray-300'
                }`}
            >
              <span
                className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${aiActive ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </DraggableItem>

          {/* 3. LIVE ROAMING MULTIPLAYER CURSOR (1 primary cursor on mobile, full team on tablet/desktop) */}

          {/* Ghiffa (Tech Lead - Green) -> Hermes Agent */}
          <div id="cursor-director" className="live-cursor block">
            <svg className="w-3.5 h-3.5 text-[#10B981] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#10B981" humanLabel="Ghiffa (Tech Lead)" aiModel="Hermes Agent" aiActive={aiActive} />
          </div>

          {/* CI/CD Bot (Emerald) -> OpenAI o3-mini */}
          <div id="cursor-dev-cyan" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#10B981] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#10B981" humanLabel="CI/CD Passing ✓" aiModel="o3-mini" aiActive={aiActive} />
          </div>

          {/* UI / Motion Designer -> DeepSeek-R1 (Charcoal) */}
          <div id="cursor-ui" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#18181B] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#18181B" humanLabel="UI & Motion" aiModel="DeepSeek-R1" aiActive={aiActive} />
          </div>

          {/* Design QA (Pink) -> Gemini 2.5 Flash */}
          <div id="cursor-ux" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#EC4899] -ml-2 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#EC4899" humanLabel="Design QA" aiModel="Gemini 2.5 Flash" aiActive={aiActive} />
          </div>

          {/* Project Manager Luffy -> GPT-4o (Emerald) */}
          <div id="cursor-pm" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#059669] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#059669" humanLabel="Project Manager" aiModel="GPT-4o" aiActive={aiActive} />
          </div>

          {/* Client PT Raksa (Orange) -> Claude 3.7 Sonnet */}
          <div id="cursor-client" className="live-cursor hidden md:block">
            <svg className="w-3.5 h-3.5 text-[#F97316] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#F97316" humanLabel="Client Review" aiModel="Claude 3.7 Sonnet" aiActive={aiActive} />
          </div>

          {/* Code Reviewer (Amber) -> Grok 3 */}
          <div id="cursor-dev-yellow" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#F59E0B] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <CursorBadge color="#F59E0B" isYellow={true} humanLabel="Code Reviewer" aiModel="Grok 3" aiActive={aiActive} />
          </div>

          {/* 4. FLOATING TOOL ICONS (Desktop / Tablet interactive elements) */}

          {/* VS Code Icon */}
          <DraggableItem className="hidden sm:flex absolute top-[28%] left-[19%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="VS Code">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
              <path d="M17.5 2L7.2 11.4L3.2 8.3L1.5 9.2V14.8L3.2 15.7L7.2 12.6L17.5 22L22.5 19.9V4.1L17.5 2ZM17.5 17.2L10.8 12L17.5 6.8V17.2Z" fill="#007ACC" />
            </svg>
          </DraggableItem>

          {/* Figma Icon */}
          <DraggableItem className="hidden sm:flex absolute top-[46%] left-[7%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="Figma">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
            </svg>
          </DraggableItem>

          {/* Next.js Icon */}
          <DraggableItem className="hidden sm:flex absolute top-[78%] left-[16%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="Next.js">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[12px] tracking-tighter group-hover:scale-110 transition-transform">N</div>
          </DraggableItem>

          {/* TypeScript Icon */}
          <DraggableItem className="hidden sm:flex absolute top-[82%] left-[48%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="TypeScript">
            <svg className="w-6 h-6 rounded-md shadow-2xs group-hover:scale-110 transition-transform" viewBox="0 0 128 128">
              <rect width="128" height="128" fill="#3178C6" rx="16" />
              <path d="M57.6 74.4h-14v39.2h-13.6v-39.2h-14v-11.8h41.6v11.8zm23.2 27.6c3.2 2.2 7.2 3.6 11.6 3.6 6.2 0 9.8-3 9.8-7.6 0-5-4.2-6.8-11.4-9.8-10.4-4.4-15.6-9.6-15.6-18.8 0-10.8 8.6-18.4 22.8-18.4 6.8 0 12.6 1.8 16.8 4.8l-4.4 10.8c-3.6-2.2-8.2-3.6-12.4-3.6-5.8 0-8.8 2.8-8.8 6.6 0 4.6 3.8 6.4 11 9.4 11.2 4.6 16.2 10.2 16.2 19.4 0 11.4-8.8 19-24.2 19-7.8 0-15-2.2-19.6-6.2l4.2-11z" fill="#FFFFFF" />
            </svg>
          </DraggableItem>

          {/* React Icon */}
          <DraggableItem className="hidden sm:flex absolute top-[15%] right-[26%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="React">
            <svg className="w-7 h-7 text-[#00D8FE] transition-transform duration-700 group-hover:rotate-180" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
              <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
              <g stroke="#00D8FE" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
          </DraggableItem>

          {/* 5. FLOATING SOCIAL CARDS & BUBBLES (Staggered rhythmic placement on mobile) */}

          {/* Top-Left: Email hello@ghiffa.dev */}
          <DraggableItem className="flex absolute top-[21%] sm:top-[14%] left-[4%] sm:left-[4%] z-30 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl rounded-bl-xs sm:rounded-bl-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 comment-shadow border border-gray-100 items-start hover:border-gray-200 transition-colors group">
            <a
              href="mailto:hello@ghiffa.dev"
              className="flex items-start gap-2 sm:gap-3 w-full cursor-pointer no-underline"
              aria-label="Send email to hello@ghiffa.dev"
            >
              <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-[#EA4335] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                  <span className="font-semibold text-gray-900">Email</span>
                  <span className="text-gray-500 font-mono text-[9px] sm:text-[10px] hidden min-[360px]:inline">just now</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-800 mt-0.5 leading-snug block group-hover:text-black transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">{content.email_label || 'Drop a message at'} </span><span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">hello@ghiffa.dev</span>
                </div>
              </div>
            </a>
          </DraggableItem>

          {/* Bottom-Left: LinkedIn Haikal Jibran */}
          <DraggableItem className="flex absolute top-[57%] sm:top-[62%] left-[4%] sm:left-[6%] z-30 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl rounded-bl-xs sm:rounded-bl-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 comment-shadow border border-gray-100 items-start hover:border-gray-200 transition-colors group">
            <a
              href="https://www.linkedin.com/in/haikal-jibran-al-ghiffarry?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 sm:gap-3 w-full cursor-pointer no-underline"
              aria-label="LinkedIn profile Haikal Jibran"
            >
              <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                  <span className="font-semibold text-gray-900">LinkedIn</span>
                  <span className="text-gray-500 font-mono text-[9px] sm:text-[10px] hidden min-[360px]:inline">just now</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-800 mt-0.5 leading-snug block group-hover:text-black transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">{content.linkedin_label || 'Connect on LinkedIn'} </span><span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">Haikal Jibran</span>
                </div>
              </div>
            </a>
          </DraggableItem>

          {/* Top-Right: GitHub Contributions Heatmap Card (Desktop Only) */}
          <DraggableItem className="hidden lg:block absolute top-[11%] right-[3%] z-10 w-[275px] bg-white p-3.5 rounded-2xl border border-gray-200/90 soft-card-shadow -rotate-[3deg] text-gray-900 group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <a
                    href="https://github.com/ghiffa08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] font-bold text-gray-900 tracking-tight hover:underline flex items-center gap-1 leading-none"
                  >
                    ghiffa08
                  </a>
                  <span className="text-[9px] text-gray-400 font-mono">github.com</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[18px] font-bold tracking-tight text-gray-950 font-mono">4,622+</span>
              <span className="text-[10px] text-gray-500 font-medium">contributions in 2026</span>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 overflow-hidden rounded-lg bg-gray-50/70 p-2">
              <img
                src="/github-contributions.svg"
                alt="ghiffa08 GitHub Contributions Heatmap"
                className="w-full h-auto select-none pointer-events-none"
                loading="eager"
                onError={(e) => {
                  e.target.src = 'https://ghchart.rshah.org/22c55e/ghiffa08';
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-gray-400 px-0.5">
              <span className="flex items-center gap-1 text-gray-600 font-medium">
                <span className="text-emerald-600 font-bold">100%</span> Verified commits
              </span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#EEEEEE]" />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#6fffab]" />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#55f891]" />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#22c55e]" />
                <span className="w-1.5 h-1.5 rounded-[2px] bg-[#1b9e4b]" />
                <span>More</span>
              </div>
            </div>
          </DraggableItem>

          {/* Mid-Right: Instagram @haikaljibraan */}
          <DraggableItem className="flex absolute top-[31%] sm:top-[38%] right-[4%] sm:right-[5%] z-30 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl rounded-bl-xs sm:rounded-bl-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 comment-shadow border border-gray-100 items-start hover:border-gray-200 transition-colors group">
            <a
              href="https://instagram.com/haikaljibraan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 sm:gap-3 w-full cursor-pointer no-underline"
              aria-label="Instagram profile @haikaljibraan"
            >
              <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                  <span className="font-semibold text-gray-900">Instagram</span>
                  <span className="text-gray-500 font-mono text-[9px] sm:text-[10px] hidden min-[360px]:inline">just now</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-800 mt-0.5 leading-snug block group-hover:text-black transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">{content.instagram_label || 'Connect on Instagram'} </span><span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">@haikaljibraan</span>
                </div>
              </div>
            </a>
          </DraggableItem>

          {/* Bottom-Right: Web skillstreak.id */}
          <DraggableItem className="flex absolute top-[68%] sm:top-[62%] right-[4%] sm:right-[6%] z-30 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl rounded-bl-xs sm:rounded-bl-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 comment-shadow border border-gray-100 items-start hover:border-gray-200 transition-colors group">
            <a
              href="https://skillstreak.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 sm:gap-3 w-full cursor-pointer no-underline"
              aria-label="Visit skillstreak.id"
            >
              <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#FF4500] via-[#FF5500] to-[#FFA116] flex items-center justify-center shrink-0 mt-0.5 shadow-xs shadow-orange-500/20">
                <img
                  src="/skillstreak-white.svg"
                  alt="Skillstreak"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain select-none pointer-events-none"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                  <span className="font-semibold text-gray-900">Skillstreak</span>
                  <span className="text-gray-500 font-mono text-[9px] sm:text-[10px] hidden min-[360px]:inline">just now</span>
                </div>
                <div className="text-[10px] sm:text-[12px] text-gray-800 mt-0.5 leading-snug block group-hover:text-black transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">{content.skillstreak_label || 'Gamified platform'} </span><span className="font-semibold text-[#FF5500] underline decoration-orange-300 underline-offset-2">skillstreak.id</span>
                </div>
              </div>
            </a>
          </DraggableItem>

          {/* Bottom-Center: GitHub ghiffa08 */}
          <DraggableItem className="flex absolute top-[79%] sm:top-[69%] left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-[40%] z-30 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl rounded-bl-xs sm:rounded-bl-sm px-3 sm:px-4 py-1.5 sm:py-2.5 comment-shadow border border-gray-100 items-center sm:items-start gap-2 sm:gap-3 hover:border-gray-200 transition-colors group">
            <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                <span className="font-semibold text-gray-900">GitHub</span>
                <span className="text-gray-500 font-mono text-[9px] sm:text-[10px] hidden min-[360px]:inline">just now</span>
              </div>
              <a
                href="https://github.com/ghiffa08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Repositories at </span><span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">ghiffa08</span>
              </a>
            </div>
          </DraggableItem>
        </div>
      </div>
    </section>
  );
}
