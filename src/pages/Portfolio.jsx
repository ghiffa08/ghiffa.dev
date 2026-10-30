import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { ContactRepository } from '../repositories/ContactRepository';
import { LandingContentRepository, DEFAULT_LANDING_SECTIONS } from '../repositories/LandingContentRepository';
import { SEO } from '../components/atoms/SEO';
import {
  PortfolioHeader,
  PortfolioHero,
  StickyScrollText,
  ServiceCardsSection,
  AboutMeSection,
  ProfessionalJourneySection,
  CertificationsSection,
  SelectedWorksSection,
  SkillstreakBannerSection,
  SelectedArticlesSection,
  InstagramPostsSection,
  CommunicationCtaSection,
  PortfolioFooter,
  ContactModal,
  CertificateModal
} from '../components/organisms/portfolio';

// Fallback Experiences
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

// Fallback Projects
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

// Dynamic Articles Fallback
const fallbackArticles = [
  {
    id: "art-1",
    title: "Welcome to ghiffa.dev",
    slug: "welcome-to-ghiffa.dev",
    cover_image: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1786879160/oslgl5w432fjmnojpeqj.png",
    description: "Welcome to my digital playground. A quick dive into who I am, the vibes behind this site, and the tech stack running the show."
  },
  {
    id: "art-2",
    title: "Menyambut Skillstreak.web.id: Platform Belajar Coding yang Gak Bikin Bosan",
    slug: "menyambut-skillstreak-web-id-beta",
    cover_image: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1786878850/oydozz6hekvhctyio9yg.png",
    description: "Versi Beta Segera Hadir untuk Mengubah Cara Kita Belajar Software Engineering"
  },
  {
    id: "art-3",
    title: "Scalable Design Systems for Modern Enterprises",
    slug: "scalable-design-systems",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "How we unify tokens, Figma libraries, and production React components to ship products twice as fast."
  }
];

export default function Portfolio({
  overrideSections = null,
  isBuilderMode = false,
  showBuilderNavbar = false,
  activeSectionId = null,
  activeFieldKey = null,
  onSelectSection = null
}) {
  const [dbSections, setDbSections] = useState(DEFAULT_LANDING_SECTIONS);

  useEffect(() => {
    if (!overrideSections) {
      LandingContentRepository.getAllSections().then((data) => {
        if (data) setDbSections(data);
      });
    }
  }, [overrideSections]);

  const sections = overrideSections || dbSections;

  // Supabase Data Queries
  const { data: info } = useSupabaseSingle('personal_info');
  const { data: supabaseProjects } = useSupabaseList('projects');
  const { data: supabaseArticles } = useSupabaseList('articles', {
    order: { column: 'published_at', ascending: false }
  });
  const { data: supabaseExperiences } = useSupabaseList('experiences', {
    order: { column: 'order_index', ascending: true }
  });
  const { data: supabaseQualifications } = useSupabaseList('qualifications', {
    order: { column: 'order_index', ascending: true }
  });

  // Interactive AI Mode Toggle
  const [aiActive, setAiActive] = useState(false);

  // Dedicated Splash Screen state
  const [splashActive, setSplashActive] = useState(false);
  const [splashFade, setSplashFade] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(true);

  useEffect(() => {
    // Fast, seamless splash exit to achieve immediate First Contentful Paint & LCP
    const fadeTimer = setTimeout(() => {
      setSplashFade(true);
    }, 120);

    const cleanupTimer = setTimeout(() => {
      setSplashActive(false);
    }, 380);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  // Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState('');
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Certificate Lightbox Preview Modal State
  const [certModalItem, setCertModalItem] = useState(null);

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

  // Skillstreak.id Banner Section Dark Mode State
  const [isBannerDark, setIsBannerDark] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const bannerEl = bannerRef.current;
    if (!bannerEl) return;

    // Support visual builder mode container or normal viewport
    const builderScrollEl = document.getElementById('builder-canvas-scroll');
    const root = builderScrollEl || null;

    // Detect when the banner enters focal center reading zone (-20% top, -25% bottom)
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBannerDark(entry.isIntersecting);
      },
      {
        root,
        rootMargin: '-20% 0px -25% 0px',
        threshold: 0.05
      }
    );

    observer.observe(bannerEl);
    return () => observer.disconnect();
  }, [isBuilderMode]);

  useEffect(() => {
    document.body.style.transition = 'background-color 700ms cubic-bezier(0.16, 1, 0.3, 1)';
    if (isBannerDark) {
      document.body.style.backgroundColor = '#F8A065';
    } else {
      document.body.style.backgroundColor = '#ffffff';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isBannerDark]);

  // Sync AI mode class to body
  useEffect(() => {
    if (aiActive) {
      document.body.classList.add('ai-mode-active');
    } else {
      document.body.classList.remove('ai-mode-active');
    }
  }, [aiActive]);

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactErrorMessage, setContactErrorMessage] = useState('');

  const openContactModal = (topic = '') => {
    setModalTopic(topic);
    if (topic) {
      setFormData((prev) => ({ ...prev, message: `Hi ghiffa.dev, I would like to talk about: ${topic}` }));
    }
    setContactModalOpen(true);
    setFormSent(false);
    setContactErrorMessage('');
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setFormSent(false);
    setContactErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmittingContact(true);
    setContactErrorMessage('');

    try {
      await ContactRepository.submitMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        topic: modalTopic || 'General Inquiry',
        honeypot: formData.honeypot
      });

      setFormSent(true);
      setTimeout(() => {
        closeContactModal();
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      }, 1800);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
      setContactErrorMessage(err.message || 'Failed to send message. Please try again or reach out directly.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Personal Info data
  const emailAddress = info?.email || 'hello@ghiffa.dev';
  const fullName = info?.full_name || info?.name || 'Haikal Jibran Al-Ghiffarry';
  const avatarImage = info?.avatar_url || '/ghiffa.svg';
  const aboutBio = info?.about_content_en || info?.about_content;

  const experiencesList = (Array.isArray(supabaseExperiences) && supabaseExperiences.length > 0)
    ? supabaseExperiences
    : fallbackExperiences;

  // Education list for About Me section
  const educationList = useMemo(() => {
    const raw = (Array.isArray(supabaseQualifications) && supabaseQualifications.length > 0)
      ? supabaseQualifications
      : [];
    const list = raw.filter((item) => item.type === 'education');
    if (list.length > 0) return list;

    return [
      {
        id: 'edu-1',
        title: 'Informatics Engineering',
        institution: 'Universitas Kuningan, West Java, Indonesia',
        period: '2024 — Present'
      },
      {
        id: 'edu-2',
        title: 'Software Engineering',
        institution: 'SMKN 2 Kuningan, Indonesia',
        period: '2021 — 2024'
      }
    ];
  }, [supabaseQualifications]);

  const projectsList = (Array.isArray(supabaseProjects) && supabaseProjects.length > 0)
    ? supabaseProjects
    : fallbackProjects;

  const articlesList = useMemo(() => {
    if (Array.isArray(supabaseArticles) && supabaseArticles.length > 0) {
      const published = supabaseArticles.filter((a) => a.status === 'published' || !a.status);
      if (published.length > 0) return published;
    }
    return fallbackArticles;
  }, [supabaseArticles]);

  // Bento Certificates List from Supabase Database
  const bentoCertificates = useMemo(() => {
    const raw = (Array.isArray(supabaseQualifications) && supabaseQualifications.length > 0)
      ? supabaseQualifications
      : [];

    const list = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    const knownImages = {
      bnsp: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783626185/dbbffblvvangiizxkudh.jpg",
      pilmapres: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714135/f2p9oyiqe0hvurgsevhx.jpg",
      ciptaan: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783713349/qx9gf4vizsixumclht13.jpg",
      mathematics: "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783712546/h4bw2py6ldnxwzdfxmls.jpg",
      'business plan': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1790349503/o6nrysdsqeq6qmcrbouh.jpg",
      'kompetensi keahlian': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714204/bnv45qjsh61acgc9xjcy.jpg",
      'vocational school graduate academy': "https://res.cloudinary.com/tabpnp3a/image/upload/f_auto,q_auto/v1783714016/vcjgxnflef3o6blw3v1o.jpg"
    };

    raw.forEach((item, idx) => {
      if (item.type === 'education') return;

      const titleLower = (item.title || '').toLowerCase();
      let docUrl = item.certificate_url || '';

      if (!docUrl) {
        for (const [k, v] of Object.entries(knownImages)) {
          if (titleLower.includes(k)) {
            docUrl = v;
            break;
          }
        }
      }

      if (!docUrl) return;

      const imgUrl = docUrl.endsWith('.pdf') ? docUrl.replace(/\.pdf$/, '.jpg') : docUrl;

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

    list.sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
    return list;
  }, [supabaseQualifications]);

  const homepageSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://ghiffa.dev/#website',
        url: 'https://ghiffa.dev',
        name: 'ghiffa.dev',
        alternateName: 'Haikal Jibran Al-Ghiffarry Portfolio',
        description: 'Official digital portfolio and resume of Haikal Jibran Al-Ghiffarry, an IoT Engineer and Fullstack Web Developer.',
        hasPart: [
          {
            '@type': 'WebPage',
            '@id': 'https://ghiffa.dev/articles',
            url: 'https://ghiffa.dev/articles',
            name: 'Articles',
            description: 'Engineering articles, technical insights, and software architecture writings.'
          },
          {
            '@type': 'WebPage',
            '@id': 'https://ghiffa.dev/works',
            url: 'https://ghiffa.dev/works',
            name: 'Selected Works',
            description: 'Featured fullstack web applications, IoT systems, and commercial engineering projects.'
          },
          {
            '@type': 'WebPage',
            '@id': 'https://ghiffa.dev/#about',
            url: 'https://ghiffa.dev/#about',
            name: 'About Haikal Jibran',
            description: 'Biography, professional qualifications, education, and career milestones.'
          },
          {
            '@type': 'WebPage',
            '@id': 'https://ghiffa.dev/links',
            url: 'https://ghiffa.dev/links',
            name: 'Bio Links',
            description: 'Curated links, contact channels, and social media profiles.'
          }
        ]
      },
      {
        '@type': 'ItemList',
        name: 'Main Sitelinks Navigation',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Articles',
            url: 'https://ghiffa.dev/articles',
            description: 'Technical insights and software engineering articles.'
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Selected Works',
            url: 'https://ghiffa.dev/works',
            description: 'Engineering portfolio and client project case studies.'
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'About',
            url: 'https://ghiffa.dev/#about',
            description: 'Personal background, certifications, and experience.'
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: 'Bio Links',
            url: 'https://ghiffa.dev/links',
            description: 'Connect across social platforms and links.'
          }
        ]
      },
      {
        '@type': 'Person',
        '@id': 'https://ghiffa.dev/#person',
        name: fullName,
        url: 'https://ghiffa.dev',
        image: avatarImage,
        jobTitle: ['Fullstack Web Developer', 'IoT Engineer'],
        sameAs: [
          'https://github.com/ghiffa08',
          'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry',
          'https://www.instagram.com/haikaljibraan'
        ]
      }
    ]
  }), [fullName, avatarImage]);

  // Highlight active widget on canvas when activeSectionId or activeFieldKey changes
  useEffect(() => {
    if (!isBuilderMode) return;
    document.querySelectorAll('.builder-widget-active').forEach((el) => {
      el.classList.remove('builder-widget-active');
    });
    if (activeSectionId && activeFieldKey) {
      const target = document.querySelector(
        `[data-section-scope="${activeSectionId}"] [data-builder-field="${activeFieldKey}"]`
      );
      if (target) {
        target.classList.add('builder-widget-active');
      }
    }
  }, [isBuilderMode, activeSectionId, activeFieldKey, sections]);

  const buildSectionDynamicCss = (id, sectionData) => {
    const style = sectionData?.content?._style || {};
    const elementStyles = sectionData?.content?._elementStyles || {};
    const rules = [];
    const scope = `[data-section-scope="${id}"]`;

    // Section container styles
    const containerProps = [];
    if (style.backgroundColor) {
      containerProps.push(`background-color: ${style.backgroundColor} !important;`);
    }
    if (style.paddingTop !== undefined && style.paddingTop !== '') {
      containerProps.push(`padding-top: ${style.paddingTop}px !important;`);
    }
    if (style.paddingBottom !== undefined && style.paddingBottom !== '') {
      containerProps.push(`padding-bottom: ${style.paddingBottom}px !important;`);
    }
    if (style.paddingLeft !== undefined && style.paddingLeft !== '') {
      containerProps.push(`padding-left: ${style.paddingLeft}px !important;`);
    }
    if (style.paddingRight !== undefined && style.paddingRight !== '') {
      containerProps.push(`padding-right: ${style.paddingRight}px !important;`);
    }
    if (style.marginTop !== undefined && style.marginTop !== '') {
      containerProps.push(`margin-top: ${style.marginTop}px !important;`);
    }
    if (style.marginBottom !== undefined && style.marginBottom !== '') {
      containerProps.push(`margin-bottom: ${style.marginBottom}px !important;`);
    }
    if (style.opacity !== undefined && style.opacity !== '' && Number(style.opacity) < 100) {
      containerProps.push(`opacity: ${(Number(style.opacity) / 100).toFixed(2)} !important;`);
    }
    if (containerProps.length > 0) {
      rules.push(`${scope} > section, ${scope} > footer { ${containerProps.join(' ')} }`);
    }

    // Typography & Text Alignment
    if (style.textAlign) {
      const align = style.textAlign;
      const marginRule =
        align === 'center'
          ? 'margin-left: auto !important; margin-right: auto !important;'
          : align === 'left'
          ? 'margin-left: 0 !important; margin-right: auto !important;'
          : align === 'right'
          ? 'margin-left: auto !important; margin-right: 0 !important;'
          : '';
      rules.push(`${scope} h1, ${scope} h2, ${scope} h3, ${scope} p { text-align: ${align} !important; ${marginRule} }`);
    }

    const headingProps = [];
    if (style.titleFontSize) headingProps.push(`font-size: ${style.titleFontSize}px !important;`);
    if (style.fontWeight) headingProps.push(`font-weight: ${style.fontWeight} !important;`);
    if (style.textTransform) headingProps.push(`text-transform: ${style.textTransform} !important;`);
    if (style.lineHeight) headingProps.push(`line-height: ${style.lineHeight} !important;`);
    if (style.letterSpacing !== undefined && style.letterSpacing !== '') {
      headingProps.push(`letter-spacing: ${style.letterSpacing}px !important;`);
    }
    if (style.titleColor) headingProps.push(`color: ${style.titleColor} !important;`);

    if (headingProps.length > 0) {
      rules.push(`${scope} h1, ${scope} h2 { ${headingProps.join(' ')} }`);
      if (style.titleColor) {
        rules.push(`${scope} .reveal-word.active, ${scope} .reveal-word { color: ${style.titleColor} !important; }`);
      }
    }

    const bodyProps = [];
    if (style.subtitleFontSize) bodyProps.push(`font-size: ${style.subtitleFontSize}px !important;`);
    if (style.textColor) bodyProps.push(`color: ${style.textColor} !important;`);
    if (style.lineHeight) bodyProps.push(`line-height: ${style.lineHeight} !important;`);
    if (bodyProps.length > 0) {
      rules.push(`${scope} p { ${bodyProps.join(' ')} }`);
      if (style.textColor) {
        rules.push(`${scope} .reveal-subword.active, ${scope} .reveal-subword { color: ${style.textColor} !important; }`);
      }
    }

    // Per-Element / Per-Widget Style Overrides
    Object.entries(elementStyles).forEach(([fieldKey, elStyle]) => {
      if (!elStyle) return;
      const elProps = [];
      if (elStyle.textAlign) elProps.push(`text-align: ${elStyle.textAlign} !important;`);
      if (elStyle.fontSize) elProps.push(`font-size: ${elStyle.fontSize}px !important;`);
      if (elStyle.fontWeight) elProps.push(`font-weight: ${elStyle.fontWeight} !important;`);
      if (elStyle.textTransform) elProps.push(`text-transform: ${elStyle.textTransform} !important;`);
      if (elStyle.lineHeight) elProps.push(`line-height: ${elStyle.lineHeight} !important;`);
      if (elStyle.letterSpacing !== undefined && elStyle.letterSpacing !== '') {
        elProps.push(`letter-spacing: ${elStyle.letterSpacing}px !important;`);
      }
      if (elStyle.color) elProps.push(`color: ${elStyle.color} !important;`);
      if (elStyle.backgroundColor) elProps.push(`background-color: ${elStyle.backgroundColor} !important;`);
      if (elStyle.borderRadius !== undefined && elStyle.borderRadius !== '') {
        elProps.push(`border-radius: ${elStyle.borderRadius}px !important;`);
      }
      if (elProps.length > 0) {
        rules.push(`${scope} [data-builder-field="${fieldKey}"] { ${elProps.join(' ')} }`);
      }
    });

    return rules.join('\n');
  };

  const renderSectionWrapper = (id, label, component) => {
    const sectionData = sections[id] || DEFAULT_LANDING_SECTIONS[id];
    if (sectionData?.is_active === false && !isBuilderMode) return null;

    const styleConfig = sectionData?.content?._style || {};
    const dynamicCss = buildSectionDynamicCss(id, sectionData);
    const customClass = styleConfig.customClass || '';
    const customId = styleConfig.customId || undefined;

    // Responsive visibility classes
    const visibilityClasses = [
      styleConfig.hideDesktop ? 'lg:hidden' : '',
      styleConfig.hideTablet ? 'md:max-lg:hidden' : '',
      styleConfig.hideMobile ? 'max-md:hidden' : ''
    ].filter(Boolean).join(' ');

    if (!isBuilderMode) {
      return (
        <div
          key={id}
          id={customId}
          data-section-scope={id}
          className={`${visibilityClasses} ${customClass}`.trim() || undefined}
        >
          {dynamicCss && <style>{dynamicCss}</style>}
          {component(sectionData)}
        </div>
      );
    }

    const isActive = activeSectionId === id;

    const handleCanvasClick = (e) => {
      e.stopPropagation();
      // Prevent links inside canvas from navigating away during builder editing
      const anchor = e.target.closest('a');
      if (anchor) {
        e.preventDefault();
      }

      // Detect clicked widget / component field
      const fieldEl = e.target.closest('[data-builder-field]');
      let detectedFieldKey = null;
      let detectedFieldLabel = null;

      if (fieldEl) {
        detectedFieldKey = fieldEl.getAttribute('data-builder-field');
        detectedFieldLabel = fieldEl.getAttribute('data-builder-label') || detectedFieldKey;
      } else if (e.target.closest('h1, h2')) {
        detectedFieldKey = 'title';
        detectedFieldLabel = 'Section Heading';
      } else if (e.target.closest('h3')) {
        detectedFieldKey = 'title';
        detectedFieldLabel = 'Subheading';
      } else if (e.target.closest('p')) {
        detectedFieldKey = 'subtitle';
        detectedFieldLabel = 'Paragraph Text';
      } else if (anchor || e.target.closest('button')) {
        detectedFieldKey = 'cta_text';
        detectedFieldLabel = 'Action Button / Link';
      }

      if (onSelectSection) {
        onSelectSection(id, detectedFieldKey, detectedFieldLabel);
      }
    };

    return (
      <div
        key={id}
        id={`builder-section-${id}`}
        data-section-scope={id}
        onClick={handleCanvasClick}
        className={`relative transition-all duration-200 group cursor-pointer ${
          isActive
            ? 'outline-2 outline-[#0D99FF] -outline-offset-2 z-30'
            : 'hover:outline-1 hover:outline-[#0D99FF]/70 hover:-outline-offset-1'
        } ${sectionData?.is_active === false ? 'opacity-40 grayscale-[40%]' : ''} ${customClass}`}
      >
        {dynamicCss && <style>{dynamicCss}</style>}
        {/* Elementor Edit Tag Handle (Centered top pill, pointer-events-none so it never blocks canvas items) */}
        <div
          className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase shadow-lg transition-all ${
            isActive
              ? 'bg-[#0D99FF] text-white opacity-100'
              : 'bg-[#18181B]/85 text-white/90 opacity-0 group-hover:opacity-100 group-hover:bg-[#0D99FF] group-hover:text-white'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{label || id}</span>
          {isActive && activeFieldKey && (
            <span className="text-[9px] bg-[#9747FF] px-1.5 py-0.5 rounded-full text-white font-semibold ml-0.5">
              {activeFieldKey}
            </span>
          )}
          {sectionData?.is_active === false && (
            <span className="text-[9px] bg-red-600 px-1.5 py-0.5 rounded-full text-white font-bold ml-0.5">HIDDEN</span>
          )}
        </div>
        {component(sectionData)}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#FF5500] selection:text-white transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isBannerDark ? 'bg-[#F8A065] text-[#111111]' : 'bg-white text-[#111111]'
      } ${aiActive ? 'ai-mode-active' : ''} ${isBuilderMode ? 'builder-canvas-mode' : ''}`}
    >
      <SEO
        title="Haikal Jibran Al-Ghiffarry | Portofolio &amp; Resume"
        description="Official portfolio of Haikal Jibran Al-Ghiffarry (ghiffa.dev). Building the bridge between bits and atoms for companies, governments, and organizations."
        url="https://ghiffa.dev/"
        jsonLd={homepageSchema}
      />

      {/* Header & Splash Screen Overlay (Hidden by default in Visual Builder mode unless toggled on) */}
      {(!isBuilderMode || showBuilderNavbar) && (
        <div className={isBuilderMode ? 'sticky top-0 z-40 [&_header]:!relative [&_header]:!top-0' : ''}>
          <PortfolioHeader
            splashActive={isBuilderMode ? false : splashActive}
            splashFade={isBuilderMode ? true : splashFade}
            heroRevealed={heroRevealed}
            isBannerDark={isBannerDark}
            onOpenContact={openContactModal}
          />
        </div>
      )}

      {/* Hero Section */}
      {renderSectionWrapper('hero', 'Hero Canvas', (sec) => (
        <PortfolioHero
          heroRevealed={heroRevealed}
          setHeroRevealed={setHeroRevealed}
          aiActive={aiActive}
          setAiActive={setAiActive}
          sectionData={sec}
          isBuilderMode={isBuilderMode}
        />
      ))}

      {/* Sticky Scroll Text Section */}
      {renderSectionWrapper('sticky_text', 'Sticky Scroll Headline', (sec) => (
        <StickyScrollText sectionData={sec} />
      ))}

      {/* Services Section */}
      {renderSectionWrapper('services', 'Capabilities & Services', (sec) => (
        <ServiceCardsSection sectionData={sec} />
      ))}

      {/* About Me Section */}
      {renderSectionWrapper('about', 'About Me', (sec) => (
        <AboutMeSection
          avatarImage={avatarImage}
          fullName={fullName}
          aboutBio={aboutBio}
          educationList={educationList}
          sectionData={sec}
        />
      ))}

      {/* Professional Journey Timeline Section */}
      {renderSectionWrapper('journey', 'Professional Journey', (sec) => (
        <ProfessionalJourneySection
          experiencesList={experiencesList}
          sectionData={sec}
        />
      ))}

      {/* Certifications Bento Grid Section */}
      {renderSectionWrapper('certifications', 'Certifications & HAKI', (sec) => (
        <CertificationsSection
          bentoCertificates={bentoCertificates}
          onSelectCert={setCertModalItem}
          sectionData={sec}
        />
      ))}

      {/* Selected Works Draggable Carousel Section */}
      {renderSectionWrapper('works', 'Selected Works', (sec) => (
        <SelectedWorksSection
          projectsList={projectsList}
          isBannerDark={isBannerDark}
          onOpenContact={openContactModal}
          sectionData={sec}
        />
      ))}

      {/* Skillstreak Banner Section */}
      {renderSectionWrapper('skillstreak', 'Skillstreak Platform Banner', (sec) => (
        <SkillstreakBannerSection
          bannerRef={bannerRef}
          isBannerDark={isBannerDark}
          sectionData={sec}
        />
      ))}

      {/* Selected Articles Draggable Carousel Section */}
      {renderSectionWrapper('articles', 'Selected Articles', (sec) => (
        <SelectedArticlesSection
          articlesList={articlesList}
          sectionData={sec}
        />
      ))}

      {/* Instagram Posts Section */}
      {renderSectionWrapper('instagram', 'Instagram Journal', (sec) => (
        <InstagramPostsSection
          sectionData={sec}
        />
      ))}

      {/* Communication Matters CTA Section */}
      {renderSectionWrapper('cta', 'Communication CTA', (sec) => (
        <CommunicationCtaSection
          emailAddress={emailAddress}
          onOpenContact={openContactModal}
          sectionData={sec}
        />
      ))}

      {/* Footer */}
      {renderSectionWrapper('footer', 'Footer', (sec) => (
        <PortfolioFooter
          emailAddress={emailAddress}
          onOpenContact={openContactModal}
          sectionData={sec}
        />
      ))}

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={closeContactModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        formSent={formSent}
        isSubmitting={isSubmittingContact}
        errorMessage={contactErrorMessage}
      />

      {/* Certificate Modal */}
      <CertificateModal
        item={certModalItem}
        onClose={() => setCertModalItem(null)}
      />
    </div>
  );
}
