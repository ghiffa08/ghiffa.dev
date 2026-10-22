import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { useSupabaseSingle } from '../hooks/useSupabaseData';
import { SEO } from '../components/atoms/SEO';
import { ScrollReveal } from '../components/atoms/ScrollReveal';
import { slugify } from '../utils/slugify';
import { WorksHeader, PortfolioFooter } from '../components/organisms/portfolio';

const parseTechStack = (tech) => {
  if (!tech) return [];
  if (Array.isArray(tech)) return tech.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tech === 'string') return tech.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

export default function WorksPage() {
  const { data: settings } = useSupabaseSingle('general_settings');
  const { data: info } = useSupabaseSingle('personal_info');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const email = info?.email || 'hello@ghiffa.dev';
  const appName = settings?.app_name || 'ghiffa.dev';

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchProjects() {
      try {
        const data = await ProjectRepository.getAllProjects();
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter projects by search and category
  const filtered = useMemo(() => {
    return projects.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (proj.category && proj.category.toLowerCase() === selectedCategory.toLowerCase());

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const stackStr = Array.isArray(proj.tech_stack)
        ? proj.tech_stack.join(' ').toLowerCase()
        : String(proj.tech_stack || '').toLowerCase();

      return (
        proj.title?.toLowerCase().includes(q) ||
        proj.description?.toLowerCase().includes(q) ||
        proj.category?.toLowerCase().includes(q) ||
        stackStr.includes(q)
      );
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#141414] flex flex-col selection:bg-[#FF5500] selection:text-white">
      <SEO
        title={`Selected Works & Case Studies | ${appName}`}
        description="Explore production web applications, IoT embedded systems, and fullstack platforms engineered by Haikal Jibran Al-Ghiffarry."
        url="https://ghiffa.dev/works"
      />

      {/* Header matching portfolio styling */}
      <WorksHeader emailAddress={email} />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-16 pt-10 sm:pt-16 pb-20 sm:pb-28">
        {/* Section Headline */}
        <ScrollReveal delay={0.05} y={24}>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-4 select-none">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-gray-500">
                Selected Portfolio
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141414] leading-[1.05] mb-4">
              works
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl font-normal">
              A curated catalog of commercial web applications, IoT devices, online examination systems, and digital platforms built with precision, speed, and modern engineering.
            </p>
          </div>
        </ScrollReveal>

        {/* Toolbar: Search & Category Pills */}
        <ScrollReveal delay={0.1} y={20}>
          <div className="space-y-5 mb-10 sm:mb-14 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by project name, tech, or client..."
                  className="w-full pl-11 pr-10 py-2.5 rounded-full border border-gray-200 bg-[#FAFAFA] text-sm text-[#141414] placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all font-mono"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Counter */}
              <div className="font-mono text-xs text-gray-500 self-start sm:self-auto">
                Showing <strong className="text-black font-semibold">{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 select-none">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-mono font-medium px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#141414] text-white border-[#141414] shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Projects Grid or States */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex flex-col animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 mb-5" />
                <div className="h-3 bg-gray-100 rounded-md w-1/3 mb-3" />
                <div className="h-5 bg-gray-100 rounded-md w-4/5 mb-2.5" />
                <div className="h-3.5 bg-gray-100 rounded-md w-full mb-1.5" />
                <div className="h-3.5 bg-gray-100 rounded-md w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty Search Results */
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
              <FolderGit2 className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#141414] mb-1">No projects found</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-5">
              We couldn&apos;t find any works matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-mono font-medium text-black underline underline-offset-4 hover:text-[#FF5500] transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          /* Real Works Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filtered.map((proj, idx) => {
              const projImg =
                proj.image_url ||
                (Array.isArray(proj.image_urls) && proj.image_urls.length > 0
                  ? proj.image_urls[0]
                  : null);
              const projectSlug = slugify(proj.title);

              return (
                <ScrollReveal key={proj.id || idx} delay={idx * 0.05} y={24}>
                  <Link
                    to={`/project/${projectSlug}`}
                    className="group flex flex-col cursor-pointer select-none"
                  >
                    {/* Visual Cover (4:3 aspect ratio, rounded-2xl) */}
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-[#F4F4F5] shadow-xs border border-black/5">
                      {projImg ? (
                        <img
                          src={projImg}
                          alt={proj.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-wider">
                          ghiffa.dev work
                        </div>
                      )}

                      {/* Floating Category Tag */}
                      {proj.category && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-800 border border-black/5 shadow-2xs">
                          {proj.category}
                        </div>
                      )}
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                      {proj.client && <span>{proj.client}</span>}
                      {proj.client && proj.year && <span className="text-gray-300">&middot;</span>}
                      {proj.year && <span>{proj.year}</span>}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-[19.5px] font-semibold leading-[1.3] mb-2 text-[#141414] group-hover:text-[#FF5500] transition-colors line-clamp-2">
                      {proj.title}
                    </h2>

                    {/* Description */}
                    <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-[#71717A] line-clamp-3 font-normal mb-3">
                      {proj.description}
                    </p>

                    {/* Tech stack badges snippet */}
                    {(() => {
                      const stack = parseTechStack(proj.tech_stack);
                      if (stack.length === 0) return null;
                      return (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {stack.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200/60"
                            >
                              {tech}
                            </span>
                          ))}
                          {stack.length > 3 && (
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">
                              +{stack.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {/* Action Link */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#141414] group-hover:text-[#FF5500] transition-colors mt-auto pt-1">
                      <span>View case study</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </main>

      {/* Reusable Portfolio Footer */}
      <PortfolioFooter emailAddress={email} />
    </div>
  );
}
