import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';

// Quintic ease-in-out for silky human-like cursor acceleration & deceleration
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

// Quadratic Bézier interpolation for curved mouse trajectories
function quadBezier(t, p0, p1, p2) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

const cursorConfigs = [
  // Creative Director (Green - above top-left of main text)
  {
    id: 'cursor-director',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.315, y: 0.23 },
      { x: 0.385, y: 0.175 },
      { x: 0.275, y: 0.27 },
      { x: 0.34, y: 0.21 }
    ]
  },
  // Developer (Cyan - near left side of main text)
  {
    id: 'cursor-dev-cyan',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.29, y: 0.42 },
      { x: 0.35, y: 0.56 },
      { x: 0.26, y: 0.48 },
      { x: 0.315, y: 0.38 }
    ]
  },
  // UI Designer (Purple - near laptop on left)
  {
    id: 'cursor-ui',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.055, y: 0.40 },
      { x: 0.11, y: 0.47 },
      { x: 0.045, y: 0.34 },
      { x: 0.085, y: 0.42 }
    ]
  },
  // UX Designer (Pink - inside bottom-left wireframe card)
  {
    id: 'cursor-ux',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.215, y: 0.62 },
      { x: 0.265, y: 0.69 },
      { x: 0.185, y: 0.57 },
      { x: 0.235, y: 0.64 }
    ]
  },
  // Project Manager (Blue - top right over sustainability card)
  {
    id: 'cursor-pm',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.835, y: 0.125 },
      { x: 0.78, y: 0.21 },
      { x: 0.87, y: 0.17 },
      { x: 0.815, y: 0.14 }
    ]
  },
  // Client (Orange - bottom right above code card)
  {
    id: 'cursor-client',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.852, y: 0.50 },
      { x: 0.79, y: 0.58 },
      { x: 0.88, y: 0.54 },
      { x: 0.83, y: 0.46 }
    ]
  },
  // Yellow Developer Cursor in Hero Canvas (near center-right under title)
  {
    id: 'cursor-dev-yellow',
    containerId: 'hero-canvas',
    waypoints: [
      { x: 0.58, y: 0.52 },
      { x: 0.65, y: 0.46 },
      { x: 0.54, y: 0.60 },
      { x: 0.62, y: 0.56 }
    ]
  }
];

// Draggable Interactive Item Wrapper
function DraggableItem({ children, className = '', title = '', ...props }) {
  const ref = useRef(null);

  const onPointerDown = (e) => {
    if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
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

  // Interactive AI Mode Toggle (Default to solid black)
  const [aiActive, setAiActive] = useState(false);

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

  // Smooth 60fps Organic Multiplayer Cursors
  useEffect(() => {
    let animId;
    const agents = cursorConfigs.map((cfg, idx) => {
      const el = document.getElementById(cfg.id);
      const container = document.getElementById(cfg.containerId);
      if (!el || !container) return null;

      const startWp = cfg.waypoints[0];
      const nextWp = cfg.waypoints[1];
      const midX = (startWp.x + nextWp.x) / 2 + (Math.random() - 0.5) * 0.06;
      const midY = (startWp.y + nextWp.y) / 2 + (Math.random() - 0.5) * 0.06;

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
        stateStartTime: performance.now() + idx * 220,
        moveDuration: 2200 + Math.random() * 1100,
        pauseDuration: 650 + Math.random() * 950,
        seed: idx * 1.7 + Math.random() * 5
      };
    }).filter(Boolean);

    function animateCursors(now) {
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
          const easedT = easeInOutQuint(rawT);

          agent.currX = quadBezier(easedT, agent.fromX, agent.ctrlX, agent.toX);
          agent.currY = quadBezier(easedT, agent.fromY, agent.ctrlY, agent.toY);

          if (rawT >= 1) {
            agent.state = 'pausing';
            agent.stateStartTime = now;
            agent.pauseDuration = 500 + Math.random() * 1100;
          }
        } else if (agent.state === 'pausing') {
          if (elapsed >= agent.pauseDuration) {
            agent.fromX = agent.toX;
            agent.fromY = agent.toY;
            agent.wpIndex = (agent.wpIndex + 1) % agent.waypoints.length;
            const target = agent.waypoints[agent.wpIndex];

            agent.toX = target.x + (Math.random() - 0.5) * 0.018;
            agent.toY = target.y + (Math.random() - 0.5) * 0.018;

            const dx = agent.toX - agent.fromX;
            const dy = agent.toY - agent.fromY;
            const arc = (Math.random() - 0.5) * 0.075;
            agent.ctrlX = (agent.fromX + agent.toX) / 2 - dy * arc * 4;
            agent.ctrlY = (agent.fromY + agent.toY) / 2 + dx * arc * 4;

            agent.moveDuration = 2100 + Math.random() * 1300;
            agent.state = 'moving';
            agent.stateStartTime = now;
          }
        }

        const driftX = Math.sin(now * 0.0022 + agent.seed) * 3.5;
        const driftY = Math.cos(now * 0.0018 + agent.seed) * 3.5;

        const finalX = agent.currX * w + driftX;
        const finalY = agent.currY * h + driftY;

        agent.el.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0)`;
      });

      animId = requestAnimationFrame(animateCursors);
    }

    animId = requestAnimationFrame(animateCursors);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Word-by-Word Scroll Reveal Animation
  useEffect(() => {
    const updateScrollTextReveal = () => {
      const track = document.getElementById('scroll-text-track');
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollDistance = track.offsetHeight - windowHeight;

      const rawProgress = (-rect.top - windowHeight * 0.08) / (totalScrollDistance * 0.85 || 1);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const mainWords = document.querySelectorAll('#animated-scroll-title .reveal-word');
      const subWords = document.querySelectorAll('#animated-scroll-subtitle .reveal-subword');
      const allWords = [...mainWords, ...subWords];

      const activeTarget = Math.floor(progress * (allWords.length + 1));

      allWords.forEach((word, index) => {
        if (index < activeTarget) {
          word.classList.add('active');
        } else {
          word.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', updateScrollTextReveal, { passive: true });
    updateScrollTextReveal();

    return () => window.removeEventListener('scroll', updateScrollTextReveal);
  }, []);

  // Sync AI mode class to body
  useEffect(() => {
    if (aiActive) {
      document.body.classList.add('ai-mode-active');
    } else {
      document.body.classList.remove('ai-mode-active');
    }
  }, [aiActive]);

  const emailAddress = info?.email || 'hello@ghiffa.dev';
  const fullName = info?.name || 'Haikal Jibran Al-Ghiffarry';
  const avatarImage = info?.avatar_url || '/ghiffa.jpeg';

  return (
    <div className={`min-h-screen bg-white text-[#111111] font-sans overflow-x-clip antialiased selection:bg-blue-600 selection:text-white ${aiActive ? 'ai-mode-active' : ''}`}>
      <SEO
        title="ghiffa.dev — Custom Web Design & Development"
        description="Official portfolio of Haikal Jibran Al-Ghiffarry (ghiffa.dev). Building the bridge between bits and atoms for companies, governments, and organizations."
        url="https://ghiffa.dev/"
      />

      {/* FULL-WIDTH HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
        <div className="w-full px-6 sm:px-16 lg:px-[12.8vw] h-[72px] flex items-center justify-between">
          <a
            href="#"
            className="text-[20px] font-bold tracking-tight text-[#111111] border border-gray-800 px-1.5 py-0.5 leading-none hover:opacity-80 transition-opacity"
          >
            ghiffa.dev
          </a>
          <button
            onClick={() => openContactModal('Header Inquiry')}
            className="bg-[#18181B] hover:bg-[#2a2a2a] text-white text-[12.5px] font-medium px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Let&apos;s talk
          </button>
        </div>
      </header>

      {/* FULL-SCREEN HERO SECTION (100vw x 100vh) */}
      <section className="relative w-screen h-screen min-h-[700px] pt-[72px] bg-square-grid overflow-hidden select-none">
        
        {/* Edge-to-Edge Full Viewport Interactive Canvas */}
        <div id="hero-canvas" className="relative w-full h-full">

          {/* 1. TOP CENTER: AI Mode Toggle Pill */}
          <DraggableItem className="absolute top-[21.5%] left-1/2 -translate-x-1/2 z-30 bg-white rounded-full px-4 py-2 soft-card-shadow border border-gray-100/90 flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-800">AI Mode</span>
            <button
              onClick={() => setAiActive(!aiActive)}
              aria-label="AI Mode"
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer ${aiActive ? 'bg-[#1877F2] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200" />
            </button>
          </DraggableItem>

          {/* 2. CENTER: Giant "ghiffa.dev" inside dashed Figma bounding box */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4">
            <div id="hero-bbox" className="figma-bbox px-6 sm:px-12 pt-3 sm:pt-4 pb-4 sm:pb-6 overflow-visible">
              {/* 8 Figma resize handles */}
              <span className="figma-handle -top-1 -left-1" />
              <span className="figma-handle -top-1 left-1/2 -translate-x-1/2" />
              <span className="figma-handle -top-1 -right-1" />
              <span className="figma-handle top-1/2 -translate-y-1/2 -left-1" />
              <span className="figma-handle top-1/2 -translate-y-1/2 -right-1" />
              <span className="figma-handle -bottom-1 -left-1" />
              <span className="figma-handle -bottom-1 left-1/2 -translate-x-1/2" />
              <span className="figma-handle -bottom-1 -right-1" />

              <h1
                id="hero-title"
                className="text-[48px] sm:text-[92px] md:text-[118px] lg:text-[138px] font-bold tracking-[-0.04em] leading-[1.08] text-[#141414] select-none whitespace-nowrap block pb-1 sm:pb-2"
              >
                ghiffa.dev
              </h1>
            </div>
          </div>

          {/* 3. LIVE ROAMING MULTIPLAYER CURSORS */}
          
          {/* Creative Director (Green) */}
          <div id="cursor-director" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#1FC77E] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#1FC77E] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              Creative Director
            </div>
          </div>

          {/* Developer (Cyan) */}
          <div id="cursor-dev-cyan" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#06B6D4] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#06B6D4] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              Developer
            </div>
          </div>

          {/* UI Designer (Purple) */}
          <div id="cursor-ui" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#7B7FEF] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#7B7FEF] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              UI Designer
            </div>
          </div>

          {/* UX Designer (Pink) */}
          <div id="cursor-ux" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#F452B8] -ml-2 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#F452B8] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              UX Designer
            </div>
          </div>

          {/* Project Manager (Blue) */}
          <div id="cursor-pm" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#1D8CF8] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#1D8CF8] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              Project Manager
            </div>
          </div>

          {/* Client (Orange) */}
          <div id="cursor-client" className="live-cursor hidden md:block">
            <svg className="w-3.5 h-3.5 text-[#F05228] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#F05228] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-sm whitespace-nowrap">
              Client
            </div>
          </div>

          {/* Developer (Yellow) */}
          <div id="cursor-dev-yellow" className="live-cursor hidden sm:block">
            <svg className="w-3.5 h-3.5 text-[#F5B800] -ml-1.5 mb-0.5 drop-shadow-xs" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" />
            </svg>
            <div className="bg-[#F5B800] text-[#111111] text-[11px] font-medium px-2.5 py-0.5 rounded-[5px] shadow-xs whitespace-nowrap">
              Developer
            </div>
          </div>

          {/* 4. FLOATING TOOL ICONS (PROGRAMMING STACK + FIGMA SWAPPED) */}
          
          {/* VS Code Icon */}
          <DraggableItem className="absolute top-[15.5%] left-[22.2%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center group" title="VS Code">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
              <path d="M17.5 2L7.2 11.4L3.2 8.3L1.5 9.2V14.8L3.2 15.7L7.2 12.6L17.5 22L22.5 19.9V4.1L17.5 2ZM17.5 17.2L10.8 12L17.5 6.8V17.2Z" fill="#007ACC" />
            </svg>
          </DraggableItem>

          {/* Figma Icon (Swapped position from top-right to mid-left) */}
          <DraggableItem className="absolute top-[38.5%] left-[15.5%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center group" title="Figma">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
            </svg>
          </DraggableItem>

          {/* Next.js Icon */}
          <DraggableItem className="absolute top-[64.5%] left-[13.8%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center group" title="Next.js">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[12px] tracking-tighter group-hover:scale-110 transition-transform">N</div>
          </DraggableItem>

          {/* TypeScript Icon (Replaces WordPress at bottom-center) */}
          <DraggableItem className="absolute top-[80.5%] left-[48.1%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center group" title="TypeScript">
            <svg className="w-6 h-6 rounded-md shadow-2xs group-hover:scale-110 transition-transform" viewBox="0 0 128 128">
              <rect width="128" height="128" fill="#3178C6" rx="16" />
              <path d="M57.6 74.4h-14v39.2h-13.6v-39.2h-14v-11.8h41.6v11.8zm23.2 27.6c3.2 2.2 7.2 3.6 11.6 3.6 6.2 0 9.8-3 9.8-7.6 0-5-4.2-6.8-11.4-9.8-10.4-4.4-15.6-9.6-15.6-18.8 0-10.8 8.6-18.4 22.8-18.4 6.8 0 12.6 1.8 16.8 4.8l-4.4 10.8c-3.6-2.2-8.2-3.6-12.4-3.6-5.8 0-8.8 2.8-8.8 6.6 0 4.6 3.8 6.4 11 9.4 11.2 4.6 16.2 10.2 16.2 19.4 0 11.4-8.8 19-24.2 19-7.8 0-15-2.2-19.6-6.2l4.2-11z" fill="#FFFFFF" />
            </svg>
          </DraggableItem>

          {/* React Icon (New programming stack at top-right where Figma was) */}
          <DraggableItem className="absolute top-[15%] right-[19.8%] z-20 w-12 h-12 rounded-2xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center group" title="React">
            <svg className="w-7 h-7 text-[#00D8FE] transition-transform duration-700 group-hover:rotate-180" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
              <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
              <g stroke="#00D8FE" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
              </g>
            </svg>
          </DraggableItem>

          {/* 5. FLOATING COMMENTS */}
          <DraggableItem className="absolute top-[28.5%] right-[10%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-3 comment-shadow border border-gray-100 flex items-start gap-3 max-w-[260px]">
            <div className="w-7 h-7 rounded-full bg-[#111] text-white flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">ghiffa</div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-semibold text-gray-900">ghiffa.dev</span>
                <span className="text-gray-400">just now</span>
              </div>
              <p className="text-[12px] text-gray-800 mt-0.5 leading-snug">Let&apos;s build your new website.</p>
            </div>
          </DraggableItem>

          <DraggableItem className="absolute top-[65%] left-[52.1%] z-30 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-3 comment-shadow border border-gray-100 flex items-start gap-3 max-w-[290px]">
            <div className="w-7 h-7 rounded-full bg-[#111] text-white flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">ghiffa</div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-semibold text-gray-900">ghiffa.dev</span>
                <span className="text-gray-400">just now</span>
              </div>
              <p className="text-[12px] text-gray-800 mt-0.5 leading-snug">Custom designed and developed.</p>
            </div>
          </DraggableItem>

          {/* 6. EDGE-TO-EDGE SURROUNDING MOCKUPS */}

          {/* Top-Left Wireframe Window */}
          <DraggableItem className="hidden md:block absolute top-[20.5%] left-[1.6%] z-10 w-[185px] bg-white rounded-xl border border-gray-200 soft-card-shadow rotate-[4deg] overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
            </div>
            <div className="p-3.5 grid grid-cols-12 gap-2.5">
              <div className="col-span-4 space-y-2">
                <div className="w-7 h-7 rounded-full bg-gray-200/80" />
                <div className="w-full h-1.5 rounded bg-gray-200" />
                <div className="w-3/4 h-1.5 rounded bg-gray-200" />
              </div>
              <div className="col-span-8 grid grid-cols-2 gap-2">
                <div className="h-16 rounded bg-gray-200/80" />
                <div className="space-y-2">
                  <div className="h-7 rounded bg-gray-200/80" />
                  <div className="h-7 rounded bg-gray-200/80" />
                </div>
              </div>
            </div>
          </DraggableItem>

          {/* Middle-Left Laptop Mockup (Bleeds off left edge) */}
          <DraggableItem className="hidden lg:block absolute top-[50%] -left-[22px] z-20 w-[235px] -rotate-[4deg]">
            <div className="bg-[#111] p-2 rounded-t-xl border-2 border-gray-300 shadow-xl">
              <div className="overflow-hidden rounded-xs h-[150px] bg-zinc-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Laptop screen"
                  className="w-full h-full object-cover grayscale contrast-125 pointer-events-none select-none"
                />
              </div>
            </div>
            <div className="h-3.5 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-xl mx-[-12px] shadow-md flex items-center justify-center">
              <div className="w-10 h-1 bg-gray-500/40 rounded-full" />
            </div>
          </DraggableItem>

          {/* Bottom-Left UX Wireframe Window */}
          <DraggableItem className="hidden md:block absolute top-[65%] left-[18%] z-10 w-[188px] bg-white rounded-xl border border-gray-200 soft-card-shadow rotate-[4deg] overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
            </div>
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0" />
                <div className="w-16 h-2 rounded bg-gray-200" />
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-full h-2 rounded bg-gray-200" />
                  <div className="w-4/5 h-2 rounded bg-gray-200" />
                </div>
              </div>
              <div className="pt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0" />
                <div className="w-full h-4 rounded border border-gray-200" />
              </div>
            </div>
          </DraggableItem>

          {/* Top-Right Sustainability Mockup */}
          <DraggableItem className="hidden lg:block absolute top-[15.5%] -right-[14px] z-10 w-[235px] bg-white p-1.5 rounded-2xl border border-gray-200 soft-card-shadow -rotate-[4deg]">
            <div className="relative rounded-xl overflow-hidden h-[178px] bg-stone-800">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                alt="Custom design"
                className="w-full h-full object-cover opacity-40 pointer-events-none select-none"
              />
              <div className="absolute inset-3 bg-[#F6F4EE] rounded-lg p-3 flex flex-col items-center justify-center text-center shadow-inner border border-stone-300">
                <span className="text-[8px] uppercase tracking-widest text-stone-500 mb-1">Sustainability</span>
                <p className="font-serif text-[16px] leading-tight text-stone-800">Care today, for<br />the future</p>
                <span className="mt-2 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[7px] font-semibold">● Project</span>
              </div>
            </div>
          </DraggableItem>

          {/* Bottom-Right Code Editor Window */}
          <DraggableItem className="hidden md:block absolute top-[66.5%] right-[9.8%] z-10 w-[188px] bg-[#FAFAFA] rounded-xl border border-gray-200 soft-card-shadow -rotate-[4deg] overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-gray-200/80 flex items-center gap-1 bg-white">
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full border border-gray-300" />
            </div>
            <div className="p-3 font-mono text-[8.5px] leading-relaxed text-gray-400 select-none">
              <div>&lt;!DOCTYPE html&gt;</div>
              <div>&lt;html lang=&quot;en&quot;&gt;</div>
              <div>&lt;head&gt;</div>
              <div className="pl-2">&lt;meta charset=&quot;UTF-8&quot;&gt;</div>
              <div className="pl-2">&lt;title&gt;ghiffa.dev&lt;/title&gt;</div>
              <div>&lt;/head&gt;</div>
              <div>&lt;body&gt;</div>
              <div>&lt;/body&gt;</div>
              <div>&lt;/html&gt;</div>
            </div>
          </DraggableItem>

          {/* Middle-Right 3D Chair Smartphone Mockup */}
          <DraggableItem className="hidden lg:block absolute top-[49.5%] right-[12px] z-20 w-[112px] bg-[#141414] p-1.5 rounded-[24px] shadow-xl rotate-[4deg]">
            <div className="bg-white rounded-[19px] h-[205px] flex flex-col items-center justify-between p-2.5 relative overflow-hidden">
              <div className="w-8 h-2 bg-black rounded-full" />
              <div className="my-auto flex flex-col items-center">
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=300&q=80"
                  alt="3D Mobile View"
                  className="w-20 h-24 object-contain pointer-events-none select-none"
                />
              </div>
              <div className="pb-1 text-gray-500">
                <svg className="w-6 h-4" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M3 5C1 6.5 1 9.5 5 11C9 12.5 15 12.5 19 11C23 9.5 23 6.5 21 5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </DraggableItem>

        </div>
      </section>

      {/* 2. STICKY SCROLL-ANIMATED TEXT SECTION */}
      <section id="scroll-text-track" className="relative h-[260vh] bg-white bg-dot-matrix">

        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6">
          <div className="max-w-[960px] mx-auto text-center relative z-10">
            {/* Main Animated Headline: ALL words start in faded gray (#ECEEEF) */}
            <h2 id="animated-scroll-title" className="text-[38px] sm:text-[56px] md:text-[68px] lg:text-[76px] font-bold tracking-[-0.035em] leading-[1.08]">
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
            <p id="animated-scroll-subtitle" className="mt-10 text-[18px] sm:text-[23px] font-semibold tracking-[-0.015em] leading-[1.35] max-w-[520px] mx-auto">
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

      {/* 2.5 ABOUT ME SECTION (CLEAN FIGMA CANVAS STYLE) */}
      <section id="about" className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto relative select-none">
        
        {/* Minimalist Figma Frame Identifier */}
        <div className="flex items-center justify-between pb-4 mb-10 border-b border-gray-200 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-semibold"># About</span>
            <span className="text-gray-300">/</span>
            <span>Profile &amp; Background</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-gray-600 font-sans font-medium text-[11.5px]">Available for projects</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: Portrait in a crisp, clean frame */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Photo Container */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 bg-gray-50 aspect-[4/5] shadow-xs">
                <img
                  src={avatarImage}
                  alt={fullName}
                  className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-[1.01] transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/ghiffa.jpeg';
                  }}
                />

                {/* Minimalist Figma User Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0D99FF] text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-xs shadow-sm pointer-events-none">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M4 0l16 12-7 2-4 10z" />
                  </svg>
                  <span>ghiffa</span>
                </div>
              </div>

              {/* Clean caption below photo */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>{fullName}</span>
                <span>Kuningan, Indonesia</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Story, Specs, and Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold mb-2">
                // ABOUT ME
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] leading-[1.18]">
                Designing &amp; engineering where hardware meets the web.
              </h2>
            </div>

            <div className="space-y-4 text-[15px] leading-relaxed text-gray-600">
              <p>
                I&apos;m <strong>Haikal Jibran Al-Ghiffarry</strong>, an IoT Engineer and Fullstack Web Developer based in Kuningan, Indonesia. I build end-to-end systems that bridge physical microcontrollers, sensors, and firmware with modern, responsive web software.
              </p>
              <p>
                Rather than treating hardware and the web as separate worlds, I work across the full stack: from embedded firmware (ESP32, Arduino) and communication protocols to cloud databases and reactive user interfaces built with React and Next.js.
              </p>
              <p>
                I am also the founder of <strong>Skillstreak.id</strong>, an interactive platform designed to help developers build consistent daily coding habits.
              </p>
            </div>

            {/* Clean Specs Grid */}
            <div className="pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">DISCIPLINE</span>
                <p className="text-sm font-medium text-gray-900">IoT Embedded &amp; Fullstack Web</p>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">TECH STACK</span>
                <p className="text-sm font-medium text-gray-900">React, Next.js, TypeScript, ESP32, Supabase</p>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">EDUCATION</span>
                <p className="text-sm font-medium text-gray-900">Teknik Informatika · Universitas Kuningan</p>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">VENTURE</span>
                <p className="text-sm font-medium text-gray-900">Skillstreak.id (Founder)</p>
              </div>
            </div>

            {/* Clean CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openContactModal('About Me & Collaboration')}
                className="bg-[#141414] hover:bg-black text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer"
              >
                Let&apos;s build together
              </button>
              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-black text-gray-700 hover:text-black font-medium text-[13px] px-5 py-2 rounded-full transition-colors"
              >
                <span>Get in touch</span>
                <span className="font-mono text-xs">&rarr;</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 3. THREE ROYAL BLUE GRID SERVICE CARDS */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service Card 1 */}
          <div className="flex flex-col">
            <div className="bg-royal-blue-grid rounded-2xl p-8 sm:p-10 text-white min-h-[380px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[26px] font-bold leading-[1.18] tracking-tight mb-5">
                  Experience &amp;<br />interface design
                </h3>
                <p className="text-white/85 text-[14.5px] leading-relaxed">
                  Users are at the center of our experience creation process. We design pixel-by-pixel relevant digital products that people love to use.
                </p>
              </div>
              <div className="relative z-10 pt-8">
                <span className="inline-block w-8 h-[1.5px] bg-white/40 group-hover:w-14 transition-all" />
              </div>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-4 leading-relaxed pr-2">
              Our design thinking process helps empower your project from day zero.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="flex flex-col">
            <div className="bg-royal-blue-grid rounded-2xl p-8 sm:p-10 text-white min-h-[380px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[26px] font-bold leading-[1.18] tracking-tight mb-5">
                  Custom website<br />development
                </h3>
                <p className="text-white/85 text-[14.5px] leading-relaxed">
                  Our team specializes in developing fully self-manageable websites built on the latest technologies to achieve top performance, quality, and security.
                </p>
              </div>
              <div className="relative z-10 pt-8">
                <span className="inline-block w-8 h-[1.5px] bg-white/40 group-hover:w-14 transition-all" />
              </div>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-4 leading-relaxed pr-2">
              Every development is tailored to each client following international standards.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="flex flex-col">
            <div className="bg-royal-blue-grid rounded-2xl p-8 sm:p-10 text-white min-h-[380px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[26px] font-bold leading-[1.18] tracking-tight mb-5">
                  Tailored digital<br />services
                </h3>
                <p className="text-white/85 text-[14.5px] leading-relaxed">
                  We take care of all the technical aspects every project requires: infrastructure, security, continuous support, and supervision over every detail.
                </p>
              </div>
              <div className="relative z-10 pt-8">
                <span className="inline-block w-8 h-[1.5px] bg-white/40 group-hover:w-14 transition-all" />
              </div>
            </div>
            <p className="text-[12.5px] text-gray-500 mt-4 leading-relaxed pr-2">
              Your website, our responsibility. Long-term partnerships tailored to each client.
            </p>
          </div>

        </div>
      </section>

      {/* 4. "FROM ZERO TO ONE" SECTION WITH BLUE SCREEN LAPTOP MOCKUP */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="rounded-[28px] bg-[#F5F6F8] border border-gray-200/70 overflow-hidden pt-12 pb-12 pl-8 sm:pl-16 pr-8 sm:pr-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Copy & Blue Pill CTA */}
            <div className="lg:col-span-6 space-y-5 pr-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-gray-400">
                // OUR METHODOLOGY &amp; PROCESS
              </div>
              <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight text-[#141414] leading-tight">
                From zero to one
              </h2>
              <p className="text-gray-600 text-[15px] leading-relaxed max-w-md">
                We work under a collaborative methodology that allows us to build high-quality digital products designed specifically around our clients&apos; goals.
              </p>
              <p className="text-gray-500 text-[13.5px] leading-relaxed max-w-md">
                From initial architecture and wireframing to custom code deployment, we bridge the gap between bits and atoms.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => openContactModal('From zero to one')}
                  className="bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium text-[13px] px-7 py-3 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Start a project
                </button>
              </div>
            </div>

            {/* Right Bleed Laptop Mockup with Royal Blue Grid Screen */}
            <div className="lg:col-span-6 flex justify-end">
              <div className="w-full max-w-[520px] lg:translate-x-6">
                <div className="bg-[#141414] p-3 rounded-t-2xl border-2 border-gray-300 shadow-2xl">
                  {/* Camera notch */}
                  <div className="w-12 h-1.5 bg-black mx-auto rounded-b-md mb-1" />
                  {/* Blue Grid Display */}
                  <div className="bg-royal-blue-grid h-[260px] sm:h-[300px] rounded-lg p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between text-white/60 text-xs font-mono">
                      <span>ghiffa.dev // workspace</span>
                      <span>v2.5</span>
                    </div>
                    <div className="my-auto text-center">
                      <div className="inline-block border border-dashed border-white/40 px-5 py-2.5">
                        <span className="text-white font-bold text-2xl sm:text-3xl tracking-tight">bits &amp; atoms.</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/70 font-mono">
                      <span>STATUS: PRODUCTION READY</span>
                      <span>100% CUSTOM</span>
                    </div>
                  </div>
                </div>
                <div className="h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-2xl -mx-4 shadow-md flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-gray-500/40 rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <p className="text-[11.5px] text-gray-400 mt-4 pl-2">
          * Every project includes dedicated UX/UI design, full-stack engineering, and QA testing.
        </p>
      </section>

      {/* 5. "A TEAM THAT LOVES THE INTERNET" INTERACTIVE CANVAS SECTION */}
      <section className="relative py-28 bg-square-grid overflow-hidden border-t border-b border-gray-100 my-10">
        <div className="max-w-[1360px] mx-auto px-6 relative min-h-[460px] flex flex-col items-center justify-center">

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
          <div className="text-center z-10 max-w-3xl px-4">
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#141414] leading-tight">
              A team that{' '}
              <span className="relative inline-block bg-[#DCE8FF] text-[#141414] px-3 py-0.5 mx-1 border border-[#3B82F6]">
                {/* Corner selection squares */}
                <span className="w-2 h-2 bg-white border border-[#3B82F6] absolute -top-1 -left-1" />
                <span className="w-2 h-2 bg-white border border-[#3B82F6] absolute -top-1 -right-1" />
                <span className="w-2 h-2 bg-white border border-[#3B82F6] absolute -bottom-1 -left-1" />
                <span className="w-2 h-2 bg-white border border-[#3B82F6] absolute -bottom-1 -right-1" />
                loves the internet.
              </span>
            </h2>
            <div className="mt-8">
              <button
                onClick={() => openContactModal('Meet the team')}
                className="bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium text-[13px] px-7 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
              >
                Meet our studio
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. "DETAILS ARE NOT DETAILS" SECTION WITH LAYERED PORTRAIT CARDS */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-3xl sm:text-[42px] font-bold tracking-tight text-[#141414] leading-[1.12]">
              Details are<br />not details
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              They make the product. We obsess over micro-interactions, typography, accessibility, and millisecond load times so your brand stands out effortlessly.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openContactModal('Design & Craft')}
                className="bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-all cursor-pointer"
              >
                See our craft &rarr;
              </button>
            </div>
          </div>

          {/* Right Layered Visual Cards */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px]">
            {/* Left tilted background card */}
            <div className="w-44 sm:w-52 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg -rotate-6 -mr-10 z-10 border border-gray-200 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80" alt="Detail 1" className="w-full h-full object-cover opacity-85" />
            </div>

            {/* Center main portrait card */}
            <div className="w-56 sm:w-64 h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl z-20 border-2 border-white bg-zinc-950 relative">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80" alt="Main Portrait" className="w-full h-full object-cover contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-mono">Pixel Precision</span>
                <p className="text-sm font-semibold mt-0.5">Crafted for human connection</p>
              </div>
            </div>

            {/* Right tilted background card */}
            <div className="w-44 sm:w-52 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg rotate-6 -ml-10 z-10 border border-gray-200 bg-zinc-900">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80" alt="Detail 2" className="w-full h-full object-cover opacity-85" />
            </div>

            {/* Floating Comment Tag Top-Right */}
            <div className="hidden sm:flex items-center gap-2.5 absolute top-6 right-8 z-30 bg-white px-3.5 py-2 rounded-xl comment-shadow border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0055FF]" />
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
      <section className="py-12 border-t border-b border-gray-100 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-8 opacity-45 grayscale">
          <span className="text-lg font-bold tracking-tight">VERCEL</span>
          <span className="text-lg font-bold tracking-widest">STRIPE</span>
          <span className="text-lg font-semibold font-serif italic">Chronicle</span>
          <span className="text-lg font-extrabold tracking-tighter">LINEAR</span>
          <span className="text-lg font-mono font-bold">SUPABASE</span>
          <span className="text-lg font-bold tracking-tight">RAYCAST</span>
          <span className="text-lg font-semibold">NOTION</span>
        </div>
      </section>

      {/* 8. THREE INSIGHTS / ARTICLES CARDS */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold mb-1">
              // PERSPECTIVES &amp; DISPATCHES
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#141414]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Article 1 */}
          <article
            className="group cursor-pointer"
            onClick={() => openContactModal('Design Systems')}
          >
            <div className="h-56 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#0055FF] transition-colors">
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
            <div className="h-56 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.35),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#0055FF] transition-colors">
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
            <div className="h-56 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-red-700 via-rose-900 to-neutral-950 relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,rgba(251,113,133,0.3),transparent_60%)] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-[18px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#0055FF] transition-colors">
              Bridging Bits and Atoms in the Age of AI
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Blending physical brand identity with intelligent digital interfaces that adapt to every user.
            </p>
          </article>
        </div>
      </section>

      {/* 9. BOTTOM "LET'S BUILD A PROJECT TOGETHER" CTA SECTION */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Mini Floating Collage */}
          <div className="lg:col-span-6 relative min-h-[280px] bg-square-grid rounded-3xl border border-gray-100 p-6 flex items-center justify-center overflow-hidden">
            {/* Handwritten style note */}
            <div className="absolute top-6 left-8 -rotate-6 font-serif italic text-blue-600 text-lg">
              Let&apos;s launch! &nearr;
            </div>

            {/* Mini photo 1 */}
            <div className="w-40 h-28 rounded-xl overflow-hidden shadow-md rotate-3 border-2 border-white bg-zinc-800 z-10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                alt="Collaboration"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mini photo 2 */}
            <div className="w-36 h-24 rounded-xl overflow-hidden shadow-lg -rotate-6 -ml-6 mt-16 border-2 border-white bg-zinc-900 z-20">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
                alt="Code"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating tool badges */}
            <div className="absolute bottom-6 left-10 w-9 h-9 rounded-xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">&lt;/&gt;</span>
            </div>
            <div className="absolute top-8 right-12 w-9 h-9 rounded-xl bg-white soft-card-shadow border border-gray-100 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
            </div>
          </div>

          {/* Right CTA Heading & Button */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-3xl sm:text-[44px] font-bold tracking-tight text-[#141414] leading-[1.12]">
              Let&apos;s build a<br />project together
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
              Tell us about your vision, timeline, and goals. Our team is ready to design and engineer your next flagship web experience.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => openContactModal('New Project')}
                className="bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium text-[13.5px] px-8 py-3 rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Let&apos;s talk
              </button>
              <a href={`mailto:${emailAddress}`} className="text-xs text-gray-400 font-mono hover:text-black transition-colors">
                {emailAddress}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200/80 py-12 px-6 sm:px-16 lg:px-28 text-xs text-gray-500">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#111111]">ghiffa.dev</div>
            <p>2008&ndash;2026 All rights reserved. ghiffa.dev &mdash; Custom Web Design &amp; Development Studio.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-gray-600">
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

    </div>
  );
}
