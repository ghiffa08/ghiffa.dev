import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import ReactMarkdown from 'react-markdown';

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

  // Contact Modal
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Skillstreak.id Banner Section Dark Mode & Mockup Screen State
  const [isBannerDark, setIsBannerDark] = useState(false);
  const [bannerScreenMode, setBannerScreenMode] = useState('desktop'); // 'desktop' or 'blueprint'
  const bannerRef = useRef(null);

  // Scroll-triggered dark mode for Skillstreak.id banner section
  useEffect(() => {
    const handleBannerScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the banner enters the central focal reading range of the viewport
      const isInFocalRange = rect.top < windowHeight * 0.70 && rect.bottom > windowHeight * 0.30;
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
      document.body.style.backgroundColor = '#000000';
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

  // Smooth Stacking Card Parallax & Scale Effect (Cards emerge from behind)
  useEffect(() => {
    let ticking = false;
    const updateStackAnimation = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cardAbout = document.getElementById('stack-card-about');
          const cardJourney = document.getElementById('stack-card-journey');
          const cardCredentials = document.getElementById('stack-card-credentials') || document.getElementById('stack-card-projects');

          if (!cardAbout || !cardJourney) {
            ticking = false;
            return;
          }

          if (window.innerWidth >= 1024) {
            const vh = window.innerHeight;
            const stickyTop = 84;

            // Card 1 (About) scales as Card 2 (Journey) approaches and stacks
            const rectJourney = cardJourney.getBoundingClientRect();
            if (rectJourney.top < vh && rectJourney.top > stickyTop) {
              const progress = (vh - rectJourney.top) / (vh - stickyTop);
              const scale = 1 - progress * 0.04;
              const brightness = 1 - progress * 0.08;
              cardAbout.style.transform = `scale(${scale.toFixed(4)})`;
              cardAbout.style.filter = `brightness(${brightness.toFixed(3)})`;
              cardAbout.style.transformOrigin = 'center top';
            } else if (rectJourney.top <= stickyTop) {
              cardAbout.style.transform = 'scale(0.96)';
              cardAbout.style.filter = 'brightness(0.92)';
            } else {
              cardAbout.style.transform = 'scale(1)';
              cardAbout.style.filter = 'brightness(1)';
            }

            // Card 2 (Journey) scales as Card 3 (Credentials) approaches and stacks
            if (cardCredentials) {
              const rectCreds = cardCredentials.getBoundingClientRect();
              if (rectCreds.top < vh && rectCreds.top > stickyTop + 12) {
                const progress3 = (vh - rectCreds.top) / (vh - (stickyTop + 12));
                const scale3 = 1 - progress3 * 0.04;
                const brightness3 = 1 - progress3 * 0.08;
                cardJourney.style.transform = `scale(${scale3.toFixed(4)})`;
                cardJourney.style.filter = `brightness(${brightness3.toFixed(3)})`;
                cardJourney.style.transformOrigin = 'center top';
              } else if (rectCreds.top <= stickyTop + 12) {
                cardJourney.style.transform = 'scale(0.96)';
                cardJourney.style.filter = 'brightness(0.92)';
              } else {
                cardJourney.style.transform = 'scale(1)';
                cardJourney.style.filter = 'brightness(1)';
              }
            }
          } else {
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
  const avatarImage = info?.avatar_url || '/ghiffa.jpeg';
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

  return (
    <div
      className={`min-h-screen font-sans overflow-x-clip antialiased selection:bg-blue-600 selection:text-white transition-colors duration-700 ease-in-out ${
        isBannerDark ? 'bg-black text-white' : 'bg-white text-[#111111]'
      } ${aiActive ? 'ai-mode-active' : ''}`}
    >
      <SEO
        title="ghiffa.dev — Custom Web Design & Development"
        description="Official portfolio of Haikal Jibran Al-Ghiffarry (ghiffa.dev). Building the bridge between bits and atoms for companies, governments, and organizations."
        url="https://ghiffa.dev/"
      />

      {/* FULL-WIDTH HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-700 ease-in-out ${
          isBannerDark
            ? 'bg-black/85 border-white/10 text-white'
            : 'bg-white/95 border-gray-100/80 text-[#111111]'
        }`}
      >
        <div className="w-full px-6 sm:px-16 lg:px-[12.8vw] h-[72px] flex items-center justify-between">
          <a
            href="#"
            className={`text-[20px] font-bold tracking-tight border px-1.5 py-0.5 leading-none transition-colors duration-700 ${
              isBannerDark
                ? 'text-white border-white/80 hover:text-gray-300'
                : 'text-[#111111] border-gray-800 hover:opacity-80'
            }`}
          >
            ghiffa.dev
          </a>
          <button
            onClick={() => openContactModal('Header Inquiry')}
            className={`text-[12.5px] font-medium px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-xs ${
              isBannerDark
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-[#18181B] text-white hover:bg-[#2a2a2a]'
            }`}
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
          <DraggableItem className="hidden lg:block absolute top-[46%] -left-[20px] z-20 w-[315px] -rotate-[3deg]">
            <div
              className="bg-[#141416] p-2.5 rounded-t-xl border border-gray-300/80 shadow-2xl overflow-hidden"
              style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              {/* Camera notch */}
              <div className="w-10 h-1.5 bg-black mx-auto rounded-b-xs mb-1.5" />
              <div className="overflow-hidden rounded-sm aspect-[16/10] bg-zinc-950 relative shadow-inner">
                <img
                  src="/skillstreak-dekstop.png"
                  alt="Skillstreak Desktop Platform"
                  className="w-full h-full object-cover object-top pointer-events-none select-none"
                  style={{ transform: 'translateZ(0)' }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
            <div className="h-3.5 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-xl mx-[-10px] shadow-md flex items-center justify-center">
              <div className="w-14 h-1 bg-gray-500/40 rounded-full" />
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

      {/* 2.25 THREE ROYAL BLUE GRID SERVICE CARDS (Above About / Stacking Cards) */}
      <section id="services" className="py-20 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto">
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

      {/* 2.5 FIGMA WORKSPACE CANVAS: STACKING CARDS WRAPPER */}
      <section id="workspace-stack" className="relative w-full py-16 px-4 sm:px-6 lg:px-12 bg-square-grid border-y border-gray-200/80">

        {/* Canvas Stack Header */}
        <div className="max-w-[1360px] mx-auto mb-8 flex items-center justify-between text-xs font-mono text-gray-500 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0D99FF] animate-pulse" />
            <span className="font-semibold text-gray-800">Figma Canvas Workspace</span>
            <span className="text-gray-300">/</span>
            <span>Interactive Stacking Artboards</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400">
            <span>Scroll to stack artboards</span>
            <span>&darr;</span>
          </div>
        </div>

        <div className="max-w-[1360px] mx-auto">

          {/* CARD 1: ABOUT ME */}
          <div
            id="stack-card-about"
            className="lg:sticky lg:top-[84px] z-10 transition-all duration-200 will-change-transform"
          >
            <div id="about" className="absolute -top-24" />

            {/* Figma Workspace Window */}
            <div className="figma-stack-card bg-white rounded-2xl border border-gray-200/90 shadow-xl overflow-hidden">

              {/* 1. FIGMA TOP TOOLBAR / APP BAR */}
              <div className="h-11 bg-[#F9FAFB] border-b border-gray-200/80 px-4 flex items-center justify-between text-xs select-none">

                {/* Left: Figma Icon + Breadcrumb */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-5" viewBox="0 0 38 57" fill="none">
                      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                    </svg>
                    <span className="font-semibold text-gray-900">ghiffa.fig</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-500 font-mono text-[11px]">About Me</span>
                  </div>
                </div>

                {/* Center: Real Figma Tools (Move V, Frame F, Rectangle R, Text T, Comment C) */}
                <div className="hidden md:flex items-center gap-1 bg-gray-200/60 p-0.5 rounded-lg">
                  <div className="w-7 h-7 rounded flex items-center justify-center bg-white shadow-2xs text-[#0D99FF]" title="Move (V)">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Frame (F)">
                    <span className="font-mono text-[12px] font-bold">#</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Rectangle (R)">
                    <div className="w-3 h-3 border border-current rounded-xs" />
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Text (T)">
                    <span className="font-serif font-bold text-[12px]">T</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Comment (C)">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6l-3.5 3V3z" />
                    </svg>
                  </div>
                </div>

                {/* Right: Multiplayer Presence + Zoom + Share */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-1.5" title="Collaborators active">
                    <div className="w-6 h-6 rounded-full bg-[#0D99FF] text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">H</div>
                    <div className="w-6 h-6 rounded-full bg-[#1FC77E] text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">CD</div>
                    <div className="w-6 h-6 rounded-full bg-[#F452B8] text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">UX</div>
                  </div>

                  <span className="hidden sm:inline font-mono text-[11px] text-gray-400">100%</span>

                  <button
                    onClick={() => openContactModal('About Me & Collaboration')}
                    className="bg-[#0D99FF] hover:bg-[#0b82d8] text-white text-[11.5px] font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>Share</span>
                  </button>
                </div>

              </div>

              {/* 2. MAIN WORKSPACE: CANVAS (LEFT) + FIGMA INSPECTOR SIDEBAR (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">

                {/* CANVAS AREA (lg:col-span-8) */}
                <div className="lg:col-span-8 bg-square-grid p-6 sm:p-10 lg:p-12 relative flex flex-col justify-center">

                  {/* Floating Figma Comment Bubble */}
                  <DraggableItem className="hidden md:flex absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-2.5 max-w-[270px]">
                    <div className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">ghiffa</div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-gray-900">ghiffa.dev</span>
                        <span className="text-gray-400">just now</span>
                      </div>
                      <p className="text-[12px] text-gray-800 mt-0.5 leading-snug">
                        Translating digital bits into real-world atoms.
                      </p>
                    </div>
                  </DraggableItem>

                  {/* Selected Figma Artboard Frame */}
                  <div className="relative">

                    {/* Frame Name Tag at Top-Left */}
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="inline-flex items-center gap-1 bg-[#0D99FF] text-white text-[10.5px] font-medium font-mono px-2 py-0.5 rounded shadow-2xs">
                        # About Me
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        880 &times; 520
                      </span>
                    </div>

                    {/* The White Frame Canvas Box with Figma Selection Border & Handles */}
                    <div className="figma-bbox bg-white rounded-xl p-6 sm:p-8 md:p-10 shadow-sm border border-[#0D99FF] relative">

                      {/* 8 Figma resize handles */}
                      <span className="figma-handle !border-[#0D99FF] -top-1 -left-1" />
                      <span className="figma-handle !border-[#0D99FF] -top-1 left-1/2 -translate-x-1/2" />
                      <span className="figma-handle !border-[#0D99FF] -top-1 -right-1" />
                      <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -left-1" />
                      <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -right-1" />
                      <span className="figma-handle !border-[#0D99FF] -bottom-1 -left-1" />
                      <span className="figma-handle !border-[#0D99FF] -bottom-1 left-1/2 -translate-x-1/2" />
                      <span className="figma-handle !border-[#0D99FF] -bottom-1 -right-1" />

                      {/* Headline */}
                      <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#141414] tracking-tight leading-[1.2] mb-8">
                        {aboutHeadline}
                      </h2>

                      {/* Split: Avatar on left + Story Bio on right */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">

                        {/* Photo */}
                        <div className="sm:col-span-5 space-y-3">
                          <div className="relative rounded-xl overflow-hidden border border-gray-200/80 aspect-[4/5] bg-gray-100 group">
                            <img
                              src={avatarImage}
                              alt={fullName}
                              className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/ghiffa.jpeg';
                              }}
                            />
                            {/* Cursor pointing at photo */}
                            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-[#0D99FF] text-white text-[10px] font-medium font-mono px-2 py-0.5 rounded shadow-sm">
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                              <span>ghiffa</span>
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-900 text-[14px]">{fullName}</div>
                            <div className="text-gray-500 text-[12px]">{roleTitle}</div>
                            <div className="text-gray-400 text-[11px] font-mono mt-0.5">&bull; Kuningan, Indonesia</div>
                          </div>
                        </div>

                        {/* Bio Story from database (ReactMarkdown) */}
                        <div className="sm:col-span-7 text-[14px] leading-relaxed text-gray-600 space-y-3 font-normal [&>p]:leading-relaxed [&>strong]:text-gray-900 [&>strong]:font-semibold">
                          {aboutBio ? (
                            <ReactMarkdown>{aboutBio}</ReactMarkdown>
                          ) : (
                            <p>Building scalable web architectures and resilient IoT hardware systems.</p>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* FIGMA DESIGN INSPECTOR SIDEBAR (lg:col-span-4) */}
                <div className="lg:col-span-4 bg-[#F9FAFB] border-t lg:border-t-0 lg:border-l border-gray-200/90 p-6 sm:p-7 space-y-6 flex flex-col justify-between">

                  <div className="space-y-6">

                    {/* Tabs: Design / Prototype / Inspect */}
                    <div className="flex items-center gap-5 border-b border-gray-200 pb-3 text-xs font-medium">
                      <span className="text-[#0D99FF] font-semibold border-b-2 border-[#0D99FF] pb-3 -mb-3">Design</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Prototype</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Inspect</span>
                    </div>

                    {/* Section: Frame Info */}
                    <div className="space-y-2.5 text-xs">
                      <div className="text-[11px] font-semibold text-gray-700">Frame</div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                          <span className="text-gray-400">W</span>
                          <span className="text-gray-800 font-medium">880</span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                          <span className="text-gray-400">H</span>
                          <span className="text-gray-800 font-medium">Auto</span>
                        </div>
                      </div>
                    </div>

                    {/* Section: Status */}
                    <div className="space-y-2 text-xs border-t border-gray-200/70 pt-4">
                      <div className="text-[11px] font-semibold text-gray-700">Status</div>
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1.5 rounded-lg font-medium text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{availabilityStatus}</span>
                      </div>
                    </div>

                    {/* Section: Skills & Tech Stack (Dynamic from database) */}
                    {skillsList.length > 0 && (
                      <div className="space-y-2.5 border-t border-gray-200/70 pt-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-semibold text-gray-700">Component Variants ({skillsList.length})</span>
                          <span className="text-[10px] text-gray-400 font-mono">Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {skillsList.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-white border border-gray-200/90 text-gray-800 text-[11px] font-mono shadow-2xs hover:border-[#0D99FF] transition-colors cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Section: Export & CTAs */}
                  <div className="border-t border-gray-200/70 pt-5 space-y-2.5">
                    <div className="text-[11px] font-semibold text-gray-700 mb-2">Export</div>

                    <button
                      onClick={() => openContactModal('About Me Inquiry')}
                      className="w-full bg-[#18181B] hover:bg-black text-white text-xs font-medium py-2.5 rounded-lg transition-all active:scale-98 cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Let&apos;s build together</span>
                    </button>

                    {cvUrl && (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Download CV (PDF)</span>
                        <span className="text-xs">&darr;</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${emailAddress}`}
                      className="w-full inline-flex items-center justify-center gap-1 text-gray-500 hover:text-black text-[11.5px] font-medium py-1 transition-colors"
                    >
                      <span>{emailAddress}</span>
                      <span>&rarr;</span>
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* CARD 2: PROFESSIONAL JOURNEY */}
          <div
            id="stack-card-journey"
            className="lg:sticky lg:top-[96px] z-20 transition-all duration-200 will-change-transform mt-12 lg:mt-24"
          >
            <div id="journey" className="absolute -top-24" />
            <div id="experience" className="absolute -top-24" />

            {/* Figma Workspace Window */}
            <div className="figma-stack-card bg-white rounded-2xl border border-gray-200/90 shadow-2xl overflow-hidden">

              {/* 1. FIGMA TOP TOOLBAR / APP BAR */}
              <div className="h-11 bg-[#F9FAFB] border-b border-gray-200/80 px-4 flex items-center justify-between text-xs select-none">

                {/* Left: Figma Icon + Breadcrumb */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-5" viewBox="0 0 38 57" fill="none">
                      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                    </svg>
                    <span className="font-semibold text-gray-900">ghiffa.fig</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-500 font-mono text-[11px]">Professional Journey</span>
                  </div>
                </div>

                {/* Center: Real Figma Tools (Move V, Frame F, Component ❖, Text T, Comment C) */}
                <div className="hidden md:flex items-center gap-1 bg-gray-200/60 p-0.5 rounded-lg">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Move (V)">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Frame (F)">
                    <span className="font-mono text-[12px] font-bold">#</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center bg-white shadow-2xs text-[#7B7FEF]" title="Component (❖)">
                    <span className="text-[12px] font-bold">❖</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Text (T)">
                    <span className="font-serif font-bold text-[12px]">T</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Comment (C)">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6l-3.5 3V3z" />
                    </svg>
                  </div>
                </div>

                {/* Right: Layer Counter + Share */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
                    {experiencesList.length} Instances
                  </span>
                  <button
                    onClick={() => openContactModal('Professional Journey & Career')}
                    className="bg-[#0D99FF] hover:bg-[#0b82d8] text-white text-[11.5px] font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>Connect</span>
                  </button>
                </div>

              </div>

              {/* 2. MAIN WORKSPACE: CANVAS (LEFT) + FIGMA INSPECTOR SIDEBAR (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">

                {/* CANVAS AREA (lg:col-span-8) */}
                <div className="lg:col-span-8 bg-square-grid p-6 sm:p-10 lg:p-12 relative flex flex-col justify-center">

                  {/* Floating Figma Comment Bubble */}
                  <DraggableItem className="hidden md:flex absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-2.5 max-w-[270px]">
                    <div className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">ghiffa</div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-gray-900">ghiffa.dev</span>
                        <span className="text-gray-400">verified</span>
                      </div>
                      <p className="text-[12px] text-gray-800 mt-0.5 leading-snug">
                        Building production web apps &amp; systems since 2023.
                      </p>
                    </div>
                  </DraggableItem>

                  {/* Canvas Frame Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="inline-flex items-center gap-1 bg-[#0D99FF] text-white text-[10.5px] font-medium font-mono px-2 py-0.5 rounded shadow-2xs">
                        # Frame: Career Timeline
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        &darr; Auto Layout &bull; Gap: 16px
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#141414] tracking-tight leading-[1.2]">
                      Professional Journey
                    </h2>
                    <p className="text-gray-500 text-[13.5px] sm:text-[14px] mt-1">
                      Proven experience in full-stack web applications, internal enterprise APIs, and system design.
                    </p>
                  </div>

                  {/* Auto Layout Stack of Experience Cards */}
                  <div className="space-y-4">
                    {experiencesList.map((exp, idx) => {
                      const isSelected = selectedExpIdx === idx;
                      return (
                        <div
                          key={exp.id || idx}
                          onClick={() => setSelectedExpIdx(idx)}
                          className={`relative rounded-xl p-5 sm:p-6 transition-all cursor-pointer ${isSelected
                            ? 'figma-bbox bg-white shadow-sm border border-[#0D99FF]'
                            : 'bg-white/90 hover:bg-white border border-gray-200/80 hover:border-gray-300 shadow-2xs'
                            }`}
                        >
                          {/* 8 Figma resize handles on selected item */}
                          {isSelected && (
                            <>
                              <span className="figma-handle !border-[#0D99FF] -top-1 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] -top-1 left-1/2 -translate-x-1/2" />
                              <span className="figma-handle !border-[#0D99FF] -top-1 -right-1" />
                              <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -right-1" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 left-1/2 -translate-x-1/2" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 -right-1" />

                              {/* Cursor badge on active card */}
                              <div className="absolute -bottom-2.5 -right-2 flex items-center gap-1 bg-[#0D99FF] text-white text-[10px] font-medium font-mono px-2 py-0.5 rounded shadow-xs select-none z-10">
                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                                <span>ghiffa</span>
                              </div>
                            </>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[#0D99FF] font-mono text-xs">❖</span>
                              <h3 className="font-semibold text-gray-900 text-[15px] sm:text-[16px]">
                                {exp.company}
                              </h3>
                            </div>
                            <span className="font-mono text-[11px] sm:text-[12px] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200/60 font-medium self-start sm:self-auto">
                              {exp.period}
                            </span>
                          </div>

                          <div className="text-[13.5px] font-medium text-[#0D99FF] mb-2">
                            {exp.role}
                          </div>

                          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-gray-600 font-normal">
                            {exp.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* FIGMA DESIGN INSPECTOR SIDEBAR (lg:col-span-4) */}
                <div className="lg:col-span-4 bg-[#F9FAFB] border-t lg:border-t-0 lg:border-l border-gray-200/90 p-6 sm:p-7 space-y-6 flex flex-col justify-between">

                  <div className="space-y-6">

                    {/* Tabs: Layers / Design / Inspect */}
                    <div className="flex items-center gap-5 border-b border-gray-200 pb-3 text-xs font-medium">
                      <span className="text-[#0D99FF] font-semibold border-b-2 border-[#0D99FF] pb-3 -mb-3">Layers</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Design</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Inspect</span>
                    </div>

                    {/* Section: Layer Tree */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-gray-700 flex items-center justify-between">
                        <span>Component Tree</span>
                        <span className="text-[10px] text-gray-400 font-mono">{experiencesList.length} Items</span>
                      </div>
                      <div className="space-y-1">
                        {experiencesList.map((exp, idx) => {
                          const isSelected = selectedExpIdx === idx;
                          return (
                            <button
                              key={exp.id || idx}
                              onClick={() => setSelectedExpIdx(idx)}
                              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${isSelected
                                ? 'bg-[#0D99FF]/10 text-[#0D99FF] font-medium border border-[#0D99FF]/30'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <span className="text-[11px]">❖</span>
                                <span className="truncate">{exp.company}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-400 shrink-0">
                                #{exp.order_index || idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section: Active Selection Properties */}
                    {activeExp && (
                      <div className="space-y-2.5 text-xs border-t border-gray-200/70 pt-4">
                        <div className="text-[11px] font-semibold text-gray-700">Instance Properties</div>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Role</span>
                            <span className="text-gray-800 font-medium font-sans text-[11.5px] truncate max-w-[170px] text-right">
                              {activeExp.role}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Period</span>
                            <span className="text-gray-800 font-medium">
                              {activeExp.period}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Order</span>
                            <span className="text-gray-800 font-medium">
                              Index 0{activeExp.order_index}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Section: Export & CTAs */}
                  <div className="border-t border-gray-200/70 pt-5 space-y-2.5">
                    <div className="text-[11px] font-semibold text-gray-700 mb-2">Actions</div>

                    <button
                      onClick={() => openContactModal(`Experience Inquiry: ${activeExp?.role} @ ${activeExp?.company}`)}
                      className="w-full bg-[#18181B] hover:bg-black text-white text-xs font-medium py-2.5 rounded-lg transition-all active:scale-98 cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Inquire about this role</span>
                    </button>

                    {cvUrl && (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Download CV (PDF)</span>
                        <span className="text-xs">&darr;</span>
                      </a>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* CARD 3: CREDENTIALS & ACHIEVEMENTS */}
          <div
            id="stack-card-credentials"
            className="lg:sticky lg:top-[108px] z-30 transition-all duration-200 will-change-transform mt-12 lg:mt-24"
          >
            <div id="credentials" className="absolute -top-24" />
            <div id="achievements" className="absolute -top-24" />
            <div id="qualifications" className="absolute -top-24" />

            {/* Figma Workspace Window */}
            <div className="figma-stack-card bg-white rounded-2xl border border-gray-200/90 shadow-2xl overflow-hidden">

              {/* 1. FIGMA TOP TOOLBAR / APP BAR */}
              <div className="h-11 bg-[#F9FAFB] border-b border-gray-200/80 px-4 flex items-center justify-between text-xs select-none">

                {/* Left: Figma Icon + Breadcrumb */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-5" viewBox="0 0 38 57" fill="none">
                      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                    </svg>
                    <span className="font-semibold text-gray-900">ghiffa.fig</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-500 font-mono text-[11px]">Credentials &amp; Achievements</span>
                  </div>
                </div>

                {/* Center: Real Figma Tools (Move V, Frame F, Achievement ★, Text T, Comment C) */}
                <div className="hidden md:flex items-center gap-1 bg-gray-200/60 p-0.5 rounded-lg">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Move (V)">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Frame (F)">
                    <span className="font-mono text-[12px] font-bold">#</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center bg-white shadow-2xs text-[#E17900]" title="Achievement (★)">
                    <span className="text-[12px] font-bold">★</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Text (T)">
                    <span className="font-serif font-bold text-[12px]">T</span>
                  </div>
                  <div className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-800" title="Comment (C)">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6l-3.5 3V3z" />
                    </svg>
                  </div>
                </div>

                {/* Right: Counter + Verify */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded border border-gray-200">
                    {credentialsList.length} Credentials
                  </span>
                  <button
                    onClick={() => openContactModal('Credentials & Qualifications Verification')}
                    className="bg-[#0D99FF] hover:bg-[#0b82d8] text-white text-[11.5px] font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>Verify</span>
                  </button>
                </div>

              </div>

              {/* 2. MAIN WORKSPACE: CANVAS (LEFT) + FIGMA INSPECTOR SIDEBAR (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">

                {/* CANVAS AREA (lg:col-span-8) */}
                <div className="lg:col-span-8 bg-square-grid p-6 sm:p-10 lg:p-12 relative flex flex-col justify-center">

                  {/* Floating Figma Comment Bubble */}
                  <DraggableItem className="hidden md:flex absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl rounded-bl-sm px-4 py-2.5 comment-shadow border border-gray-100 items-start gap-2.5 max-w-[280px]">
                    <div className="w-6 h-6 rounded-full bg-[#111] text-white flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5">ghiffa</div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-gray-900">ghiffa.dev</span>
                        <span className="text-gray-400">verified</span>
                      </div>
                      <p className="text-[12px] text-gray-800 mt-0.5 leading-snug">
                        Certified software competencies, IP copyrights, and university honors.
                      </p>
                    </div>
                  </DraggableItem>

                  {/* Canvas Frame Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <span className="inline-flex items-center gap-1 bg-[#0D99FF] text-white text-[10.5px] font-medium font-mono px-2 py-0.5 rounded shadow-2xs">
                        # Frame: Credentials &amp; Achievements
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        &darr; Auto Layout &bull; Gap: 16px
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#141414] tracking-tight leading-[1.2]">
                      Credentials &amp; Achievements
                    </h2>
                    <p className="text-gray-500 text-[13.5px] sm:text-[14px] mt-1">
                      Recognized excellence in national informatics competitions, government certifications, and intellectual property.
                    </p>
                  </div>

                  {/* Stack of Credential Cards */}
                  <div className="space-y-4">
                    {credentialsList.slice(0, 4).map((cred, idx) => {
                      const isSelected = selectedCredIdx === idx;
                      const isHonor = cred.type === 'honor';
                      const badgeLabel = cred.badge || (isHonor ? 'HONOR & AWARD' : 'CERTIFICATION');
                      return (
                        <div
                          key={cred.id || idx}
                          onClick={() => setSelectedCredIdx(idx)}
                          className={`relative rounded-xl p-5 sm:p-6 transition-all cursor-pointer ${isSelected
                            ? 'figma-bbox bg-white shadow-sm border border-[#0D99FF]'
                            : 'bg-white/90 hover:bg-white border border-gray-200/80 hover:border-gray-300 shadow-2xs'
                            }`}
                        >
                          {/* 8 Figma resize handles on selected item */}
                          {isSelected && (
                            <>
                              <span className="figma-handle !border-[#0D99FF] -top-1 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] -top-1 left-1/2 -translate-x-1/2" />
                              <span className="figma-handle !border-[#0D99FF] -top-1 -right-1" />
                              <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] top-1/2 -translate-y-1/2 -right-1" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 -left-1" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 left-1/2 -translate-x-1/2" />
                              <span className="figma-handle !border-[#0D99FF] -bottom-1 -right-1" />

                              {/* Cursor badge on active card */}
                              <div className="absolute -bottom-2.5 -right-2 flex items-center gap-1 bg-[#0D99FF] text-white text-[10px] font-medium font-mono px-2 py-0.5 rounded shadow-xs select-none z-10">
                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16"><path d="M1 1L6.5 14.5L8.8 8.8L14.5 6.5L1 1Z" /></svg>
                                <span>ghiffa</span>
                              </div>
                            </>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${isHonor ? 'text-amber-500' : 'text-[#0D99FF]'}`}>
                                {isHonor ? '★' : '❖'}
                              </span>
                              <span className={`text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded ${isHonor ? 'bg-amber-50 text-amber-800 border border-amber-200/70' : 'bg-blue-50 text-blue-800 border border-blue-200/70'
                                }`}>
                                {badgeLabel}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] sm:text-[12px] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200/60 font-medium self-start sm:self-auto">
                              {cred.period}
                            </span>
                          </div>

                          <h3 className="font-semibold text-gray-900 text-[15px] sm:text-[16px] mb-1">
                            {cred.title}
                          </h3>

                          <div className="text-[13px] font-medium text-gray-600 mb-2 flex items-center gap-1.5">
                            <span className="text-gray-400">Issuer:</span>
                            <span className="text-gray-900 font-medium">{cred.institution}</span>
                          </div>

                          {cred.description && (
                            <p className="text-[13px] leading-relaxed text-gray-600 mb-3 font-normal">
                              {cred.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11.5px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Verified Credential</span>
                            </div>

                            {cred.certificate_url && (
                              <a
                                href={cred.certificate_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11.5px] font-mono text-[#0D99FF] hover:underline"
                              >
                                <span>View Document</span>
                                <span>&rarr;</span>
                              </a>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* FIGMA DESIGN INSPECTOR SIDEBAR (lg:col-span-4) */}
                <div className="lg:col-span-4 bg-[#F9FAFB] border-t lg:border-t-0 lg:border-l border-gray-200/90 p-6 sm:p-7 space-y-6 flex flex-col justify-between">

                  <div className="space-y-6">

                    {/* Tabs: Layers / Design / Inspect */}
                    <div className="flex items-center gap-5 border-b border-gray-200 pb-3 text-xs font-medium">
                      <span className="text-[#0D99FF] font-semibold border-b-2 border-[#0D99FF] pb-3 -mb-3">Layers</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Design</span>
                      <span className="text-gray-400 hover:text-gray-600 cursor-pointer">Inspect</span>
                    </div>

                    {/* Section: Layer Tree */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-gray-700 flex items-center justify-between">
                        <span>Credentials Tree</span>
                        <span className="text-[10px] text-gray-400 font-mono">{credentialsList.length} Items</span>
                      </div>
                      <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                        {credentialsList.map((cred, idx) => {
                          const isSelected = selectedCredIdx === idx;
                          const isHonor = cred.type === 'honor';
                          return (
                            <button
                              key={cred.id || idx}
                              onClick={() => setSelectedCredIdx(idx)}
                              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${isSelected
                                ? 'bg-[#0D99FF]/10 text-[#0D99FF] font-medium border border-[#0D99FF]/30'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <span className={isHonor ? 'text-amber-500' : 'text-[#0D99FF]'}>
                                  {isHonor ? '★' : '❖'}
                                </span>
                                <span className="truncate">{cred.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-400 shrink-0">
                                #{idx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section: Active Selection Properties */}
                    {activeCredential && (
                      <div className="space-y-2.5 text-xs border-t border-gray-200/70 pt-4">
                        <div className="text-[11px] font-semibold text-gray-700">Instance Properties</div>

                        <div className="space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Award / Title</span>
                            <span className="text-gray-800 font-medium font-sans text-[11.5px] truncate max-w-[170px] text-right">
                              {activeCredential.title}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Issuer</span>
                            <span className="text-gray-800 font-medium font-sans text-[11px] truncate max-w-[170px] text-right">
                              {activeCredential.institution}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Period</span>
                            <span className="text-gray-800 font-medium">
                              {activeCredential.period}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-gray-200 px-2.5 py-1.5 rounded">
                            <span className="text-gray-400">Type</span>
                            <span className="text-gray-800 font-medium uppercase text-[10px]">
                              {activeCredential.type || 'Credential'}
                            </span>
                          </div>
                        </div>

                        {activeCredential.certificate_url && (
                          <div className="pt-2">
                            <a
                              href={activeCredential.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-[11.5px] font-medium py-1.5 rounded-md transition-colors"
                            >
                              <span>Open Official Certificate</span>
                              <span>&rarr;</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Section: Export & CTAs */}
                  <div className="border-t border-gray-200/70 pt-5 space-y-2.5">
                    <div className="text-[11px] font-semibold text-gray-700 mb-2">Actions</div>

                    <button
                      onClick={() => openContactModal(`Credential Verification: ${activeCredential?.title}`)}
                      className="w-full bg-[#18181B] hover:bg-black text-white text-xs font-medium py-2.5 rounded-lg transition-all active:scale-98 cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Request qualification info</span>
                    </button>

                    {cvUrl && (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Download Full CV (PDF)</span>
                        <span className="text-xs">&darr;</span>
                      </a>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 3. SELECTED WORKS (3-CARD GRID DESIGN BELOW STACKING CARDS) */}
      <section id="works" className="relative py-20 px-6 sm:px-12 lg:px-24 max-w-[1360px] mx-auto border-t border-gray-100/90">
        <div id="work" className="absolute -top-24" />
        <div id="projects" className="absolute -top-24" />

        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0D99FF] font-semibold mb-1">
            </div>
            <h2 className="text-3xl sm:text-[38px] font-bold tracking-tight text-[#141414]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {projectsList.slice(0, 3).map((proj, idx) => {
            const cardThemes = [
              {
                gradient: "from-amber-400 via-orange-500 to-red-600",
                radial: "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]"
              },
              {
                gradient: "from-blue-600 via-indigo-700 to-slate-900",
                radial: "bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.35),transparent_60%)]"
              },
              {
                gradient: "from-red-700 via-rose-900 to-neutral-950",
                radial: "bg-[radial-gradient(circle_at_25%_70%,rgba(251,113,133,0.3),transparent_60%)]"
              }
            ];
            const theme = cardThemes[idx % cardThemes.length];
            const projImg = proj.image_url || (Array.isArray(proj.image_urls) && proj.image_urls.length > 0 ? proj.image_urls[0] : null);
            const techList = Array.isArray(proj.tech_stack)
              ? proj.tech_stack
              : typeof proj.tech_stack === 'string'
                ? proj.tech_stack.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            return (
              <article
                key={proj.id || idx}
                className="group cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  if (proj.link && proj.link !== '#' && proj.link.startsWith('http')) {
                    window.open(proj.link, '_blank', 'noopener,noreferrer');
                  } else {
                    openContactModal(`Project Inquiry: ${proj.title}`);
                  }
                }}
              >
                <div>
                  {/* Card Visual / Thumbnail */}
                  <div className={`h-56 rounded-2xl overflow-hidden mb-5 relative shadow-sm border border-gray-100/80 bg-gradient-to-br ${theme.gradient}`}>
                    {projImg && (
                      <img
                        src={projImg}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div className={`absolute inset-0 ${theme.radial} group-hover:scale-105 transition-transform duration-500 pointer-events-none ${projImg ? 'opacity-30' : 'opacity-100'}`} />

                    {/* Category Tag Top-Left */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-medium px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider shadow-sm">
                        {proj.category || 'CASE STUDY'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] sm:text-[19px] font-bold text-[#141414] leading-snug mb-2 group-hover:text-[#0D99FF] transition-colors">
                    {proj.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
                    {proj.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                {techList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techList.slice(0, 3).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-200/80 text-gray-600 text-[10.5px] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {techList.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-mono py-0.5">
                        +{techList.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SKILLSTREAK.ID PLATFORM BANNER WITH DARK THEME SCROLL TRANSITION (MATCHING GAMBAR 1) */}
      <section
        ref={bannerRef}
        id="skillstreak-banner"
        className="py-20 sm:py-28 px-6 sm:px-12 lg:px-24 transition-colors duration-700 ease-in-out relative z-10"
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="rounded-[32px] sm:rounded-[36px] bg-[#111113] border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden transition-all duration-500">
            {/* Subtle background ambient blue glow behind the laptop */}
            <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[480px] h-[380px] bg-[#0055FF]/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">

              {/* Left Column: Figma Bounding Box Title, Clean Typography & Blue CTA */}
              <div className="lg:col-span-6 space-y-6 pr-0 lg:pr-4">

                {/* Figma Dashed Bounding Box with Corner & Midpoint Handles (Exact Gambar 1 styling) */}
                <div className="relative inline-block border border-dashed border-white/35 px-5 py-2.5 -ml-2 rounded-xs select-none">
                  {/* 4 Corner Handles */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  {/* 4 Midpoint Handles */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white border border-black rounded-[1px]" />
                  <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border border-black rounded-[1px]" />

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                    skillstreak.id
                  </h2>
                </div>

                {/* Primary bold lead text */}
                <p className="text-white text-base sm:text-lg font-medium leading-relaxed max-w-lg">
                  The fastest path from zero to deployable engineer, built like a game and engineered for the real world.
                </p>

                {/* Secondary muted text */}
                <p className="text-[#9E9E9E] text-xs sm:text-[13.5px] leading-relaxed max-w-lg">
                  Most developers quit because learning feels like a grind with no visible progress. skillstreak.id changes the feedback loop with XP rewards, daily streak accountability, and real-time code evaluations.
                </p>

                {/* Vibrant Blue Pill CTA */}
                <div className="pt-2">
                  <a
                    href="https://skillstreak.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0055FF] hover:bg-[#0044CC] text-white font-medium text-[13.5px] px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get Early Access</span>
                    <span className="text-sm">&rarr;</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Dark Space-Black MacBook Mockup (Exact Gambar 1 styling) */}
              <div className="lg:col-span-6 flex justify-end">
                <div className="w-full max-w-[530px] lg:translate-x-4">

                  {/* Dark MacBook Frame */}
                  <div className="bg-[#0b0b0d] p-2.5 sm:p-3 rounded-t-2xl border-2 border-[#222225] shadow-2xl relative">

                    {/* Camera notch */}
                    <div className="w-14 h-2 bg-[#0b0b0d] mx-auto rounded-b-md mb-1.5 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#1e1e24]" />
                    </div>

                    {/* Screen Container */}
                    <div className="h-[250px] sm:h-[295px] rounded-lg overflow-hidden bg-black relative border border-[#1d1d20] shadow-inner group">

                      {/* Screen View Toggle (Live App Screenshot vs Royal Blue Blueprint) */}
                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center bg-black/70 backdrop-blur-md rounded-full p-0.5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setBannerScreenMode('desktop')}
                          className={`text-[9.5px] font-mono px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                            bannerScreenMode === 'desktop' ? 'bg-[#0055FF] text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          App View
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerScreenMode('blueprint')}
                          className={`text-[9.5px] font-mono px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                            bannerScreenMode === 'blueprint' ? 'bg-[#0055FF] text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Blueprint
                        </button>
                      </div>

                      {bannerScreenMode === 'desktop' ? (
                        <img
                          src="/skillstreak-dekstop.png"
                          alt="Skillstreak Platform Desktop Preview"
                          className="w-full h-full object-cover object-top select-none pointer-events-none"
                          loading="eager"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full bg-royal-blue-grid p-6 flex flex-col justify-between relative overflow-hidden select-none">
                          <div className="flex items-center justify-between text-white/70 text-xs font-mono">
                            <span>skillstreak.id // workspace</span>
                            <span>v1.0</span>
                          </div>
                          <div className="my-auto text-center">
                            <div className="inline-block border border-dashed border-white/40 px-5 py-2.5 rounded-xs">
                              <span className="text-white font-bold text-2xl sm:text-3xl tracking-tight">skillstreak.id</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-white/70 font-mono">
                            <span>STATUS: EARLY ACCESS</span>
                            <span>100% HANDS-ON</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dark Laptop Base with Center Notch */}
                  <div className="h-4 bg-gradient-to-b from-[#242426] to-[#141416] rounded-b-2xl -mx-3 shadow-xl flex items-center justify-center border-t border-[#313134]">
                    <div className="w-16 h-1 bg-[#09090b] rounded-full" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Subtext below card */}
          <p className="text-[12px] text-gray-400 mt-4 pl-2 font-normal transition-colors duration-700">
            * Early members receive Founder Badge + lifetime discounted access on skillstreak.id
          </p>
        </div>
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
