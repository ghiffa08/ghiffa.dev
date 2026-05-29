import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { slugify } from '../utils/slugify';

// Hooks
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useMousePosition } from '../hooks/useMousePosition';

// Components
const ThreeBackground = lazy(() => import('../components/organisms/ThreeBackground').then(m => ({ default: m.ThreeBackground })));
const CustomCursor = lazy(() => import('../components/organisms/CustomCursor').then(m => ({ default: m.CustomCursor })));
import { DetailModal } from '../components/organisms/DetailModal';
import { Header } from '../components/organisms/Header';
import { HeroSection } from '../components/organisms/HeroSection';
import { AboutSection } from '../components/organisms/AboutSection';
import { ExperienceSection } from '../components/organisms/ExperienceSection';
import { WorksSection } from '../components/organisms/WorksSection';
import { EducationSection } from '../components/organisms/EducationSection';
import { ArticlesSection } from '../components/organisms/ArticlesSection';
import { ContactSection } from '../components/organisms/ContactSection';
import { Footer } from '../components/organisms/Footer';
import { SEO } from '../components/atoms/SEO';

export default function Portfolio() {
  // Custom hooks initialization
  useSmoothScroll();
  const mousePos = useMousePosition();

  // State
  const [hoveredArticleImg, setHoveredArticleImg] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  
  const { slug } = useParams();
  const location = useLocation();

  useEffect(() => {
    const isProject = location.pathname.startsWith('/project/');
    const isArticle = location.pathname.startsWith('/article/');

    async function fetchDetail() {
      if (isProject && slug) {
        const { data } = await supabase.from('projects').select('*');
        if (data && !activeDetail) {
          const matchedProject = data.find(p => slugify(p.title) === slug);
          if (matchedProject) {
            setActiveDetail({ 
              ...matchedProject, 
              type: 'project', 
              img: matchedProject.image_url, 
              stack: Array.isArray(matchedProject.tech_stack) ? matchedProject.tech_stack : [], 
              desc: matchedProject.description 
            });
          }
        }
      } else if (isArticle && slug) {
        const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
        if (data && !activeDetail) {
          setActiveDetail({ 
            ...data, 
            type: 'article', 
            img: data.cover_image, 
            date: data.published_at ? new Date(data.published_at).toLocaleDateString() : '', 
            readTime: data.read_time, 
            desc: data.description 
          });
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
      } else if (detail.type === 'article') {
        window.history.pushState(null, '', `/article/${detail.slug}`);
      }
    } else {
      window.history.pushState(null, '', `/`);
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Haikal Jibran Al Ghiffarry",
    "url": "https://ghiffa.dev",
    "image": "https://ghiffa.dev/og-image.jpg",
    "sameAs": [
      "https://github.com/ghiffa",
      "https://linkedin.com/in/haikal-jibran-al-ghiffarry",
      "https://instagram.com/haikaljibrn__"
    ],
    "jobTitle": "Systems Architect & Full-stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  return (
    <>
      <SEO 
        title="Portfolio & Resume" 
        description="Creative Software Engineer specializing in scalable web systems, intuitive interfaces, and AI implementations. Based in Kuningan, Indonesia."
        jsonLd={personSchema}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --bg: #FAFAFA;
          --text: #111111;
          --grid-line: #E5E5E5;
          --accent: #3B82F6;
        }

        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif-editorial { font-family: 'Playfair Display', serif; }
        
        .hairline-b { border-bottom: 1px solid var(--grid-line); }
        .hairline-t { border-top: 1px solid var(--grid-line); }
        .hairline-r { border-right: 1px solid var(--grid-line); }
        .hairline-l { border-left: 1px solid var(--grid-line); }
        
        .clip-text { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
        ::selection { background: var(--text); color: var(--bg); }

        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Magazine Drop Cap Styling */
        .drop-cap::first-letter {
          font-size: 5rem;
          font-weight: 900;
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
          mousePos={mousePos} 
        />
      </Suspense>

      <DetailModal 
        activeDetail={activeDetail} 
        setActiveDetail={handleSetActiveDetail} 
      />

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto hairline-l hairline-r bg-transparent">
        <Header />
        
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <WorksSection setActiveDetail={handleSetActiveDetail} />
        <EducationSection />
        <ArticlesSection 
          setActiveDetail={handleSetActiveDetail} 
          setHoveredArticleImg={setHoveredArticleImg} 
        />
        <ContactSection />
        
        <Footer />
      </div>
    </>
  );
}
