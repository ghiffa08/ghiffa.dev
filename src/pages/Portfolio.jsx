import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ProjectRepository } from '../repositories/ProjectRepository';

// Hooks
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useSupabaseSingle } from '../hooks/useSupabaseData';

// Components
const ThreeBackground = lazy(() => import('../components/organisms/ThreeBackground').then(m => ({ default: m.ThreeBackground })));
const CustomCursor = lazy(() => import('../components/organisms/CustomCursor').then(m => ({ default: m.CustomCursor })));
import { DetailModal } from '../components/organisms/DetailModal';
import { CVDownloadModal } from '../components/organisms/CVDownloadModal';
import { Header } from '../components/organisms/Header';
import { HeroSection } from '../components/organisms/HeroSection';
import { AboutSection } from '../components/organisms/AboutSection';
import { ExperienceSection } from '../components/organisms/ExperienceSection';
import { WorksSection } from '../components/organisms/WorksSection';
import { EducationSection } from '../components/organisms/EducationSection';
import { InstagramFeed } from '../components/organisms/InstagramFeed';
import { ContactSection } from '../components/organisms/ContactSection';
import { Footer } from '../components/organisms/Footer';
import { SEO } from '../components/atoms/SEO';
import { PinnedMarquee } from '../components/atoms/PinnedMarquee';

export default function Portfolio() {
  // Custom hooks initialization
  useSmoothScroll();

  // Data
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  // State
  const [hoveredArticleImg, setHoveredArticleImg] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  
  const { slug } = useParams();
  const location = useLocation();

  useEffect(() => {
    const isProject = location.pathname.startsWith('/project/');

    async function fetchDetail() {
      if (isProject && slug) {
        try {
          const matchedProject = await ProjectRepository.getProjectBySlug(slug);
          if (matchedProject && !activeDetail) {
            setActiveDetail({ 
              ...matchedProject, 
              type: 'project', 
              img: matchedProject.image_urls?.[0] || matchedProject.image_url, 
              stack: Array.isArray(matchedProject.tech_stack) ? matchedProject.tech_stack : [], 
              desc: matchedProject.description 
            });
          }
        } catch (err) {
          console.error("Error fetching project detail:", err);
        }
      }
    }

    if (!activeDetail && slug) {
      fetchDetail();
    }
  }, []); // Only run once on mount

  const handleSetActiveDetail = (detail) => {
    setActiveDetail(detail);
    if (detail) {
      if (detail.type === 'project') {
        window.history.pushState(null, '', `/project/${detail.slug}`);
      }
    } else {
      window.history.pushState(null, '', `/`);
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": info?.full_name || "Haikal Jibran Al Ghiffarry",
    "url": "https://ghiffa.dev",
    "image": "https://ghiffa.dev/og-image.jpg",
    "sameAs": info?.social_links ? [
      info.social_links.github,
      info.social_links.linkedin,
      info.social_links.instagram
    ].filter(Boolean) : [],
    "jobTitle": info?.role || "Systems Architect & Full-stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  const baseTitle = settings?.seo_title || "Portfolio & Resume";
  const appName = settings?.app_name || "Haikal Jibran";
  
  const pageTitle = activeDetail 
    ? `${activeDetail.title} — ${appName}` 
    : `${baseTitle} | ${appName}`;
    
  const pageDesc = activeDetail?.desc || settings?.seo_description || "Creative Software Engineer specializing in scalable web systems, intuitive interfaces, and AI implementations.";

  return (
    <>
      <SEO 
        title={pageTitle} 
        description={pageDesc}
        jsonLd={personSchema}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        
        :root {
          --bg-light: #FAFAFA;
          --bg-card: #FFFFFF;
          --text-dark: #111111;
          --border: #E5E5E5;
          --accent: #666666;
        }

        body {
          background-color: var(--bg-light);
          color: var(--text-dark);
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif-editorial { font-family: 'Playfair Display', serif; }
        
        .hairline-b { border-bottom: 1px solid var(--border); }
        .hairline-t { border-top: 1px solid var(--border); }
        .hairline-l { border-left: 1px solid var(--border); }
        
        ::selection { background: var(--text-dark); color: var(--bg-light); }

        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll 60s linear infinite;
        }

        .drop-cap::first-letter {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem;
          font-weight: 700;
          float: left;
          line-height: 0.8;
          padding-right: 0.75rem;
          padding-top: 0.25rem;
          color: #111111;
        }
      `}} />

      <Suspense fallback={null}>
        <ThreeBackground />
        <CustomCursor 
          hoveredArticleImg={hoveredArticleImg} 
          activeDetail={activeDetail} 
        />
      </Suspense>

      <DetailModal 
        activeDetail={activeDetail} 
        setActiveDetail={handleSetActiveDetail} 
      />

      <CVDownloadModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
      />

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="relative w-full z-10 selection:bg-[#111111] selection:text-[#FAFAFA]">
        <Header />
        
        {/* Section 1: Hero */}
        <section className="sticky top-0 w-full h-screen flex flex-col justify-center items-center z-0 overflow-hidden bg-white">
          <HeroSection />
        </section>

        {/* Section 2: About */}
        <section className="relative w-full h-auto min-h-screen py-16 md:py-24 flex flex-col justify-center z-10 bg-white shadow-[0px_-10px_30px_rgba(0,0,0,0.1)]">
          <AboutSection onDownloadCV={() => setIsCVModalOpen(true)} />
        </section>

        {/* Transition: Pinned Horizontal Scroll Marquee */}
        <PinnedMarquee 
          text={info?.skills && info.skills.length > 0 
            ? info.skills.map(s => s.toUpperCase()).join(' ') 
            : "SQL MYSQL SUPABASE GSAP WEB DESIGN UI/UX ESP32 MICROCONTROLLER"
          } 
        />

        {/* Section 3: Works */}
        <section className="relative z-20 w-full h-auto min-h-screen py-16 md:py-24 bg-[#FAFAFA] flex flex-col justify-center">
          <WorksSection setActiveDetail={handleSetActiveDetail} />
        </section>

        {/* Section 4: Experience */}
        <section className="relative z-30 w-full h-auto min-h-screen py-16 md:py-24 bg-white flex flex-col justify-center">
          <ExperienceSection />
        </section>

        {/* Section 5: Education */}
        <section className="relative z-40 w-full h-auto min-h-screen py-16 md:py-24 bg-[#FAFAFA] flex flex-col justify-center">
          <EducationSection />
        </section>

        {/* Section 6: Instagram & Socials */}
        <section className="relative z-50 w-full h-auto min-h-screen py-16 md:py-24 bg-white flex flex-col justify-center">
          <InstagramFeed setHoveredArticleImg={setHoveredArticleImg} />
        </section>

        {/* Section 7: Contact & Footer */}
        <section className="relative z-60 w-full h-auto min-h-screen py-16 md:py-24 bg-[#111111] text-[#FAFAFA] flex flex-col justify-center">
          <ContactSection />
          <Footer />
        </section>
      </main>
    </>
  );
}
