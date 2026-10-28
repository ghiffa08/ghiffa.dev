import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSupabaseSingle, useSupabaseList } from '../hooks/useSupabaseData';
import { ContactRepository } from '../repositories/ContactRepository';
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

export default function Portfolio() {
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
    let rafId = null;

    const handleBannerScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the banner enters the central focal reading range of the viewport
      const isInFocalRange = rect.top < windowHeight * 0.55 && rect.bottom > windowHeight * 0.25;
      setIsBannerDark((prev) => (prev !== isInFocalRange ? isInFocalRange : prev));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleBannerScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleBannerScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#FF5500] selection:text-white transition-colors duration-700 ease-in-out ${
        isBannerDark ? 'bg-[#F8A065] text-[#111111]' : 'bg-white text-[#111111]'
      } ${aiActive ? 'ai-mode-active' : ''}`}
    >
      <SEO
        title="Haikal Jibran Al-Ghiffarry | Portofolio &amp; Resume"
        description="Official portfolio of Haikal Jibran Al-Ghiffarry (ghiffa.dev). Building the bridge between bits and atoms for companies, governments, and organizations."
        url="https://ghiffa.dev/"
        jsonLd={homepageSchema}
      />

      {/* Header & Splash Screen Overlay */}
      <PortfolioHeader
        splashActive={splashActive}
        splashFade={splashFade}
        heroRevealed={heroRevealed}
        isBannerDark={isBannerDark}
        onOpenContact={openContactModal}
      />

      {/* Hero Section */}
      <PortfolioHero
        heroRevealed={heroRevealed}
        setHeroRevealed={setHeroRevealed}
        aiActive={aiActive}
        setAiActive={setAiActive}
      />

      {/* Sticky Scroll Text Section */}
      <StickyScrollText />

      {/* Services Section */}
      <ServiceCardsSection />

      {/* About Me Section */}
      <AboutMeSection
        avatarImage={avatarImage}
        fullName={fullName}
        aboutBio={aboutBio}
        educationList={educationList}
      />

      {/* Professional Journey Timeline Section */}
      <ProfessionalJourneySection experiencesList={experiencesList} />

      {/* Certifications Bento Grid Section */}
      <CertificationsSection
        bentoCertificates={bentoCertificates}
        onSelectCert={setCertModalItem}
      />

      {/* Selected Works Draggable Carousel Section */}
      <SelectedWorksSection
        projectsList={projectsList}
        isBannerDark={isBannerDark}
        onOpenContact={openContactModal}
      />

      {/* Skillstreak Banner Section */}
      <SkillstreakBannerSection
        bannerRef={bannerRef}
        isBannerDark={isBannerDark}
      />

      {/* Selected Articles Draggable Carousel Section (Right Below Banner Gambar 1) */}
      <SelectedArticlesSection
        articlesList={articlesList}
        isBannerDark={isBannerDark}
      />

      {/* Instagram Posts Section */}
      <InstagramPostsSection isBannerDark={isBannerDark} />

      {/* Communication Matters CTA Section */}
      <CommunicationCtaSection
        emailAddress={emailAddress}
        onOpenContact={openContactModal}
      />

      {/* Footer */}
      <PortfolioFooter
        emailAddress={emailAddress}
        onOpenContact={openContactModal}
      />

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
