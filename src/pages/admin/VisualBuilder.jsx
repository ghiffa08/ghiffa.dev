import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LandingContentRepository,
  DEFAULT_LANDING_SECTIONS
} from '../../repositories/LandingContentRepository';
import Portfolio from '../Portfolio';
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Layers,
  Settings,
  Maximize2,
  Layout,
  ScrollText,
  Cpu,
  User,
  Milestone,
  Award,
  Briefcase,
  Zap,
  BookOpen,
  Camera,
  MessageSquare,
  PanelBottom
} from 'lucide-react';

const SECTION_CONFIGS = [
  {
    id: 'hero',
    name: 'Hero Canvas',
    icon: Layout,
    description: 'Header, main display title, and floating social & tech widgets',
    fields: [
      { key: 'title', label: 'Main Display Title', type: 'text', placeholder: 'ghiffa.dev' },
      { key: 'headline', label: 'Author Full Name', type: 'text', parent: 'content', placeholder: 'Haikal Jibran Al-Ghiffarry' },
      { key: 'ai_mode_label', label: 'AI Mode Toggle Label', type: 'text', parent: 'content', placeholder: 'AI Mode' },
      { key: 'email_label', label: 'Email Card Prefix', type: 'text', parent: 'content', placeholder: 'Drop a message at' },
      { key: 'linkedin_label', label: 'LinkedIn Card Prefix', type: 'text', parent: 'content', placeholder: 'Connect on LinkedIn' },
      { key: 'instagram_label', label: 'Instagram Card Prefix', type: 'text', parent: 'content', placeholder: 'Connect on Instagram' },
      { key: 'skillstreak_label', label: 'Skillstreak Card Prefix', type: 'text', parent: 'content', placeholder: 'Gamified platform' }
    ]
  },
  {
    id: 'sticky_text',
    name: 'Sticky Scroll Headline',
    icon: ScrollText,
    description: 'Word-by-word reveal text triggered on scroll',
    fields: [
      { key: 'title', label: 'Main Headline Sentence', type: 'textarea', placeholder: 'Building the bridge between bits and atoms for companies, governments, and organizations.' },
      { key: 'subtitle', label: 'Subtext Sentence', type: 'textarea', placeholder: 'Following our goal of making the internet a better place.' }
    ]
  },
  {
    id: 'services',
    name: 'Capabilities & Services',
    icon: Cpu,
    description: '3 Service cards: Mobile Apps, Web Development, and IoT Hardware',
    fields: [
      { key: 'card1_title', label: 'Card 1 (Mobile) Title', type: 'text', parent: 'content', placeholder: 'Mobile app services' },
      { key: 'card1_desc', label: 'Card 1 Description', type: 'textarea', parent: 'content' },
      { key: 'card1_footer', label: 'Card 1 Footer Text', type: 'text', parent: 'content' },
      { key: 'card2_title', label: 'Card 2 (Web) Title', type: 'text', parent: 'content', placeholder: 'Web development services' },
      { key: 'card2_desc', label: 'Card 2 Description', type: 'textarea', parent: 'content' },
      { key: 'card2_footer', label: 'Card 2 Footer Text', type: 'text', parent: 'content' },
      { key: 'card3_title', label: 'Card 3 (IoT) Title', type: 'text', parent: 'content', placeholder: 'IoT & hardware services' },
      { key: 'card3_desc', label: 'Card 3 Description', type: 'textarea', parent: 'content' },
      { key: 'card3_footer', label: 'Card 3 Footer Text', type: 'text', parent: 'content' }
    ]
  },
  {
    id: 'about',
    name: 'About Me',
    icon: User,
    description: 'Cutout showcase, education titles, and availability status badge',
    fields: [
      { key: 'title', label: 'Section Header Title', type: 'text', placeholder: 'about me' },
      { key: 'education_title', label: 'Education Heading', type: 'text', parent: 'content', placeholder: 'Education' },
      { key: 'languages_title', label: 'Languages Heading', type: 'text', parent: 'content', placeholder: 'Languages & Specialization' },
      { key: 'status_badge', label: 'Availability Badge Text', type: 'text', parent: 'content', placeholder: 'Available for Full-Time & Contracts' }
    ]
  },
  {
    id: 'journey',
    name: 'Professional Journey',
    icon: Milestone,
    description: 'Career roadmap and professional experience timeline',
    fields: [
      { key: 'title', label: 'Display Title', type: 'text', placeholder: 'professional journey' }
    ]
  },
  {
    id: 'certifications',
    name: 'Certifications & HAKI',
    icon: Award,
    description: 'Bento grid showing verified credentials and copyrights',
    fields: [
      { key: 'title', label: 'Section Heading', type: 'text', placeholder: 'Credentials & Achievements' }
    ]
  },
  {
    id: 'works',
    name: 'Selected Works',
    icon: Briefcase,
    description: 'Draggable project showcase carousel',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'selected works' },
      { key: 'cta_text', label: 'Explore Button Text', type: 'text', parent: 'content', placeholder: 'Explore all works →' }
    ]
  },
  {
    id: 'skillstreak',
    name: 'Skillstreak Platform Banner',
    icon: Zap,
    description: 'Interactive MacBook frame showcasing skillstreak.id',
    fields: [
      { key: 'title', label: 'Banner Brand Title', type: 'text', placeholder: 'skillstreak.id' },
      { key: 'heading', label: 'Main Value Proposition', type: 'textarea', parent: 'content' },
      { key: 'desc', label: 'Secondary Description', type: 'textarea', parent: 'content' },
      { key: 'cta_text', label: 'CTA Button Text', type: 'text', parent: 'content', placeholder: 'Get Early Access' },
      { key: 'cta_url', label: 'CTA Target URL', type: 'text', parent: 'content', placeholder: 'https://skillstreak.id' }
    ]
  },
  {
    id: 'articles',
    name: 'Selected Articles',
    icon: BookOpen,
    description: 'Featured technical insights and publication carousel',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'selected articles' },
      { key: 'cta_text', label: 'Explore Button Text', type: 'text', parent: 'content', placeholder: 'Explore all articles →' }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram Journal',
    icon: Camera,
    description: 'Social photo feed grid & account link',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'instagram posts' },
      { key: 'handle', label: 'Instagram Handle', type: 'text', parent: 'content', placeholder: '@haikaljibraan' }
    ]
  },
  {
    id: 'cta',
    name: 'Communication Matters CTA',
    icon: MessageSquare,
    description: 'End-of-page contact inquiry trigger',
    fields: [
      { key: 'title', label: 'Main Headline', type: 'text', placeholder: 'communication matters' },
      { key: 'highlight_text', label: 'Highlighted Suffix', type: 'text', parent: 'content', placeholder: 'to start good things/' },
      { key: 'subtitle', label: 'Paragraph Narrative', type: 'textarea', parent: 'content' },
      { key: 'button_text', label: 'Contact Button Text', type: 'text', parent: 'content', placeholder: "Let's Connect With Me" }
    ]
  },
  {
    id: 'footer',
    name: 'Portfolio Footer',
    icon: PanelBottom,
    description: 'Copyright, location, and bottom navigation credits',
    fields: [
      { key: 'title', label: 'Footer Brand Title', type: 'text', placeholder: 'ghiffa.dev' },
      { key: 'desc', label: 'Brand Description', type: 'textarea', parent: 'content' },
      { key: 'location', label: 'Location String', type: 'text', parent: 'content', placeholder: 'Kuningan, West Java, ID' },
      { key: 'copyright', label: 'Copyright Owner', type: 'text', parent: 'content', placeholder: 'Haikal Jibran Al-Ghiffarry' }
    ]
  }
];

export default function VisualBuilder() {
  const [sections, setSections] = useState(DEFAULT_LANDING_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load sections from DB or localStorage
  useEffect(() => {
    LandingContentRepository.getAllSections().then((data) => {
      if (data) {
        setSections(data);
      }
    });
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFieldChange = (sectionId, fieldKey, value, isContent = false) => {
    setSections((prev) => {
      const section = prev[sectionId] || { id: sectionId, title: '', subtitle: '', content: {}, is_active: true };
      let updated;
      if (isContent) {
        updated = {
          ...section,
          content: {
            ...(section.content || {}),
            [fieldKey]: value
          }
        };
      } else {
        updated = {
          ...section,
          [fieldKey]: value
        };
      }
      return {
        ...prev,
        [sectionId]: updated
      };
    });
    setHasUnsavedChanges(true);
  };

  const toggleSectionActive = (sectionId, e) => {
    e.stopPropagation();
    setSections((prev) => {
      const section = prev[sectionId] || { id: sectionId, title: '', subtitle: '', content: {}, is_active: true };
      return {
        ...prev,
        [sectionId]: {
          ...section,
          is_active: section.is_active === false ? true : false
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    try {
      const res = await LandingContentRepository.saveAllSections(sections);
      if (res.success) {
        setHasUnsavedChanges(false);
        showToast(
          res.savedLocally && res.warning
            ? 'Changes published locally & cached! (Supabase sync warning: ' + res.warning + ')'
            : 'Changes successfully published live to Supabase & Cached!',
          'success'
        );
      } else {
        showToast('Error saving: ' + (res.error || 'Unknown error'), 'error');
      }
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all landing sections to default copy?')) {
      const defaults = LandingContentRepository.resetToDefaults();
      setSections(defaults);
      setHasUnsavedChanges(true);
      showToast('Reset to system defaults. Click "Save & Publish" to commit.', 'info');
    }
  };

  const scrollToSectionInCanvas = (sectionId) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(`builder-section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const filteredConfigs = SECTION_CONFIGS.filter((cfg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cfg.name.toLowerCase().includes(q) ||
      cfg.description.toLowerCase().includes(q) ||
      cfg.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-[#111113] text-[#E4E4E7] overflow-hidden select-none font-sans">
      {/* 1. ELEMENTOR TOP BAR */}
      <header className="h-[56px] bg-[#18181B] border-b border-[#27272A] px-4 flex items-center justify-between z-40 shrink-0">
        {/* Left: Back & Branding */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/panel/dashboard"
            className="w-8 h-8 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            title="Back to Admin Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E24B88] animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 font-mono">
              <span>ELEMENTOR BUILDER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272A] text-gray-400 font-normal">v2.0</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#27272A] text-xs text-gray-400">
            <span>Target:</span>
            <span className="font-mono text-gray-200 bg-[#27272A] px-2 py-0.5 rounded font-medium">Homepage (Portfolio.jsx)</span>
          </div>
        </div>

        {/* Center: Viewport Controls */}
        <div className="flex items-center bg-[#27272A]/70 p-1 rounded-xl border border-[#3F3F46]/50">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewport === 'desktop'
                ? 'bg-[#E24B88] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Desktop Fullscreen (100%)"
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewport === 'tablet'
                ? 'bg-[#E24B88] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewport === 'mobile'
                ? 'bg-[#E24B88] text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="hidden xl:inline text-[11px] text-amber-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Unsaved changes
            </span>
          )}

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#27272A] transition-colors"
            title="Reset to default landing content"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#27272A] transition-colors"
            title="View public live site"
          >
            <ExternalLink size={14} />
            <span className="hidden md:inline">Preview</span>
          </a>

          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#E24B88] hover:bg-[#D03874] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-[#E24B88]/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* 2. BODY SPLIT: SIDEBAR (380px) + CANVAS PREVIEW */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT ELEMENTOR DOCK */}
        <aside
          className={`h-full bg-[#18181B] border-r border-[#27272A] transition-all duration-300 flex flex-col z-30 shrink-0 ${
            sidebarOpen ? 'w-[380px]' : 'w-0'
          }`}
        >
          {sidebarOpen && (
            <>
              {/* Dock Header */}
              <div className="p-4 border-b border-[#27272A] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Layers size={14} className="text-[#E24B88]" />
                    Page Sections ({SECTION_CONFIGS.length})
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
                </div>

                {/* Filter / Search input */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sections or texts..."
                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E24B88]"
                  />
                </div>
              </div>

              {/* Sections Accordion List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#27272A]/80 no-scrollbar">
                {filteredConfigs.map((cfg) => {
                  const Icon = cfg.icon;
                  const sectionData = sections[cfg.id] || DEFAULT_LANDING_SECTIONS[cfg.id] || {};
                  const isExpanded = activeSectionId === cfg.id;
                  const isActive = sectionData.is_active !== false;

                  return (
                    <div
                      key={cfg.id}
                      className={`transition-colors ${isExpanded ? 'bg-[#202024]' : 'hover:bg-[#1E1E22]'}`}
                    >
                      {/* Section Accordion Title Bar */}
                      <div
                        onClick={() => scrollToSectionInCanvas(cfg.id)}
                        className="px-4 py-3 flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#27272A] border border-[#3F3F46]/50 flex items-center justify-center shrink-0 text-[#E24B88] group-hover:bg-[#E24B88] group-hover:text-white transition-colors">
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-[#E24B88] transition-colors truncate">
                              {cfg.name}
                            </div>
                            <div className="text-[10px] text-gray-400 truncate font-mono">
                              id: {cfg.id}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={(e) => toggleSectionActive(cfg.id, e)}
                            className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${
                              isActive ? 'text-emerald-400' : 'text-gray-600'
                            }`}
                            title={isActive ? 'Section visible on homepage' : 'Section hidden'}
                          >
                            {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>

                          {/* Accordion Chevron */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSectionId(isExpanded ? null : cfg.id);
                            }}
                            className="p-1.5 text-gray-400 group-hover:text-white"
                          >
                            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Section Form Inputs */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 space-y-3 bg-[#161619] border-t border-[#27272A]/60">
                          <p className="text-[11px] text-gray-400 leading-relaxed italic">
                            {cfg.description}
                          </p>

                          {cfg.fields.map((field) => {
                            const isContentField = field.parent === 'content';
                            const currentValue = isContentField
                              ? sectionData.content?.[field.key] ?? ''
                              : sectionData[field.key] ?? '';

                            return (
                              <div key={field.key} className="space-y-1">
                                <label className="block text-[11px] font-mono font-semibold text-gray-300">
                                  {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                  <textarea
                                    rows={3}
                                    value={currentValue}
                                    onChange={(e) =>
                                      handleFieldChange(cfg.id, field.key, e.target.value, isContentField)
                                    }
                                    placeholder={field.placeholder || ''}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E24B88] font-sans resize-y"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={currentValue}
                                    onChange={(e) =>
                                      handleFieldChange(cfg.id, field.key, e.target.value, isContentField)
                                    }
                                    placeholder={field.placeholder || ''}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E24B88] font-sans"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* SIDEBAR TOGGLE TAB */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 z-40 bg-[#18181B] border border-[#27272A] text-gray-300 hover:text-white p-2 rounded-r-lg shadow-md transition-all"
          style={{ left: sidebarOpen ? '380px' : '0' }}
          title={sidebarOpen ? 'Collapse Left Dock' : 'Expand Left Dock'}
        >
          {sidebarOpen ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
        </button>

        {/* RIGHT PREVIEW CANVAS CONTAINER */}
        <main className="flex-1 bg-[#09090B] overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
          {/* Canvas Wrapper sizing based on chosen viewport */}
          <div
            className={`transition-all duration-300 ease-out bg-white text-[#111111] overflow-hidden shadow-2xl relative ${
              viewport === 'desktop'
                ? 'w-full rounded-2xl border border-gray-200'
                : viewport === 'tablet'
                ? 'w-[768px] max-w-full rounded-3xl border-8 border-[#27272A] shadow-[0_25px_60px_rgba(0,0,0,0.5)] my-4'
                : 'w-[390px] max-w-full rounded-[44px] border-[10px] border-[#27272A] shadow-[0_25px_60px_rgba(0,0,0,0.6)] my-4'
            }`}
          >
            {/* Tablet / Mobile Speaker & Camera Notch Bar */}
            {viewport !== 'desktop' && (
              <div className="w-full bg-[#27272A] py-1 flex items-center justify-center">
                <div className="w-20 h-3 bg-black rounded-full flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]" />
                </div>
              </div>
            )}

            {/* LIVE PORTFOLIO INSTANCE WITH BUILDER OVERRIDES */}
            <Portfolio
              overrideSections={sections}
              isBuilderMode={true}
              activeSectionId={activeSectionId}
              onSelectSection={(id) => {
                setActiveSectionId(id);
                if (!sidebarOpen) setSidebarOpen(true);
              }}
            />
          </div>
        </main>
      </div>

      {/* 3. FLOATING STATUS TOAST */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold tracking-wide border transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-700/80'
              : toastMessage.type === 'error'
              ? 'bg-red-950 text-red-200 border-red-700/80'
              : 'bg-blue-950 text-blue-200 border-blue-700/80'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="text-red-400" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
