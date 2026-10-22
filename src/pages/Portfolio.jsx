import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import ReactMarkdown from 'react-markdown';

// Harmonic cosine easing for silky, organic acceleration and deceleration without jerk
function smoothCosine(t) {
  const clampT = Math.min(1, Math.max(0, t));
  return 0.5 * (1 - Math.cos(Math.PI * clampT));
}

// Quadratic Bézier interpolation for curved mouse trajectories
function quadBezier(t, p0, p1, p2) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

// Animated Cursor Badge with silky smooth crossfade transition between Human team & AI frontier model
function CursorBadge({ color, humanLabel, aiModel, aiActive, isYellow = false }) {
  return (
    <div
      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none overflow-hidden ${isYellow ? 'text-[#111111]' : 'text-white'
        } ${aiActive
          ? 'shadow-[0_0_16px_rgba(255,85,0,0.4)] ring-1 ring-white/40 scale-[1.02]'
          : 'shadow-sm scale-100'
        }`}
      style={{ backgroundColor: color }}
    >
      <div className="relative flex items-center justify-center">
        {/* Human Team Role Label */}
        <span
          className={`inline-flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${aiActive
            ? 'opacity-0 -translate-y-2.5 pointer-events-none absolute'
            : 'opacity-100 translate-y-0 relative'
            }`}
        >
          <span>{humanLabel}</span>
        </span>

        {/* Cutting-edge AI Model Agent Label */}
        <span
          className={`inline-flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${aiActive
            ? 'opacity-100 translate-y-0 relative'
            : 'opacity-0 translate-y-2.5 pointer-events-none absolute'
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0 shadow-xs" />
          <span className="font-semibold tracking-tight">{aiModel}</span>
        </span>
      </div>
    </div>
  );
}

const cursorConfigs = [
  // 1. Ghiffa Tech Lead (Emerald Green) - Roams open upper-center corridor above ghiffa.dev
  {
    id: 'cursor-director',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.32, y: 0.18 },
      { x: 0.45, y: 0.14 },
      { x: 0.38, y: 0.26 },
      { x: 0.26, y: 0.21 }
    ]
  },
  // 2. Project Manager Luffy (Forest Emerald) - Roams open corridor left of GitHub card & below React
  {
    id: 'cursor-pm',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.66, y: 0.18 },
      { x: 0.74, y: 0.27 },
      { x: 0.65, y: 0.33 },
      { x: 0.60, y: 0.22 }
    ]
  },
  // 3. CI/CD Bot (Emerald Green) - Roams open mid-left corridor between Figma and LinkedIn
  {
    id: 'cursor-dev-cyan',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.15, y: 0.44 },
      { x: 0.25, y: 0.52 },
      { x: 0.20, y: 0.60 },
      { x: 0.13, y: 0.54 }
    ]
  },
  // 4. Code Reviewer (Amber Yellow) - Roams lower-right channel below ghiffa.dev and left of skillstreak
  {
    id: 'cursor-dev-yellow',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.62, y: 0.62 },
      { x: 0.72, y: 0.72 },
      { x: 0.67, y: 0.80 },
      { x: 0.57, y: 0.66 }
    ]
  },
  // 5. Design QA (Pink) - Roams upper-left channel between Email, VS Code, and Figma
  {
    id: 'cursor-ux',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.08, y: 0.26 },
      { x: 0.15, y: 0.36 },
      { x: 0.07, y: 0.41 },
      { x: 0.14, y: 0.22 }
    ]
  },
  // 6. Client Review (Orange) - Roams mid-right channel between Instagram and skillstreak
  {
    id: 'cursor-client',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.72, y: 0.46 },
      { x: 0.79, y: 0.54 },
      { x: 0.73, y: 0.60 },
      { x: 0.68, y: 0.50 }
    ]
  },
  // 7. UI & Motion (Dark Charcoal) - Roams lower-left channel below LinkedIn around Next.js icon
  {
    id: 'cursor-ui',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.07, y: 0.80 },
      { x: 0.16, y: 0.88 },
      { x: 0.25, y: 0.82 },
      { x: 0.12, y: 0.75 }
    ]
  }
];

// Draggable Interactive Item Wrapper
function DraggableItem({ children, className = '', title = '', ...props }) {
  const ref = useRef(null);

  const onPointerDown = (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button') || e.target.closest('a')) return;
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);

    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const initialX = matrix.m41;
    const initialY = matrix.m42;
    const startX = e.clientX - initialX;
    const startY = e.clientY - initialY;

    const onPointerMove = (ev) => {
      const currentX = ev.clientX - startX;
      const currentY = ev.clientY - startY;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
    };

    const onPointerUp = () => {
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
    };

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      className={`draggable-item ${className}`}
      title={title}
      {...props}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: supabaseProjects } = useSupabaseList('projects');
  const { data: supabaseArticles } = useSupabaseList('articles');
  const { data: supabaseExperiences } = useSupabaseList('experiences', {
    order: { column: 'order_index', ascending: true }
  });
  const { data: supabaseQualifications } = useSupabaseList('qualifications', {
    order: { column: 'order_index', ascending: true }
  });

  // Active Experience Index for Figma Workspace
  const [selectedExpIdx, setSelectedExpIdx] = useState(0);

  // Active Credential Index for Figma Credentials & Achievements
  const [selectedCredIdx, setSelectedCredIdx] = useState(0);

  // Interactive AI Mode Toggle (Default to solid black)
  const [aiActive, setAiActive] = useState(false);

  // Dedicated Splash Screen state (only ghiffa.dev initially, seamless fade-out with zero positional jump)
  const [splashActive, setSplashActive] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);

  useEffect(() => {
    // Lock scroll during splash screen to prevent shift
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // After 950ms: begin silky fade-out of splash overlay and reveal surrounding items & navbar
    const fadeTimer = setTimeout(() => {
      setSplashFade(true);
      setHeroRevealed(true);
    }, 950);

    // After fade transition completes: unmount splash screen and restore body scroll
    const cleanupTimer = setTimeout(() => {
      setSplashActive(false);
      document.body.style.overflow = originalOverflow || '';
    }, 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Certificate Lightbox Preview Modal & Show All
  const [certModalItem, setCertModalItem] = useState(null);
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setContactModalOpen(false);
        setCertModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Skillstreak.id Banner Section Dark Mode & Mockup Screen State
  const [isBannerDark, setIsBannerDark] = useState(false);
  const bannerRef = useRef(null);

  // Scroll-triggered dark mode for Skillstreak.id banner section
  useEffect(() => {
    const handleBannerScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the banner enters the central focal reading range of the viewport
      const isInFocalRange = rect.top < windowHeight * 0.60 && rect.bottom > windowHeight * 0.35;
      setIsBannerDark(isInFocalRange);
    };

    window.addEventListener('scroll', handleBannerScroll, { passive: true });
    window.addEventListener('resize', handleBannerScroll, { passive: true });
    handleBannerScroll();

    return () => {
      window.removeEventListener('scroll', handleBannerScroll);
      window.removeEventListener('resize', handleBannerScroll);
    };
  }, []);

  useEffect(() => {
    if (isBannerDark) {
      document.body.style.backgroundColor = '#F8A065';
    } else {
      document.body.style.backgroundColor = '#ffffff';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isBannerDark]);

  const openContactModal = (topic = '') => {
    setModalTopic(topic);
    if (topic) {
      setFormData(prev => ({ ...prev, message: `Hi ghiffa.dev, I would like to talk about: ${topic}` }));
    }
    setContactModalOpen(true);
    setFormSent(false);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setFormSent(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      closeContactModal();
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  const aiActiveRef = useRef(aiActive);
  useEffect(() => {
    aiActiveRef.current = aiActive;
  }, [aiActive]);

  // Smooth 60fps Organic Multiplayer Cursors with realistic purposeful travel
  useEffect(() => {
    let animId;
    const agents = cursorConfigs.map((cfg, idx) => {
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
    }).filter(Boolean);

    function animateCursors(now) {
      const isAI = aiActiveRef.current;

      agents.forEach(agent => {
        const w = agent.container.clientWidth;
        const h = agent.container.clientHeight;

        if (now < agent.stateStartTime) {
          const px = agent.currX * w;
          const py = agent.currY * h;
          agent.el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
          return;
        }

        const elapsed = now - agent.stateStartTime;

        if (agent.state === 'moving') {
          const rawT = Math.min(1, elapsed / agent.moveDuration);
          // Silky harmonic cosine easing: fast start, elegant decelerating glide
          const easedT = smoothCosine(rawT);

          agent.currX = quadBezier(easedT, agent.fromX, agent.ctrlX, agent.toX);
          agent.currY = quadBezier(easedT, agent.fromY, agent.ctrlY, agent.toY);

          if (rawT >= 1) {
            agent.state = 'pausing';
            agent.stateStartTime = now;
            // Realistic human pause (1.4s - 2.6s) so the cursor clearly arrives and stays
            agent.pauseDuration = isAI
              ? 1000 + Math.random() * 800
              : 1400 + Math.random() * 1200;
          }
        } else if (agent.state === 'pausing') {
          // Extremely subtle natural hand stillness (±0.3px) - zero heavy vibrating wave
          const breath = Math.sin((elapsed + agent.seed * 200) * 0.002) * 0.0003;
          agent.currX = agent.toX + breath;
          agent.currY = agent.toY + Math.cos((elapsed + agent.seed * 200) * 0.0018) * 0.0003;

          if (elapsed >= agent.pauseDuration) {
            agent.fromX = agent.currX;
            agent.fromY = agent.currY;
            agent.wpIndex = (agent.wpIndex + 1) % agent.waypoints.length;
            const target = agent.waypoints[agent.wpIndex];

            // Subtle variety around waypoint
            agent.toX = target.x + (Math.random() - 0.5) * 0.015;
            agent.toY = target.y + (Math.random() - 0.5) * 0.015;

            // Curved human-like mouse arc
            const dx = agent.toX - agent.fromX;
            const dy = agent.toY - agent.fromY;
            const arc = (Math.random() - 0.5) * 0.12;
            agent.ctrlX = (agent.fromX + agent.toX) / 2 - dy * arc * 2;
            agent.ctrlY = (agent.fromY + agent.toY) / 2 + dx * arc * 2;

            // Purposeful travel speed: 1.1s - 1.7s (snappy, clearly shifts across screen)
            agent.moveDuration = isAI
              ? 900 + Math.random() * 400
              : 1200 + Math.random() * 500;
            agent.state = 'moving';
            agent.stateStartTime = now;
          }
        }

        const finalX = agent.currX * w;
        const finalY = agent.currY * h;

        agent.el.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0)`;
      });

      animId = requestAnimationFrame(animateCursors);
    }

    animId = requestAnimationFrame(animateCursors);
    return () => cancelAnimationFrame(animId);
  }, []);

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

        // 2. Surrounding Workspace Items (laptop, phone, bubbles, tools, cursors) float upwards faster
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

  // Sync AI mode class to body
  useEffect(() => {
    if (aiActive) {
      document.body.classList.add('ai-mode-active');
    } else {
      document.body.classList.remove('ai-mode-active');
    }
  }, [aiActive]);

  // Smooth Stacking Card Parallax & Scale Effect (Cards emerge from behind)
  useEffect(() => {
    let ticking = false;
    const updateStackAnimation = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cardAbout = document.getElementById('stack-card-about');
          const cardJourney = document.getElementById('stack-card-journey');
          const cardCredentials = document.getElementById('stack-card-credentials');

          if (!cardAbout || !cardJourney) {
            ticking = false;
            return;
          }

          if (window.innerWidth >= 1024) {
            const vh = window.innerHeight;
            const topJourney = 104;
            const topCreds = 128;

            const rectJourney = cardJourney.getBoundingClientRect();
            const rectCreds = cardCredentials ? cardCredentials.getBoundingClientRect() : null;

            // Progress of Card 2 (Journey) approaching Card 1's stack
            let pJourney = 0;
            if (rectJourney.top < vh) {
              pJourney = Math.min(1, Math.max(0, (vh - rectJourney.top) / (vh - topJourney)));
            }

            // Progress of Card 3 (Credentials) approaching Card 2's stack
            let pCreds = 0;
            if (rectCreds && rectCreds.top < vh) {
              pCreds = Math.min(1, Math.max(0, (vh - rectCreds.top) / (vh - topCreds)));
            }

            // Card 1 cascades: 1.0 -> 0.96 with Card 2, -> 0.92 with Card 3
            const scale1 = 1 - (pJourney * 0.04) - (pCreds * 0.04);
            const brightness1 = 1 - (pJourney * 0.08) - (pCreds * 0.07);
            cardAbout.style.transform = `scale(${scale1.toFixed(4)})`;
            cardAbout.style.filter = `brightness(${brightness1.toFixed(3)})`;
            cardAbout.style.transformOrigin = 'center top';

            // Card 2: 1.0 -> 0.96 with Card 3
            const scale2 = 1 - (pCreds * 0.04);
            const brightness2 = 1 - (pCreds * 0.08);
            cardJourney.style.transform = `scale(${scale2.toFixed(4)})`;
            cardJourney.style.filter = `brightness(${brightness2.toFixed(3)})`;
            cardJourney.style.transformOrigin = 'center top';

            // Card 3 stays at pristine scale 1.0
            if (cardCredentials) {
              cardCredentials.style.transform = 'scale(1)';
              cardCredentials.style.filter = 'brightness(1)';
              cardCredentials.style.transformOrigin = 'center top';
            }
          } else {
            // Mobile: clean native flow with no transforms/filters
            cardAbout.style.transform = 'none';
            cardAbout.style.filter = 'none';
            cardJourney.style.transform = 'none';
            cardJourney.style.filter = 'none';
            if (cardCredentials) {
              cardCredentials.style.transform = 'none';
              cardCredentials.style.filter = 'none';
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateStackAnimation, { passive: true });
    window.addEventListener('resize', updateStackAnimation, { passive: true });
    updateStackAnimation();

    return () => {
      window.removeEventListener('scroll', updateStackAnimation);
      window.removeEventListener('resize', updateStackAnimation);
    };
  }, []);

  const emailAddress = info?.email || 'hello@ghiffa.dev';
  const fullName = info?.full_name || info?.name || 'Haikal Jibran Al-Ghiffarry';
  const roleTitle = info?.role || 'IoT Engineer & Full-stack Developer';
  const avatarImage = info?.avatar_url || '/ghiffa.svg';
  const cvUrl = info?.cv_url || '/cv.pdf';
  const aboutHeadline = info?.headline || 'Building the bridge between bits and atoms.';
  const aboutBio = info?.about_content_en || info?.about_content;
  const skillsList = Array.isArray(info?.skills) ? info.skills : [];
  const availabilityStatus = info?.availability_status || 'Available for work';

  const fallbackExperiences = [
    {
      id: "exp-1",
      period: "OKT 2024 - FEB 2025",
      role: "Web Developer",
      company: "PT. Bengkel Aplikasi Nusantara",
      description: "Mengembangkan modul aplikasi web dinamis sesuai kebutuhan spesifik klien perusahaan. Merancang dan mengoptimalkan API internal serta melakukan pemeliharaan database.",
      order_index: 1
    },
    {
      id: "exp-2",
      period: "MEI 2024 - JUN 2024",
      role: "Web Developer & System Designer",
      company: "LSP-P1 SMKN 2 Kuningan",
      description: "Merancang dan membangun aplikasi manajemen sertifikasi profesi online. Mengintegrasikan alur registrasi asesi, form pengisian asesmen mandiri, dan evaluasi portofolio.",
      order_index: 2
    },
    {
      id: "exp-3",
      period: "Sep 2023 - Dec 2023",
      role: "Website Developer",
      company: "PT BPR Raksa Wacana Agri Purnama",
      description: "Location: Cilimus, Jawa Barat, Indonesia",
      order_index: 3
    },
    {
      id: "exp-4",
      period: "Sep 2023",
      role: "IT Support Specialist",
      company: "PT BPR Raksa Wacana Agri Purnama",
      description: "Maintained IT infrastructure and provided technical support to ensure operational stability across the banking environment.",
      order_index: 4
    }
  ];

  const experiencesList = (Array.isArray(supabaseExperiences) && supabaseExperiences.length > 0)
    ? supabaseExperiences
    : fallbackExperiences;

  const activeExp = experiencesList[selectedExpIdx] || experiencesList[0];

  // Education list for About Me section (matching reference Gambar 1)
  const educationList = useMemo(() => {
    const raw = (Array.isArray(supabaseQualifications) && supabaseQualifications.length > 0)
      ? supabaseQualifications
      : [];
    const list = raw.filter(item => item.type === 'education');
    if (list.length > 0) return list;

    return [
      {
        id: 'edu-1',
        title: 'S1 Teknik Informatika (Informatics Engineering)',
        institution: 'Universitas Kuningan, Kuningan, Jawa Barat, Indonesia',
        period: '2021 — Present'
      },
      {
        id: 'edu-2',
        title: 'Rekayasa Perangkat Lunak (Software Engineering)',
        institution: 'SMK Negeri 1 Kuningan, Indonesia',
        period: '2018 — 2021'
      }
    ];
  }, [supabaseQualifications]);

  const fallbackProjects = [
    {
      id: "proj-1",
      title: "Kredit Raksa Analytica",
      category: "COMMERCIAL PLATFORM",
      description: "Otomatisasi Analisis Kelayakan Kredit yang Presisi dan Objektif berbasis algoritma rasio finansial terintegrasi.",
      tech_stack: ["Laravel", "PHP", "MySQL", "System Design"],
      image_url: "https://myciozcwwvziuqlqxhpq.supabase.co/storage/v1/object/public/portfolio-media/projects/0.2161669911915305.avif",
      link: "#"
    },
    {
      id: "proj-2",
      title: "Digital Bank Raksa",
      category: "ENTERPRISE BANKING",
      description: "Sistem perbankan online modern untuk penanganan pengaduan nasabah, pengajuan kredit secara digital, serta pembukaan rekening.",
      tech_stack: ["PHP", "Laravel", "MySQL", "TailwindCSS"],
      image_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783668568/cpezjuo93lqirexqkvzb.png",
      link: "https://e-digital-bank.rwap.co.id/"
    },
    {
      id: "proj-3",
      title: "Game Edukasi Harta Karun Angka",
      category: "GAME DEV & IP",
      description: "Interactive RPG math-education game registered as official Intellectual Property (Hak Cipta) under DGIP Indonesia.",
      tech_stack: ["Game Dev", "Educational Tech", "RPG Design", "DGIP Copyright"],
      image_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1784846871/kuoufsejrp60iwgrowbo.png",
      link: "#"
    }
  ];

  const projectsList = (Array.isArray(supabaseProjects) && supabaseProjects.length > 0)
    ? supabaseProjects
    : fallbackProjects;

  const fallbackCredentials = [
    {
      id: "cred-1",
      type: "honor",
      title: "Juara 1 PILMAPRES Universitas Kuningan 2026",
      institution: "Universitas Kuningan",
      period: "2026",
      badge: "UNIVERSITY HONOR",
      description: "Pemilihan Mahasiswa Berprestasi tingkat universitas dengan riset inovasi rekayasa sistem terintegrasi (IoT & Web Ecosystem).",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714135/f2p9oyiqe0hvurgsevhx.jpg"
    },
    {
      id: "cred-2",
      type: "honor",
      title: "2nd Place Winner – International Digital Mathematics Game Competition",
      institution: "Universitas Syiah Kuala",
      period: "Jul 2025",
      badge: "INTERNATIONAL AWARD",
      description: "International competition award for innovative digital mathematics game development and computational logic design.",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783712546/h4bw2py6ldnxwzdfxmls.jpg"
    },
    {
      id: "cred-3",
      type: "certification",
      title: "Junior Web Developer (BNSP Certified)",
      institution: "Badan Nasional Sertifikasi Profesi & Kominfo",
      period: "2024 - 2027",
      badge: "NATIONAL CERTIFICATION",
      description: "Standardized national software engineering competency certification covering responsive layouts, security, and web architecture.",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783626185/dbbffblvvangiizxkudh.jpg"
    },
    {
      id: "cred-4",
      type: "certification",
      title: "Sertifikat Pencatatan Ciptaan (Hak Cipta / IP)",
      institution: "Direktorat Jenderal Kekayaan Intelektual (DGIP)",
      period: "Jul 2025",
      badge: "INTELLECTUAL PROPERTY",
      description: "Official IP Copyright registration under the Ministry of Law and Human Rights Republic of Indonesia for digital software product.",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783713349/qx9gf4vizsixumclht13.pdf"
    },
    {
      id: "cred-5",
      type: "honor",
      title: "Peringkat Pertama Uji Kompetensi Keahlian (RPL)",
      institution: "SMKN 2 Kuningan",
      period: "May 2024",
      badge: "VOCATIONAL EXCELLENCE",
      description: "First highest academic and practical score in final software engineering vocational evaluation and RDBMS architecture.",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714204/bnv45qjsh61acgc9xjcy.jpg"
    },
    {
      id: "cred-6",
      type: "honor",
      title: "2nd Runner Up of the Business Plan Competition",
      institution: "Universitas Pancasakti",
      period: "2026",
      badge: "COMPETITION AWARD",
      description: "National business plan and product architecture competition award for viable technological innovation.",
      certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1790349503/o6nrysdsqeq6qmcrbouh.jpg"
    }
  ];

  // Deduplicate and merge qualifications so awards/certifications never appear twice
  const credentialsList = useMemo(() => {
    const raw = (Array.isArray(supabaseQualifications) && supabaseQualifications.length > 0)
      ? supabaseQualifications
      : fallbackCredentials;

    const normalizeKey = (str) => {
      if (!str) return '';
      return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const getGroupKey = (item) => {
      const t = normalizeKey(item.title);
      const inst = normalizeKey(item.institution);

      if (t.includes('pilmapres') || t.includes('mahasiswa berprestasi')) return 'pilmapres';
      if (t.includes('mathematics game') || t.includes('syiah kuala')) return 'intl_math_game';
      if (t.includes('pancasakti') || t.includes('canva design') || (t.includes('runner up') && t.includes('business plan'))) return 'pancasakti_bizplan';
      if (t.includes('business plan competition') || t.includes('uniku business') || (t.includes('business plan') && inst.includes('kuningan'))) return 'uniku_bizplan';
      if (t.includes('uji kompetensi') || t.includes('kompetensi keahlian')) return 'uji_kompetensi';
      if (t.includes('astra vocapreneur')) return 'astra_vocapreneur';
      if (t.includes('ciptaan') || t.includes('intellectual property') || t.includes('dgip') || t.includes('copyright')) return 'dgip_haki';
      if (t.includes('bnsp') || (t.includes('junior web developer') && !t.includes('vocational') && !t.includes('vsga'))) return 'bnsp_jwd';
      if (t.includes('vocational school') || t.includes('vsga')) return 'vsga_kominfo';
      if (t.includes('cakrawala') || t.includes('junior web programmer')) return 'cakrawala_jwp';
      if (t.includes('connect code') && t.includes('committee')) return 'connect_code_committee';
      if (t.includes('connect code') && t.includes('mentor')) return 'connect_code_mentor';
      if (t.includes('connect code') && t.includes('lecturer')) return 'connect_code_lecturer';
      if (t.includes('laravel') || t.includes('pijar')) return 'pijar_laravel';
      if (t.includes('iot') || t.includes('makerindo')) return 'iot_bootcamp';
      if (t.includes('web design') && (t.includes('it fest') || inst.includes('kuningan'))) return 'it_fest_web';
      if (t.includes('data science')) return 'dqlab_datascience';
      if (t.includes('python') && (t.includes('dqlab') || inst.includes('dqlab'))) return 'dqlab_python';
      if (t.includes('membangun desa')) return 'smk_membangun_desa';
      return `${t}_${inst}`;
    };

    const groups = new Map();
    raw.forEach(item => {
      if (item.type === 'education') return;
      const key = getGroupKey(item);
      if (!groups.has(key)) {
        groups.set(key, { ...item });
      } else {
        const existing = groups.get(key);
        // Retain certificate_url if available on either
        if (!existing.certificate_url && item.certificate_url) {
          existing.certificate_url = item.certificate_url;
        }
        // Prefer honor title if available
        if (item.type === 'honor' && existing.type !== 'honor') {
          existing.title = item.title;
          existing.type = 'honor';
        }
        if (item.type === 'honor' && existing.type === 'honor' && item.title.toLowerCase().includes('pilmapres')) {
          existing.title = item.title;
        }
        if (!existing.period || existing.period === 'N/A') {
          existing.period = item.period;
        }
        if (!existing.description && item.description) {
          existing.description = item.description;
        }
      }
    });

    const result = Array.from(groups.values());
    result.sort((a, b) => {
      // Honors first
      if (a.type === 'honor' && b.type !== 'honor') return -1;
      if (b.type === 'honor' && a.type !== 'honor') return 1;
      // Then items with verified certificate documents
      if (a.certificate_url && !b.certificate_url) return -1;
      if (b.certificate_url && !a.certificate_url) return 1;
      return 0;
    });

    return result.length > 0 ? result : fallbackCredentials;
  }, [supabaseQualifications]);

  const activeCredential = credentialsList[selectedCredIdx] || credentialsList[0];

  // Dynamic Certificates List from Supabase Database
  const bentoCertificates = useMemo(() => {
    const raw = (Array.isArray(supabaseQualifications) && supabaseQualifications.length > 0)
      ? supabaseQualifications
      : fallbackCredentials;

    const list = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    // Specific verified images for known certifications if certificate_url is missing or needs jpg conversion
    const knownImages = {
      'bnsp': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783626185/dbbffblvvangiizxkudh.jpg",
      'pilmapres': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714135/f2p9oyiqe0hvurgsevhx.jpg",
      'ciptaan': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783713349/qx9gf4vizsixumclht13.jpg",
      'mathematics': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783712546/h4bw2py6ldnxwzdfxmls.jpg",
      'business plan': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1790349503/o6nrysdsqeq6qmcrbouh.jpg",
      'kompetensi keahlian': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714204/bnv45qjsh61acgc9xjcy.jpg",
      'vocational school graduate academy': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714016/vcjgxnflef3o6blw3v1o.jpg"
    };

    raw.forEach((item, idx) => {
      if (item.type === 'education') return;

      const titleLower = (item.title || '').toLowerCase();
      let docUrl = item.certificate_url || '';

      // Check known fallback image if docUrl missing
      if (!docUrl) {
        for (const [k, v] of Object.entries(knownImages)) {
          if (titleLower.includes(k)) {
            docUrl = v;
            break;
          }
        }
      }

      if (!docUrl) return; // Only items with actual certificates

      // Convert .pdf to .jpg for preview
      const imgUrl = docUrl.endsWith('.pdf') ? docUrl.replace(/\.pdf$/, '.jpg') : docUrl;

      // Deduplicate by image or title key
      const normTitle = titleLower.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      if (seenUrls.has(imgUrl) || seenTitles.has(normTitle)) return;
      seenUrls.add(imgUrl);
      seenTitles.add(normTitle);

      list.push({
        id: item.id || `cert-db-${idx}`,
        order_index: item.order_index !== undefined && item.order_index !== null ? item.order_index : 999,
        title: item.title,
        institution: item.institution || 'Verified Credential',
        period: item.period || 'Verified',
        badge: item.badge || (item.type === 'honor' ? 'HONOR' : 'CERTIFIED'),
        tag: (titleLower.includes('ciptaan') || titleLower.includes('haki') || item.type === 'haki') ? 'HAK' : 'CRT',
        image: imgUrl,
        document_url: docUrl,
        type: item.type
      });
    });

    // Sort strictly by database order_index as requested
    list.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));

    return list;
  }, [supabaseQualifications]);

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#FF5500] selection:text-white transition-colors duration-700 ease-in-out ${isBannerDark ? 'bg-[#F8A065] text-[#111111]' : 'bg-white text-[#111111]'
        } ${aiActive ? 'ai-mode-active' : ''}`}
    >
      <SEO
        title="ghiffa.dev — Custom Web Design & Development"
        description="Official portfolio of Haikal Jibran Al-Ghiffarry (ghiffa.dev). Building the bridge between bits and atoms for companies, governments, and organizations."
        url="https://ghiffa.dev/"
      />

      {/* SEAMLESS SPLASH SCREEN: ONLY ghiffa.dev IN IDENTICAL PIXEL-PERFECT POSITION */}
      {splashActive && (
        <div
          id="splash-screen"
          className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-700 ease-out select-none pointer-events-none ${splashFade ? 'opacity-0' : 'opacity-100'
            }`}
          aria-hidden={splashFade}
        >
          <div className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] pt-[64px] sm:pt-[72px] overflow-hidden select-none">
            <div className="relative w-full h-full">
              <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-2 sm:px-4 w-full max-w-[96vw] sm:max-w-none flex justify-center">
                <div className="will-change-transform">
                  <div className="px-3 min-[400px]:px-6 sm:px-12 pt-2 sm:pt-4 pb-2.5 sm:pb-6 overflow-visible relative border border-transparent">
                    <h1 className="text-[34px] min-[360px]:text-[40px] min-[400px]:text-[48px] sm:text-[84px] md:text-[112px] lg:text-[138px] font-bold tracking-[-0.04em] leading-[1.08] text-[#141414] select-none whitespace-nowrap block pb-1 sm:pb-2">
                      ghiffa.dev
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-WIDTH HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-700 ease-in-out ${heroRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
          } ${isBannerDark
            ? 'bg-[#F8A065]/85 border-black/10 text-[#111111]'
            : 'bg-white/95 border-gray-100/80 text-[#111111]'
          }`}
      >
        <div className="w-full px-4 sm:px-16 lg:px-[12.8vw] h-[64px] sm:h-[72px] flex items-center justify-between">
          <a
            href="#"
            className={`text-[18px] sm:text-[20px] font-bold tracking-tight border px-1.5 py-0.5 leading-none transition-colors duration-700 ${isBannerDark
              ? 'text-[#111111] border-[#111111] hover:opacity-80'
              : 'text-[#111111] border-gray-800 hover:opacity-80'
              }`}
          >
            ghiffa.dev
          </a>
          <button
            onClick={() => openContactModal('Header Inquiry')}
            className={`text-[12px] sm:text-[12.5px] font-medium px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs ${isBannerDark
              ? 'bg-[#18181B] text-white hover:bg-black'
              : 'bg-[#18181B] text-white hover:bg-[#2a2a2a]'
              }`}
          >
            Let&apos;s talk
          </button>
        </div>
      </header>

      {/* FULL-SCREEN HERO SECTION (Architectural Dot-Grid) */}
      <section className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] pt-[64px] sm:pt-[72px] bg-architectural-dots overflow-hidden select-none">

        {/* Edge-to-Edge Full Viewport Interactive Canvas */}
        <div id="hero-canvas" className="relative w-full h-full will-change-transform">

          {/* 1. CENTER: Giant "ghiffa.dev" (Figma Canvas Selection with Skillstreak Orange Accent & Layer Badge) */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-2 sm:px-4 w-full max-w-[96vw] sm:max-w-none flex justify-center">
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
                  onClick={() => setHeroRevealed(prev => !prev)}
                >
                  ghiffa.dev
                </h1>
              </div>
            </div>
          </div>

          {/* 2. SURROUNDING WORKSPACE ITEMS (Hidden on refresh, reveals smoothly) */}
          <div
            id="hero-workspace-items"
            className={`absolute inset-0 transition-all duration-1000 ease-out will-change-transform ${heroRevealed
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-[0.98] pointer-events-none'
              }`}
          >
            {/* Top Center: AI Mode Toggle Pill (Skillstreak Flame Orange Accent) */}
            <DraggableItem className="absolute top-[20%] sm:top-[21.5%] left-1/2 -translate-x-1/2 z-30 bg-white rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 soft-card-shadow border border-gray-100/90 flex items-center gap-2.5 sm:gap-3 select-none">
              <span className={`text-[11px] sm:text-[12px] font-medium transition-colors duration-300 ${aiActive ? 'text-[#FF5500] font-semibold' : 'text-gray-800'}`}>
                {aiActive ? 'AI Mode' : 'AI Mode'}
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

            {/* 3. LIVE ROAMING MULTIPLAYER CURSORS */}

            {/* Ghiffa (Tech Lead - Green) -> Project Astra (DeepMind) */}
            <div id="cursor-director" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#10B981] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#10B981"
                humanLabel="Ghiffa (Tech Lead)"
                aiModel="Project Astra (Vision)"
                aiActive={aiActive}
              />
            </div>

            {/* CI/CD Bot (Emerald) -> OpenAI o3-mini */}
            <div id="cursor-dev-cyan" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#10B981] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#10B981"
                humanLabel="CI/CD Passing ✓"
                aiModel="OpenAI o3-mini"
                aiActive={aiActive}
              />
            </div>

            {/* UI / Motion Designer -> DeepSeek-R1 (Charcoal) */}
            <div id="cursor-ui" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#18181B] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#18181B"
                humanLabel="UI & Motion"
                aiModel="DeepSeek-R1 (Architect)"
                aiActive={aiActive}
              />
            </div>

            {/* Design QA (Pink) -> Gemini 2.5 Flash */}
            <div id="cursor-ux" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#EC4899] -ml-2 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#EC4899"
                humanLabel="Design QA"
                aiModel="Gemini 2.5 Flash"
                aiActive={aiActive}
              />
            </div>

            {/* Project Manager Luffy -> GPT-4o (Emerald) */}
            <div id="cursor-pm" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#059669] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#059669"
                humanLabel="Luffy (PM)"
                aiModel="GPT-4o (Supervisor)"
                aiActive={aiActive}
              />
            </div>

            {/* Client PT Raksa (Orange) -> Claude 3.7 Sonnet */}
            <div id="cursor-client" className="live-cursor hidden md:block">
              <svg className="w-3.5 h-3.5 text-[#F97316] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#F97316"
                humanLabel="Client Review"
                aiModel="Claude 3.7 Sonnet (Hybrid)"
                aiActive={aiActive}
              />
            </div>

            {/* Code Reviewer (Amber) -> Grok 3 */}
            <div id="cursor-dev-yellow" className="live-cursor hidden sm:block">
              <svg className="w-3.5 h-3.5 text-[#F59E0B] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
              </svg>
              <CursorBadge
                color="#F59E0B"
                isYellow={true}
                humanLabel="Code Reviewer"
                aiModel="Grok 3 (DeepSearch)"
                aiActive={aiActive}
              />
            </div>

            {/* 4. FLOATING TOOL ICONS */}

            {/* VS Code Icon (Top-left stack) */}
            <DraggableItem className="hidden sm:flex absolute top-[28%] left-[19%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="VS Code">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                <path d="M17.5 2L7.2 11.4L3.2 8.3L1.5 9.2V14.8L3.2 15.7L7.2 12.6L17.5 22L22.5 19.9V4.1L17.5 2ZM17.5 17.2L10.8 12L17.5 6.8V17.2Z" fill="#007ACC" />
              </svg>
            </DraggableItem>

            {/* Figma Icon (Mid-left) */}
            <DraggableItem className="hidden md:flex absolute top-[46%] left-[7%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="Figma">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 38 57" fill="none">
                <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
              </svg>
            </DraggableItem>

            {/* Next.js Icon (Lower-left) */}
            <DraggableItem className="hidden sm:flex absolute top-[78%] left-[16%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="Next.js">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[12px] tracking-tighter group-hover:scale-110 transition-transform">N</div>
            </DraggableItem>

            {/* TypeScript Icon (Bottom-center stack) */}
            <DraggableItem className="hidden md:flex absolute top-[82%] left-[48%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 items-center justify-center group" title="TypeScript">
              <svg className="w-6 h-6 rounded-md shadow-2xs group-hover:scale-110 transition-transform" viewBox="0 0 128 128">
                <rect width="128" height="128" fill="#3178C6" rx="16" />
                <path d="M57.6 74.4h-14v39.2h-13.6v-39.2h-14v-11.8h41.6v11.8zm23.2 27.6c3.2 2.2 7.2 3.6 11.6 3.6 6.2 0 9.8-3 9.8-7.6 0-5-4.2-6.8-11.4-9.8-10.4-4.4-15.6-9.6-15.6-18.8 0-10.8 8.6-18.4 22.8-18.4 6.8 0 12.6 1.8 16.8 4.8l-4.4 10.8c-3.6-2.2-8.2-3.6-12.4-3.6-5.8 0-8.8 2.8-8.8 6.6 0 4.6 3.8 6.4 11 9.4 11.2 4.6 16.2 10.2 16.2 19.4 0 11.4-8.8 19-24.2 19-7.8 0-15-2.2-19.6-6.2l4.2-11z" fill="#FFFFFF" />
              </svg>
            </DraggableItem>

            {/* React Icon (Top-right stack) */}
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

            {/* 5. FLOATING SOCIAL CARDS & BUBBLES */}

            {/* Top-Left: Email hello@ghiffa.dev Bubble */}
            <DraggableItem className="hidden sm:flex absolute top-[14%] left-[4%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-3 max-w-[270px] hover:border-gray-200 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-[#EA4335] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-900">Email</span>
                  <span className="text-gray-400 font-mono text-[10px]">just now</span>
                </div>
                <a
                  href="mailto:hello@ghiffa.dev"
                  className="text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors"
                >
                  Drop a message at <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">hello@ghiffa.dev</span>
                </a>
              </div>
            </DraggableItem>

            {/* Bottom-Left: LinkedIn Haikal Jibran Bubble */}
            <DraggableItem className="hidden md:flex absolute top-[62%] left-[6%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-3 max-w-[270px] hover:border-gray-200 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-900">LinkedIn</span>
                  <span className="text-gray-400 font-mono text-[10px]">just now</span>
                </div>
                <a
                  href="https://www.linkedin.com/in/haikal-jibran-al-ghiffarry?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors"
                >
                  Connect on LinkedIn <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">Haikal Jibran</span>
                </a>
              </div>
            </DraggableItem>

            {/* Top-Right: GitHub Contributions Heatmap Card */}
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

            {/* Mid-Right: Instagram @haikaljibraan Bubble */}
            <DraggableItem className="hidden md:flex absolute top-[38%] right-[5%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-3 max-w-[260px] hover:border-gray-200 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-900">Instagram</span>
                  <span className="text-gray-400 font-mono text-[10px]">just now</span>
                </div>
                <a
                  href="https://instagram.com/haikaljibraan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors"
                >
                  Connect on Instagram <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">@haikaljibraan</span>
                </a>
              </div>
            </DraggableItem>

            {/* Bottom-Right: Web skillstreak.id Bubble */}
            <DraggableItem className="hidden md:flex absolute top-[62%] right-[6%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-3 max-w-[270px] hover:border-gray-200 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4500] via-[#FF5500] to-[#FFA116] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs shadow-orange-500/20">
                <svg className="w-3.5 h-3.5 fill-white stroke-white" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-900">skillstreak.id</span>
                  <span className="text-gray-400 font-mono text-[10px]">just now</span>
                </div>
                <a
                  href="https://skillstreak.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors"
                >
                  Gamified learning platform <span className="font-semibold text-[#FF5500] underline decoration-orange-300 underline-offset-2">skillstreak.id</span>
                </a>
              </div>
            </DraggableItem>

            {/* Bottom-Center: GitHub ghiffa08 Bubble */}
            <DraggableItem className="hidden md:flex absolute top-[69%] left-[40%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-3 max-w-[270px] hover:border-gray-200 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-gray-900">GitHub</span>
                  <span className="text-gray-400 font-mono text-[10px]">just now</span>
                </div>
                <a
                  href="https://github.com/ghiffa08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-gray-800 mt-0.5 leading-snug block hover:text-black transition-colors"
                >
                  Open source repositories at <span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2">ghiffa08</span>
                </a>
              </div>
            </DraggableItem>

          </div>
        </div>
      </section>

      {/* 2. STICKY SCROLL-ANIMATED TEXT SECTION (Clean pure white, no dots) */}
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

      {/* 2.25 THREE SKILLSTREAK FLAME ORANGE GRID SERVICE CARDS */}
      <section id="services" className="relative w-full min-h-screen bg-white flex flex-col justify-center items-center py-12 lg:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">

            {/* Service Card 1 */}
            <div className="flex flex-col">
              <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                    Experience &amp;<br />interface design
                  </h3>
                  <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                    Users are at the center of our experience creation process. We design pixel-by-pixel relevant digital products that people love to use.
                  </p>
                </div>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
                Our design thinking process helps empower your project from day zero.
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="flex flex-col">
              <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                    Custom website<br />development
                  </h3>
                  <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                    Our team specializes in developing fully self-manageable websites built on the latest technologies to achieve top performance, quality, and security.
                  </p>
                </div>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
                Every development is tailored to each client following international standards.
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="flex flex-col">
              <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                    Tailored digital<br />services
                  </h3>
                  <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                    We take care of all the technical aspects every project requires: infrastructure, security, continuous support, and supervision over every detail.
                  </p>
                </div>
              </div>
              <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
                Your website, our responsibility. Long-term partnerships tailored to each client.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 ABOUT ME SECTION (Clean Concept Matching Reference Gambar 1 & Theme) */}
      <section id="about" className="relative py-20 sm:py-28 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start sm:items-center">

          {/* LEFT COLUMN: Uncropped Full-Height Person Cutout + Floating Tech Dock (No Background) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-end relative self-stretch">
            {/* Person Cutout: Full height, uncropped, zero background */}
            <div className="relative flex items-end justify-center w-full flex-1">
              <img
                src={avatarImage}
                alt={fullName}
                className="w-auto h-auto max-h-[520px] sm:max-h-[600px] lg:max-h-[680px] xl:max-h-[740px] object-contain object-bottom select-none pointer-events-none drop-shadow-xs transition-transform duration-500 hover:scale-[1.01]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  if (e.currentTarget.src.includes('.svg')) {
                    e.currentTarget.src = '/ghiffa.png';
                  } else {
                    e.currentTarget.src = '/ghiffa.jpeg';
                  }
                }}
              />
            </div>

            {/* FLOATING TECH DOCK (All Official Tech Brand Logos) */}
            <div className="-mt-5 sm:-mt-7 relative z-10 bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.08)] rounded-full px-4 sm:px-5 py-2.5 flex items-center justify-center gap-3 sm:gap-3.5 select-none hover:shadow-lg transition-shadow">
              {/* React */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="React">
                <svg className="w-5 h-5 text-[#00D8FE]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
                  <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
                  <g stroke="#00D8FE" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                  </g>
                </svg>
              </div>

              {/* Next.js */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Next.js">
                <svg className="w-5 h-5 text-black" viewBox="0 0 180 180" fill="none">
                  <circle cx="90" cy="90" r="90" fill="black" />
                  <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
                  <rect x="115" y="54" width="12" height="72" fill="white" />
                </svg>
              </div>

              {/* TypeScript */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="TypeScript">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#3178C6" />
                  <path d="M11.75 8.25H6.25v1.88h1.8v8.62h2.2v-8.62h1.5V8.25zm5.55 3.3c-1.3-.4-2.1-.8-2.1-1.6 0-.7.7-1.2 1.8-1.2 1.1 0 1.9.5 2.2 1.3l1.8-.8c-.6-1.4-1.9-2.3-3.9-2.3-2.4 0-4.1 1.5-4.1 3.5 0 2 1.4 2.8 3.3 3.4 1.4.4 2.1.9 2.1 1.7 0 .8-.8 1.4-2 1.4-1.5 0-2.3-.7-2.7-1.6l-1.9.8c.6 1.7 2.2 2.7 4.5 2.7 2.6 0 4.3-1.4 4.3-3.6 0-2.1-1.3-3-3.3-3.7z" fill="white" />
                </svg>
              </div>

              {/* Tailwind CSS */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Tailwind CSS">
                <svg className="w-5 h-5 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                </svg>
              </div>

              {/* Node.js */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Node.js">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5FA04E">
                  <path d="M11.998 1.5L2.616 6.92v10.84l9.382 5.42 9.386-5.42V6.92L11.998 1.5zm-.088 2.378l7.26 4.195v8.384l-7.26 4.191-7.256-4.191V8.073l7.256-4.195zm.088 3.513l-4.75 2.742v5.485l4.75 2.743 4.75-2.743V10.133l-4.75-2.742z" />
                </svg>
              </div>

              {/* Python */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Python">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M11.914 2c-5.042 0-4.726 2.186-4.726 2.186l.006 2.264h4.79v.678H5.196S2 6.764 2 11.838c0 5.075 2.784 4.887 2.784 4.887h1.66v-2.336s-.09-2.784 2.723-2.784h4.698v-.706H9.281s-2.66-.027-2.66-2.607c0-2.58 2.308-2.527 2.308-2.527h5.666S17.067 5.6 17.067 8.2v.735h1.737V4.24S18.995 2 11.914 2zm-2.583 1.488a.86.86 0 1 1 0 1.72.86.86 0 0 1 0-1.72z" fill="#3776AB" />
                  <path d="M12.086 22c5.042 0 4.726-2.186 4.726-2.186l-.006-2.264h-4.79v-.678h6.788S22 17.236 22 12.162c0-5.075-2.784-4.887-2.784-4.887h-1.66v2.336s.09 2.784-2.723 2.784h-4.698v.706h4.582s2.66.027 2.66 2.607c0 2.58-2.308 2.527-2.308 2.527H7.405S4.933 18.4 4.933 15.8v-.735H3.196v4.695S5.005 22 12.086 22zm2.583-1.488a.86.86 0 1 1 0-1.72.86.86 0 0 1 0 1.72z" fill="#FFD43B" />
                </svg>
              </div>

              {/* Arduino */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Arduino & Embedded IoT">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00979C">
                  <path d="M17.03 7C14.71 7 12.79 8.5 12 10.61 11.21 8.5 9.29 7 6.97 7 3.67 7 1 9.69 1 13s2.67 6 5.97 6c2.32 0 4.24-1.5 5.03-3.61.79 2.11 2.71 3.61 5.03 3.61 3.3 0 5.97-2.69 5.97-6s-2.67-6-5.97-6zm-10.06 9.6c-1.99 0-3.6-1.61-3.6-3.6 0-1.99 1.61-3.6 3.6-3.6 1.99 0 3.6 1.61 3.6 3.6 0 1.99-1.61 3.6-3.6 3.6zm10.06 0c-1.99 0-3.6-1.61-3.6-3.6 0-1.99 1.61-3.6 3.6-3.6 1.99 0 3.6 1.61 3.6 3.6 0 1.99-1.61 3.6-3.6 3.6zm-11.86-4.4h3.6v1.6H5.17v-1.6zm10.26-1.8h1.6v1.8h1.8v1.6h-1.8v1.8h-1.6v-1.8h-1.8v-1.6h1.8v-1.8z" />
                </svg>
              </div>

              {/* Laravel */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Laravel">
                <svg className="w-5 h-5 text-[#FF2D20]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.2 2.5L2 6.1l6.2 3.6 6.2-3.6-6.2-3.6zm0 18.9l-6.2-3.6V10.3l6.2 3.6v7.5zm7.6-7.5l6.2-3.6V2.5l-6.2 3.6v7.7zm0 7.5l6.2-3.6v-7.5l-6.2 3.6v7.5z" />
                </svg>
              </div>

              {/* Supabase */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Supabase">
                <svg className="w-5 h-5 text-[#3ECF8E]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.4 2.1a1 1 0 0 0-1.6.4L5.2 14.8a1 1 0 0 0 .9 1.4h5.3v5.7a1 1 0 0 0 1.6.8l7.6-11.8a1 1 0 0 0-.9-1.5h-6.3V2.1z" />
                </svg>
              </div>

              {/* Figma */}
              <div className="hover:scale-115 transition-transform cursor-pointer" title="Figma UI/UX">
                <svg className="w-4 h-5" viewBox="0 0 38 57" fill="none">
                  <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                  <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                  <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                  <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                  <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Selection Highlight Header, Bio, Education, Languages */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 sm:space-y-8">

            {/* SELECTION-HIGHLIGHTED HEADER (Matching Reference Gambar 1 with Theme Accent) */}
            <div className="inline-flex items-center relative select-none self-start">
              {/* Left selection handle with top circle pin */}
              <div className="absolute -left-[2px] top-0 bottom-0 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white -translate-y-1/2" />
                <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
              </div>

              {/* Selection highlight box with text */}
              <div className="bg-[#FFF2EB] border-y border-[#FF5500]/30 px-5 sm:px-7 py-2 sm:py-2.5">
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#141414] lowercase leading-none">
                  about me
                </h2>
              </div>

              {/* Right selection handle with bottom circle pin */}
              <div className="absolute -right-[2px] top-0 bottom-0 flex flex-col items-center">
                <div className="w-[2.5px] flex-1 bg-[#FF5500]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] ring-2 ring-white translate-y-1/2" />
              </div>
            </div>

            {/* Bio Narrative Paragraph */}
            <div className="text-[14.5px] sm:text-[15.5px] text-gray-600 leading-relaxed space-y-3 font-normal max-w-2xl text-justify [&>p]:leading-relaxed [&>p]:text-justify [&>strong]:text-gray-900 [&>strong]:font-semibold">
              {aboutBio ? (
                <ReactMarkdown>{aboutBio}</ReactMarkdown>
              ) : (
                <p>
                  As a Fullstack Web Developer and IoT Engineer, I design end-to-end technological solutions from the ground up. My technical scope encompasses scalable cloud architectures, high-performance web applications, edge computing, LoRa network telemetry, and custom PCB hardware design.
                </p>
              )}
            </div>

            {/* EDUCACIÓN / EDUCATION (Matching Reference Gambar 1 with Folder Icons) */}
            <div className="pt-2">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2">
                <span>Educación</span>
                <span className="text-xs font-normal text-gray-400 font-mono">/ Education</span>
              </h3>
              <div className="space-y-3.5">
                {educationList.map((edu, idx) => (
                  <div key={edu.id || idx} className="flex items-start gap-3.5 group">
                    {/* Clean Folder Icon matching Reference Gambar 1 (Themed Orange) */}
                    <div className="shrink-0 pt-0.5">
                      <svg className="w-9 h-7 sm:w-10 sm:h-8 drop-shadow-2xs group-hover:scale-105 transition-transform" viewBox="0 0 48 38" fill="none">
                        <path d="M4 6C4 3.79086 5.79086 2 8 2H18.5858C19.6466 2 20.664 2.42143 21.4142 3.17157L24.8284 6.58579C25.5786 7.33593 26.596 7.75736 27.6569 7.75736H40C42.2091 7.75736 44 9.54822 44 11.7574V14H4V6Z" fill="#FFA06B" />
                        <rect x="2" y="10" width="44" height="26" rx="4" fill="#FF5500" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[14px] sm:text-[14.5px] text-gray-900 leading-snug">
                        {edu.title}
                      </div>
                      <div className="text-[12.5px] sm:text-[13px] text-gray-500 italic mt-0.5">
                        {edu.institution} {edu.period && <span>({edu.period})</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IDIOMAS / LANGUAGES & SPECIALIZATION (Speech-bubble pills matching Gambar 1) */}
            <div className="pt-2">
              <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 tracking-tight mb-3 flex items-center gap-2">
                <span>Idiomas &amp; Specialization</span>
              </h3>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3 items-start sm:items-center">
                {/* Speech Bubble Pill 1 */}
                <div className="relative inline-flex items-center gap-2 bg-[#FF5500] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-br-xs shadow-xs hover:bg-[#E04B00] transition-colors cursor-default select-none">
                  <span>Bahasa Indonesia - Native</span>
                </div>

                {/* Speech Bubble Pill 2 */}
                <div className="relative inline-flex items-center gap-2 bg-[#18181B] text-white text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl rounded-bl-xs shadow-xs hover:bg-black transition-colors cursor-default select-none">
                  <span>English - Professional Working</span>
                </div>

                {/* Speech Bubble Pill 3 */}
                <div className="relative inline-flex items-center gap-2 bg-white text-gray-800 text-[12px] sm:text-[12.5px] font-medium px-4 py-2 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors select-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for Full-Time &amp; Contracts</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2.6 PROFESSIONAL JOURNEY SECTION (Clean Experience Timeline) */}
      <section id="journey" className="relative py-20 sm:py-24 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto border-t border-gray-100">
        <div id="experience" className="absolute -top-24" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              <span>Career Timeline &bull; {experiencesList.length} Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141414] tracking-tight">
              Professional Journey
            </h2>
            <p className="text-gray-500 text-[14px] sm:text-[15px] mt-2 max-w-xl">
              Proven track record in scalable web ecosystems, internal enterprise APIs, and hardware-resilient IoT systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openContactModal('Career & Collaboration')}
              className="bg-[#18181B] hover:bg-black text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              Let&apos;s build together
            </button>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium px-4 py-2.5 rounded-full transition-colors cursor-pointer shadow-2xs"
              >
                <span>Download CV</span>
                <span>&darr;</span>
              </a>
            )}
          </div>
        </div>

        {/* Clean Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiencesList.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-[#FF5500] bg-[#FF5500]/10 px-2.5 py-0.5 rounded-md">
                    {exp.period || '2023 - Present'}
                  </span>
                  {exp.location && (
                    <span className="text-[11.5px] text-gray-400 font-medium">
                      {exp.location}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#FF5500] transition-colors leading-snug">
                  {exp.role || exp.position}
                </h3>
                <div className="text-[13.5px] font-medium text-gray-600 mb-3">
                  {exp.company}
                </div>
                <p className="text-[13px] sm:text-[13.5px] text-gray-500 leading-relaxed mb-4">
                  {exp.description}
                </p>
              </div>

              {exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {exp.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2.75 VERIFIED HAKI & CERTIFICATIONS: FULL SHARP CERTIFICATES WITH SHOW ALL */}
      <section
        id="haki-certifications"
        className="relative py-12 sm:py-16 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto"
      >
        <div id="credentials" className="absolute -top-24" />
        <div id="certifications" className="absolute -top-24" />

        {/* 3-Column Bento Grid: Dynamic 8 Initial / All Database Certificates */}
        {(() => {
          const renderCertCard = (cert) => {
            if (!cert) return null;
            return (
              <div
                key={cert.id}
                onClick={() => setCertModalItem(cert)}
                className="group relative overflow-hidden bg-white shadow-[0_4px_22px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
              >
                {/* Full Sharp Uncropped Certificate Image */}
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-auto block select-none"
                  loading="lazy"
                />

                {/* Clean Theme Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 text-white">
                  {/* Top: Tag & Period */}
                  <div className="flex items-center justify-between gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                      {cert.tag || 'CRT'}
                    </span>
                    <span className="font-mono text-[11px] text-white/75 tracking-wider uppercase">
                      {cert.period}
                    </span>
                  </div>

                  {/* Bottom: Institution, Title & Action */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-xs text-white/80 font-medium mb-1 truncate">
                      {cert.institution}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2 sm:line-clamp-3">
                      {cert.title}
                    </h3>
                    <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[11px] text-white/90 font-medium">
                      <span>View Full Document</span>
                      <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          };

          return (
            <div className="space-y-7 sm:space-y-9">
              {/* Row 1: Left Portrait (0), Middle 2 Landscapes (1 & 3), Right Portrait (2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
                {/* Left: Pilmapres (Portrait) */}
                <div className="flex flex-col">
                  {renderCertCard(bentoCertificates[0])}
                </div>

                {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
                <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
                  {renderCertCard(bentoCertificates[1])}
                  {renderCertCard(bentoCertificates[3])}
                </div>

                {/* Right: BNSP (Portrait) */}
                <div className="flex flex-col">
                  {renderCertCard(bentoCertificates[2])}
                </div>
              </div>

              {/* Row 2: Left Portrait (5), Middle 2 Landscapes (6 & 7), Right Portrait (4) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-stretch">
                {/* Left: Cakrawala (Portrait) */}
                <div className="flex flex-col">
                  {renderCertCard(bentoCertificates[5])}
                </div>

                {/* Middle: 2 Landscapes (Height matches 1 portrait) */}
                <div className="flex flex-col justify-between gap-4 sm:gap-5 h-full">
                  {renderCertCard(bentoCertificates[6])}
                  {renderCertCard(bentoCertificates[7])}
                </div>

                {/* Right: HAKI Ciptaan (Portrait) */}
                <div className="flex flex-col">
                  {renderCertCard(bentoCertificates[4])}
                </div>
              </div>

              {/* Show All: Additional certificates from database */}
              {showAllCerts && bentoCertificates.length > 8 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9 items-start pt-2">
                  {bentoCertificates.slice(8).map((cert) => (
                    <div key={cert.id} className="flex flex-col">
                      {renderCertCard(cert)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Show All / Show Less Button */}
        {bentoCertificates.length > 8 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAllCerts(!showAllCerts)}
              className="inline-flex items-center gap-2.5 text-xs font-semibold px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              <span>{showAllCerts ? 'Show less' : `Show all certificates (${bentoCertificates.length})`}</span>
              <svg
                className={`w-3.5 h-3.5 stroke-current transition-transform duration-200 ${showAllCerts ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* 3. SELECTED WORKS (3-CARD GRID DESIGN BELOW STACKING CARDS) */}
      <section id="works" className="relative py-14 sm:py-20 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
        <div id="work" className="absolute -top-24" />
        <div id="projects" className="absolute -top-24" />

        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
            </div>
            <h2 className="text-2xl sm:text-[38px] font-bold tracking-tight text-[#141414]">
              Selected works
            </h2>
          </div>
          <button
            onClick={() => openContactModal('Explore All Works')}
            className="text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-4 py-2 rounded-full transition-colors hidden sm:inline-block cursor-pointer shadow-2xs hover:border-gray-300"
          >
            Explore all works &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projectsList.slice(0, 3).map((proj, idx) => {
            const projImg = proj.image_url || (Array.isArray(proj.image_urls) && proj.image_urls.length > 0 ? proj.image_urls[0] : null);

            return (
              <article
                key={proj.id || idx}
                className="group cursor-pointer flex flex-col"
                onClick={() => {
                  if (proj.link && proj.link !== '#' && proj.link.startsWith('http')) {
                    window.open(proj.link, '_blank', 'noopener,noreferrer');
                  } else {
                    openContactModal(`Project Inquiry: ${proj.title}`);
                  }
                }}
              >
                {/* Clean Card Visual matching Gambar 2 (Tall 4:3 aspect ratio, rounded-2xl) */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 relative bg-[#F4F4F5] select-none">
                  {projImg ? (
                    <img
                      src={projImg}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-[#FF5500]" />
                  )}
                </div>

                {/* Title (2 lines max with clean leading, matching Gambar 2) */}
                <h3 className="text-[19px] sm:text-[20px] lg:text-[21px] font-semibold text-[#141414] leading-[1.3] mb-2.5 group-hover:text-[#FF5500] transition-colors line-clamp-2">
                  {proj.title}
                </h3>

                {/* Description (3 lines clean, matching Gambar 2) */}
                <p className="text-[13px] sm:text-[13.5px] text-[#71717A] leading-[1.6] line-clamp-3 font-normal">
                  {proj.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SKILLSTREAK.ID PLATFORM BANNER — EXACT 1:1 REFERENCE MATCH (ONLINES.COM.AR STYLE) */}
      <section
        ref={bannerRef}
        id="skillstreak-banner"
        className={`min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-12 relative z-10 transition-colors duration-700 ease-in-out select-none ${isBannerDark ? 'bg-[#F8A065]' : 'bg-white'
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
                {/* Laptop Mockup Wrapper — clean centered on mobile, slightly bleeds on desktop */}
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

          {/* Subtext below card — dark text on soft orange background */}
          <p className="text-[12px] text-neutral-900/80 font-medium mt-4 pl-1 max-w-lg leading-relaxed">
            * Early members receive Founder Badge + lifetime discounted access on skillstreak.id
          </p>
        </div>
      </section>

      {/* 5. "A TEAM THAT LOVES THE INTERNET" INTERACTIVE CANVAS SECTION */}
      <section className="relative py-16 sm:py-28 bg-square-grid overflow-hidden border-t border-b border-gray-100 my-8 sm:my-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative min-h-[360px] sm:min-h-[460px] flex flex-col items-center justify-center">

          {/* Floating Team Member Avatars & Chat Bubbles */}
          <div className="hidden md:flex items-center gap-2.5 absolute top-[8%] left-[12%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Team" className="w-9 h-9 rounded-full object-cover" />
            <div className="text-[11px]">
              <div className="font-semibold text-gray-900">Sarah — UX Lead</div>
              <div className="text-gray-400">Wireframes approved ✓</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 absolute top-[4%] left-[36%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Team" className="w-9 h-9 rounded-full object-cover" />
            <div className="text-[11px]">
              <div className="font-semibold text-gray-900">Ghiffa — Tech Lead</div>
              <div className="text-gray-400">Deploying to edge...</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 absolute top-[12%] right-[14%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Team" className="w-9 h-9 rounded-full object-cover" />
            <div className="text-[11px]">
              <div className="font-semibold text-gray-900">Elena — Art Director</div>
              <div className="text-gray-400">Typography refined</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 absolute bottom-[12%] left-[18%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Team" className="w-9 h-9 rounded-full object-cover" />
            <div className="text-[11px]">
              <div className="font-semibold text-gray-900">Marco — Full-Stack</div>
              <div className="text-gray-400">99.9% Lighthouse score</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 absolute bottom-[10%] right-[16%] bg-white px-3.5 py-2 rounded-2xl soft-card-shadow border border-gray-100">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Team" className="w-9 h-9 rounded-full object-cover" />
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
                onClick={() => openContactModal('Meet the team')}
                className="bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-[13px] px-6 sm:px-7 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
              >
                Meet our studio
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. "DETAILS ARE NOT DETAILS" SECTION WITH LAYERED PORTRAIT CARDS */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <h2 className="text-2xl min-[360px]:text-3xl sm:text-[42px] font-bold tracking-tight text-[#141414] leading-[1.12]">
              Details are<br />not details
            </h2>
            <p className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed">
              They make the product. We obsess over micro-interactions, typography, accessibility, and millisecond load times so your brand stands out effortlessly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openContactModal('Design & Craft')}
                className="bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-all cursor-pointer"
              >
                See our craft &rarr;
              </button>
            </div>
          </div>

          {/* Right Layered Visual Cards */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[300px] sm:min-h-[380px] overflow-hidden sm:overflow-visible py-4">
            {/* Left tilted background card */}
            <div className="w-28 min-[380px]:w-36 sm:w-52 h-44 min-[380px]:h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg -rotate-6 -mr-6 min-[380px]:-mr-8 sm:-mr-10 z-10 border border-gray-200 bg-zinc-900 shrink-0">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80" alt="Detail 1" className="w-full h-full object-cover opacity-85" />
            </div>

            {/* Center main portrait card */}
            <div className="w-40 min-[380px]:w-48 sm:w-64 h-60 min-[380px]:h-72 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-20 border-2 border-white bg-zinc-950 relative shrink-0">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80" alt="Main Portrait" className="w-full h-full object-cover contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#FF5500] font-mono">Pixel Precision</span>
                <p className="text-xs sm:text-sm font-semibold mt-0.5">Crafted for human connection</p>
              </div>
            </div>

            {/* Right tilted background card */}
            <div className="w-28 min-[380px]:w-36 sm:w-52 h-44 min-[380px]:h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg rotate-6 -ml-6 min-[380px]:-ml-8 sm:-ml-10 z-10 border border-gray-200 bg-zinc-900 shrink-0">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80" alt="Detail 2" className="w-full h-full object-cover opacity-85" />
            </div>

            {/* Floating Comment Tag Top-Right */}
            <div className="hidden sm:flex items-center gap-2.5 absolute top-6 right-8 z-30 bg-white px-3.5 py-2 rounded-xl comment-shadow border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]" />
              <span className="text-[11.5px] font-medium text-gray-800">60fps smooth animations</span>
            </div>

            {/* Floating Comment Tag Bottom */}
            <div className="hidden sm:flex items-center gap-2.5 absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 bg-white px-4 py-2 rounded-xl comment-shadow border border-gray-100">
              <div className="w-5 h-5 rounded-full bg-black text-white text-[7px] font-bold flex items-center justify-center">gh</div>
              <span className="text-[11.5px] font-medium text-gray-800">Every breakpoint tested</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CLIENT LOGOS STRIP */}
      <section className="py-10 sm:py-12 border-t border-b border-gray-100 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-8 opacity-45 grayscale">
          <span className="text-base sm:text-lg font-bold tracking-tight">VERCEL</span>
          <span className="text-base sm:text-lg font-bold tracking-widest">STRIPE</span>
          <span className="text-base sm:text-lg font-semibold font-serif italic">Chronicle</span>
          <span className="text-base sm:text-lg font-extrabold tracking-tighter">LINEAR</span>
          <span className="text-base sm:text-lg font-mono font-bold">SUPABASE</span>
          <span className="text-base sm:text-lg font-bold tracking-tight">RAYCAST</span>
          <span className="text-base sm:text-lg font-semibold">NOTION</span>
        </div>
      </section>

      {/* 8. THREE INSIGHTS / ARTICLES CARDS */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 lg:px-16 max-w-[1360px] mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#FF5500] font-semibold mb-1">
              // PERSPECTIVES &amp; DISPATCHES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
              Selected insights &amp; publications
            </h2>
          </div>
          <Link
            to="/articles"
            className="text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-4 py-2 rounded-full transition-colors hidden sm:inline-block"
          >
            View all articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* Article 1 */}
          <article
            className="group cursor-pointer"
            onClick={() => openContactModal('Design Systems')}
          >
            <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
              Scalable Design Systems for Modern Enterprises
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              How we unify tokens, Figma libraries, and production React components to ship products twice as fast.
            </p>
          </article>

          {/* Article 2 */}
          <article
            className="group cursor-pointer"
            onClick={() => openContactModal('Web Performance')}
          >
            <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-[#FF5500] via-amber-600 to-zinc-900 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,85,0,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
              Engineering High-Performance Web Architecture
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Why Core Web Vitals, edge caching, and clean semantic markup are essential for conversion and SEO.
            </p>
          </article>

          {/* Article 3 */}
          <article
            className="group cursor-pointer"
            onClick={() => openContactModal('AI + Web')}
          >
            <div className="h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 sm:mb-5 bg-gradient-to-br from-red-700 via-rose-900 to-neutral-950 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,rgba(251,113,133,0.3),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#FF5500] transition-colors">
              Bridging Bits and Atoms in the Age of AI
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Blending physical brand identity with intelligent digital interfaces that adapt to every user.
            </p>
          </article>
        </div>
      </section>

      {/* 9. BOTTOM "LET'S BUILD A PROJECT TOGETHER" CTA SECTION */}
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
                onClick={() => openContactModal('New Project')}
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

      {/* FOOTER */}
      <footer className="border-t border-gray-200/80 py-10 sm:py-12 px-4 sm:px-12 lg:px-20 text-xs text-gray-500">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#111111]">ghiffa.dev</div>
            <p>2008&ndash;2026 All rights reserved. ghiffa.dev &mdash; Custom Web Design &amp; Development Studio.</p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-gray-600">
            <a href="#services" className="hover:text-black transition-colors">Services</a>
            <Link to="/admin" className="hover:text-black transition-colors">Admin Panel</Link>
            <a href={`mailto:${emailAddress}`} className="hover:text-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* CONTACT MODAL */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={closeContactModal}
        >
          <div
            className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeContactModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-1 cursor-pointer"
            >
              ✕
            </button>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              ghiffa.dev
            </div>
            <h3 className="text-2xl font-bold text-[#111111] mb-2">
              Let&apos;s build a project together
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Leave us a message and we&apos;ll schedule a call.
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="hello@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#141414] hover:bg-black text-white font-medium py-3 rounded-full text-sm transition-all cursor-pointer"
              >
                Send message
              </button>
              {formSent && (
                <p className="text-xs text-emerald-600 text-center pt-2 font-medium">
                  Message sent! We will get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE / HAKI LIGHTBOX MODAL */}
      {certModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setCertModalItem(null)}
        >
          <div
            className="bg-white border border-gray-200/90 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Clean Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-[#FAFAFA]">
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span className="bg-[#FF5500]/10 text-[#FF5500] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span>[ {certModalItem.tag || 'CERT'} ]</span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-950 truncate">
                    {certModalItem.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {certModalItem.institution} &bull; {certModalItem.period}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {certModalItem.document_url && (
                  <a
                    href={certModalItem.document_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gray-900 text-white hover:bg-black transition-colors shadow-xs"
                  >
                    <span className="hidden sm:inline">Original Document</span>
                    <span className="sm:hidden">Document</span>
                    <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                  </a>
                )}
                <button
                  onClick={() => setCertModalItem(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Image Body with scroll */}
            <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-[#F5F5F7] flex items-center justify-center">
              <img
                src={certModalItem.image}
                alt={certModalItem.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-sm bg-white select-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3 border-t border-gray-100 bg-white flex items-center justify-between text-xs text-gray-500">
              <span className="font-mono text-[11px] text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Credential &bull; ghiffa.dev</span>
              </span>
              <a
                href={certModalItem.image}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-[#FF5500] hover:underline flex items-center gap-1"
              >
                <span>Open Full Resolution</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
