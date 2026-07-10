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
import { SkillsSection } from '../components/organisms/SkillsSection';
import { ExperienceSection } from '../components/organisms/ExperienceSection';
import { WorksSection } from '../components/organisms/WorksSection';
import { EducationSection } from '../components/organisms/EducationSection';
import { InstagramFeed } from '../components/organisms/InstagramFeed';
import { ContactSection } from '../components/organisms/ContactSection';
import { Footer } from '../components/organisms/Footer';
import { SEO } from '../components/atoms/SEO';
import { VelocityScroll } from '../components/atoms/VelocityScroll';

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
        <section className="sticky top-0 h-screen w-full bg-white z-10 overflow-hidden flex flex-col justify-center">
          <HeroSection />
        </section>

        {/* Transition: Velocity Scroll */}
        <section className="sticky top-0 z-20 bg-white">
          <VelocityScroll baseVelocity={-2} text="DEVELOPER DESIGNER ENGINEER" />
        </section>

        {/* Section 2: About */}
        <section className="sticky top-0 h-screen w-full bg-gray-100 border-t-4 border-black z-30 overflow-y-auto pb-20">
          <AboutSection onDownloadCV={() => setIsCVModalOpen(true)} />
        </section>

        {/* Section 3: Skills */}
        <section className="sticky top-0 h-screen w-full bg-white border-t-4 border-black z-40 overflow-y-auto pb-20">
          <SkillsSection />
        </section>

        {/* Section 4: Works */}
        <section className="sticky top-0 h-screen w-full bg-gray-100 border-t-4 border-black z-50 overflow-y-auto pb-20">
          <WorksSection setActiveDetail={handleSetActiveDetail} />
        </section>

        {/* Section 5: Experience */}
        <section className="sticky top-0 h-screen w-full bg-white border-t-4 border-black z-60 overflow-y-auto pb-20">
          <ExperienceSection />
        </section>

        {/* Section 6: Education */}
        <section className="sticky top-0 h-screen w-full bg-gray-100 border-t-4 border-black z-70 overflow-y-auto pb-20">
          <EducationSection />
        </section>

        {/* Section 7: Instagram & Socials */}
        <section className="sticky top-0 h-screen w-full bg-white border-t-4 border-black z-80 overflow-y-auto pb-20">
          <InstagramFeed setHoveredArticleImg={setHoveredArticleImg} />
        </section>

        {/* Section 8: Contact & Footer */}
        <section className="sticky top-0 h-screen w-full bg-gray-100 border-t-4 border-black z-90 overflow-y-auto pb-20">
          <ContactSection />
          <Footer />
        </section>
      </main>
    </>
  );
}
