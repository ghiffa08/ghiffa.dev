import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Calendar,
  UserCheck,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import { ScrollReveal } from '../components/atoms/ScrollReveal';
import { slugify } from '../utils/slugify';
import { WorksHeader, PortfolioFooter } from '../components/organisms/portfolio';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  const [project, setProject] = useState(null);
  const [moreProjects, setMoreProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const email = info?.email || 'hello@ghiffa.dev';
  const appName = settings?.app_name || 'ghiffa.dev';

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchProjectAndMore() {
      setLoading(true);
      try {
        const data = await ProjectRepository.getProjectBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setProject(data);
          setNotFound(false);
          setActiveImageIndex(0);

          // Fetch other projects for bottom recommendation section
          try {
            const all = await ProjectRepository.getAllProjects(5);
            const others = (all || [])
              .filter((p) => slugify(p.title) !== slug)
              .slice(0, 3);
            setMoreProjects(others);
          } catch {
            // non-fatal
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchProjectAndMore();
  }, [slug]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col">
        <WorksHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-20 flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-3 border-[#111111] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 animate-pulse">
            Loading Project Case Study...
          </p>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  // Not Found State
  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-white text-[#141414] flex flex-col">
        <WorksHeader showBack={true} emailAddress={email} />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-24 text-center flex flex-col items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-2">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141414] mb-3">
            Project Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The project you are looking for doesn&apos;t exist, has been moved, or the URL might be incorrect.
          </p>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium px-5 py-2.5 rounded-full bg-[#141414] text-white hover:bg-[#2b2b2b] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Works</span>
          </Link>
        </main>
        <PortfolioFooter emailAddress={email} />
      </div>
    );
  }

  const allImages = Array.isArray(project.image_urls) && project.image_urls.length > 0
    ? project.image_urls
    : (project.image_url ? [project.image_url] : []);

  const techStackList = Array.isArray(project.tech_stack)
    ? project.tech_stack.map((t) => String(t).trim()).filter(Boolean)
    : (typeof project.tech_stack === 'string'
      ? project.tech_stack.split(',').map((t) => t.trim()).filter(Boolean)
      : []);

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#FF5500] selection:text-white">
      <SEO
        title={`${project.title} — Case Study | ${appName}`}
        description={project.description || `Explore ${project.title} case study, tech architecture, and deliverables.`}
        image={allImages[0] || undefined}
        url={`https://ghiffa.dev/project/${slug}`}
      />

      {/* Reusable Header */}
      <WorksHeader currentTitle={project.title} showBack={true} emailAddress={email} />

      <main className="flex-1 w-full">
        {/* Project Header Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-8">
          <ScrollReveal delay={0.05} y={16}>
            {/* Back link */}
            <Link
              to="/works"
              className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-black transition-colors mb-6 sm:mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to all works</span>
            </Link>

            {/* Category / Client / Year Eyebrow */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-3 select-none">
              {project.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span>{project.category}</span>
                </span>
              )}
              {project.year && (
                <span className="inline-flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{project.year}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#141414] leading-[1.08] mb-5">
              {project.title}
            </h1>

            {/* Executive Summary */}
            {project.description && (
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal mb-8 max-w-3xl">
                {project.description}
              </p>
            )}

            {/* Action Buttons: Live Link & GitHub */}
            <div className="flex flex-wrap items-center gap-3 pt-2 pb-6 border-b border-gray-100">
              {project.link && project.link !== '#' && project.link.startsWith('http') && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-medium text-xs sm:text-[13px] px-6 py-3 rounded-full shadow-sm shadow-orange-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Visit Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.github_url && project.github_url.startsWith('http') && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium text-xs sm:text-[13px] px-6 py-3 rounded-full shadow-2xs hover:border-gray-400 transition-all active:scale-95 cursor-pointer font-mono"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>

            {/* Project Specs Table / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-gray-100 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                  Client / Organization
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {project.client || 'ghiffa.dev project'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                  Timeline
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {project.year || '2024'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                  Role
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  Fullstack &amp; IoT
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </span>
              </div>
            </div>

            {/* Tech Stack Pills */}
            {techStackList.length > 0 && (
              <div className="pt-6 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 block mb-2.5">
                  Technologies &amp; Architecture
                </span>
                <div className="flex flex-wrap gap-2">
                  {techStackList.map((tech, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200/60 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Hero Visual Media */}
        {allImages.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
            <ScrollReveal delay={0.1} y={24}>
              {/* Main Active Preview */}
              <div className="aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 border border-black/5 shadow-xs mb-4">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${project.title} Preview ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>

              {/* Thumbnails Strip if multiple images exist */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-24 sm:w-28 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === i
                          ? 'border-[#FF5500] shadow-sm scale-102'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </div>
        )}

        {/* Markdown Case Study Body if available */}
        {project.content ? (
          <article className="max-w-3xl mx-auto px-4 sm:px-8 pb-16">
            <div className="prose-portfolio">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          /* Elegant Fallback Architecture Note */
          <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-16">
            <div className="bg-[#FAFAFA] border border-gray-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5500]" />
                <h3 className="text-base sm:text-lg font-semibold text-[#141414]">
                  Key Engineering Highlights
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {project.description ||
                  'This project was engineered with high performance, modular architecture, and modern industry best practices.'}
              </p>
              {techStackList.length > 0 && (
                <div className="pt-2 text-xs font-mono text-gray-500">
                  Built with: <span className="font-semibold text-gray-800">{techStackList.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* More Works Recommendation Section */}
        {moreProjects.length > 0 && (
          <section className="border-t border-gray-100 bg-[#FAFAFA] py-16 sm:py-20">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#FF5500] block mb-1">
                    Portfolio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
                    more works
                  </h2>
                </div>

                <Link
                  to="/works"
                  className="text-xs font-mono text-gray-600 hover:text-black inline-flex items-center gap-1 font-medium"
                >
                  <span>Explore all</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {moreProjects.map((otherProj, idx) => {
                  const otherImg =
                    otherProj.image_url ||
                    (Array.isArray(otherProj.image_urls) && otherProj.image_urls.length > 0
                      ? otherProj.image_urls[0]
                      : null);
                  const otherSlug = slugify(otherProj.title);

                  return (
                    <Link
                      key={otherProj.id || idx}
                      to={`/project/${otherSlug}`}
                      className="group bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-gray-400 hover:shadow-xs transition-all flex flex-col"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4 border border-black/5">
                        {otherImg ? (
                          <img
                            src={otherImg}
                            alt={otherProj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/30 font-mono text-xs">
                            ghiffa.dev
                          </div>
                        )}
                      </div>

                      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">
                        {otherProj.category || 'Engineering'}
                      </span>

                      <h3 className="text-base font-semibold text-[#141414] group-hover:text-[#FF5500] transition-colors line-clamp-2 mb-2 leading-snug">
                        {otherProj.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-auto pt-1">
                        {otherProj.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Reusable Portfolio Footer */}
      <PortfolioFooter emailAddress={email} />
    </div>
  );
}
