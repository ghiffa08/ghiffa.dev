import React, { useState, useEffect } from 'react';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { useInstagramFeed } from '../hooks/useInstagramFeed';
import { SEO } from '../components/atoms/SEO';

export default function Portfolio() {
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: supabaseProjects } = useSupabaseList('projects');
  const { data: supabaseExperiences } = useSupabaseList('experiences');
  const { data: supabaseQualifications } = useSupabaseList('qualifications');

  // Instagram Feed Data
  const { data: instagramPosts, isLoading: igLoading, error: igError } = useInstagramFeed();
  const [igCount, setIgCount] = useState(8);

  // Certificate Modal & Filter state
  const [selectedCert, setSelectedCert] = useState(null);
  const [certFilter, setCertFilter] = useState('all'); // 'all' | 'verified' | 'national' | 'competition'
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Multi-page navigation state: 'home' | 'about' | 'work'
  const [currentPage, setCurrentPage] = useState('home');

  // Work page layout state: 'grid' | 'table'
  const [workLayout, setWorkLayout] = useState('grid');

  // Filter states
  const [homeFilter, setHomeFilter] = useState('all');
  const [workFilter, setWorkFilter] = useState('all');

  // Accordion state (0 open by default like the source)
  const [openAccordion, setOpenAccordion] = useState(0);

  // Case study modal state (index of projectsData or null)
  const [modalIndex, setModalIndex] = useState(null);

  // Live clock
  const [clockTime, setClockTime] = useState('JST (UTC+9)');

  // Email copy state
  const [copied, setCopied] = useState(false);

  // Contact form state
  const [formFeedback, setFormFeedback] = useState(false);

  // Dynamic user data with authentic fallbacks from Supabase personal_info & general_settings
  const displayName = info?.full_name ? info.full_name.split(' ')[0] : 'Ghiffa';
  const fullName = info?.full_name || 'Haikal Jibran Al-Ghiffarry';
  const roleTitle = info?.role || 'IoT Engineer & Full-stack Developer';
  const emailAddress = info?.email || 'hello@ghiffa.dev';
  const headline = info?.headline || 'Building the bridge between bits and atoms.';
  const appBrand = (settings?.app_name ? settings.app_name.replace('.dev', '') : 'GHIFFA').toUpperCase();
  const availabilityStatus = info?.availability_status || 'Available for work';
  const aboutBio = info?.about_content_en || info?.about_content || "I believe the best technology doesn't just live on a screen. It must directly interact with and transform the real world. That is the core of my professional philosophy: 'From Bits to Atoms' translating digital architecture and lines of code (Bits) into physical hardware that makes a tangible impact in the field (Atoms).";

  // Dynamic Marquee skills from personal_info.skills
  const marqueeSkills = (info?.skills && Array.isArray(info.skills) && info.skills.length > 0)
    ? info.skills
    : ["REACT", "NEXT.JS", "TAILWIND CSS", "LARAVEL", "NODE.JS", "EXPRESS", "POSTGRESQL", "MYSQL", "SUPABASE", "GSAP", "WEB DESIGN", "UI/UX", "ESP32 MICROCONTROLLER", "LORA TELEMETRY", "MQTT", "CUSTOM PCB DESIGN", "SMART IRRIGATION SYSTEM"];

  // Dynamic metrics from actual database counts
  const shippedCount = String(supabaseProjects?.length || 11).padStart(3, '0');
  const recognitionsCount = String(supabaseQualifications?.length || 38);
  const yearsCount = '05';

  // 8 Complete Case Studies matching LEQUON/01 architecture from source
  const defaultProjects = [
    {
      id: 0,
      folio: "[ FOLIO / 01 · CASE STUDY ]",
      meta: "BRAND SYSTEM · DIGITAL MONOGRAPH · 2026",
      title: "Novaire Architecture",
      subtitle: "Architecture",
      category: "identity",
      client: "Novaire",
      location: "ZURICH",
      year: "2026",
      discipline: "Brand System · Digital Monograph",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      desc: "Modular identity system and digital monograph for a Zurich-based architectural practice.",
      challenge: "Novaire needed to transition from a regional Zurich studio into an international architectural practice without losing the quiet rigor of their physical buildings.",
      solution: "We constructed a strict 12-column swiss grid system paired with a bespoke serif monograph layout, indexing 14 years of built works by material, typology, and latitude.",
      stat: "+140% International Commission Inquiries"
    },
    {
      id: 1,
      folio: "[ FOLIO / 02 · CASE STUDY ]",
      meta: "VARIABLE TYPE · E-COMMERCE · 2025",
      title: "MONO/TYPE Foundry",
      subtitle: "Foundry",
      category: "digital",
      client: "MONO/TYPE",
      location: "BERLIN",
      year: "2025",
      discipline: "Variable Type · E-Commerce",
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85",
      desc: "Bespoke variable type specimen tester and e-commerce engine for an independent foundry.",
      challenge: "Traditional type foundries bury their typefaces under bloated licensing calculators and slow specimen PDFs.",
      solution: "Designed an immediate, zero-latency browser specimen playground with real-time OpenType feature toggles and a frictionless 2-step licensing checkout.",
      stat: "3.8× Increase in Direct License Conversions"
    },
    {
      id: 2,
      folio: "[ FOLIO / 03 · CASE STUDY ]",
      meta: "PACKAGING ARCHITECTURE · PRINT · 2025",
      title: "Vale&Form Objects",
      subtitle: "Objects",
      category: "editorial",
      client: "Vale&Form",
      location: "KYOTO",
      year: "2025",
      discipline: "Packaging Architecture · Print",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
      desc: "Tactile packaging architecture and print catalogue for apothecary & ceramic objects.",
      challenge: "Create a zero-plastic packaging system and seasonal print index for a Kyoto-based botanical and ceramic object label.",
      solution: "Utilized blind debossing on uncoated Japanese cotton stock with numbered batch labels inspired by archival herbarium specimens.",
      stat: "Featured in Communication Arts & Awwwards"
    },
    {
      id: 3,
      folio: "[ FOLIO / 04 · CASE STUDY ]",
      meta: "HARDWARE UI · LAUNCH SYSTEM · 2024",
      title: "Arclane Audio",
      subtitle: "Audio",
      category: "digital",
      client: "Arclane",
      location: "TOKYO",
      year: "2024",
      discipline: "Hardware UI · Launch System",
      img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85",
      desc: "Industrial hardware interface and web launch system for a Tokyo synthesizer lab.",
      challenge: "Unify the physical silk-screened interface of Arclane's flagship analog synthesizer with their digital documentation and launch film.",
      solution: "Developed a custom high-legibility technical micro-type system and interactive web audio patch explorer.",
      stat: "First Production Batch Sold Out in 18 Hours"
    },
    {
      id: 4,
      folio: "[ FOLIO / 05 · CASE STUDY ]",
      meta: "BRAND SYSTEM · PRINT · 2024",
      title: "BRIXEN Atelier",
      subtitle: "Atelier",
      category: "identity",
      client: "BRIXEN",
      location: "MILAN",
      year: "2024",
      discipline: "Identity · Exhibition Print",
      img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
      desc: "Architectural lighting identity, technical specification sheets, and Salone del Mobile exhibition.",
      challenge: "Establish an authoritative architectural lighting identity and technical specification system ahead of Salone del Mobile in Milan.",
      solution: "Created an industrial cataloguing system inspired by 1970s European electrical schematics, unifying product stamps, crates, and digital spec sheets.",
      stat: "Adopted by 240+ Architectural Specifiers"
    },
    {
      id: 5,
      folio: "[ FOLIO / 06 · CASE STUDY ]",
      meta: "BOOK DESIGN · ART DIRECTION · 2024",
      title: "KINFOLK Archive Vol. IV",
      subtitle: "Archive Vol. IV",
      category: "editorial",
      client: "KINFOLK",
      location: "COPENHAGEN",
      year: "2024",
      discipline: "Editorial Monograph · Print",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85",
      desc: "340-page linen-bound editorial anthology exploring Nordic & Japanese spatial restraint.",
      challenge: "Design a landmark 340-page hardcover anthology celebrating ten years of spatial essays and monochrome portrait commissions.",
      solution: "Paired custom-milled Munken print paper with raw Japanese linen bindings and a Swiss baseline grid that accommodates bilingual essays.",
      stat: "15,000 First-Edition Copies Sold Worldwide"
    },
    {
      id: 6,
      folio: "[ FOLIO / 07 · CASE STUDY ]",
      meta: "IDENTITY · E-COMMERCE · 2023",
      title: "Sori Studio",
      subtitle: "Studio",
      category: "identity",
      client: "Sori Studio",
      location: "SEOUL",
      year: "2023",
      discipline: "Brand Identity · E-Commerce",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      desc: "Garment label architecture, woven care tags, and lookbook platform for a Seoul atelier.",
      challenge: "Translate the quiet drape and unbleached textile philosophy of a Seoul garment studio into a global direct-to-consumer flagship.",
      solution: "Designed an editorial lookbook commerce experience where every garment is documented like an archival gallery piece with fabric weight specs.",
      stat: "+210% Direct Global Online Revenue"
    },
    {
      id: 7,
      folio: "[ FOLIO / 08 · CASE STUDY ]",
      meta: "DESIGN SYSTEM · WEB · 2023",
      title: "NORD/OST Research",
      subtitle: "Research",
      category: "digital",
      client: "NORD/OST",
      location: "STOCKHOLM",
      year: "2023",
      discipline: "Design System · Digital Publication",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      desc: "Data-driven publication portal and visual identity for a Scandinavian climate think tank.",
      challenge: "Make complex Nordic urban climate data legible and engaging for policymakers, architects, and the general public.",
      solution: "Engineered a modular Webflow CMS publication platform featuring interactive cartographic diagrams and automated footnote indexing.",
      stat: "Winner of TDC Typographic Excellence"
    }
  ];

  // Fully Dynamic projects mapped from Supabase with rich fallbacks
  const projectsData = (supabaseProjects && supabaseProjects.length > 0)
    ? supabaseProjects.map((sp, idx) => {
        const dp = defaultProjects[idx % defaultProjects.length];
        const rawCat = (sp.category || '').toLowerCase();
        let cat = 'digital';
        if (rawCat.includes('komersial') || rawCat.includes('brand') || rawCat.includes('identity')) {
          cat = 'identity';
        } else if (rawCat.includes('iot') || rawCat.includes('mobile') || rawCat.includes('app') || rawCat.includes('hardware')) {
          cat = 'digital';
        } else {
          cat = 'editorial';
        }

        return {
          id: idx,
          dbId: sp.id,
          folio: `[ FOLIO / ${String(idx + 1).padStart(2, '0')} · CASE STUDY ]`,
          meta: `${(sp.category || 'SYSTEM').toUpperCase()} · ${sp.year || '2025'}`,
          title: sp.title || dp.title,
          subtitle: sp.category || dp.subtitle,
          category: cat,
          rawCategory: sp.category || 'System',
          client: sp.client || dp.client,
          location: 'INDONESIA',
          year: sp.year || dp.year,
          discipline: sp.category || dp.discipline,
          img: sp.image_url || (Array.isArray(sp.image_urls) && sp.image_urls[0]) || dp.img,
          imageUrls: Array.isArray(sp.image_urls) ? sp.image_urls : [],
          desc: sp.description || dp.desc,
          challenge: sp.description || dp.challenge,
          solution: sp.content || dp.solution,
          stat: sp.client ? `Client: ${sp.client}` : dp.stat,
          techStack: Array.isArray(sp.tech_stack) ? sp.tech_stack : [],
          link: sp.link,
          githubUrl: sp.github_url
        };
      })
    : defaultProjects;

  // 12 Collaborators matching real clients from projects, experiences & qualifications with fallbacks
  const defaultCollabNames = [
    "PT BPR Raksa Wacana", "Bank Raksa Indonesia", "PT Bengkel Aplikasi", "LSP-P1 SMKN 2", 
    "HIMA-TI UNIKU", "AgriNex Systems", "Universitas Kuningan", "Universitas Syiah Kuala", 
    "BNSP & Kominfo", "PT Astra International", "Universitas Pancasakti", "SMKN 2 Kuningan"
  ];

  const clientList = Array.from(new Set([
    ...(supabaseProjects || []).map(p => p.client).filter(Boolean),
    ...(supabaseExperiences || []).map(e => e.company).filter(Boolean),
    ...(supabaseQualifications || []).map(q => q.institution).filter(Boolean)
  ]));

  const collaborators = Array.from({ length: 12 }, (_, i) => ({
    no: String(i + 1).padStart(2, '0'),
    name: clientList[i] || defaultCollabNames[i]
  }));

  // Chronology from supabase experiences or default
  const careerChronology = (supabaseExperiences && supabaseExperiences.length > 0)
    ? supabaseExperiences.map(e => ({
        period: e.period || '2024',
        title: e.role || 'Software Engineer',
        company: e.company || 'Engineering Practice',
        desc: e.description || 'Design and system architecture.'
      }))
    : [
        { period: "OKT 2024 — FEB 2025", title: "Web Developer", company: "PT. BENGKEL APLIKASI NUSANTARA", desc: "Engineered scalable web applications and high-performance client API architectures." },
        { period: "MEI 2024 — JUN 2024", title: "Web Developer & System Designer", company: "LSP-P1 SMKN 2 KUNINGAN", desc: "Designed competency assessment systems and administrative web modules." },
        { period: "SEP 2023 — DEC 2023", title: "Website Developer", company: "PT BPR RAKSA WACANA AGRI PURNAMA", desc: "Built banking analytics modules and optimized internal IT network infrastructure." },
        { period: "SEP 2023", title: "IT Support Specialist", company: "PT BPR RAKSA WACANA AGRI PURNAMA", desc: "Maintained IT infrastructure and technical banking operations stability." }
      ];

  // Honors & Awards from qualifications
  const honorsList = (supabaseQualifications && supabaseQualifications.length > 0)
    ? [
        ...supabaseQualifications.filter(q => q.type === 'honor'),
        ...supabaseQualifications.filter(q => q.type === 'certification')
      ].slice(0, 8).map(q => ({
        org: q.institution || (q.type === 'honor' ? 'HONOR & RECOGNITION' : 'PROFESSIONAL CERTIFICATION'),
        title: q.title,
        desc: q.description || (q.type === 'honor' ? 'Academic / National Recognition' : 'Certified Professional Competency'),
        year: q.period || '2025',
        certUrl: q.certificate_url,
        isHonor: q.type === 'honor'
      }))
    : [
        { org: "UNIVERSITAS KUNINGAN", title: "Juara 1 PILMAPRES (Mahasiswa Berprestasi) 2026", desc: "Rank 1 Outstanding Student Award across University level.", year: "2026", isHonor: true },
        { org: "UNIVERSITAS SYIAH KUALA", title: "2nd Place Winner – International Digital Math Competition", desc: "International mathematics & digital innovation competition.", year: "2025", isHonor: true },
        { org: "UNIVERSITAS PANCASAKTI", title: "2nd Runner Up – National Business Plan Competition", desc: "Canva Design & digital product business strategy.", year: "2026", isHonor: true },
        { org: "BNSP & KOMINFO", title: "Junior Web Developer Certified", desc: "National professional competency certification in full-stack web engineering.", year: "2024", isHonor: false }
      ];

  // Education list from qualifications
  const educationList = (supabaseQualifications && supabaseQualifications.length > 0)
    ? supabaseQualifications
        .filter(q => q.type === 'education')
        .map(q => ({
          institution: q.institution,
          title: q.title,
          period: q.period,
          desc: q.description || 'Formal degree and engineering curriculum.'
        }))
    : [
        { institution: "UNIVERSITAS KUNINGAN", title: "Teknik Informatika", period: "2024 — PRESENT", desc: "Computer Science & Informatics Engineering degree." },
        { institution: "SMKN 2 KUNINGAN", title: "Rekayasa Perangkat Lunak", period: "2021 — 2024", desc: "Vocational software engineering & web development program." }
      ];

  // Dynamic category counts
  const categoryCounts = {
    all: projectsData.length,
    identity: projectsData.filter(p => p.category === 'identity').length,
    digital: projectsData.filter(p => p.category === 'digital').length,
    editorial: projectsData.filter(p => p.category === 'editorial').length,
  };

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

  // Certifications filter
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

  const displayedCerts = showAllCerts ? filteredCerts : filteredCerts.slice(0, 6);

  // Helper to format ISO timestamp into monospace Swiss Design friendly format (e.g. "10 JUL 2026")
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

  // Default Instagram fallbacks if network is offline or token needs refresh
  const fallbackInstagramPosts = [
    {
      id: "ig-1",
      permalink: "https://www.instagram.com/p/DDS_AlvTWUy/",
      caption: "Merupakan sebuah kehormatan bisa bertemu langsung dengan sosok yang sangat berpengaruh dalam perjalanan saya, Bapak Sandhika Galih di DevFest Bandung 2024. We are programmers, unite!",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://instagram.fbdo7-1.fna.fbcdn.net/v/t51.82787-15/651910368_18004272569854743_466558839764470286_n.webp",
      timestamp: "2024-12-08T00:05:47+0000"
    },
    {
      id: "ig-2",
      permalink: "https://www.instagram.com/p/C6vZglurhj1/",
      caption: "Tiga tahun, ribuan baris kode. Meraih predikat nilai tertinggi Uji Kompetensi Keahlian (UKK) di SMKN 2 Kuningan jurusan Rekayasa Perangkat Lunak. The real coding begins now!",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://instagram.fbdo7-1.fna.fbcdn.net/v/t51.82787-15/658321659_18205027192332288_6031163848411633467_n.webp",
      timestamp: "2024-05-09T08:13:32+0000"
    },
    {
      id: "ig-3",
      permalink: "https://www.instagram.com/p/CvUx7g2LQmt/",
      caption: "Program Astra Voca Preneur di Desa Sejahtera Astra, Mangunan Yogyakarta. Membawa ide lingkungan RETHREEE ke panggung nasional bersama PT Astra International Tbk.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://instagram.fbdo7-1.fna.fbcdn.net/v/t51.82787-15/654022819_18086771207583898_6508677857259860684_n.webp",
      timestamp: "2023-07-30T14:22:06+0000"
    },
    {
      id: "ig-4",
      permalink: "https://www.instagram.com/p/CqQBrFXL-LN/",
      caption: "Marketplace digital REThreee untuk pengrajin daur ulang dan eco-friendly diapresiasi Juara 1. Validasi bahwa ide anak muda untuk lingkungan bisa punya panggung.",
      media_type: "CAROUSEL_ALBUM",
      media_url: "https://instagram.fbdo7-1.fna.fbcdn.net/v/t51.82787-15/653411830_18117109447653173_346985710592717213_n.webp",
      timestamp: "2023-03-26T11:26:30+0000"
    }
  ];

  const displayedInstagramPosts = (instagramPosts && instagramPosts.length > 0)
    ? instagramPosts
    : fallbackInstagramPosts;

  // Live clock (WIB / UTC+7)
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        setClockTime(`${timeString} WIB (UTC+7)`);
      } catch (err) {
        setClockTime('WIB (UTC+7)');
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Page Switcher helper
  const switchPage = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal helpers
  const openProjectModal = (index) => {
    setModalIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setModalIndex(null);
    setSelectedCert(null);
    document.body.style.overflow = '';
  };

  const nextProjectInModal = () => {
    if (modalIndex !== null) {
      setModalIndex((modalIndex + 1) % projectsData.length);
    }
  };

  // Escape key handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalIndex, selectedCert]);

  // Copy email
  const copyEmail = () => {
    navigator.clipboard?.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormFeedback(true);
    e.target.reset();
    setTimeout(() => setFormFeedback(false), 5000);
  };

  // Filter home projects
  const filteredHomeProjects = projectsData.filter(p => {
    if (homeFilter === 'all') return true;
    return p.category === homeFilter;
  }).slice(0, 4);

  // Filter work projects
  const filteredWorkProjects = projectsData.filter(p => {
    if (workFilter === 'all') return true;
    return p.category === workFilter;
  });

  // Reusable 12-Column Background Grid Lines
  const BackgroundGridLines = () => (
    <div className="section-bg-line-container pointer-events-none">
      <div className="section-bg-line placeholder-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line"></div>
      <div className="section-bg-line placeholder-line"></div>
    </div>
  );

  return (
    <div className="bg-[#F0EFE9] text-[#121210] font-sans overflow-x-hidden selection:bg-[#FF441F] selection:text-white min-h-screen">
      <SEO 
        title={`${fullName} — Independent Practice | LEQUON STUDIO`} 
        description={headline}
      />

      {/* Subtle Print Texture Overlay */}
      <div className="grain-overlay"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F0EFE9]/95 backdrop-blur-sm border-b border-[#111111]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between border-x border-[#111111]/[0.18]">
          {/* Left Brand Logo */}
          <button onClick={() => switchPage('home')} className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer">
            {/* Lequon Pill-Cutout Icon */}
            <svg className="w-4 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16344 0 0 7.16344 0 16V26C0 34.8366 7.16344 42 16 42V21H32V16C32 7.16344 24.8366 0 16 0Z" fill="#121210"/>
              <path d="M16 21H32V26C32 34.8366 24.8366 42 16 42V21Z" fill="#FF441F"/>
            </svg>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold tracking-tight text-sm uppercase text-[#121210]">{appBrand}</span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-[#6E6D68] uppercase">STUDIO</span>
            </div>
          </button>

          {/* Center Navigation Links (Multi-Page Switcher) */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-[10px] tracking-[0.14em] uppercase">
            <button 
              onClick={() => switchPage('home')} 
              className={`nav-item transition-colors cursor-pointer ${currentPage === 'home' ? 'nav-link-active' : 'text-[#121210] hover:text-[#FF441F]'}`}
            >
              <span className="text-[#6E6D68] mr-1">00</span>HOME
            </button>
            <button 
              onClick={() => switchPage('about')} 
              className={`nav-item transition-colors cursor-pointer ${currentPage === 'about' ? 'nav-link-active' : 'text-[#121210] hover:text-[#FF441F]'}`}
            >
              <span className="text-[#6E6D68] mr-1">01</span>ABOUT
            </button>
            <button 
              onClick={() => switchPage('work')} 
              className={`nav-item transition-colors cursor-pointer ${currentPage === 'work' ? 'nav-link-active' : 'text-[#121210] hover:text-[#FF441F]'}`}
            >
              <span className="text-[#6E6D68] mr-1">02</span>WORK
            </button>
            <a 
              href="#credentials" 
              onClick={(e) => {
                if (currentPage !== 'home') {
                  setCurrentPage('home');
                }
              }}
              className="text-[#121210] hover:text-[#FF441F] transition-colors"
            >
              <span className="text-[#6E6D68] mr-1">03</span>CERTS
            </a>
            <a 
              href="#journal" 
              onClick={(e) => {
                if (currentPage !== 'home') {
                  setCurrentPage('home');
                }
              }}
              className="text-[#121210] hover:text-[#FF441F] transition-colors"
            >
              <span className="text-[#6E6D68] mr-1">04</span>DISPATCHES
            </a>
          </nav>

          {/* Right CTA Button & Mobile Page Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Quick Nav */}
            <div className="flex md:hidden items-center border border-[#111111]/[0.18] bg-[#EAE8E0]/70 p-0.5 font-mono text-[9px] uppercase">
              <button 
                onClick={() => switchPage('home')} 
                className={`px-2 py-1 transition-colors ${currentPage === 'home' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
              >
                00
              </button>
              <button 
                onClick={() => switchPage('about')} 
                className={`px-2 py-1 transition-colors ${currentPage === 'about' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
              >
                01
              </button>
              <button 
                onClick={() => switchPage('work')} 
                className={`px-2 py-1 transition-colors ${currentPage === 'work' ? 'bg-[#121210] text-[#F0EFE9]' : 'text-[#121210]'}`}
              >
                02
              </button>
              <a 
                href="#credentials"
                onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); }}
                className="px-2 py-1 text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors"
              >
                CERT
              </a>
              <a 
                href="#journal"
                onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); }}
                className="px-2 py-1 text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors"
              >
                FEED
              </a>
            </div>

            <a href="#contact" className="border border-[#121210] px-3 sm:px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors flex items-center gap-1.5">
              <span>GET IN TOUCH</span>
              <span className="text-[11px] leading-none">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* PAGE 00: HOME VIEW                                                */}
      {/* ================================================================= */}
      {currentPage === 'home' && (
        <main id="page-home" className="page-view">
          {/* HERO SECTION */}
          <section id="home" className="relative max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <BackgroundGridLines />

            {/* Vertical Grid Inner Area */}
            <div className="relative min-h-[540px] sm:min-h-[640px] lg:min-h-[730px] flex flex-col justify-between px-4 sm:px-6 pt-3 pb-16 z-10">
              
              {/* Top Micro-Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
                <div>N 6°58'40" E 108°29'00" · FOLIO/01</div>
                <div>{appBrand} — {roleTitle.toUpperCase()}, EST. 2021</div>
              </div>

              {/* Centerpiece Logo + Akira Typography */}
              <div className="my-auto py-16 sm:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  <div className="lg:col-start-2 lg:col-span-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 md:gap-9">
                      {/* Large Geometric Pill Emblem */}
                      <div className="shrink-0">
                        <svg className="w-24 h-32 sm:w-32 sm:h-44 md:w-36 md:h-48 lg:w-[152px] lg:h-[206px]" viewBox="0 0 152 206" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M76 0C34.0264 0 0 34.0264 0 76V130C0 171.974 34.0264 206 76 206V103H152V76C152 34.0264 117.974 0 76 0Z" fill="#121210"/>
                          <path d="M76 103H152V130C152 171.974 117.974 206 76 206V103Z" fill="#FF441F"/>
                        </svg>
                      </div>

                      {/* Massive "Akira." Display Heading + Underline Subtitle */}
                      <div className="flex-1 w-full">
                        <h1 className="akira-title text-[78px] sm:text-[128px] md:text-[168px] lg:text-[205px] text-[#121210] select-none">
                          {displayName}.
                        </h1>
                        
                        {/* Thin Horizontal Rule under Akira extending right */}
                        <div className="mt-3 sm:mt-4 border-t border-[#121210]/80 pt-3 sm:pt-3.5 max-w-[780px]">
                          <p className="text-sm sm:text-base md:text-[17px] font-medium text-[#121210] tracking-[-0.01em]">
                            {headline}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Spacer inside Hero Grid */}
              <div className="h-2"></div>
            </div>

            {/* 4-COLUMN HERO FOOTER SPEC BAR */}
            <div className="border-t border-[#111111]/[0.18] bg-[#111111]/[0.18] relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                {/* [01] DISCIPLINE */}
                <div className="bg-[#F0EFE9] p-6 sm:p-7 space-y-1.5">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[01] DISCIPLINE</div>
                  <div className="text-xs font-bold text-[#121210]">Full-Stack &amp; IoT</div>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">Web apps, hardware, embedded systems end-to-end.</p>
                </div>

                {/* [02] PRACTICE */}
                <div className="bg-[#F0EFE9] p-6 sm:p-7 space-y-1.5">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[02] PRACTICE</div>
                  <div className="text-xs font-bold text-[#121210]">Bits to Atoms</div>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">Sensors, cloud APIs, PCB &amp; web architecture.</p>
                </div>

                {/* [03] CURRENTLY */}
                <div className="bg-[#F0EFE9] p-6 sm:p-7 space-y-1.5">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[03] CURRENTLY</div>
                  <div className="text-xs font-bold text-[#121210]">{availabilityStatus}</div>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">Open for engineering &amp; consulting projects.</p>
                </div>

                {/* [04] ARCHIVE */}
                <div className="bg-[#F0EFE9] p-6 sm:p-7 space-y-1.5">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">[04] ARCHIVE</div>
                  <div className="text-xs font-bold text-[#121210]">The Folio · {projectsData.length} Projects</div>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">Commercial, IoT &amp; web engineering.</p>
                  <div className="pt-0.5">
                    <button onClick={() => switchPage('work')} className="inline-block font-mono text-[10px] tracking-[0.12em] uppercase text-[#121210] underline underline-offset-4 hover:text-[#FF441F] transition-colors cursor-pointer">
                      OPEN THE INDEX
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INFINITE MARQUEE TICKER (Dynamic Skills) */}
          <div className="bg-[#111111] text-[#F0EFE9] py-4 sm:py-5 border-b border-[#111111]/[0.18] overflow-hidden select-none">
            <div className="animate-marquee flex items-center">
              {/* Set 1 */}
              <div className="flex items-center shrink-0">
                {marqueeSkills.map((skill, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight mx-5 sm:mx-7 whitespace-nowrap">
                      {skill}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF441F] mx-2 shrink-0"></span>
                  </React.Fragment>
                ))}
              </div>
              {/* Set 2 (Duplicate for seamless loop) */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                {marqueeSkills.map((skill, sIdx) => (
                  <React.Fragment key={`dup-${sIdx}`}>
                    <span className="text-xl sm:text-2xl md:text-[26px] font-bold tracking-tight mx-5 sm:mx-7 whitespace-nowrap">
                      {skill}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF441F] mx-2 shrink-0"></span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION [ 01 / 07 ] ABOUT */}
          <section id="about" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            {/* Section Header Row */}
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                {/* Left Index Marker */}
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 01 / 07 ]</div>
                  <div>ABOUT</div>
                </div>
                {/* Right Editorial Headline */}
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    A studio of one. <span className="editorial-serif text-[#D85131] font-normal text-[1.08em]">Built around obsession,</span> run like<br className="hidden sm:inline" /> a system.
                  </h2>
                </div>
              </div>
            </div>

            {/* Split Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column (5 cols on desktop) */}
              <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#111111]/[0.18]">
                <div>
                  {/* Red Tag */}
                  <div className="font-mono text-[10px] tracking-[0.15em] text-[#D85131] uppercase mb-4">
                    [ {roleTitle.toUpperCase()} · KUNINGAN / REMOTE ]
                  </div>

                  {/* Name & Sub-caption */}
                  <h3 className="editorial-serif text-3xl sm:text-4xl text-[#111111] leading-none mb-1.5">
                    {fullName}
                  </h3>
                  <div className="font-mono text-[9px] tracking-[0.16em] text-[#6E6D68] uppercase mb-8">
                    INDEPENDENT ENGINEER · SINCE 2021
                  </div>

                  {/* Main Pull Quote */}
                  <blockquote className="text-base sm:text-lg md:text-[19px] font-semibold text-[#111111] leading-[1.42] tracking-[-0.015em] mb-6">
                    "Building the bridge between bits and atoms — translating digital architecture and lines of code into physical hardware that creates a tangible real-world impact."
                  </blockquote>

                  {/* Supporting Paragraph */}
                  <p className="text-xs sm:text-[13px] text-[#6E6D68] leading-relaxed mb-10">
                    Over five years developing precision IoT telemetry, custom PCB hardware, and full-stack web platforms. The technology evolves; the architectural rigor doesn't.
                  </p>
                </div>

                {/* Bottom 3 Metrics Row */}
                <div className="border-t border-[#111111]/[0.18] pt-6 grid grid-cols-3 gap-4">
                  <div>
                    <div className="editorial-serif text-3xl sm:text-4xl text-[#111111] leading-none mb-1.5">
                      {shippedCount}<span className="text-[#D85131]">.</span>
                    </div>
                    <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                      PROJECTS SHIPPED
                    </div>
                  </div>
                  <div>
                    <div className="editorial-serif text-3xl sm:text-4xl text-[#111111] leading-none mb-1.5">
                      {recognitionsCount}<span className="text-[#D85131] text-2xl align-top">×</span>
                    </div>
                    <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                      AWARDS / MENTIONS
                    </div>
                  </div>
                  <div>
                    <div className="editorial-serif text-3xl sm:text-4xl text-[#111111] leading-none mb-1.5">
                      {yearsCount}<span className="text-[#D85131]">yr</span>
                    </div>
                    <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.13em] text-[#6E6D68] uppercase">
                      INDEPENDENT PRACTICE
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Monochrome Portrait */}
              <div className="lg:col-span-7 bg-[#0E0E0E] relative min-h-[420px] sm:min-h-[520px] flex flex-col justify-between overflow-hidden group">
                <div className="relative z-10 p-5 sm:p-6 flex justify-end">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">[ {appBrand} ]</span>
                </div>

                <div className="absolute inset-0 flex items-end justify-center pt-8 overflow-hidden">
                  <img 
                    src="/ghiffa.jpeg" 
                    alt={fullName} 
                    className="h-full w-full object-cover object-top grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-[1.02]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-[#0E0E0E]/40 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/60 via-transparent to-[#0E0E0E]/60 pointer-events-none"></div>
                </div>

                <button onClick={() => switchPage('about')} className="w-full relative z-10 border-t border-white/15 px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors text-left cursor-pointer">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase">MORE ABOUT ME</span>
                  <span className="text-sm transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION [ 02 / 06 ] SELECTED COLLABORATORS (Matches screenshot exactly) */}
          <section className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-10 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 02 / 06 ]</div>
                  <div>ABOUT</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-none text-[#121210]">
                    Selected <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">collaborators</span>.
                  </h2>
                </div>
              </div>
            </div>

            {/* 6x2 Grid with exact 1px border lines created by 1px gap on grey background */}
            <div className="collaborator-brand-grid">
              {collaborators.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => switchPage('work')}
                  className="collaborator-card group"
                >
                  <div className="collaborator-card-number-wrapper">
                    <span className="mono-label font-mono text-[11px] text-[#111111]/50 group-hover:text-white transition-colors">
                      {c.no}
                    </span>
                  </div>
                  <div className="quote-text text-xl sm:text-2xl font-medium tracking-tight text-[#111111] group-hover:text-white transition-colors px-3 text-center">
                    {c.name}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION [ 02 / 07 ] SELECTED WORK (CMS CASE STUDIES) */}
          <section id="work" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 02 / 07 ]</div>
                  <div>SELECTED WORK</div>
                </div>
                <div className="lg:col-span-7">
                  <h2 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Considered <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">case studies</span>,<br className="hidden sm:inline" /> built to endure.
                  </h2>
                </div>
                <div className="lg:col-span-3 flex lg:justify-end">
                  <button onClick={() => switchPage('work')} className="border border-[#121210] px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors uppercase cursor-pointer">
                    VIEW ALL WORK ({String(projectsData.length).padStart(2, '0')}) →
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#111111]/[0.18] flex flex-wrap items-center justify-between gap-4 bg-[#EAE8E0]/50">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
                <button 
                  onClick={() => setHomeFilter('all')} 
                  className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${homeFilter === 'all' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
                >
                  ALL [{String(categoryCounts.all).padStart(2, '0')}]
                </button>
                <button 
                  onClick={() => setHomeFilter('identity')} 
                  className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${homeFilter === 'identity' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
                >
                  COMMERCIAL [{String(categoryCounts.identity).padStart(2, '0')}]
                </button>
                <button 
                  onClick={() => setHomeFilter('digital')} 
                  className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${homeFilter === 'digital' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
                >
                  IOT &amp; EMBEDDED [{String(categoryCounts.digital).padStart(2, '0')}]
                </button>
                <button 
                  onClick={() => setHomeFilter('editorial')} 
                  className={`filter-btn px-3 py-1 transition-colors cursor-pointer ${homeFilter === 'editorial' ? 'bg-[#121210] text-[#F0EFE9]' : 'hover:bg-[#121210]/10 text-[#121210]'}`}
                >
                  WEB &amp; RESEARCH [{String(categoryCounts.editorial).padStart(2, '0')}]
                </button>
              </div>
              <div className="font-mono text-[10px] tracking-[0.12em] text-[#6E6D68] uppercase">
                CLICK ANY PROJECT TO INSPECT CASE STUDY ↗
              </div>
            </div>

            {/* Projects 2-Column Grid with 1px border gap */}
            <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 bg-[#111111]/[0.18] gap-[1px]">
              {filteredHomeProjects.map((p) => {
                return (
                  <article 
                    key={p.id}
                    onClick={() => openProjectModal(p.id)} 
                    className="project-card cursor-pointer bg-[#F0EFE9] hover:bg-[#EAE8E0] p-5 sm:p-8 flex flex-col justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-4">
                        <span>[ FOLIO / {String(p.id + 1).padStart(2, '0')} ]</span>
                        <span>{p.meta}</span>
                      </div>
                      <div className="relative aspect-[16/10] bg-[#121210] overflow-hidden mb-6 border border-[#111111]/[0.18]">
                        <img 
                          src={p.img} 
                          alt={p.title} 
                          className="project-img w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-[#121210]/90 text-[#F0EFE9] font-mono text-[9px] tracking-[0.14em] px-2.5 py-1 uppercase">
                          VIEW CASE STUDY ↗
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-4 pt-2 border-t border-[#111111]/[0.18]">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">
                          {p.title.split(' ')[0]} <span className="editorial-serif font-normal text-[#6E6D68] text-3xl sm:text-4xl">{p.subtitle}</span>
                        </h3>
                        <p className="text-xs text-[#6E6D68] mt-1">{p.desc}</p>
                      </div>
                      <span className="font-mono text-xs text-[#121210] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* SECTION [ 03 / 07 ] CAPABILITIES & SERVICES ACCORDION */}
          <section id="services" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 03 / 07 ]</div>
                  <div>CAPABILITIES</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Four disciplines. <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">One unified</span> standard.
                  </h2>
                </div>
              </div>
            </div>

            {/* Interactive Accordion List */}
            <div className="divide-y divide-[#111111]/[0.18]">
              {/* Service 01 */}
              <div className="accordion-item">
                <button onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)} className="w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between text-left hover:bg-[#EAE8E0]/60 transition-colors group cursor-pointer">
                  <div className="grid grid-cols-1 sm:grid-cols-12 w-full items-baseline gap-2 sm:gap-4">
                    <span className="sm:col-span-2 font-mono text-xs text-[#6E6D68]">[ 01 ]</span>
                    <span className="sm:col-span-5 text-xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">Full-Stack Web Architectures</span>
                    <span className="sm:col-span-4 font-mono text-[10px] tracking-[0.13em] text-[#6E6D68] uppercase">NEXT.JS · REACT · LARAVEL · SUPABASE</span>
                  </div>
                  <span className="font-mono text-xl text-[#121210] ml-4 transition-transform duration-300">
                    {openAccordion === 0 ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 0 && (
                  <div className="px-4 sm:px-6 pb-8 pt-2 bg-[#EAE8E0]/30 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      <div className="sm:col-start-3 sm:col-span-5 text-sm text-[#121210]/90 leading-relaxed">
                        Scalable web ecosystems engineered from first principles. Constructing relational database schemas, secure RESTful APIs, and reactive frontend experiences built for performance and high data throughput.
                      </div>
                      <div className="sm:col-span-4 flex flex-wrap gap-1.5 content-start">
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Next.js &amp; React</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Laravel &amp; Node</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">PostgreSQL &amp; Supabase</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">RESTful API Design</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service 02 */}
              <div className="accordion-item">
                <button onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)} className="w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between text-left hover:bg-[#EAE8E0]/60 transition-colors group cursor-pointer">
                  <div className="grid grid-cols-1 sm:grid-cols-12 w-full items-baseline gap-2 sm:gap-4">
                    <span className="sm:col-span-2 font-mono text-xs text-[#6E6D68]">[ 02 ]</span>
                    <span className="sm:col-span-5 text-xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">IoT &amp; Embedded Microcontrollers</span>
                    <span className="sm:col-span-4 font-mono text-[10px] tracking-[0.13em] text-[#6E6D68] uppercase">ESP32 · C/C++ · SENSORS · EDGE</span>
                  </div>
                  <span className="font-mono text-xl text-[#121210] ml-4 transition-transform duration-300">
                    {openAccordion === 1 ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 1 && (
                  <div className="px-4 sm:px-6 pb-8 pt-2 bg-[#EAE8E0]/30 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      <div className="sm:col-start-3 sm:col-span-5 text-sm text-[#121210]/90 leading-relaxed">
                        Translating physical phenomena into digital signals. Writing deterministic firmware in C/C++, integrating industrial sensors across I2C/SPI/ADC buses, and optimizing battery power duty cycles.
                      </div>
                      <div className="sm:col-span-4 flex flex-wrap gap-1.5 content-start">
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">ESP32 &amp; ARM Edge</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">C/C++ Embedded</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Sensors &amp; Actuators</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Low Power Modes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service 03 */}
              <div className="accordion-item">
                <button onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)} className="w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between text-left hover:bg-[#EAE8E0]/60 transition-colors group cursor-pointer">
                  <div className="grid grid-cols-1 sm:grid-cols-12 w-full items-baseline gap-2 sm:gap-4">
                    <span className="sm:col-span-2 font-mono text-xs text-[#6E6D68]">[ 03 ]</span>
                    <span className="sm:col-span-5 text-xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">Custom PCB &amp; Long-Range Telemetry</span>
                    <span className="sm:col-span-4 font-mono text-[10px] tracking-[0.13em] text-[#6E6D68] uppercase">EASYEDA · LORA · MQTT · HARDWARE</span>
                  </div>
                  <span className="font-mono text-xl text-[#121210] ml-4 transition-transform duration-300">
                    {openAccordion === 2 ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 2 && (
                  <div className="px-4 sm:px-6 pb-8 pt-2 bg-[#EAE8E0]/30 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      <div className="sm:col-start-3 sm:col-span-5 text-sm text-[#121210]/90 leading-relaxed">
                        Physical hardware designed for harsh agricultural and industrial field conditions. Schematic capture, multi-layer PCB layout routing, LoRaWAN telemetry, and broker communications over MQTT.
                      </div>
                      <div className="sm:col-span-4 flex flex-wrap gap-1.5 content-start">
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">PCB Routing &amp; CAM</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">LoRa / LoRaWAN</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">MQTT Brokers</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Enclosure &amp; Power</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service 04 */}
              <div className="accordion-item">
                <button onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)} className="w-full px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between text-left hover:bg-[#EAE8E0]/60 transition-colors group cursor-pointer">
                  <div className="grid grid-cols-1 sm:grid-cols-12 w-full items-baseline gap-2 sm:gap-4">
                    <span className="sm:col-span-2 font-mono text-xs text-[#6E6D68]">[ 04 ]</span>
                    <span className="sm:col-span-5 text-xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">Interface Systems &amp; Motion</span>
                    <span className="sm:col-span-4 font-mono text-[10px] tracking-[0.13em] text-[#6E6D68] uppercase">TAILWIND · GSAP · SWISS GRIDS · BRUTALISM</span>
                  </div>
                  <span className="font-mono text-xl text-[#121210] ml-4 transition-transform duration-300">
                    {openAccordion === 3 ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 3 && (
                  <div className="px-4 sm:px-6 pb-8 pt-2 bg-[#EAE8E0]/30 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      <div className="sm:col-start-3 sm:col-span-5 text-sm text-[#121210]/90 leading-relaxed">
                        Giving complex technical telemetry a crisp, editorial voice. Swiss mathematical grids, high-density typography, micro-interactions, and brutalist lines built to endure.
                      </div>
                      <div className="sm:col-span-4 flex flex-wrap gap-1.5 content-start">
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Brutalist Systems</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">GSAP Motion</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Telemetry UI</span>
                        <span className="border border-[#111111]/[0.18] bg-[#F0EFE9] px-2.5 py-1 font-mono text-[10px] uppercase">Type Architecture</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION [ 04 / 07 ] METHOD & ARCHIVE INDEX */}
          <section id="process" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 04 / 07 ]</div>
                  <div>METHOD</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Direct access. <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">Zero account</span> managers.
                  </h2>
                </div>
              </div>
            </div>

            {/* 4-Step Method Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#111111]/[0.18] gap-[1px]">
              <div className="bg-[#F0EFE9] p-6 sm:p-8 flex flex-col justify-between min-h-[250px]">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
                  <span>PHASE 01</span>
                  <span>WEEK 1</span>
                </div>
                <div className="my-6">
                  <h3 className="text-xl font-bold text-[#121210] mb-2">Diagnostic &amp; Audit</h3>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">
                    We strip away assumptions, clarify positioning, and define the exact visual and commercial leverage points before drawing a single frame.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#CE4A30] uppercase tracking-wider">01 / ALIGNMENT</div>
              </div>

              <div className="bg-[#F0EFE9] p-6 sm:p-8 flex flex-col justify-between min-h-[250px]">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
                  <span>PHASE 02</span>
                  <span>WEEK 2–3</span>
                </div>
                <div className="my-6">
                  <h3 className="text-xl font-bold text-[#121210] mb-2">System Architecture</h3>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">
                    Establishing the typographic voice, grid ratios, and core visual language tested across real-world applications rather than abstract mockups.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#CE4A30] uppercase tracking-wider">02 / DIRECTION</div>
              </div>

              <div className="bg-[#F0EFE9] p-6 sm:p-8 flex flex-col justify-between min-h-[250px]">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
                  <span>PHASE 03</span>
                  <span>WEEK 4–5</span>
                </div>
                <div className="my-6">
                  <h3 className="text-xl font-bold text-[#121210] mb-2">Craft &amp; Build</h3>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">
                    High-precision execution across digital templates, CMS collections, motion states, and print-ready production files.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#CE4A30] uppercase tracking-wider">03 / EXECUTION</div>
              </div>

              <div className="bg-[#F0EFE9] p-6 sm:p-8 flex flex-col justify-between min-h-[250px]">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
                  <span>PHASE 04</span>
                  <span>ONGOING</span>
                </div>
                <div className="my-6">
                  <h3 className="text-xl font-bold text-[#121210] mb-2">Handover &amp; Stewardship</h3>
                  <p className="text-xs text-[#6E6D68] leading-relaxed">
                    Comprehensive documentation, team training, and autonomous design systems built so your internal team can ship without friction.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#CE4A30] uppercase tracking-wider">04 / LONGEVITY</div>
              </div>
            </div>
          </section>

          {/* SECTION [ 05 / 07 ] CREDENTIALS & LICENSES */}
          <section id="credentials" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            {/* Section Header */}
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 05 / 07 ]</div>
                  <div>CREDENTIALS</div>
                </div>
                <div className="lg:col-span-7">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Verified credentials. <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">Formal licenses</span> ({allCertifications.length}).
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-[#6E6D68] leading-relaxed max-w-2xl">
                    Official technical competencies, intellectual property filings (DGIP), national competition recognitions, and professional accreditations.
                  </p>
                </div>
                <div className="lg:col-span-3 flex lg:justify-end">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#CE4A30] uppercase border border-[#CE4A30]/40 px-3 py-1.5 bg-[#CE4A30]/5">
                    ● {allCertifications.filter(c => c.certificate_url).length} DIGITAL CERTIFICATES ATTACHED
                  </span>
                </div>
              </div>

              {/* Filter Tabs Bar */}
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#111111]/[0.12] font-mono text-[10px] tracking-[0.12em] uppercase">
                <span className="text-[#6E6D68] mr-2">FILTER BY:</span>
                <button
                  onClick={() => setCertFilter('all')}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${certFilter === 'all' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] text-[#121210] hover:bg-[#EAE8E0]'}`}
                >
                  ALL [{allCertifications.length}]
                </button>
                <button
                  onClick={() => setCertFilter('verified')}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${certFilter === 'verified' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] text-[#121210] hover:bg-[#EAE8E0]'}`}
                >
                  WITH CERTIFICATE [{allCertifications.filter(c => c.certificate_url).length}]
                </button>
                <button
                  onClick={() => setCertFilter('national')}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${certFilter === 'national' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] text-[#121210] hover:bg-[#EAE8E0]'}`}
                >
                  NATIONAL &amp; GOV
                </button>
                <button
                  onClick={() => setCertFilter('competition')}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${certFilter === 'competition' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] text-[#121210] hover:bg-[#EAE8E0]'}`}
                >
                  COMPETITION &amp; AWARDS
                </button>
              </div>
            </div>

            {/* Certifications 3-Column Brutalist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-[#111111]/[0.18] gap-[1px]">
              {displayedCerts.map((cert, cIdx) => (
                <div 
                  key={cert.id || cIdx} 
                  className="bg-[#F0EFE9] p-6 sm:p-7 flex flex-col justify-between hover:bg-[#EAE8E0] transition-colors group relative"
                >
                  {/* Top Preview or Brutalist Seal */}
                  <div>
                    {cert.certificate_url ? (
                      <div 
                        onClick={() => setSelectedCert(cert)}
                        className="aspect-[16/10] bg-[#121210] overflow-hidden relative cursor-pointer group/img mb-5 border border-[#111111]/[0.15]"
                      >
                        {cert.certificate_url.toLowerCase().endsWith('.pdf') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#1c1c1a] text-center">
                            <span className="font-mono text-[10px] text-[#CE4A30] uppercase tracking-widest mb-1">[ PDF DOCUMENT ]</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{cert.institution}</span>
                            <span className="mt-2 text-[10px] text-white/60 font-mono">CLICK TO INSPECT PDF ↗</span>
                          </div>
                        ) : (
                          <img 
                            src={cert.certificate_url} 
                            alt={cert.title} 
                            loading="lazy"
                            className="w-full h-full object-cover grayscale contrast-110 group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute top-2 right-2 bg-[#121210]/90 text-white font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase flex items-center gap-1">
                          <span>INSPECT</span>
                          <span>↗</span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-[#EAE8E0]/70 border border-[#111111]/[0.12] p-4 flex flex-col justify-between mb-5">
                        <div className="flex items-center justify-between font-mono text-[9px] text-[#6E6D68] uppercase">
                          <span>REGISTRATION CODE</span>
                          <span className="text-[#CE4A30] font-semibold">[VERIFIED ATTESTATION]</span>
                        </div>
                        <div className="font-mono text-xs uppercase font-bold text-[#121210] tracking-wider truncate">
                          {cert.institution}
                        </div>
                        <div className="flex items-center justify-between font-mono text-[9px] text-[#6E6D68] uppercase">
                          <span>OFFICIAL RECORD</span>
                          <span>{cert.period || 'VALID'}</span>
                        </div>
                      </div>
                    )}

                    {/* Metadata Header */}
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase mb-2">
                      <span className="text-[#CE4A30] font-semibold truncate max-w-[200px]">{cert.institution}</span>
                      <span className="text-[#6E6D68] shrink-0">{cert.period}</span>
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#121210] leading-snug mb-2 group-hover:text-[#CE4A30] transition-colors">
                      {cert.title}
                    </h3>

                    {/* Description if available */}
                    {cert.description && (
                      <p className="text-xs text-[#6E6D68] leading-relaxed line-clamp-2 mb-4">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-4 border-t border-[#111111]/[0.12]">
                    {cert.certificate_url ? (
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="w-full py-2 px-3 border border-[#121210] font-mono text-[10px] tracking-[0.12em] uppercase text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>INSPECT CREDENTIAL</span>
                        <span className="text-[11px]">↗</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 px-3 border border-[#111111]/20 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6E6D68] flex items-center justify-between bg-[#EAE8E0]/40">
                        <span>OFFICIALLY ATTESTED</span>
                        <span>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Expand / Collapse Bar */}
            {filteredCerts.length > 6 && (
              <div className="p-4 sm:p-6 bg-[#EAE8E0]/60 border-t border-[#111111]/[0.18] flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
                <span className="text-[#6E6D68]">
                  SHOWING {displayedCerts.length} OF {filteredCerts.length} CREDENTIALS
                </span>
                <button
                  onClick={() => setShowAllCerts(!showAllCerts)}
                  className="border border-[#121210] bg-[#F0EFE9] px-4 py-2 text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>{showAllCerts ? 'COLLAPSE TO COMPACT VIEW' : `SHOW ALL ${filteredCerts.length} CERTIFICATIONS`}</span>
                  <span>{showAllCerts ? '↑' : '↓'}</span>
                </button>
              </div>
            )}
          </section>

          {/* SECTION [ 06 / 07 ] VISUAL DISPATCHES (INSTAGRAM JOURNAL) */}
          <section id="journal" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            {/* Section Header */}
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 06 / 07 ]</div>
                  <div>DISPATCHES</div>
                </div>
                <div className="lg:col-span-7">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Visual dispatches. <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">Field telemetry</span> &amp; lab notes.
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-[#6E6D68] leading-relaxed max-w-2xl">
                    Real-time field logs, hardware fabrications, technical community meetups, and engineering milestones from the Kuningan lab.
                  </p>
                </div>
                <div className="lg:col-span-3 flex lg:justify-end">
                  <a 
                    href="https://www.instagram.com/haikaljibraan/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-[#121210] px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors uppercase inline-flex items-center gap-2"
                  >
                    <span>FOLLOW @HAIKALJIBRAAN</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Loading Skeleton State */}
            {igLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#111111]/[0.18] gap-[1px]">
                {[...Array(4)].map((_, sIdx) => (
                  <div key={sIdx} className="bg-[#F0EFE9] p-5 flex flex-col justify-between animate-pulse min-h-[360px]">
                    <div className="aspect-square bg-[#EAE8E0] mb-4"></div>
                    <div className="h-4 bg-[#EAE8E0] w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#EAE8E0] w-full mb-1"></div>
                    <div className="h-3 bg-[#EAE8E0] w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Instagram 4-Column Brutalist Grid */}
            {!igLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#111111]/[0.18] gap-[1px]">
                {displayedInstagramPosts.slice(0, igCount).map((post, pIdx) => {
                  const mediaUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;
                  const typeLabel = post.media_type === 'VIDEO' ? 'REEL' : post.media_type === 'CAROUSEL_ALBUM' ? 'ALBUM' : 'PHOTO';
                  
                  return (
                    <a
                      key={post.id || pIdx}
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#F0EFE9] p-5 sm:p-6 flex flex-col justify-between hover:bg-[#EAE8E0] transition-colors group cursor-pointer"
                    >
                      <div>
                        {/* Square Media Preview */}
                        <div className="aspect-square bg-[#121210] overflow-hidden relative mb-4 border border-[#111111]/[0.15]">
                          <img
                            src={mediaUrl}
                            alt={post.caption || 'Instagram dispatch'}
                            loading="lazy"
                            className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          {/* Corner Badges */}
                          <div className="absolute top-2 left-2 bg-[#121210]/85 backdrop-blur-xs text-[#F0EFE9] font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase">
                            {formatIgDate(post.timestamp) || 'DISPATCH'}
                          </div>
                          <div className="absolute top-2 right-2 bg-[#CE4A30] text-white font-mono text-[9px] px-1.5 py-0.5 tracking-wider uppercase font-bold">
                            [{typeLabel}]
                          </div>
                        </div>

                        {/* Caption snippet */}
                        <p className="text-xs text-[#121210]/90 leading-relaxed line-clamp-3 mb-4 group-hover:text-[#121210]">
                          {post.caption || 'Field notes, hardware architecture, and laboratory updates.'}
                        </p>
                      </div>

                      {/* Bottom Footer Info */}
                      <div className="pt-3 border-t border-[#111111]/[0.12] flex items-center justify-between font-mono text-[9px] tracking-[0.14em] uppercase text-[#6E6D68]">
                        <span>INSTAGRAM POST</span>
                        <span className="text-[#CE4A30] font-semibold group-hover:translate-x-0.5 transition-transform">
                          VIEW ↗
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Load More Dispatches Bar */}
            {displayedInstagramPosts.length > igCount && (
              <div className="p-4 sm:p-6 bg-[#EAE8E0]/60 border-t border-[#111111]/[0.18] flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
                <span className="text-[#6E6D68]">
                  SHOWING {Math.min(igCount, displayedInstagramPosts.length)} OF {displayedInstagramPosts.length} DISPATCHES
                </span>
                <button
                  onClick={() => setIgCount(prev => prev + 4)}
                  className="border border-[#121210] bg-[#F0EFE9] px-4 py-2 text-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>LOAD MORE DISPATCHES</span>
                  <span>↓</span>
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ================================================================= */}
      {/* PAGE 01: ABOUT VIEW                                               */}
      {/* ================================================================= */}
      {currentPage === 'about' && (
        <main id="page-about" className="page-view">
          {/* ABOUT HERO SECTION WITH 12-COLUMN GRID */}
          <section className="relative max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <BackgroundGridLines />

            <div className="relative min-h-[480px] sm:min-h-[580px] flex flex-col justify-between px-4 sm:px-6 pt-3 pb-12 z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
                <div>S 06°58'40" E 108°29'00" · FOLIO/ABOUT</div>
                <div>[ 01 ] PRACTICE PROFILE &amp; MONOGRAPH</div>
              </div>

              <div className="my-auto py-14 sm:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
                  <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#CE4A30] uppercase">
                    <div>[ INDEPENDENT PRACTICE ]</div>
                    <div className="text-[#6E6D68] mt-1">EST. KUNINGAN 2021</div>
                  </div>
                  <div className="lg:col-span-10">
                    <h1 className="akira-title text-[54px] sm:text-[96px] md:text-[128px] lg:text-[152px] text-[#121210] select-none">
                      Independent<br />
                      <span className="editorial-serif text-[#CE4A30] font-normal">by engineering.</span>
                    </h1>
                    <div className="mt-6 border-t border-[#121210]/80 pt-4 max-w-[760px]">
                      <p className="text-sm sm:text-base md:text-[17px] font-medium text-[#121210] tracking-[-0.01em] leading-relaxed">
                        {appBrand} is the independent engineering &amp; full-stack practice of {fullName} — building scalable web ecosystems, embedded microcontrollers, and long-range IoT telemetry networks that bridge bits and atoms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata Bar inside Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#111111]/[0.18] font-mono text-[10px] tracking-[0.14em] uppercase">
                <div>
                  <span className="text-[#6E6D68] block mb-1">PRINCIPAL</span>
                  <span className="text-[#121210] font-semibold">{fullName.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[#6E6D68] block mb-1">BASE</span>
                  <span className="text-[#121210] font-semibold">KUNINGAN, INDONESIA</span>
                </div>
                <div>
                  <span className="text-[#6E6D68] block mb-1">EXPERIENCE</span>
                  <span className="text-[#121210] font-semibold">{yearsCount}+ YEARS ACTIVE</span>
                </div>
                <div>
                  <span className="text-[#6E6D68] block mb-1">AVAILABILITY</span>
                  <span className="text-[#FF441F] font-semibold">{availabilityStatus.toUpperCase()} [OPEN]</span>
                </div>
              </div>
            </div>
          </section>

          {/* BIOGRAPHY & MONOCHROME PORTRAIT STUDY */}
          <section className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 bg-[#0E0E0E] relative min-h-[460px] sm:min-h-[600px] flex flex-col justify-between p-6 border-b lg:border-b-0 lg:border-r border-[#111111]/[0.18] overflow-hidden">
                <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-white/70 uppercase">
                  <span>[ PORTRAIT / 01 ]</span>
                  <span>KUNINGAN LAB / STUDIO</span>
                </div>

                <div className="absolute inset-0 flex items-end justify-center pt-12">
                  <img 
                    src="/ghiffa.jpeg" 
                    alt={fullName} 
                    className="h-[90%] w-auto object-cover object-top grayscale contrast-125 brightness-90"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-[#0E0E0E]/40 pointer-events-none"></div>
                </div>

                <div className="relative z-10 border-t border-white/15 pt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-white/80 uppercase">
                  <span>{fullName.toUpperCase()} — PRINCIPAL</span>
                  <span>6.9778° S, 108.4833° E</span>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-12 md:p-16 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase">
                    [ 01 / 05 · THE PRACTICE ]
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-[42px] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#121210]">
                    Small by conviction. <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">Rigorous in execution</span>. Every system is architected, wired, and coded by the same pair of hands.
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-xs sm:text-sm text-[#121210]/85 leading-relaxed">
                    <div className="space-y-4">
                      <p>
                        I believe the best technology doesn't just live on a screen. It must directly interact with and transform the physical world. That is the core of my professional philosophy: <strong>"From Bits to Atoms"</strong> translating digital architecture and lines of code (Bits) into physical hardware that makes a tangible impact in the field (Atoms).
                      </p>
                      <p>
                        As a Full-Stack Web Developer and IoT Engineer, I design end-to-end technological solutions from the ground up. My technical scope encompasses scalable web ecosystems, embedded microcontrollers, edge computing, LoRa network telemetry, and custom PCB hardware design.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p>
                        Currently pursuing a degree in Informatics Engineering at Universitas Kuningan, I was recently awarded 1st Place as the University-Level Outstanding Student (Juara 1 PILMAPRES 2026). Backed by national competency certifications (BNSP &amp; Kominfo), I solve real-world industrial challenges across agriculture, banking, and organizational systems.
                      </p>
                      <p>
                        When an engineering engagement requires specialized hardware fabrication or multi-disciplinary integration, I work directly with founders and teams—delivering end-to-end technical stewardship from schematic capture to production deployment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Key Figures */}
                <div className="mt-12 pt-8 border-t border-[#111111]/[0.18] grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <div className="editorial-serif text-4xl sm:text-5xl text-[#121210] leading-none mb-2">{shippedCount}<span className="text-[#CE4A30]">.</span></div>
                    <div className="font-mono text-[9px] tracking-[0.14em] text-[#6E6D68] uppercase">SYSTEMS SHIPPED</div>
                  </div>
                  <div>
                    <div className="editorial-serif text-4xl sm:text-5xl text-[#121210] leading-none mb-2">{recognitionsCount}<span className="text-[#CE4A30] text-3xl align-top">×</span></div>
                    <div className="font-mono text-[9px] tracking-[0.14em] text-[#6E6D68] uppercase">HONORS &amp; CERTS</div>
                  </div>
                  <div>
                    <div className="editorial-serif text-4xl sm:text-5xl text-[#121210] leading-none mb-2">02</div>
                    <div className="font-mono text-[9px] tracking-[0.14em] text-[#6E6D68] uppercase">DOMAINS (BITS &amp; ATOMS)</div>
                  </div>
                  <div>
                    <div className="editorial-serif text-4xl sm:text-5xl text-[#121210] leading-none mb-2">100<span className="text-[#CE4A30] text-2xl">%</span></div>
                    <div className="font-mono text-[9px] tracking-[0.14em] text-[#6E6D68] uppercase">PRINCIPAL BUILT</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION [ 02 / 05 ] DESIGN & ENGINEERING PRINCIPLES */}
          <section className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 02 / 05 ]</div>
                  <div>ETHOS</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Three rules that <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">govern the work</span>.
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#111111]/[0.18]">
              <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[300px]">
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase">[ PRINCIPLE / 01 ]</div>
                <div className="my-8">
                  <h3 className="text-2xl font-bold tracking-tight text-[#121210] mb-3">Bits to Atoms: Hardware &amp; software must speak one language.</h3>
                  <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                    A web dashboard is only as reliable as the edge sensor collecting telemetry in the soil. Designing both layers under a single architectural vision eliminates handoff friction and guarantees deterministic data fidelity.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#6E6D68] uppercase">INTEGRATION · DETERMINISM</div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[300px]">
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase">[ PRINCIPLE / 02 ]</div>
                <div className="my-8">
                  <h3 className="text-2xl font-bold tracking-tight text-[#121210] mb-3">Clarity &amp; architectural rigor carry 80% of reliability.</h3>
                  <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                    Before adding complex features, how a system models its database tables, API payloads, and microcontroller state machines defines its stability. We build clean, modular foundations that scale effortlessly.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#6E6D68] uppercase">STRUCTURE · RESILIENCE</div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-between min-h-[300px]">
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase">[ PRINCIPLE / 03 ]</div>
                <div className="my-8">
                  <h3 className="text-2xl font-bold tracking-tight text-[#121210] mb-3">Engineered for the fifth year, not launch day.</h3>
                  <p className="text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                    Demo day excitement fades quickly. Well-architected firmware, low-power duty cycles, and maintainable cloud backends continue performing autonomously in field conditions long after deployment.
                  </p>
                </div>
                <div className="font-mono text-[10px] text-[#6E6D68] uppercase">ENDURANCE · TELEMETRY</div>
              </div>
            </div>
          </section>

          {/* SECTION [ 03 / 05 ] CAREER & EDUCATION CHRONOLOGY */}
          <section className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 03 / 05 ]</div>
                  <div>CHRONOLOGY</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Experience &amp; <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">lineage</span>.
                  </h2>
                </div>
              </div>
            </div>

            {/* Work & Industry Experiences */}
            <div className="divide-y divide-[#111111]/[0.18]">
              {careerChronology.map((c, i) => (
                <div key={i} className="px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 items-baseline gap-4 hover:bg-[#EAE8E0]/50 transition-colors">
                  <div className={`md:col-span-2 font-mono text-xs ${i === 0 ? 'text-[#CE4A30]' : 'text-[#6E6D68]'}`}>
                    {c.period}
                  </div>
                  <div className="md:col-span-4 text-xl sm:text-2xl font-bold text-[#121210]">{c.title}</div>
                  <div className="md:col-span-3 font-mono text-xs uppercase text-[#121210]">{c.company}</div>
                  <div className="md:col-span-3 text-xs text-[#6E6D68]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Academic Lineage Sub-Block */}
            <div className="border-t border-[#111111]/[0.18] bg-[#EAE8E0]/30 px-4 sm:px-6 py-4 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
              ACADEMIC BACKGROUND &amp; FORMAL EDUCATION
            </div>
            <div className="divide-y divide-[#111111]/[0.18]">
              {educationList.map((ed, i) => (
                <div key={i} className="px-4 sm:px-6 py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 items-baseline gap-4 hover:bg-[#EAE8E0]/50 transition-colors">
                  <div className="md:col-span-2 font-mono text-xs text-[#CE4A30]">
                    {ed.period}
                  </div>
                  <div className="md:col-span-4 text-xl font-bold text-[#121210]">{ed.title}</div>
                  <div className="md:col-span-3 font-mono text-xs uppercase text-[#121210]">{ed.institution}</div>
                  <div className="md:col-span-3 text-xs text-[#6E6D68]">{ed.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION [ 04 / 05 ] RECOGNITION & AWARDS INDEX */}
          <section className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
                <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
                  <div>[ 04 / 05 ]</div>
                  <div>RECOGNITION</div>
                </div>
                <div className="lg:col-span-10">
                  <h2 className="text-3xl sm:text-5xl md:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                    Selected <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">honors &amp; certifications</span> ({recognitionsCount}×).
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#111111]/[0.18] gap-[1px]">
              {honorsList.map((h, i) => (
                <div key={i} className="bg-[#F0EFE9] p-6 sm:p-8 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#6E6D68] uppercase">
                    <span>{h.org}</span>
                    {h.isHonor && <span className="text-[#CE4A30]">[HONOR]</span>}
                  </div>
                  <div className="my-3">
                    <div className="text-lg sm:text-xl font-bold text-[#121210] mb-1.5 leading-snug">{h.title}</div>
                    <p className="text-xs text-[#6E6D68] leading-relaxed">{h.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#111111]/[0.18]">
                    <span className="font-mono text-[10px] text-[#CE4A30] uppercase">{h.year}</span>
                    {h.certUrl && (
                      <a href={h.certUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] uppercase tracking-wider text-[#121210] underline hover:text-[#CE4A30]">
                        VERIFY ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ================================================================= */}
      {/* PAGE 02: WORK VIEW                                                */}
      {/* ================================================================= */}
      {currentPage === 'work' && (
        <main id="page-work" className="page-view">
          {/* WORK HERO SECTION */}
          <section className="relative max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
            <BackgroundGridLines />

            <div className="relative min-h-[420px] sm:min-h-[500px] flex flex-col justify-between px-4 sm:px-6 pt-3 pb-10 z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
                <div>S 06°58'40" E 108°29'00" · FOLIO/WORK</div>
                <div>COMPLETE ARCHIVE · 2023 — 2026</div>
              </div>

              <div className="my-auto py-12 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
                  <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#CE4A30] uppercase">
                    <div>[ 02 / WORK ]</div>
                    <div className="text-[#6E6D68] mt-1">SELECTED FOLIO</div>
                  </div>
                  <div className="lg:col-span-10">
                    <h1 className="akira-title text-[56px] sm:text-[104px] md:text-[138px] lg:text-[164px] text-[#121210] select-none">
                      Work <span className="editorial-serif text-[#CE4A30] font-normal">index.</span>
                    </h1>
                    <div className="mt-4 border-t border-[#121210]/80 pt-3.5 max-w-[780px] flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm sm:text-base font-medium text-[#121210] tracking-[-0.01em]">
                        A curated archive of commercial platforms, IoT telemetry networks, and open-source systems shipped between 2023 and 2026.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Bar: Category Filter + Grid/Index View Switcher */}
              <div className="pt-5 border-t border-[#111111]/[0.18] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
                  <button 
                    onClick={() => setWorkFilter('all')} 
                    className={`wfilter-btn px-3 py-1.5 transition-colors cursor-pointer ${workFilter === 'all' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] hover:border-[#121210] text-[#121210]'}`}
                  >
                    ALL WORKS [{String(categoryCounts.all).padStart(2, '0')}]
                  </button>
                  <button 
                    onClick={() => setWorkFilter('identity')} 
                    className={`wfilter-btn px-3 py-1.5 transition-colors cursor-pointer ${workFilter === 'identity' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] hover:border-[#121210] text-[#121210]'}`}
                  >
                    COMMERCIAL [{String(categoryCounts.identity).padStart(2, '0')}]
                  </button>
                  <button 
                    onClick={() => setWorkFilter('digital')} 
                    className={`wfilter-btn px-3 py-1.5 transition-colors cursor-pointer ${workFilter === 'digital' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] hover:border-[#121210] text-[#121210]'}`}
                  >
                    IOT &amp; EMBEDDED [{String(categoryCounts.digital).padStart(2, '0')}]
                  </button>
                  <button 
                    onClick={() => setWorkFilter('editorial')} 
                    className={`wfilter-btn px-3 py-1.5 transition-colors cursor-pointer ${workFilter === 'editorial' ? 'bg-[#121210] text-[#F0EFE9]' : 'border border-[#111111]/[0.18] hover:border-[#121210] text-[#121210]'}`}
                  >
                    WEB &amp; RESEARCH [{String(categoryCounts.editorial).padStart(2, '0')}]
                  </button>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
                  <span className="text-[#6E6D68] mr-1">VIEW MODE:</span>
                  <button 
                    onClick={() => setWorkLayout('grid')} 
                    className={`px-3 py-1.5 border transition-colors cursor-pointer ${workLayout === 'grid' ? 'bg-[#121210] text-[#F0EFE9] border-[#121210]' : 'text-[#121210] border-[#111111]/[0.18] hover:bg-[#121210]/10'}`}
                  >
                    [::] EDITORIAL GRID
                  </button>
                  <button 
                    onClick={() => setWorkLayout('table')} 
                    className={`px-3 py-1.5 border transition-colors cursor-pointer ${workLayout === 'table' ? 'bg-[#121210] text-[#F0EFE9] border-[#121210]' : 'text-[#121210] border-[#111111]/[0.18] hover:bg-[#121210]/10'}`}
                  >
                    [≡] ARCHIVE INDEX
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* WORK EDITORIAL GRID VIEW (8 COMPLETE CMS PROJECTS) */}
          {workLayout === 'grid' && (
            <section id="work-grid-container" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
              <div className="grid grid-cols-1 md:grid-cols-2 bg-[#111111]/[0.18] gap-[1px]">
                {filteredWorkProjects.map((p) => {
                  return (
                    <article 
                      key={p.id}
                      onClick={() => openProjectModal(p.id)} 
                      className="work-page-card project-card cursor-pointer bg-[#F0EFE9] hover:bg-[#EAE8E0] p-5 sm:p-9 flex flex-col justify-between group transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-4">
                          <span>[ FOLIO / {String(p.id + 1).padStart(2, '0')} · {p.location} ]</span>
                          <span>{p.meta}</span>
                        </div>
                        <div className="relative aspect-[16/10] bg-[#121210] overflow-hidden mb-6 border border-[#111111]/[0.18]">
                          <img src={p.img} alt={p.title} className="project-img w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" />
                          <div className="absolute top-3 right-3 bg-[#121210]/90 text-[#F0EFE9] font-mono text-[9px] tracking-[0.14em] px-2.5 py-1 uppercase">OPEN CASE STUDY ↗</div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-4 pt-3 border-t border-[#111111]/[0.18]">
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121210] group-hover:text-[#FF441F] transition-colors">
                            {p.title.split(' ')[0]} <span className="editorial-serif font-normal text-[#6E6D68] text-3xl sm:text-4xl">{p.subtitle}</span>
                          </h3>
                          <p className="text-xs text-[#6E6D68] mt-1">{p.desc}</p>
                        </div>
                        <span className="font-mono text-xs text-[#121210] group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* WORK ARCHIVE TABLE VIEW */}
          {workLayout === 'table' && (
            <section id="work-table-container" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
              <div className="divide-y divide-[#111111]/[0.18]">
                {/* Table Header */}
                <div className="px-4 sm:px-6 py-3 bg-[#EAE8E0] grid grid-cols-12 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
                  <div className="col-span-2 sm:col-span-1">NO.</div>
                  <div className="col-span-6 sm:col-span-4">CLIENT / PROJECT</div>
                  <div className="hidden sm:block sm:col-span-4">DISCIPLINE</div>
                  <div className="col-span-2 sm:col-span-2">LOCATION</div>
                  <div className="col-span-2 sm:col-span-1 text-right">YEAR</div>
                </div>

                {filteredWorkProjects.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => openProjectModal(p.id)} 
                    className="px-4 sm:px-6 py-5 grid grid-cols-12 items-center hover:bg-[#121210] hover:text-[#F0EFE9] cursor-pointer transition-colors group"
                  >
                    <div className="col-span-2 sm:col-span-1 font-mono text-xs text-[#6E6D68] group-hover:text-[#F0EFE9]/70">{String(p.id + 1).padStart(2, '0')}</div>
                    <div className="col-span-6 sm:col-span-4 font-bold text-base sm:text-xl">{p.title}</div>
                    <div className="hidden sm:block sm:col-span-4 font-mono text-[11px] uppercase text-[#6E6D68] group-hover:text-[#F0EFE9]/80">{p.discipline}</div>
                    <div className="col-span-2 sm:col-span-2 font-mono text-[11px] uppercase">{p.location}</div>
                    <div className="col-span-2 sm:col-span-1 font-mono text-xs text-right">{p.year} ↗</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {/* ================================================================= */}
      {/* SECTION [ 07 / 07 ] SHARED CONTACT & FOOTER                       */}
      {/* ================================================================= */}
      <footer id="contact" className="max-w-[1440px] mx-auto border-x border-[#111111]/[0.18] border-b border-[#111111]">
        {/* Contact Header */}
        <div className="px-4 sm:px-6 py-8 sm:py-11 border-b border-[#111111]/[0.18]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-4">
            <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase leading-relaxed">
              <div>[ 07 / 07 ]</div>
              <div>INQUIRIES</div>
            </div>
            <div className="lg:col-span-10">
              <h2 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.02] text-[#121210]">
                Have a brief in mind? <span className="editorial-serif text-[#CE4A30] font-normal text-[1.08em]">Let's talk</span> scope.
              </h2>
            </div>
          </div>
        </div>

        {/* Split Contact Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#111111]/[0.18]">
          {/* Left Direct Details */}
          <div className="lg:col-span-5 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#111111]/[0.18] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase">
                [ {availabilityStatus.toUpperCase()} ]
              </div>
              <p className="text-sm text-[#121210]/80 leading-relaxed max-w-md">
                Taking on select IoT engineering, embedded telemetry, and full-stack web commissions. Direct dispatch is preferred; every inquiry receives a personal response within 24 hours.
              </p>
              <div className="pt-2">
                <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-1">DIRECT DISPATCH</div>
                <div className="flex items-center gap-3">
                  <a href={`mailto:${emailAddress}`} className="text-xl sm:text-2xl font-bold tracking-tight text-[#121210] hover:text-[#FF441F] transition-colors">
                    {emailAddress}
                  </a>
                  <button 
                    onClick={copyEmail} 
                    className="border border-[#111111]/[0.18] px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
                  >
                    {copied ? 'COPIED ✓' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-10 mt-10 border-t border-[#111111]/[0.18] grid grid-cols-2 gap-4 font-mono text-[10px] tracking-[0.12em] uppercase">
              <div>
                <div className="text-[#6E6D68] mb-1">STUDIO &amp; LAB BASE</div>
                <div className="text-[#121210]">KUNINGAN, JAWA BARAT, ID</div>
              </div>
              <div>
                <div className="text-[#6E6D68] mb-1">LOCAL TIME</div>
                <div className="text-[#121210]">{clockTime}</div>
              </div>
            </div>
          </div>

          {/* Right Interactive Commission Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-[#EAE8E0]/40">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">01 / YOUR NAME *</label>
                  <input type="text" required placeholder="Dr. Ir. Alex Hartanto" className="w-full bg-transparent border-b border-[#121210]/40 focus:border-[#121210] py-2.5 text-sm text-[#121210] placeholder:text-[#6E6D68]/50 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">02 / EMAIL ADDRESS *</label>
                  <input type="email" required placeholder="alex@agrinex.id" className="w-full bg-transparent border-b border-[#121210]/40 focus:border-[#121210] py-2.5 text-sm text-[#121210] placeholder:text-[#6E6D68]/50 focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">03 / DISCIPLINE</label>
                  <select className="w-full bg-transparent border-b border-[#121210]/40 focus:border-[#121210] py-2.5 text-sm text-[#121210] focus:outline-none">
                    <option value="IoT & Hardware">IoT System &amp; Embedded Telemetry</option>
                    <option value="Full-Stack Web">Full-Stack Web &amp; API Architecture</option>
                    <option value="PCB & Hardware">Custom PCB Design &amp; Fabrication</option>
                    <option value="Full Architecture">End-to-End System (Bits to Atoms)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">04 / ENGAGEMENT TYPE</label>
                  <select className="w-full bg-transparent border-b border-[#121210]/40 focus:border-[#121210] py-2.5 text-sm text-[#121210] focus:outline-none">
                    <option value="Project Commission">Fixed Scope Commission</option>
                    <option value="Retainer">Engineering Retainer / Advisory</option>
                    <option value="Academic Collaboration">Research &amp; Academic Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">05 / PROJECT BRIEF &amp; TIMELINE *</label>
                <textarea rows="3" required placeholder="Describe your engineering objective, hardware or software scope, and target deployment timeline..." className="w-full bg-transparent border-b border-[#121210]/40 focus:border-[#121210] py-2.5 text-sm text-[#121210] placeholder:text-[#6E6D68]/50 focus:outline-none transition-colors resize-none"></textarea>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                {formFeedback && (
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[#FF441F] uppercase">
                    ✓ DISPATCH RECEIVED — {displayName.toUpperCase()} WILL REPLY WITHIN 24H.
                  </span>
                )}
                <button type="submit" className="ml-auto bg-[#121210] text-[#F0EFE9] hover:bg-[#FF441F] px-6 py-3 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors flex items-center gap-2 cursor-pointer">
                  <span>SEND INQUIRY</span>
                  <span>↗</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF441F]"></span>
            <span>© 2021—2026 {appBrand} · {fullName.toUpperCase()}. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex items-center gap-6">
            {info?.social_links?.github && (
              <a href={info.social_links.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#121210] transition-colors">GITHUB ↗</a>
            )}
            {info?.social_links?.linkedin && (
              <a href={info.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#121210] transition-colors">LINKEDIN ↗</a>
            )}
            {info?.social_links?.instagram && (
              <a href={info.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#121210] transition-colors">INSTAGRAM ↗</a>
            )}
            <a href="#home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[#121210] hover:text-[#FF441F] transition-colors cursor-pointer">TOP ↑</a>
          </div>
        </div>
      </footer>

      {/* CMS CASE STUDY MODAL */}
      {modalIndex !== null && projectsData[modalIndex] && (
        <div className="fixed inset-0 z-50 bg-[#121210]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-[#F0EFE9] border border-[#111111]/[0.18] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Top Sticky Header */}
            <div className="sticky top-0 z-10 bg-[#F0EFE9] border-b border-[#111111]/[0.18] px-5 py-4 flex items-center justify-between">
              <div className="font-mono text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase">
                {projectsData[modalIndex].folio}
              </div>
              <button 
                onClick={closeProjectModal} 
                className="border border-[#121210] px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
              >
                CLOSE [ESC] ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase mb-2">
                  {projectsData[modalIndex].meta}
                </div>
                <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#121210]">
                  {projectsData[modalIndex].title}
                </h3>
              </div>

              {/* Tech Stack Badges */}
              {projectsData[modalIndex].techStack && projectsData[modalIndex].techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {projectsData[modalIndex].techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="font-mono text-[9px] tracking-[0.12em] px-2.5 py-1 bg-[#121210] text-[#F0EFE9] uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="aspect-[16/9] bg-[#121210] overflow-hidden border border-[#111111]/[0.18]">
                <img 
                  src={projectsData[modalIndex].img} 
                  alt={projectsData[modalIndex].title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Live Links if available */}
              {(projectsData[modalIndex].link || projectsData[modalIndex].githubUrl) && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {projectsData[modalIndex].link && projectsData[modalIndex].link !== '#' && (
                    <a 
                      href={projectsData[modalIndex].link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-[#CE4A30] hover:bg-[#121210] text-white px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>VISIT LIVE PLATFORM</span>
                      <span>↗</span>
                    </a>
                  )}
                  {projectsData[modalIndex].githubUrl && (
                    <a 
                      href={projectsData[modalIndex].githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="border border-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>GITHUB REPOSITORY</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              )}

              {/* Challenge & Strategy Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-[#111111]/[0.18] py-6">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">[ 01 / THE CHALLENGE ]</div>
                  <p className="text-xs sm:text-sm text-[#121210]/90 leading-relaxed">
                    {projectsData[modalIndex].challenge}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase mb-2">[ 02 / THE SYSTEM ]</div>
                  <p className="text-xs sm:text-sm text-[#121210]/90 leading-relaxed">
                    {projectsData[modalIndex].solution}
                  </p>
                </div>
              </div>

              {/* Deliverables & Outcome */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#6E6D68] uppercase block mb-1">CLIENT / CONTEXT</span>
                  <span className="editorial-serif text-2xl text-[#121210]">
                    {projectsData[modalIndex].stat}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={nextProjectInModal} 
                    className="border border-[#121210] px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
                  >
                    NEXT PROJECT →
                  </button>
                  <a 
                    href="#contact" 
                    onClick={closeProjectModal} 
                    className="bg-[#121210] text-[#F0EFE9] hover:bg-[#FF441F] px-5 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
                  >
                    COMMISSION SIMILAR WORK ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 bg-[#121210]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-[#F0EFE9] border border-[#111111]/[0.18] max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Sticky Header */}
            <div className="sticky top-0 z-10 bg-[#F0EFE9] border-b border-[#111111]/[0.18] px-5 py-4 flex items-center justify-between">
              <div className="font-mono text-[10px] tracking-[0.15em] text-[#6E6D68] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CE4A30] animate-pulse"></span>
                <span>[ CREDENTIAL INSPECTOR · {selectedCert.period || 'VERIFIED'} ]</span>
              </div>
              <button 
                onClick={() => setSelectedCert(null)} 
                className="border border-[#121210] px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-[#121210] hover:text-[#F0EFE9] transition-colors cursor-pointer"
              >
                CLOSE [ESC] ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.15em] text-[#CE4A30] uppercase mb-1.5">
                  {selectedCert.institution}
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#121210] leading-snug">
                  {selectedCert.title}
                </h3>
                {selectedCert.description && (
                  <p className="mt-3 text-xs sm:text-sm text-[#6E6D68] leading-relaxed">
                    {selectedCert.description}
                  </p>
                )}
              </div>

              {/* Certificate Media Viewer (PDF or High-Res Image) */}
              <div className="bg-[#121210] border border-[#111111]/[0.18] overflow-hidden flex items-center justify-center min-h-[340px] max-h-[66vh] p-2 relative">
                {selectedCert.certificate_url.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={selectedCert.certificate_url} 
                    title={selectedCert.title} 
                    className="w-full h-[64vh] border-0 bg-white"
                  />
                ) : (
                  <img 
                    src={selectedCert.certificate_url} 
                    alt={selectedCert.title} 
                    className="w-full h-auto max-h-[64vh] object-contain mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                )}
              </div>

              {/* Modal Footer Attestation & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#111111]/[0.18]">
                <div className="font-mono text-[10px] text-[#6E6D68] uppercase flex items-center gap-2">
                  <span className="text-[#CE4A30] font-bold">●</span>
                  <span>ATTESTATION: <strong className="text-[#121210]">OFFICIALLY RECORDED IN LAB ARCHIVE</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={selectedCert.certificate_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#CE4A30] hover:bg-[#121210] text-white px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>OPEN ORIGINAL SOURCE</span>
                    <span>↗</span>
                  </a>
                  <button 
                    onClick={() => setSelectedCert(null)} 
                    className="border border-[#121210] hover:bg-[#121210] hover:text-[#F0EFE9] px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors cursor-pointer"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
