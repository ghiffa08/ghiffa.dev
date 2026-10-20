import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  Globe,
  Plus,
  Minus,
  CornerDownRight,
  ExternalLink
} from 'lucide-react';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { useInstagramFeed } from '../hooks/useInstagramFeed';
import { SEO } from '../components/atoms/SEO';

// Inline SVGs for Brand Icons
const InstagramIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CrosshairIcon = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="opacity-75">
    <circle cx="23" cy="23" r="14" stroke="#1c1c1a" strokeWidth="1" />
    <circle cx="23" cy="23" r="7" stroke="#1c1c1a" strokeWidth="1" />
    <line x1="23" y1="0" x2="23" y2="46" stroke="#1c1c1a" strokeWidth="1" />
    <line x1="0" y1="23" x2="46" y2="23" stroke="#1c1c1a" strokeWidth="1" />
  </svg>
);

const WireframeGlobe = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="shrink-0">
    <circle cx="23" cy="23" r="21" stroke="#1c1c1a" strokeWidth="1.2" />
    <ellipse cx="23" cy="23" rx="10" ry="21" stroke="#1c1c1a" strokeWidth="1.2" />
    <line x1="2" y1="23" x2="44" y2="23" stroke="#1c1c1a" strokeWidth="1.2" />
    <path d="M5 13C15 16 31 16 41 13" stroke="#1c1c1a" strokeWidth="1.2" />
    <path d="M5 33C15 30 31 30 41 33" stroke="#1c1c1a" strokeWidth="1.2" />
    <line x1="23" y1="2" x2="23" y2="44" stroke="#1c1c1a" strokeWidth="1.2" />
  </svg>
);

const RotatingStamp = () => (
  <div className="relative w-32 h-32 flex items-center justify-center select-none group">
    <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
      <circle cx="60" cy="60" r="56" stroke="#EAE6DF" strokeWidth="1.2" fill="none" opacity="0.85" />
      <circle cx="60" cy="60" r="38" stroke="#EAE6DF" strokeWidth="1" fill="none" opacity="0.6" />
      <defs>
        <path
          id="stampTextPath"
          d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
        />
      </defs>
      <text fill="#EAE6DF" fontSize="7.2" fontFamily="JetBrains Mono, monospace" letterSpacing="2.6px" fontWeight="600">
        <textPath href="#stampTextPath" startOffset="0%">
          STRATEGY • DESIGN • EXPERIENCE •
        </textPath>
      </text>
    </svg>
    {/* Center Geometric M Logo */}
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="34" height="30" viewBox="0 0 34 30" fill="none" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M2 28V2L17 16L32 2V28H25V14L17 22L9 14V28H2Z" fill="#E84E0F" />
        <rect x="14" y="2" width="6" height="6" fill="#EAE6DF" />
      </svg>
    </div>
  </div>
);

const BarcodeGraphic = () => {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2];
  return (
    <div className="flex items-stretch h-8 gap-[2px] opacity-85 bg-[#141413] p-1">
      {bars.map((width, idx) => (
        <div
          key={idx}
          className="bg-[#EAE6DF]"
          style={{ width: `${width * 1.6}px` }}
        />
      ))}
    </div>
  );
};

export default function Portfolio() {
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: supabaseProjects } = useSupabaseList('projects');
  const { data: supabaseQualifications } = useSupabaseList('qualifications');
  const { data: instagramPosts, isLoading: igLoading } = useInstagramFeed();

  // State management
  const [expandedService, setExpandedService] = useState('01');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [certFilter, setCertFilter] = useState('all');
  const [certPage, setCertPage] = useState(0);
  const [igPage, setIgPage] = useState(0);

  // Draggable slider state for Selected Work
  const workSliderRef = useRef(null);
  const [isWorkDragging, setIsWorkDragging] = useState(false);
  const [workStartX, setWorkStartX] = useState(0);
  const [workScrollLeft, setWorkScrollLeft] = useState(0);
  const [workDragProgress, setWorkDragProgress] = useState(0);
  const [workHasDragged, setWorkHasDragged] = useState(false);

  const handleWorkMouseDown = (e) => {
    if (!workSliderRef.current) return;
    setIsWorkDragging(true);
    setWorkHasDragged(false);
    setWorkStartX(e.pageX - workSliderRef.current.offsetLeft);
    setWorkScrollLeft(workSliderRef.current.scrollLeft);
  };

  const handleWorkMouseMove = (e) => {
    if (!isWorkDragging || !workSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - workSliderRef.current.offsetLeft;
    const walk = (x - workStartX) * 1.6;
    if (Math.abs(walk) > 6) {
      setWorkHasDragged(true);
    }
    workSliderRef.current.scrollLeft = workScrollLeft - walk;
  };

  const handleWorkMouseUpOrLeave = () => {
    setIsWorkDragging(false);
  };

  const handleWorkScroll = () => {
    if (!workSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = workSliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setWorkDragProgress((scrollLeft / maxScroll) * 100);
    }
  };

  // Dynamic Identity Data
  const fullName = info?.full_name || 'Haikal Jibran Al-Ghiffarry';
  const roleTitle = info?.role || 'IoT Engineer & Full-stack Developer';
  const emailAddress = info?.email || 'hello@ghiffa.dev';
  const phone = settings?.phone || '+62 895 385 108 008';
  const location = info?.location || 'Kuningan, Indonesia';
  const availability = info?.availability_status || 'AVAILABLE FOR NEW PROJECTS';

  const toggleService = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  // Keyboard escape listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedProjectModal(null);
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Services Data
  const servicesData = [
    {
      id: '01',
      title: 'WEB ARCHITECTURE & DEV',
      desc: 'High-performance React, Next.js, and modern full-stack web applications engineered for speed, clean UX, and deterministic scale.'
    },
    {
      id: '02',
      title: 'EMBEDDED IOT SYSTEMS',
      desc: 'End-to-end hardware telemetry, ESP32 microcontrollers, custom sensor networks, LoRa long-range protocols, and edge computing.'
    },
    {
      id: '03',
      title: 'UI/UX & EDITORIAL DESIGN',
      desc: 'Bold, brutalist visual identities, typographic design systems, and responsive layouts that cut through generic digital noise.'
    },
    {
      id: '04',
      title: 'FULL-STACK BACKENDS',
      desc: 'Secure REST APIs, Supabase / PostgreSQL schemas, real-time telemetry streaming, and automated backend infrastructure.'
    },
    {
      id: '05',
      title: 'HARDWARE & PCB DESIGN',
      desc: 'From circuit schematics to physical fabrication — bridging digital code (Bits) with real-world physical devices (Atoms).'
    },
    {
      id: '06',
      title: 'PERFORMANCE & AUDIT',
      desc: 'Ongoing system audits, memory-leak debugging, Core Web Vitals optimization, and long-term infrastructure maintenance.'
    },
  ];

  // Tech Stack Data
  const techStack = (info?.skills && Array.isArray(info.skills) && info.skills.length > 0)
    ? info.skills.slice(0, 9)
    : [
      'REACT / NEXT.JS',
      'TAILWIND CSS',
      'JAVASCRIPT (ES6+)',
      'LARAVEL / PHP',
      'ESP32 / IOT FIRMWARE',
      'POSTGRESQL & SUPABASE',
      'GSAP ANIMATION',
      'LORA TELEMETRY',
      'FIGMA & UI/UX'
    ];

  // Projects Data with graceful fallbacks
  const defaultProjects = [
    {
      num: '01/',
      title: 'NEXUS ARCHITECTURE',
      category: 'WEBSITE DESIGN · 2026',
      desc: 'A brutalist 3D architectural and creative direction studio website featuring WebGL shaders and smooth scroll choreography.',
      link: '#',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      client: 'NEXUS LABS',
      stat: '+140% International Inquiries'
    },
    {
      num: '02/',
      title: 'ELEVATE DIGITAL',
      category: 'BRAND & PLATFORM · 2025',
      desc: 'Complete rebrand and interactive web platform for a next-generation digital product agency.',
      link: '#',
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      client: 'ELEVATE AGENCY',
      stat: '3.8× Direct Conversions'
    },
    {
      num: '03/',
      title: 'SMART SOIL TELEMETRY',
      category: 'IOT HARDWARE & CLOUD · 2025',
      desc: 'Autonomous solar-powered IoT soil moisture and ambient telemetry node with LoRa long-range transmission and web dashboard.',
      link: '#',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      client: 'AGRICULTURAL RESEARCH LAB',
      stat: '15km Transmission Range'
    }
  ];

  const allProjects = (supabaseProjects && supabaseProjects.length > 0)
    ? supabaseProjects.map((p, idx) => ({
      id: p.id,
      num: `${String(idx + 1).padStart(2, '0')}/`,
      title: (p.title || `PROJECT 0${idx + 1}`).toUpperCase(),
      category: (p.category || 'FULL-STACK & IOT').toUpperCase(),
      desc: p.description || 'Full-stack engineering commission built with modern architectural rigor.',
      link: p.live_url || p.github_url || '#',
      img: p.image_url || defaultProjects[idx % defaultProjects.length]?.img,
      client: p.client || 'COMMISSION WORK',
      stat: p.metrics || 'Engineered for Performance'
    }))
    : defaultProjects;

  // Certifications data processing from Supabase
  const allCertifications = (supabaseQualifications && supabaseQualifications.length > 0)
    ? supabaseQualifications
      .filter(q => q.type === 'certification')
      .sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999))
    : [
      {
        id: "cert-01",
        title: "Piagam Penghargaan Mahasiswa Berprestasi Universitas Kuningan 2026",
        institution: "Universitas Kuningan",
        period: "May 2026",
        certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714135/f2p9oyiqe0hvurgsevhx.jpg",
        description: "Rank 1 Outstanding Student Award across University level."
      },
      {
        id: "cert-02",
        title: "2nd Runner Up of the Business Plan (Canva Design) Competition",
        institution: "Universitas Pancasakti",
        period: "2026",
        certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1790349503/o6nrysdsqeq6qmcrbouh.jpg",
        description: "National business innovation and digital presentation design."
      },
      {
        id: "cert-03",
        title: "Junior Web Developer",
        institution: "BNSP & Kominfo",
        period: "Okt 2024",
        certificate_url: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783626185/dbbffblvvangiizxkudh.jpg",
        description: "Certified professional competence in modern web software engineering."
      }
    ];

  const filteredCerts = allCertifications.filter(cert => {
    if (certFilter === 'verified') return Boolean(cert.certificate_url);
    if (certFilter === 'national') {
      const text = `${cert.title || ''} ${cert.institution || ''}`.toLowerCase();
      return text.includes('bnsp') || text.includes('kominfo') || text.includes('kemenkominfo') || text.includes('cipta') || text.includes('intelektual') || text.includes('astra');
    }
    if (certFilter === 'competition') {
      const text = `${cert.title || ''} ${cert.institution || ''}`.toLowerCase();
      return text.includes('competition') || text.includes('juara') || text.includes('winner') || text.includes('runner up') || text.includes('pilmapres');
    }
    return true;
  });

  const pagedCerts = filteredCerts.slice(certPage * 3, (certPage + 1) * 3);

  // Instagram date formatter
  const formatIgDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase();
    } catch {
      return '';
    }
  };

  const fallbackInstagramPosts = [
    {
      id: "ig-1",
      permalink: "https://www.instagram.com/p/DDS_AlvTWUy/",
      caption: "Merupakan sebuah kehormatan bisa bertemu langsung dengan sosok yang sangat berpengaruh dalam perjalanan saya, Bapak Sandhika Galih di DevFest Bandung 2024.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      timestamp: "2024-12-08T00:05:47+0000"
    },
    {
      id: "ig-2",
      permalink: "https://www.instagram.com/p/C6vZglurhj1/",
      caption: "Tiga tahun, ribuan baris kode. Meraih predikat nilai tertinggi Uji Kompetensi Keahlian (UKK) di SMKN 2 Kuningan jurusan Rekayasa Perangkat Lunak.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
      timestamp: "2024-05-09T08:13:32+0000"
    },
    {
      id: "ig-3",
      permalink: "https://www.instagram.com/p/CvUx7g2LQmt/",
      caption: "Program Astra Voca Preneur di Desa Sejahtera Astra, Mangunan Yogyakarta. Membawa ide lingkungan RETHREEE ke panggung nasional bersama PT Astra International Tbk.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      timestamp: "2023-07-30T14:22:06+0000"
    },
    {
      id: "ig-4",
      permalink: "https://www.instagram.com/p/CqQBrFXL-LN/",
      caption: "Marketplace digital REThreee untuk pengrajin daur ulang dan eco-friendly diapresiasi Juara 1.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
      timestamp: "2023-03-26T11:26:30+0000"
    }
  ];

  const displayedInstagramPosts = (instagramPosts && instagramPosts.length > 0)
    ? instagramPosts
    : fallbackInstagramPosts;

  const pagedInstagramPosts = displayedInstagramPosts.slice(igPage * 3, (igPage + 1) * 3);

  return (
    <div className="min-h-screen bg-[#111110] py-0 sm:py-8 px-0 sm:px-4 flex justify-center items-start font-mono text-[#1c1c1a] selection:bg-[#E84E0F] selection:text-[#EAE6DF]">
      <SEO
        title={`${fullName} — IoT Engineer & Full-stack Developer`}
        description="Official poster portfolio of Haikal Jibran Al-Ghiffarry (Ghiffa). Bridging bits and atoms through modern web architecture and embedded IoT systems."
      />

      {/* SVG Filters for Paper Noise & Grunge Distress */}
      <svg className="hidden">
        <filter id="paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* MAIN POSTER CONTAINER */}
      <div className="w-full max-w-[1080px] bg-[#EAE6DF] relative shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden border border-[#2c2c2a]">

        {/* Global Fine Noise Texture Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-40 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* =========================================================
            1. TOP NAVIGATION / STATUS BAR
        ========================================================= */}
        <header className="relative z-20 px-6 sm:px-12 pt-7 pb-4 flex justify-between items-start text-[11px] sm:text-xs leading-[1.35] tracking-[0.06em] font-mono-tech font-medium uppercase border-b border-[#1c1c1a]/15">
          {/* Top Left */}
          <div>
            <div className="w-3.5 h-[3px] bg-[#E84E0F] mb-2" />
            <p className="text-[#1c1c1a] font-bold">FULL-STACK DEVELOPER</p>
            <p className="text-[#4a4946]">IOT TELEMETRY ENGINEER</p>
          </div>

          {/* Top Center Quick Anchors */}
          <div className="hidden sm:flex items-center gap-6 font-mono-tech text-[10.5px] tracking-wider text-[#1c1c1a]">
            <a href="#work" className="hover:text-[#E84E0F] transition-colors">01. WORK</a>
            <a href="#services" className="hover:text-[#E84E0F] transition-colors">02. SERVICES</a>
            <a href="#credentials" className="hover:text-[#E84E0F] transition-colors">03. CREDENTIALS</a>
            <a href="#dispatches" className="hover:text-[#E84E0F] transition-colors">04. DISPATCHES</a>
            <a href="#contact" className="hover:text-[#E84E0F] transition-colors">05. CONTACT</a>
          </div>

          {/* Top Right */}
          <div className="text-right flex flex-col items-end">
            <div className="w-3.5 h-[3px] bg-[#E84E0F] mb-2" />
            <p className="text-[#1c1c1a] font-bold">BASE: {location.toUpperCase()}</p>
            <p className="text-[#E84E0F] font-semibold">{availability.toUpperCase()}</p>
          </div>
        </header>

        {/* =========================================================
            2. HERO SECTION (TYPOGRAPHY + PORTRAIT + ABOUT ME)
        ========================================================= */}
        <section className="relative z-10 px-6 sm:px-12 pt-3 pb-10 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">

            {/* LEFT COLUMN: STACKED BRUTALIST HEADLINE & ABOUT ME */}
            <div className="lg:col-span-7 relative z-20 flex flex-col justify-between">

              {/* Giant Stacked Headline */}
              <div className="select-none pt-1">
                <h1 className="font-anton uppercase tracking-[-0.02em] flex flex-col">
                  <span
                    className="text-[21vw] sm:text-[145px] lg:text-[160px] leading-[0.87] text-[#222220] relative"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(234, 230, 223, 0.14) 1px, transparent 0)',
                      backgroundSize: '6px 6px'
                    }}
                  >
                    DESIGN
                  </span>
                  <span className="text-[21vw] sm:text-[145px] lg:text-[160px] leading-[0.87] text-[#222220] mt-1">
                    WITH
                  </span>
                  <span className="text-[21vw] sm:text-[145px] lg:text-[160px] leading-[0.87] text-[#E84E0F] mt-1 inline-flex items-baseline">
                    INTENT.
                    {/* Distinct black square next to the orange period */}
                    <span className="inline-block w-5 h-5 sm:w-[26px] sm:h-[26px] bg-[#1c1c1a] ml-2 sm:ml-3 mb-2 sm:mb-3 shrink-0" />
                  </span>
                </h1>
              </div>

              {/* ABOUT ME & WORLDWIDE COLLABS ROW */}
              <div className="mt-8 sm:mt-10 pb-8 lg:pb-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
                {/* About Me Text */}
                <div className="sm:col-span-6">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-anton text-xl sm:text-[22px] tracking-wide uppercase text-[#1c1c1a]">
                      ABOUT ME
                    </h2>
                    <span className="w-6 h-[2.5px] bg-[#1c1c1a]" />
                  </div>
                  <p className="text-[11.5px] leading-[1.55] text-[#2b2b29] font-mono-tech mb-4 max-w-[260px]">
                    Translating digital architecture and lines of code (Bits) into physical hardware that impacts the real world (Atoms).
                  </p>
                  <p className="text-[11.5px] leading-[1.5] text-[#1c1c1a] font-mono-tech font-medium">
                    Small by conviction.<br />
                    Rigorous by execution.
                  </p>
                </div>

                {/* Available Worldwide Globe Badge */}
                <div className="sm:col-span-6 flex flex-col justify-end">
                  <div className="w-full h-[1px] bg-[#1c1c1a]/60 mb-4" />
                  <div className="flex items-center gap-3.5">
                    <WireframeGlobe />
                    <div className="text-[10px] leading-[1.45] font-mono-tech uppercase tracking-[0.04em] text-[#1c1c1a] font-semibold">
                      <p>AVAILABLE WORLDWIDE</p>
                      <p>FOR ENGINEERING</p>
                      <p>&amp; HARDWARE COLLABS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PORTRAIT WITH GEOMETRIC ORANGE BACKDROP */}
            <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[560px] lg:min-h-[635px] flex items-end justify-center lg:-ml-14">

              {/* Crosshair Target Graphic Top Right */}
              <div className="absolute top-12 right-2 sm:right-4 z-20">
                <CrosshairIcon />
              </div>

              {/* Bold Orange Brutalist Geometric Shapes Behind Subject */}
              <div
                className="w-[215px] sm:w-[245px] h-[125px] bg-[#E84E0F] absolute top-[18px] left-[22px] sm:left-[40px] z-0"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }}
              />
              <div
                className="w-[150px] sm:w-[175px] h-[185px] bg-[#E84E0F] absolute top-[145px] right-0 sm:right-2 z-0"
                style={{
                  clipPath: 'polygon(0 0, 74% 0, 100% 24%, 100% 100%, 0 100%)'
                }}
              />

              {/* High-Contrast B&W Editorial Portrait of Haikal */}
              <div className="relative z-10 w-full h-[460px] sm:h-[555px] lg:h-[615px] flex items-end justify-center overflow-hidden">
                <img
                  src="/ghiffa.png"
                  alt={fullName}
                  className="w-full h-full object-cover object-top grayscale contrast-125 brightness-95 select-none"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85';
                  }}
                />
                {/* Dark Visual Framing Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Floating Dark Name Tag Card */}
              <div className="absolute bottom-[95px] sm:bottom-[115px] right-0 z-30 bg-[#181817]/95 border border-[#2e2e2c] px-5 py-3.5 shadow-2xl backdrop-blur-xs">
                <div className="w-8 h-[2px] bg-[#EAE6DF] mb-2 opacity-80" />
                <p className="font-mono-tech text-[#EAE6DF] text-xs sm:text-[13px] tracking-[0.14em] leading-tight uppercase font-medium">
                  HAIKAL JIBRAN<br />
                  AL-GHIFFARRY
                </p>
                <p className="font-mono-tech text-[#E84E0F] text-[10px] tracking-[0.14em] uppercase mt-1.5 font-semibold">
                  IOT &amp; FULL-STACK ENGINEER
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            3. SELECTED WORK BAR (CLEAN BRUTALIST BAND)
        ========================================================= */}
        <section id="work" className="relative z-20 bg-[#181816] text-[#EAE6DF] flex flex-col md:flex-row border-t border-b border-[#2b2b28]">

          {/* Left Vertical Orange Sidebar */}
          <div className="bg-[#E84E0F] text-[#181816] md:w-[68px] py-3.5 px-6 md:py-6 md:px-0 flex items-center justify-between md:justify-center shrink-0 self-stretch select-none">
            <div className="font-mono-tech font-bold text-xs sm:text-[13px] tracking-[0.24em] uppercase flex items-center gap-2.5 md:[writing-mode:vertical-rl] md:rotate-180">
              <span>SELECTED WORK</span>
              <span className="inline-block w-[10px] h-[2px] md:w-[2.5px] md:h-[12px] bg-[#181816]" />
            </div>
          </div>

          {/* Project Cards Draggable Slider - ULTRA CLEAN, NO PAGINATION */}
          <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 pb-5 sm:pb-6 lg:pb-6 overflow-hidden">
            <div
              ref={workSliderRef}
              onMouseDown={handleWorkMouseDown}
              onMouseMove={handleWorkMouseMove}
              onMouseUp={handleWorkMouseUpOrLeave}
              onMouseLeave={handleWorkMouseUpOrLeave}
              onScroll={handleWorkScroll}
              className="flex items-start gap-6 sm:gap-7 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none pb-2 pt-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {allProjects.map((proj, pIdx) => (
                <div
                  key={proj.id || pIdx}
                  onClick={() => {
                    if (!workHasDragged) setSelectedProjectModal(proj);
                  }}
                  className="w-[280px] sm:w-[310px] md:w-[325px] shrink-0 group flex flex-col cursor-pointer"
                >
                  {/* Clean Orange Index */}
                  <span className="text-[#E84E0F] font-mono-tech text-xs sm:text-sm font-semibold mb-2.5 tracking-wider block">
                    {proj.num}
                  </span>

                  {/* Clean Cover Thumbnail - ZERO TEXT ON IMAGE */}
                  <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] border border-[#2e2e2b] overflow-hidden mb-3.5">
                    <img
                      src={proj.img}
                      alt={proj.title}
                      draggable={false}
                      className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0 pointer-events-none select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {/* Bottom Right Orange Action Tag */}
                    <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <CornerDownRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#181816] stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Clean Titles Below Thumbnail */}
                  <h3 className="font-mono-tech text-xs sm:text-[13px] font-bold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors uppercase truncate">
                    {proj.title}
                  </h3>
                  <p className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider text-[#8e8d87] uppercase mt-1 truncate">
                    {proj.category}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtle Minimal Drag Hint & Recessed Progress Indicator */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#232320]/60">
              <div className="flex items-center gap-2 font-mono-tech text-[9.5px] uppercase tracking-widest text-[#66655f]">
                <span>[ DRAG ARCHIVE // {allProjects.length} COMMISSIONS ]</span>
                <span className="text-[#E84E0F]">→</span>
              </div>
              <div className="w-24 sm:w-32 h-[2px] bg-[#262624] overflow-hidden rounded-full relative">
                <div 
                  className="h-full bg-[#E84E0F] transition-all duration-150"
                  style={{
                    width: '32%',
                    transform: `translateX(${workDragProgress * 2.1}%)`
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. SERVICES / DESIGN MANIFESTO / TECH STACK (3 COLUMNS)
        ========================================================= */}
        <section id="services" className="relative z-20 grid grid-cols-1 lg:grid-cols-12 bg-[#EAE6DF] border-b border-[#1c1c1a]/20">

          {/* COLUMN 1: SERVICES ACCORDION LIST */}
          <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1c1c1a]/20">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <h2 className="font-anton text-2xl sm:text-[28px] tracking-wide uppercase text-[#1c1c1a]">
                  SERVICES
                </h2>
                <span className="w-6 h-[2.5px] bg-[#1c1c1a]" />
              </div>

              <div className="divide-y divide-[#1c1c1a]/30 border-b border-[#1c1c1a]/30">
                {servicesData.map((item) => {
                  const isOpen = expandedService === item.id;
                  return (
                    <div key={item.id} className="py-2.5">
                      <button
                        onClick={() => toggleService(item.id)}
                        className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono-tech text-xs font-extrabold text-[#1c1c1a]">
                            {item.id}
                          </span>
                          <span className="font-mono-tech text-[11px] sm:text-xs font-medium tracking-wider text-[#1c1c1a] group-hover:text-[#E84E0F] transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[#1c1c1a] group-hover:text-[#E84E0F] transition-colors">
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="mt-2 pl-7 text-[11px] leading-relaxed text-[#4a4946] font-mono-tech">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: DESIGN MANIFESTO (ORANGE BLOCK) */}
          <div className="lg:col-span-4 bg-[#E84E0F] text-[#181816] p-6 sm:p-10 relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#1c1c1a]/20">
            <div>
              <div className="flex items-end gap-3 mb-5">
                <h2 className="font-anton text-xl sm:text-[23px] leading-[1.08] tracking-wide uppercase text-[#181816]">
                  ENGINEERING<br />
                  MANIFESTO
                </h2>
                <span className="w-5 h-[2px] bg-[#181816] mb-1.5" />
              </div>

              <div className="font-mono-tech text-[11px] leading-[1.55] tracking-[0.02em] uppercase space-y-4 font-medium text-[#181816]">
                <p>
                  GOOD TECHNOLOGY ISN&apos;T JUST<br />
                  ABOUT HOW IT LOOKS.<br />
                  IT&apos;S ABOUT HOW IT PERFORMS,<br />
                  HOW RELIABLE IT RUNS, AND<br />
                  WHAT PROBLEM IT SOLVES.
                </p>
                <p>
                  FROM BITS TO ATOMS.<br />
                  I ARCHITECT WITH PURPOSE.<br />
                  I BUILD WITH PRECISION.<br />
                  I DELIVER WITH PRIDE.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-2">
              <p className="font-mono-tech text-[10.5px] leading-[1.4] uppercase italic font-semibold text-[#181816]">
                NO TRENDS.<br />
                ONLY WORKING SYSTEMS.
              </p>
            </div>

            {/* Signature Black Cutout Triangle in Bottom Right */}
            <div
              className="w-20 h-11 bg-[#181816] absolute bottom-2.5 right-3"
              style={{
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
              }}
            />
          </div>

          {/* COLUMN 3: TECH STACK */}
          <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <h2 className="font-anton text-2xl sm:text-[26px] tracking-wide uppercase text-[#1c1c1a]">
                  TECH STACK
                </h2>
                <span className="w-5 h-[2.5px] bg-[#1c1c1a]" />
              </div>

              <ul className="space-y-2.5">
                {techStack.map((tech) => (
                  <li
                    key={tech}
                    className="flex items-center justify-between font-mono-tech text-[11.5px] tracking-wider font-medium text-[#1c1c1a] group cursor-default"
                  >
                    <span className="group-hover:translate-x-1 transition-transform group-hover:text-[#E84E0F]">
                      {tech}
                    </span>
                    <span className="w-1.5 h-1.5 bg-[#1c1c1a] group-hover:bg-[#E84E0F] transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </section>

        {/* =========================================================
            5. CREDENTIALS & LICENSES (EXACTLY MATCHING SELECTED WORK)
        ========================================================= */}
        <section id="credentials" className="relative z-20 bg-[#181816] text-[#EAE6DF] flex flex-col md:flex-row border-t border-b border-[#2b2b28]">

          {/* Left Vertical Orange Sidebar */}
          <div className="bg-[#E84E0F] text-[#181816] md:w-[68px] py-3.5 px-6 md:py-6 md:px-0 flex items-center justify-between md:justify-center shrink-0 self-stretch select-none">
            <div className="font-mono-tech font-bold text-xs sm:text-[13px] tracking-[0.24em] uppercase flex items-center gap-2.5 md:[writing-mode:vertical-rl] md:rotate-180">
              <span>CREDENTIALS</span>
              <span className="inline-block w-[10px] h-[2px] md:w-[2.5px] md:h-[12px] bg-[#181816]" />
            </div>
          </div>

          {/* Credentials Cards Grid - ULTRA CLEAN */}
          <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
              {pagedCerts.map((cert, cIdx) => (
                <div 
                  key={cert.id || cIdx}
                  onClick={() => setSelectedCert(cert)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Clean Orange Index */}
                  <span className="text-[#E84E0F] font-mono-tech text-xs sm:text-sm font-semibold mb-2.5 tracking-wider block">
                    {String(certPage * 3 + cIdx + 1).padStart(2, '0')}/
                  </span>

                  {/* Clean Certificate Thumbnail - ZERO TEXT ON IMAGE */}
                  <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] border border-[#2e2e2b] overflow-hidden mb-3.5">
                    {cert.certificate_url ? (
                      <img
                        src={cert.certificate_url}
                        alt={cert.title}
                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#141413] p-4 flex flex-col justify-between text-[#8e8d87] font-mono-tech text-[9px] uppercase">
                        <div className="flex justify-between items-center text-[#E84E0F]">
                          <span>[ARCHIVE ATTESTATION]</span>
                          <span>OFFICIAL</span>
                        </div>
                        <div className="text-xs font-bold text-[#EAE6DF] truncate">{cert.institution}</div>
                        <div>VALIDATED RECORD</div>
                      </div>
                    )}

                    {/* Bottom Right Orange Action Tag */}
                    <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <CornerDownRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#181816] stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Clean Titles Below Thumbnail */}
                  <h3 className="font-mono-tech text-xs sm:text-[13px] font-bold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors uppercase truncate">
                    {cert.title}
                  </h3>
                  <p className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider text-[#8e8d87] uppercase mt-1 truncate">
                    {cert.institution} · {cert.period}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtle Minimal Pagination & Filter at Bottom */}
            <div className="mt-8 pt-4 border-t border-[#252522] flex flex-wrap items-center justify-between gap-3 font-mono-tech text-[10px] text-[#8e8d87] uppercase tracking-wider">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[#8e8d87]">CATEGORY:</span>
                {['all', 'verified', 'national', 'competition'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setCertFilter(tab); setCertPage(0); }}
                    className={`px-2 py-0.5 border cursor-pointer transition-colors ${certFilter === tab ? 'border-[#E84E0F] text-[#E84E0F] font-bold' : 'border-transparent text-[#8e8d87] hover:text-[#EAE6DF]'}`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span>{certPage * 3 + 1}–{Math.min((certPage + 1) * 3, filteredCerts.length)} OF {filteredCerts.length}</span>
                <button
                  disabled={certPage === 0}
                  onClick={() => setCertPage(p => Math.max(0, p - 1))}
                  className="px-2.5 py-1 border border-[#2e2e2b] enabled:hover:border-[#E84E0F] enabled:hover:text-[#E84E0F] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  ← PREV
                </button>
                <button
                  disabled={(certPage + 1) * 3 >= filteredCerts.length}
                  onClick={() => setCertPage(p => p + 1)}
                  className="px-2.5 py-1 border border-[#2e2e2b] enabled:hover:border-[#E84E0F] enabled:hover:text-[#E84E0F] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            6. SPECIAL FEATURE: SKILLSTREAK.ID CTA BANNER
        ========================================================= */}
        <section className="relative z-20 bg-[#EAE6DF] text-[#181816] border-t border-b border-[#1c1c1a]/20 p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 bg-[#E84E0F]" />
                <span className="font-mono-tech text-[11px] font-bold tracking-widest text-[#E84E0F] uppercase">
                  [ CODING EDUCATION PLATFORM · FOUNDED BY GHIFFA ]
                </span>
              </div>
              <h2 className="font-anton text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#181816] leading-[0.92] mb-3">
                SKILLSTREAK.ID
              </h2>
              <p className="font-mono-tech text-xs sm:text-[13px] leading-relaxed text-[#3a3935] uppercase font-medium max-w-xl">
                The fastest path from zero to deployable software engineer. Built with gamified streaks, live code evaluators, and production-grade curriculum.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 font-mono-tech text-[10px] uppercase text-[#6e6c64] font-semibold">
                <span>⚡ XP REWARD SYSTEM</span>
                <span className="hidden sm:inline">•</span>
                <span>🔥 DAILY STREAK ENGINE</span>
                <span className="hidden sm:inline">•</span>
                <span>💻 LIVE CODE EVALUATOR</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              <a
                href="https://skillstreak.web.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#181816] text-[#EAE6DF] hover:bg-[#E84E0F] hover:text-[#181816] px-7 py-4 font-mono-tech text-xs font-bold uppercase tracking-wider transition-colors group cursor-pointer border border-[#181816]"
              >
                <span>EXPLORE SKILLSTREAK.ID</span>
                <CornerDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform stroke-[2.5]" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. VISUAL DISPATCHES (EXACTLY MATCHING SELECTED WORK)
        ========================================================= */}
        <section id="dispatches" className="relative z-20 bg-[#181816] text-[#EAE6DF] flex flex-col md:flex-row border-t border-b border-[#2b2b28]">

          {/* Left Vertical Orange Sidebar */}
          <div className="bg-[#E84E0F] text-[#181816] md:w-[68px] py-3.5 px-6 md:py-6 md:px-0 flex items-center justify-between md:justify-center shrink-0 self-stretch select-none">
            <div className="font-mono-tech font-bold text-xs sm:text-[13px] tracking-[0.24em] uppercase flex items-center gap-2.5 md:[writing-mode:vertical-rl] md:rotate-180">
              <span>DISPATCHES</span>
              <span className="inline-block w-[10px] h-[2px] md:w-[2.5px] md:h-[12px] bg-[#181816]" />
            </div>
          </div>

          {/* Visual Dispatches Cards Grid - ULTRA CLEAN */}
          <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
              {pagedInstagramPosts.map((post, pIdx) => {
                const mediaUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;
                return (
                  <a
                    key={post.id || pIdx}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Clean Orange Index */}
                    <span className="text-[#E84E0F] font-mono-tech text-xs sm:text-sm font-semibold mb-2.5 tracking-wider block">
                      {String(igPage * 3 + pIdx + 1).padStart(2, '0')}/
                    </span>

                    {/* Clean Instagram Photo Thumbnail - ZERO TEXT ON IMAGE */}
                    <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] border border-[#2e2e2b] overflow-hidden mb-3.5">
                      <img
                        src={mediaUrl}
                        alt={post.caption || 'Instagram dispatch'}
                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                        }}
                      />

                      {/* Bottom Right Orange Action Tag */}
                      <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#E84E0F] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <CornerDownRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#181816] stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Clean Titles Below Thumbnail */}
                    <h3 className="font-mono-tech text-xs sm:text-[13px] font-bold tracking-wider text-[#EAE6DF] group-hover:text-[#E84E0F] transition-colors uppercase truncate">
                      {post.caption ? post.caption.split('\n')[0] : 'FIELD TELEMETRY & LAB NOTES'}
                    </h3>
                    <p className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider text-[#8e8d87] uppercase mt-1 truncate">
                      INSTAGRAM · {formatIgDate(post.timestamp)}
                    </p>
                  </a>
                );
              })}
            </div>

            {/* Subtle Minimal Bottom Bar */}
            <div className="mt-8 pt-4 border-t border-[#252522] flex items-center justify-between font-mono-tech text-[10px] text-[#8e8d87] uppercase tracking-wider">
              <a
                href="https://www.instagram.com/haikaljibraan/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E84E0F] transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>@HAIKALJIBRAAN</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <span>{igPage * 3 + 1}–{Math.min((igPage + 1) * 3, displayedInstagramPosts.length)} OF {displayedInstagramPosts.length}</span>
                <button
                  disabled={igPage === 0}
                  onClick={() => setIgPage(p => Math.max(0, p - 1))}
                  className="px-2.5 py-1 border border-[#2e2e2b] enabled:hover:border-[#E84E0F] enabled:hover:text-[#E84E0F] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  ← PREV
                </button>
                <button
                  disabled={(igPage + 1) * 3 >= displayedInstagramPosts.length}
                  onClick={() => setIgPage(p => p + 1)}
                  className="px-2.5 py-1 border border-[#2e2e2b] enabled:hover:border-[#E84E0F] enabled:hover:text-[#E84E0F] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* =========================================================
            7. FOOTER (CTA + CONTACT DETAILS + ROTATING STAMP & BARCODE)
        ========================================================= */}
        <footer id="contact" className="relative z-20 bg-[#141413] text-[#EAE6DF] px-6 sm:px-10 py-9 border-t border-[#2b2b28]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* LEFT: VERTICAL TEXT + CTA HEADLINE */}
            <div className="lg:col-span-5 flex items-stretch gap-5">

              {/* Vertical "LET'S BUILD SOMETHING BOLD." */}
              <div className="hidden sm:flex items-center pr-4 border-r border-[#EAE6DF]/25 select-none">
                <div className="font-mono-tech text-[10px] tracking-[0.18em] uppercase [writing-mode:vertical-rl] rotate-180 flex items-center gap-2 text-[#EAE6DF]/90">
                  <span>LET&apos;S BUILD</span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-[#E84E0F]" />
                    <span>SOMETHING BOLD.</span>
                  </span>
                </div>
              </div>

              {/* Main Orange Footer Headline */}
              <div className="flex flex-col justify-between">
                <h2 className="font-anton text-3xl sm:text-[36px] leading-[1.03] tracking-wide uppercase text-[#E84E0F]">
                  READY TO<br />
                  ELEVATE YOUR<br />
                  DIGITAL PRESENCE?
                </h2>

                {/* Chalk/Brush White Underline Stroke */}
                <svg className="w-48 h-3 my-2.5" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 7.5C45 3.5 135 2.5 198 6.5"
                    stroke="#EAE6DF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="font-mono-tech text-[10px] leading-[1.45] tracking-[0.08em] text-[#b8b5ad] uppercase">
                  I&apos;M ALWAYS OPEN TO<br />
                  NEW CHALLENGES AND<br />
                  EXCITING COMMISSIONS.
                </p>
              </div>
            </div>

            {/* CENTER: CONTACT LINKS */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <h3 className="font-anton text-base tracking-wider uppercase text-[#EAE6DF] pb-2 mb-3 border-b border-[#EAE6DF]/20">
                DIRECT CONTACT
              </h3>

              <ul className="space-y-2.5 font-mono-tech text-[10.5px] tracking-[0.06em] text-[#d6d3cb]">
                <li>
                  <a href={`mailto:${emailAddress}`} className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Mail className="w-2.5 h-2.5" />
                    </span>
                    <span className="uppercase">{emailAddress}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${phone}`} className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <Phone className="w-2.5 h-2.5" />
                    </span>
                    <span>{phone}</span>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/haikaljibraan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <InstagramIcon />
                    </span>
                    <span>INSTAGRAM.COM/HAIKALJIBRAAN</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/ghiffa08" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <GithubIcon />
                    </span>
                    <span>GITHUB.COM/GHIFFA08</span>
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/haikaljibraan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#E84E0F] transition-colors">
                    <span className="w-5 h-5 rounded-full border border-[#EAE6DF]/40 flex items-center justify-center shrink-0">
                      <LinkedinIcon />
                    </span>
                    <span>LINKEDIN.COM/IN/HAIKALJIBRAAN</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* RIGHT: CIRCULAR STRATEGY STAMP & BARCODE */}
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-between gap-4">
              <RotatingStamp />
              <BarcodeGraphic />
            </div>

          </div>
        </footer>

        {/* =========================================================
            INTERACTIVE PROJECT CASE STUDY PREVIEW MODAL
        ========================================================= */}
        {selectedProjectModal && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedProjectModal(null)}
          >
            <div
              className="bg-[#EAE6DF] border-2 border-[#181816] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono-tech text-xs font-bold text-[#E84E0F] bg-[#181816] px-2.5 py-1">
                  {selectedProjectModal.num} {selectedProjectModal.category}
                </span>
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="font-mono-tech text-xs font-bold text-[#181816] hover:text-[#E84E0F] cursor-pointer"
                >
                  [CLOSE X]
                </button>
              </div>
              <h3 className="font-anton text-3xl uppercase text-[#181816] mb-3">
                {selectedProjectModal.title}
              </h3>
              {selectedProjectModal.img && (
                <div className="aspect-[16/9] w-full bg-[#181816] mb-4 overflow-hidden border border-[#181816]">
                  <img src={selectedProjectModal.img} alt={selectedProjectModal.title} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="font-mono-tech text-xs leading-relaxed text-[#2b2b29] mb-4">
                {selectedProjectModal.desc}
              </p>
              <div className="font-mono-tech text-[10px] text-[#4a4946] mb-6 uppercase">
                <span>CLIENT / IMPACT: </span>
                <strong className="text-[#181816]">{selectedProjectModal.stat}</strong>
              </div>
              {selectedProjectModal.link && selectedProjectModal.link !== '#' && (
                <a
                  href={selectedProjectModal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#E84E0F] text-[#181816] font-mono-tech text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#181816] hover:text-[#EAE6DF] transition-colors"
                >
                  <span>VISIT LIVE SYSTEM</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            CERTIFICATE PREVIEW MODAL
        ========================================================= */}
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedCert(null)}
          >
            <div
              className="bg-[#EAE6DF] border-2 border-[#181816] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono-tech text-xs font-bold text-[#E84E0F] bg-[#181816] px-2.5 py-1">
                  [CREDENTIAL: {selectedCert.period || 'OFFICIAL'}]
                </span>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="font-mono-tech text-xs font-bold text-[#181816] hover:text-[#E84E0F] cursor-pointer"
                >
                  [CLOSE X]
                </button>
              </div>
              <div className="font-mono-tech text-xs font-bold text-[#E84E0F] uppercase mb-1">
                {selectedCert.institution}
              </div>
              <h3 className="font-anton text-2xl sm:text-3xl uppercase text-[#181816] mb-4">
                {selectedCert.title}
              </h3>

              {selectedCert.certificate_url && (
                <div className="w-full bg-[#181816] border border-[#181816] mb-4 overflow-hidden flex items-center justify-center min-h-[300px]">
                  {selectedCert.certificate_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe src={selectedCert.certificate_url} title={selectedCert.title} className="w-full h-[60vh] border-0" />
                  ) : (
                    <img src={selectedCert.certificate_url} alt={selectedCert.title} className="w-full h-auto max-h-[60vh] object-contain" />
                  )}
                </div>
              )}

              {selectedCert.description && (
                <p className="font-mono-tech text-xs text-[#2b2b29] mb-4">
                  {selectedCert.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#1c1c1a]/20">
                <span className="font-mono-tech text-[10px] text-[#4a4946] uppercase">OFFICIALLY RECORDED IN ARCHIVE</span>
                {selectedCert.certificate_url && (
                  <a
                    href={selectedCert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 bg-[#E84E0F] text-[#181816] font-mono-tech text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-[#181816] hover:text-[#EAE6DF] transition-colors"
                  >
                    <span>OPEN SOURCE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
