import React, { useState, useEffect } from 'react';
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
  Layers,
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
  PanelBottom,
  PanelTop,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Edit3,
  Palette,
  SlidersHorizontal,
  Link2,
  Unlink,
  MousePointerClick,
  X,
  Type
} from 'lucide-react';

const FIGMA_COLOR_SWATCHES = [
  '#111111',
  '#52525B',
  '#FFFFFF',
  '#0D99FF',
  '#10B981',
  '#9747FF',
  '#F97316',
  '#F59E0B',
  '#FF5500',
  '#EC4899'
];

const BG_COLOR_SWATCHES = [
  '#FFFFFF',
  '#FAFAFA',
  '#F4F4F5',
  '#FFF7ED',
  '#F0F9FF',
  '#F5F3FF',
  '#ECFDF5',
  '#18181B',
  '#111113'
];

const SECTION_CONFIGS = [
  {
    id: 'hero',
    name: 'Hero Canvas',
    icon: Layout,
    color: '#0D99FF', // Figma Selection Blue
    description: 'Interactive Figma canvas, main display title, and floating social & tech bubbles',
    fields: [
      // Group 1: Main Identity
      { key: 'title', label: 'Main Display Title', type: 'text', group: 'Canvas & Identity', placeholder: 'ghiffa.dev' },
      { key: 'headline', label: 'Author Full Name', type: 'text', parent: 'content', group: 'Canvas & Identity', placeholder: 'Haikal Jibran Al-Ghiffarry' },
      { key: 'ai_mode_label', label: 'AI Mode Toggle Label', type: 'text', parent: 'content', group: 'Canvas & Identity', placeholder: 'AI Mode' },

      // Group 2: Email Bubble
      { key: 'email_label', label: 'Email Bubble Prefix', type: 'text', parent: 'content', group: 'Email Bubble', placeholder: 'Drop a message at' },
      { key: 'email_value', label: 'Email Display Address', type: 'text', parent: 'content', group: 'Email Bubble', placeholder: 'hello@ghiffa.dev' },
      { key: 'email_url', label: 'Email Bubble Link (URL)', type: 'link', parent: 'content', group: 'Email Bubble', placeholder: 'mailto:hello@ghiffa.dev' },

      // Group 3: LinkedIn Bubble
      { key: 'linkedin_label', label: 'LinkedIn Bubble Prefix', type: 'text', parent: 'content', group: 'LinkedIn Bubble', placeholder: 'Connect on LinkedIn' },
      { key: 'linkedin_value', label: 'LinkedIn Display Name', type: 'text', parent: 'content', group: 'LinkedIn Bubble', placeholder: 'Haikal Jibran' },
      { key: 'linkedin_url', label: 'LinkedIn Bubble Link (URL)', type: 'link', parent: 'content', group: 'LinkedIn Bubble', placeholder: 'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry/' },

      // Group 4: Instagram Bubble
      { key: 'instagram_label', label: 'Instagram Bubble Prefix', type: 'text', parent: 'content', group: 'Instagram Bubble', placeholder: 'Connect on Instagram' },
      { key: 'instagram_value', label: 'Instagram Handle', type: 'text', parent: 'content', group: 'Instagram Bubble', placeholder: '@haikaljibraan' },
      { key: 'instagram_url', label: 'Instagram Bubble Link (URL)', type: 'link', parent: 'content', group: 'Instagram Bubble', placeholder: 'https://instagram.com/haikaljibraan' },

      // Group 5: Skillstreak Bubble
      { key: 'skillstreak_label', label: 'Skillstreak Bubble Prefix', type: 'text', parent: 'content', group: 'Skillstreak Bubble', placeholder: 'Gamified platform' },
      { key: 'skillstreak_value', label: 'Skillstreak Display Domain', type: 'text', parent: 'content', group: 'Skillstreak Bubble', placeholder: 'skillstreak.id' },
      { key: 'skillstreak_url', label: 'Skillstreak Bubble Link (URL)', type: 'link', parent: 'content', group: 'Skillstreak Bubble', placeholder: 'https://skillstreak.id' },

      // Group 6: GitHub Card & Bubble
      { key: 'github_label', label: 'GitHub Bubble Prefix', type: 'text', parent: 'content', group: 'GitHub Card & Bubble', placeholder: 'Repositories at' },
      { key: 'github_value', label: 'GitHub Username', type: 'text', parent: 'content', group: 'GitHub Card & Bubble', placeholder: 'ghiffa08' },
      { key: 'github_url', label: 'GitHub Profile Link (URL)', type: 'link', parent: 'content', group: 'GitHub Card & Bubble', placeholder: 'https://github.com/ghiffa08' },
      { key: 'github_contributions', label: 'Contributions Counter', type: 'text', parent: 'content', group: 'GitHub Card & Bubble', placeholder: '4,622+' }
    ]
  },
  {
    id: 'sticky_text',
    name: 'Sticky Scroll Headline',
    icon: ScrollText,
    color: '#9747FF', // Figma Component Purple
    description: 'Word-by-word reveal text triggered on scroll',
    fields: [
      { key: 'title', label: 'Main Headline Sentence', type: 'textarea', group: 'Scroll Reveal Copy', placeholder: 'Building the bridge between bits and atoms for companies, governments, and organizations.' },
      { key: 'subtitle', label: 'Subtext Sentence', type: 'textarea', group: 'Scroll Reveal Copy', placeholder: 'Following our goal of making the internet a better place.' }
    ]
  },
  {
    id: 'services',
    name: 'Capabilities & Services',
    icon: Cpu,
    color: '#10B981', // Figma Emerald Green (Ghiffa Tech Lead)
    description: '3 Service cards: Mobile Apps, Web Development, and IoT Hardware',
    fields: [
      { key: 'card1_title', label: 'Card 1 (Mobile) Title', type: 'text', parent: 'content', group: 'Card 1: Mobile App', placeholder: 'Mobile app services' },
      { key: 'card1_desc', label: 'Card 1 Description', type: 'textarea', parent: 'content', group: 'Card 1: Mobile App' },
      { key: 'card1_footer', label: 'Card 1 Footer Text', type: 'text', parent: 'content', group: 'Card 1: Mobile App' },
      { key: 'card2_title', label: 'Card 2 (Web) Title', type: 'text', parent: 'content', group: 'Card 2: Fullstack Web', placeholder: 'Web development services' },
      { key: 'card2_desc', label: 'Card 2 Description', type: 'textarea', parent: 'content', group: 'Card 2: Fullstack Web' },
      { key: 'card2_footer', label: 'Card 2 Footer Text', type: 'text', parent: 'content', group: 'Card 2: Fullstack Web' },
      { key: 'card3_title', label: 'Card 3 (IoT) Title', type: 'text', parent: 'content', group: 'Card 3: IoT & Hardware', placeholder: 'IoT & hardware services' },
      { key: 'card3_desc', label: 'Card 3 Description', type: 'textarea', parent: 'content', group: 'Card 3: IoT & Hardware' },
      { key: 'card3_footer', label: 'Card 3 Footer Text', type: 'text', parent: 'content', group: 'Card 3: IoT & Hardware' }
    ]
  },
  {
    id: 'about',
    name: 'About Me',
    icon: User,
    color: '#F97316', // Figma Client Orange
    description: 'Cutout showcase, bio narrative, education titles, and availability status badge',
    fields: [
      { key: 'title', label: 'Section Header Title', type: 'text', group: 'About Content', placeholder: 'about me' },
      { key: 'bio', label: 'Bio Narrative Paragraph', type: 'textarea', parent: 'content', group: 'About Content', placeholder: 'As a Fullstack Web Developer and IoT Engineer, I design end-to-end technological solutions from the ground up...' },
      { key: 'education_title', label: 'Education Heading', type: 'text', parent: 'content', group: 'About Content', placeholder: 'Education' },
      { key: 'languages_title', label: 'Languages Heading', type: 'text', parent: 'content', group: 'About Content', placeholder: 'Languages & Specialization' },
      { key: 'status_badge', label: 'Availability Badge Text', type: 'text', parent: 'content', group: 'About Content', placeholder: 'Available for Full-Time & Contracts' }
    ]
  },
  {
    id: 'journey',
    name: 'Professional Journey',
    icon: Milestone,
    color: '#06B6D4', // Figma Cyan
    description: 'Career roadmap and professional experience timeline',
    fields: [
      { key: 'title', label: 'Display Title', type: 'text', group: 'Journey Header', placeholder: 'professional journey' }
    ]
  },
  {
    id: 'certifications',
    name: 'Certifications & HAKI',
    icon: Award,
    color: '#F59E0B', // Figma Reviewer Amber
    description: 'Bento grid showing verified credentials and copyrights',
    fields: [
      { key: 'title', label: 'Section Heading', type: 'text', group: 'Certifications Header', placeholder: 'Credentials & Achievements' }
    ]
  },
  {
    id: 'works',
    name: 'Selected Works',
    icon: Briefcase,
    color: '#8B5CF6', // Figma Violet
    description: 'Draggable project showcase carousel',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', group: 'Works Showcase', placeholder: 'selected works' },
      { key: 'cta_text', label: 'Explore Button Text', type: 'text', parent: 'content', group: 'Works Showcase', placeholder: 'Explore all works →' }
    ]
  },
  {
    id: 'skillstreak',
    name: 'Skillstreak Platform Banner',
    icon: Zap,
    color: '#FF5500', // Skillstreak Flame Orange
    description: 'Interactive MacBook frame showcasing skillstreak.id',
    fields: [
      { key: 'title', label: 'Banner Brand Title', type: 'text', group: 'Skillstreak Content', placeholder: 'skillstreak.id' },
      { key: 'heading', label: 'Main Value Proposition', type: 'textarea', parent: 'content', group: 'Skillstreak Content' },
      { key: 'desc', label: 'Secondary Description', type: 'textarea', parent: 'content', group: 'Skillstreak Content' },
      { key: 'cta_text', label: 'CTA Button Text', type: 'text', parent: 'content', group: 'Skillstreak CTA', placeholder: 'Get Early Access' },
      { key: 'cta_url', label: 'CTA Target URL', type: 'link', parent: 'content', group: 'Skillstreak CTA', placeholder: 'https://skillstreak.id' }
    ]
  },
  {
    id: 'articles',
    name: 'Selected Articles',
    icon: BookOpen,
    color: '#0284C7', // Figma Sky Blue
    description: 'Featured technical insights and publication carousel',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', group: 'Articles Header', placeholder: 'selected articles' },
      { key: 'cta_text', label: 'Explore Button Text', type: 'text', parent: 'content', group: 'Articles Header', placeholder: 'Explore all articles →' }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram Posts',
    icon: Camera,
    color: '#EC4899', // Figma QA Pink
    description: 'Social photo feed grid & account link',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', group: 'Instagram Feed', placeholder: 'instagram posts' },
      { key: 'handle', label: 'Instagram Handle', type: 'text', parent: 'content', group: 'Instagram Feed', placeholder: '@haikaljibraan' }
    ]
  },
  {
    id: 'cta',
    name: 'Communication Matters CTA',
    icon: MessageSquare,
    color: '#F43F5E', // Figma Rose / Coral
    description: 'End-of-page contact & collaboration trigger',
    fields: [
      { key: 'title', label: 'Main Headline', type: 'text', group: 'CTA Headline & Copy', placeholder: 'communication matters' },
      { key: 'highlight_text', label: 'Highlighted Badge Text', type: 'text', parent: 'content', group: 'CTA Headline & Copy', placeholder: 'to start good things/' },
      { key: 'subtitle', label: 'Paragraph Narrative', type: 'textarea', parent: 'content', group: 'CTA Headline & Copy', placeholder: "I'm currently available for freelance worldwide and full-time engineering roles. Feel free to contact me if you want to collaborate on future projects or have a chat." },
      { key: 'button_text', label: 'Contact Button Text', type: 'text', parent: 'content', group: 'CTA Action Button', placeholder: "Let's Connect With Me" },
      { key: 'button_url', label: 'Contact Button Link (URL)', type: 'link', parent: 'content', group: 'CTA Action Button', placeholder: 'mailto:hello@ghiffa.dev' }
    ]
  },
  {
    id: 'footer',
    name: 'Portfolio Footer',
    icon: PanelBottom,
    color: '#14AE5C', // Figma Mint
    description: 'Copyright, location, and bottom navigation credits',
    fields: [
      { key: 'title', label: 'Footer Brand Title', type: 'text', group: 'Footer Info', placeholder: 'ghiffa.dev' },
      { key: 'desc', label: 'Brand Description', type: 'textarea', parent: 'content', group: 'Footer Info' },
      { key: 'email', label: 'Footer Contact Email', type: 'text', parent: 'content', group: 'Footer Info', placeholder: 'hello@ghiffa.dev' },
      { key: 'location', label: 'Location String', type: 'text', parent: 'content', group: 'Footer Info', placeholder: 'Kuningan, West Java, ID' },
      { key: 'copyright', label: 'Copyright Owner', type: 'text', parent: 'content', group: 'Footer Info', placeholder: 'Haikal Jibran Al-Ghiffarry' }
    ]
  }
];

export default function VisualBuilder() {
  const [sections, setSections] = useState(DEFAULT_LANDING_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [activeFieldKey, setActiveFieldKey] = useState(null);
  const [activeFieldLabel, setActiveFieldLabel] = useState(null);
  const [inspectorTab, setInspectorTab] = useState('content'); // 'content' | 'style' | 'advanced'
  const [styleScope, setStyleScope] = useState('section'); // 'section' | 'element'
  const [paddingLinked, setPaddingLinked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
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
        const extraContent = {};
        if (sectionId === 'sticky_text') {
          if (fieldKey === 'title') extraContent.headline = value;
          if (fieldKey === 'subtitle') extraContent.subtitle = value;
        }
        updated = {
          ...section,
          [fieldKey]: value,
          content: {
            ...(section.content || {}),
            ...extraContent
          }
        };
      }
      return {
        ...prev,
        [sectionId]: updated
      };
    });
    setHasUnsavedChanges(true);
  };

  // Update Section-level _style OR Element-level _elementStyles[activeFieldKey]
  const handleStyleChange = (sectionId, styleProp, value, targetElementKey = null) => {
    setSections((prev) => {
      const section = prev[sectionId] || { id: sectionId, title: '', subtitle: '', content: {}, is_active: true };
      const currentContent = section.content || {};

      if (targetElementKey) {
        const currentElStyles = currentContent._elementStyles || {};
        const targetStyles = currentElStyles[targetElementKey] || {};
        return {
          ...prev,
          [sectionId]: {
            ...section,
            content: {
              ...currentContent,
              _elementStyles: {
                ...currentElStyles,
                [targetElementKey]: {
                  ...targetStyles,
                  [styleProp]: value
                }
              }
            }
          }
        };
      }

      const currentStyle = currentContent._style || {};
      return {
        ...prev,
        [sectionId]: {
          ...section,
          content: {
            ...currentContent,
            _style: {
              ...currentStyle,
              [styleProp]: value
            }
          }
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleResetSectionStyles = (sectionId) => {
    setSections((prev) => {
      const section = prev[sectionId];
      if (!section) return prev;
      const nextContent = { ...(section.content || {}) };
      delete nextContent._style;
      delete nextContent._elementStyles;
      return {
        ...prev,
        [sectionId]: {
          ...section,
          content: nextContent
        }
      };
    });
    setHasUnsavedChanges(true);
    showToast('Section & widget styles reset to default.', 'info');
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
    setActiveFieldKey(null);
    setActiveFieldLabel(null);
    const el = document.getElementById(`builder-section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Called when user clicks any component or section directly on the Canvas
  const handleCanvasSelect = (sectionId, fieldKey = null, fieldLabel = null) => {
    setActiveSectionId(sectionId);
    setActiveFieldKey(fieldKey);
    setActiveFieldLabel(fieldLabel);
    if (!sidebarOpen) setSidebarOpen(true);

    setTimeout(() => {
      if (fieldKey) {
        const inputWrapper = document.getElementById(`builder-field-${sectionId}-${fieldKey}`);
        if (inputWrapper) {
          inputWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const inputEl = inputWrapper.querySelector('input, textarea');
          if (inputEl && inspectorTab === 'content') {
            inputEl.focus({ preventScroll: true });
          }
          return;
        }
      }
      const sectionAccordion = document.getElementById(`sidebar-section-${sectionId}`);
      if (sectionAccordion) {
        sectionAccordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 80);
  };

  const filteredConfigs = SECTION_CONFIGS.filter((cfg) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cfg.name.toLowerCase().includes(q) ||
      cfg.description.toLowerCase().includes(q) ||
      cfg.id.toLowerCase().includes(q) ||
      cfg.fields.some((f) => f.label.toLowerCase().includes(q) || (f.group && f.group.toLowerCase().includes(q)))
    );
  });

  // Helper to check if a field belongs to the same group as activeFieldKey
  const isFieldHighlighted = (cfg, field) => {
    if (!activeFieldKey) return false;
    if (field.key === activeFieldKey) return true;
    const activeFieldObj = cfg.fields.find((f) => f.key === activeFieldKey);
    if (activeFieldObj?.group && field.group && activeFieldObj.group === field.group) {
      return true;
    }
    return false;
  };

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

          <div className="flex items-center gap-2.5">
            <div className="flex items-center -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D99FF] ring-2 ring-[#18181B]" title="Figma Blue" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#18181B]" title="Figma Green" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-[#18181B]" title="Figma Amber" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#9747FF] ring-2 ring-[#18181B]" title="Figma Purple" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 font-mono">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">PORTOBUILDER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#0D99FF] font-semibold border border-[#0D99FF]/30">v2.0</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#27272A] text-xs text-gray-400">
            <MousePointerClick size={13} className="text-[#9747FF]" />
            <span>Click any element on canvas to inspect &amp; style</span>
          </div>
        </div>

        {/* Center: Viewport & Canvas Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#27272A]/70 p-1 rounded-xl border border-[#3F3F46]/50">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-[#0D99FF] text-white shadow-sm shadow-[#0D99FF]/20 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title="Desktop Fullscreen (100%)"
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-[#0D99FF] text-white shadow-sm shadow-[#0D99FF]/20 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet size={14} />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-[#0D99FF] text-white shadow-sm shadow-[#0D99FF]/20 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Toggle Site Navbar inside Canvas */}
          <button
            type="button"
            onClick={() => setShowNavbar(!showNavbar)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
              showNavbar
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#27272A]/70 text-gray-400 hover:text-white border-[#3F3F46]/50'
            }`}
            title="Show or hide the portfolio navbar inside the preview canvas"
          >
            <PanelTop size={13} />
            <span>{showNavbar ? 'Navbar: On' : 'Navbar: Off'}</span>
          </button>

          {/* Toggle Full Canvas Mode */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
              !sidebarOpen
                ? 'bg-[#9747FF]/20 text-[#C084FC] border-[#9747FF]/40'
                : 'bg-[#27272A]/70 text-gray-400 hover:text-white border-[#3F3F46]/50'
            }`}
            title={sidebarOpen ? 'Expand canvas to 100% full width' : 'Show Elementor Inspector'}
          >
            {sidebarOpen ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            <span>{sidebarOpen ? 'Full Canvas' : 'Split View'}</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#27272A] transition-colors cursor-pointer"
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
            <span className="hidden md:inline">Live Site</span>
          </a>

          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0D99FF] via-[#7B61FF] to-[#9747FF] hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-[#0D99FF]/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* 2. BODY SPLIT: SIDEBAR (360px) + CANVAS PREVIEW */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT DOCK (ELEMENTOR INSPECTOR) */}
        <aside
          className={`h-full bg-[#18181B] border-r border-[#27272A] transition-all duration-300 flex flex-col z-30 shrink-0 ${
            sidebarOpen ? 'w-[360px]' : 'w-0'
          }`}
        >
          {sidebarOpen && (
            <>
              {/* Dock Header */}
              <div className="p-3.5 border-b border-[#27272A] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Layers size={14} className="text-[#0D99FF]" />
                    Elementor Inspector ({SECTION_CONFIGS.length})
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Canvas Sync
                  </span>
                </div>

                {/* Filter / Search input */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sections, bubbles, links..."
                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0D99FF] focus:ring-1 focus:ring-[#0D99FF]/30"
                  />
                </div>
              </div>

              {/* Sections Accordion List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#27272A]/80 builder-scrollbar pb-28">
                {filteredConfigs.map((cfg) => {
                  const Icon = cfg.icon;
                  const sectionData = sections[cfg.id] || DEFAULT_LANDING_SECTIONS[cfg.id] || {};
                  const isExpanded = activeSectionId === cfg.id;
                  const isActive = sectionData.is_active !== false;
                  const figmaColor = cfg.color || '#0D99FF';

                  // Group fields by `field.group` for clean Elementor-like subsections
                  const groupedFields = cfg.fields.reduce((acc, field) => {
                    const g = field.group || 'General Content';
                    if (!acc[g]) acc[g] = [];
                    acc[g].push(field);
                    return acc;
                  }, {});

                  // Current style values (either widget-scoped or section-scoped)
                  const isElementStyleMode = styleScope === 'element' && activeFieldKey;
                  const currentStyleObj = isElementStyleMode
                    ? sectionData.content?._elementStyles?.[activeFieldKey] || {}
                    : sectionData.content?._style || {};
                  const sectionLevelStyle = sectionData.content?._style || {};

                  return (
                    <div
                      key={cfg.id}
                      id={`sidebar-section-${cfg.id}`}
                      className={`transition-colors relative ${
                        isExpanded ? 'bg-[#202024]' : 'hover:bg-[#1E1E22]'
                      }`}
                      style={{
                        borderLeft: isExpanded ? `3px solid ${figmaColor}` : '3px solid transparent'
                      }}
                    >
                      {/* Section Accordion Title Bar */}
                      <div
                        onClick={() => scrollToSectionInCanvas(cfg.id)}
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer group ${
                          isExpanded ? 'sticky top-0 z-20 bg-[#202024] border-b border-[#27272A]/80 shadow-md' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200"
                            style={{
                              backgroundColor: isExpanded ? `${figmaColor}25` : '#27272A',
                              borderColor: isExpanded ? `${figmaColor}80` : '#3F3F4680',
                              color: figmaColor
                            }}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <div
                              className="text-xs font-bold transition-colors truncate"
                              style={{
                                color: isExpanded ? figmaColor : '#FFFFFF'
                              }}
                            >
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
                              if (isExpanded) {
                                setActiveSectionId(null);
                              } else {
                                scrollToSectionInCanvas(cfg.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 group-hover:text-white"
                          >
                            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED ELEMENTOR 3-TAB INSPECTOR (Content | Style | Advanced) */}
                      {isExpanded && (
                        <div className="bg-[#161619] border-t border-[#27272A]/60 flex flex-col">
                          {/* Active Selected Widget Banner (when clicked on canvas) */}
                          {activeFieldKey && (
                            <div className="mx-3 mt-2.5 px-3 py-2 rounded-lg bg-[#9747FF]/15 border border-[#9747FF]/40 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2 h-2 rounded-full bg-[#9747FF] animate-ping shrink-0" />
                                <div className="truncate">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C084FC] block leading-none">
                                    Selected on Canvas
                                  </span>
                                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                                    {activeFieldLabel || activeFieldKey}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveFieldKey(null);
                                  setActiveFieldLabel(null);
                                  setStyleScope('section');
                                }}
                                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white shrink-0"
                                title="Clear widget selection"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          )}

                          {/* WORDPRESS ELEMENTOR 3-TAB SWITCHER */}
                          <div className="grid grid-cols-3 border-b border-[#27272A] bg-[#18181B] mt-2">
                            <button
                              type="button"
                              onClick={() => setInspectorTab('content')}
                              className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-mono font-semibold border-b-2 transition-all cursor-pointer ${
                                inspectorTab === 'content'
                                  ? 'border-[#0D99FF] text-[#0D99FF] bg-[#202024]'
                                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }`}
                            >
                              <Edit3 size={13} />
                              <span>Content</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspectorTab('style')}
                              className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-mono font-semibold border-b-2 transition-all cursor-pointer ${
                                inspectorTab === 'style'
                                  ? 'border-[#9747FF] text-[#C084FC] bg-[#202024]'
                                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }`}
                            >
                              <Palette size={13} />
                              <span>Style</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setInspectorTab('advanced')}
                              className={`flex flex-col items-center justify-center py-2.5 gap-1 text-[11px] font-mono font-semibold border-b-2 transition-all cursor-pointer ${
                                inspectorTab === 'advanced'
                                  ? 'border-[#10B981] text-[#10B981] bg-[#202024]'
                                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }`}
                            >
                              <SlidersHorizontal size={13} />
                              <span>Advanced</span>
                            </button>
                          </div>

                          {/* SCROLLABLE TAB BODY */}
                          <div className="px-4 pb-5 pt-3 space-y-4 max-h-[56vh] overflow-y-auto builder-scrollbar overscroll-contain pr-2.5">
                            {/* ================= TAB 1: CONTENT ================= */}
                            {inspectorTab === 'content' && (
                              <>
                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                  {cfg.description}
                                </p>

                                {Object.entries(groupedFields).map(([groupName, groupFields]) => (
                                  <div
                                    key={groupName}
                                    className="space-y-2.5 pt-2 first:pt-0 border-t border-[#27272A]/60 first:border-t-0"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D99FF]">
                                        {groupName}
                                      </span>
                                    </div>

                                    {groupFields.map((field) => {
                                      const isContentField = field.parent === 'content';
                                      const currentValue = isContentField
                                        ? sectionData.content?.[field.key] ?? ''
                                        : sectionData[field.key] ?? '';
                                      const highlighted = isFieldHighlighted(cfg, field);

                                      return (
                                        <div
                                          key={field.key}
                                          id={`builder-field-${cfg.id}-${field.key}`}
                                          className={`space-y-1 p-2 rounded-lg transition-all ${
                                            highlighted
                                              ? 'bg-[#9747FF]/12 ring-1 ring-[#9747FF]/50'
                                              : 'hover:bg-white/[0.02]'
                                          }`}
                                        >
                                          <label className="flex items-center justify-between text-[11px] font-mono font-semibold text-gray-300">
                                            <span>{field.label}</span>
                                            {field.type === 'link' && (
                                              <span className="text-[9px] text-[#0D99FF] uppercase">URL / Link</span>
                                            )}
                                          </label>

                                          {field.type === 'textarea' ? (
                                            <textarea
                                              rows={3}
                                              value={currentValue}
                                              onChange={(e) =>
                                                handleFieldChange(cfg.id, field.key, e.target.value, isContentField)
                                              }
                                              placeholder={field.placeholder || ''}
                                              className="w-full bg-[#111113] border border-[#27272A] rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#0D99FF] focus:ring-1 focus:ring-[#0D99FF]/30 font-sans resize-y"
                                            />
                                          ) : field.type === 'link' ? (
                                            <div className="flex items-center gap-1.5">
                                              <div className="relative flex-1">
                                                <Link2
                                                  size={13}
                                                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0D99FF]"
                                                />
                                                <input
                                                  type="text"
                                                  value={currentValue}
                                                  onChange={(e) =>
                                                    handleFieldChange(cfg.id, field.key, e.target.value, isContentField)
                                                  }
                                                  placeholder={field.placeholder || 'https://...'}
                                                  className="w-full bg-[#111113] border border-[#27272A] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#38BDF8] font-mono placeholder-gray-600 focus:outline-none focus:border-[#0D99FF] focus:ring-1 focus:ring-[#0D99FF]/30"
                                                />
                                              </div>
                                              {currentValue && (
                                                <a
                                                  href={currentValue}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="p-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-gray-300 hover:text-white transition-colors shrink-0"
                                                  title="Test link in new tab"
                                                >
                                                  <ExternalLink size={13} />
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <input
                                              type="text"
                                              value={currentValue}
                                              onChange={(e) =>
                                                handleFieldChange(cfg.id, field.key, e.target.value, isContentField)
                                              }
                                              placeholder={field.placeholder || ''}
                                              className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#0D99FF] focus:ring-1 focus:ring-[#0D99FF]/30 font-sans"
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </>
                            )}

                            {/* ================= TAB 2: STYLE (ELEMENTOR TYPOGRAPHY, ALIGNMENT, COLORS) ================= */}
                            {inspectorTab === 'style' && (
                              <div className="space-y-4">
                                {/* Scope Toggle if a widget is selected */}
                                {activeFieldKey && (
                                  <div className="p-2 bg-[#111113] rounded-lg border border-[#27272A] space-y-1.5">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">
                                      Apply Style To:
                                    </span>
                                    <div className="grid grid-cols-2 gap-1">
                                      <button
                                        type="button"
                                        onClick={() => setStyleScope('section')}
                                        className={`px-2 py-1.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                                          styleScope === 'section'
                                            ? 'bg-[#0D99FF] text-white'
                                            : 'text-gray-400 hover:text-white bg-[#18181B]'
                                        }`}
                                      >
                                        Entire Section
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setStyleScope('element')}
                                        className={`px-2 py-1.5 rounded text-[11px] font-mono font-semibold truncate transition-all cursor-pointer ${
                                          styleScope === 'element'
                                            ? 'bg-[#9747FF] text-white'
                                            : 'text-gray-400 hover:text-white bg-[#18181B]'
                                        }`}
                                        title={activeFieldLabel || activeFieldKey}
                                      >
                                        Widget: {activeFieldLabel || activeFieldKey}
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* 1. TEXT ALIGNMENT (Elementor 4-Icon Button Group) */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-mono font-semibold text-gray-300 flex items-center gap-1.5">
                                      <AlignLeft size={12} className="text-[#9747FF]" />
                                      Text Alignment (Perataan Teks)
                                    </label>
                                    {currentStyleObj.textAlign && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStyleChange(
                                            cfg.id,
                                            'textAlign',
                                            '',
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="text-[10px] text-gray-500 hover:text-white font-mono"
                                      >
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-4 gap-1.5 bg-[#111113] p-1 rounded-lg border border-[#27272A]">
                                    {[
                                      { value: 'left', icon: AlignLeft, label: 'Left' },
                                      { value: 'center', icon: AlignCenter, label: 'Center' },
                                      { value: 'right', icon: AlignRight, label: 'Right' },
                                      { value: 'justify', icon: AlignJustify, label: 'Justify' }
                                    ].map((alignOpt) => {
                                      const AlignIcon = alignOpt.icon;
                                      const active = currentStyleObj.textAlign === alignOpt.value;
                                      return (
                                        <button
                                          key={alignOpt.value}
                                          type="button"
                                          onClick={() =>
                                            handleStyleChange(
                                              cfg.id,
                                              'textAlign',
                                              active ? '' : alignOpt.value,
                                              isElementStyleMode ? activeFieldKey : null
                                            )
                                          }
                                          className={`flex items-center justify-center py-1.5 rounded-md transition-all cursor-pointer ${
                                            active
                                              ? 'bg-[#9747FF] text-white shadow-sm'
                                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                                          }`}
                                          title={`Align ${alignOpt.label}`}
                                        >
                                          <AlignIcon size={14} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* 2. TYPOGRAPHY SIZING & WEIGHT */}
                                <div className="space-y-3 pt-3 border-t border-[#27272A]/70">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#9747FF]">
                                    <Type size={12} />
                                    <span>Typography</span>
                                  </div>

                                  {/* Primary / Heading Font Size */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-mono">
                                      <span className="text-gray-300">
                                        {isElementStyleMode ? 'Widget Font Size' : 'Heading Font Size'}
                                      </span>
                                      <span className="text-[#C084FC]">
                                        {(isElementStyleMode ? currentStyleObj.fontSize : currentStyleObj.titleFontSize)
                                          ? `${isElementStyleMode ? currentStyleObj.fontSize : currentStyleObj.titleFontSize}px`
                                          : 'Default'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="range"
                                        min="12"
                                        max="150"
                                        value={
                                          (isElementStyleMode
                                            ? currentStyleObj.fontSize
                                            : currentStyleObj.titleFontSize) || 48
                                        }
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            isElementStyleMode ? 'fontSize' : 'titleFontSize',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="flex-1 accent-[#9747FF] cursor-pointer"
                                      />
                                      <input
                                        type="number"
                                        min="10"
                                        max="220"
                                        placeholder="Auto"
                                        value={
                                          (isElementStyleMode
                                            ? currentStyleObj.fontSize
                                            : currentStyleObj.titleFontSize) || ''
                                        }
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            isElementStyleMode ? 'fontSize' : 'titleFontSize',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-16 bg-[#111113] border border-[#27272A] rounded px-2 py-1 text-xs text-white font-mono text-center"
                                      />
                                    </div>
                                  </div>

                                  {/* Subtitle / Body Font Size (Section Mode) */}
                                  {!isElementStyleMode && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[11px] font-mono">
                                        <span className="text-gray-300">Body / Subtitle Size</span>
                                        <span className="text-[#C084FC]">
                                          {currentStyleObj.subtitleFontSize
                                            ? `${currentStyleObj.subtitleFontSize}px`
                                            : 'Default'}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="range"
                                          min="11"
                                          max="54"
                                          value={currentStyleObj.subtitleFontSize || 18}
                                          onChange={(e) =>
                                            handleStyleChange(cfg.id, 'subtitleFontSize', e.target.value)
                                          }
                                          className="flex-1 accent-[#9747FF] cursor-pointer"
                                        />
                                        <input
                                          type="number"
                                          min="10"
                                          max="80"
                                          placeholder="Auto"
                                          value={currentStyleObj.subtitleFontSize || ''}
                                          onChange={(e) =>
                                            handleStyleChange(cfg.id, 'subtitleFontSize', e.target.value)
                                          }
                                          className="w-16 bg-[#111113] border border-[#27272A] rounded px-2 py-1 text-xs text-white font-mono text-center"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Font Weight & Text Transform */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono text-gray-400">
                                        Font Weight
                                      </label>
                                      <select
                                        value={currentStyleObj.fontWeight || ''}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'fontWeight',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#9747FF]"
                                      >
                                        <option value="">Default</option>
                                        <option value="300">300 Light</option>
                                        <option value="400">400 Normal</option>
                                        <option value="500">500 Medium</option>
                                        <option value="600">600 SemiBold</option>
                                        <option value="700">700 Bold</option>
                                        <option value="800">800 ExtraBold</option>
                                        <option value="900">900 Black</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-mono text-gray-400">
                                        Transform
                                      </label>
                                      <select
                                        value={currentStyleObj.textTransform || ''}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'textTransform',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#9747FF]"
                                      >
                                        <option value="">Default</option>
                                        <option value="none">None</option>
                                        <option value="uppercase">UPPERCASE</option>
                                        <option value="lowercase">lowercase</option>
                                        <option value="capitalize">Capitalize</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Line Height & Letter Spacing */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                                        <span>Line Height</span>
                                        <span className="text-[#C084FC]">{currentStyleObj.lineHeight || 'Auto'}</span>
                                      </div>
                                      <input
                                        type="range"
                                        min="0.8"
                                        max="2.2"
                                        step="0.05"
                                        value={currentStyleObj.lineHeight || 1.15}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'lineHeight',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-full accent-[#9747FF] cursor-pointer"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                                        <span>Letter Space</span>
                                        <span className="text-[#C084FC]">
                                          {currentStyleObj.letterSpacing !== undefined && currentStyleObj.letterSpacing !== ''
                                            ? `${currentStyleObj.letterSpacing}px`
                                            : 'Auto'}
                                        </span>
                                      </div>
                                      <input
                                        type="range"
                                        min="-5"
                                        max="10"
                                        step="0.5"
                                        value={currentStyleObj.letterSpacing || 0}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'letterSpacing',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-full accent-[#9747FF] cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* 3. COLORS & SWATCHES */}
                                <div className="space-y-3 pt-3 border-t border-[#27272A]/70">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#9747FF]">
                                    <Palette size={12} />
                                    <span>Colors &amp; Theme Swatches</span>
                                  </div>

                                  {/* Primary / Heading Text Color */}
                                  <div className="space-y-1.5">
                                    <label className="block text-[11px] font-mono text-gray-300">
                                      {isElementStyleMode ? 'Widget Text Color' : 'Heading / Primary Color'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={
                                          (isElementStyleMode ? currentStyleObj.color : currentStyleObj.titleColor) ||
                                          '#141414'
                                        }
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            isElementStyleMode ? 'color' : 'titleColor',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#3F3F46]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Default (#141414)"
                                        value={
                                          (isElementStyleMode ? currentStyleObj.color : currentStyleObj.titleColor) || ''
                                        }
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            isElementStyleMode ? 'color' : 'titleColor',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="flex-1 bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {FIGMA_COLOR_SWATCHES.map((swatch) => (
                                        <button
                                          key={swatch}
                                          type="button"
                                          onClick={() =>
                                            handleStyleChange(
                                              cfg.id,
                                              isElementStyleMode ? 'color' : 'titleColor',
                                              swatch,
                                              isElementStyleMode ? activeFieldKey : null
                                            )
                                          }
                                          className="w-5 h-5 rounded-md border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                                          style={{ backgroundColor: swatch }}
                                          title={swatch}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Subtitle / Body Text Color (Section Mode) */}
                                  {!isElementStyleMode && (
                                    <div className="space-y-1.5 pt-2">
                                      <label className="block text-[11px] font-mono text-gray-300">
                                        Subtitle / Paragraph Color
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="color"
                                          value={currentStyleObj.textColor || '#52525B'}
                                          onChange={(e) =>
                                            handleStyleChange(cfg.id, 'textColor', e.target.value)
                                          }
                                          className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#3F3F46]"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Default (#52525B)"
                                          value={currentStyleObj.textColor || ''}
                                          onChange={(e) =>
                                            handleStyleChange(cfg.id, 'textColor', e.target.value)
                                          }
                                          className="flex-1 bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* Section / Widget Background Color */}
                                  <div className="space-y-1.5 pt-2">
                                    <label className="block text-[11px] font-mono text-gray-300">
                                      {isElementStyleMode ? 'Widget Background Color' : 'Section Background Color'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={currentStyleObj.backgroundColor || '#FFFFFF'}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'backgroundColor',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="w-8 h-8 rounded cursor-pointer bg-transparent border border-[#3F3F46]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Default (#FFFFFF)"
                                        value={currentStyleObj.backgroundColor || ''}
                                        onChange={(e) =>
                                          handleStyleChange(
                                            cfg.id,
                                            'backgroundColor',
                                            e.target.value,
                                            isElementStyleMode ? activeFieldKey : null
                                          )
                                        }
                                        className="flex-1 bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                      {BG_COLOR_SWATCHES.map((swatch) => (
                                        <button
                                          key={swatch}
                                          type="button"
                                          onClick={() =>
                                            handleStyleChange(
                                              cfg.id,
                                              'backgroundColor',
                                              swatch,
                                              isElementStyleMode ? activeFieldKey : null
                                            )
                                          }
                                          className="w-5 h-5 rounded-md border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                                          style={{ backgroundColor: swatch }}
                                          title={swatch}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ================= TAB 3: ADVANCED (PADDING, MARGIN, VISIBILITY, RESET) ================= */}
                            {inspectorTab === 'advanced' && (
                              <div className="space-y-4">
                                {/* 1. PADDING (Elementor 4-Way Linked Dimensions) */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-mono font-semibold text-gray-300">
                                      Section Padding (px)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setPaddingLinked(!paddingLinked)}
                                      className={`p-1 rounded flex items-center gap-1 text-[10px] font-mono cursor-pointer ${
                                        paddingLinked
                                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                                          : 'bg-[#27272A] text-gray-400'
                                      }`}
                                      title="Link padding values together"
                                    >
                                      {paddingLinked ? <Link2 size={11} /> : <Unlink size={11} />}
                                      <span>{paddingLinked ? 'Linked' : 'Unlinked'}</span>
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1.5">
                                    {[
                                      { key: 'paddingTop', label: 'TOP' },
                                      { key: 'paddingRight', label: 'RIGHT' },
                                      { key: 'paddingBottom', label: 'BOTTOM' },
                                      { key: 'paddingLeft', label: 'LEFT' }
                                    ].map((dim) => (
                                      <div key={dim.key} className="text-center">
                                        <input
                                          type="number"
                                          placeholder="-"
                                          value={sectionLevelStyle[dim.key] ?? ''}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            if (paddingLinked) {
                                              handleStyleChange(cfg.id, 'paddingTop', val);
                                              handleStyleChange(cfg.id, 'paddingRight', val);
                                              handleStyleChange(cfg.id, 'paddingBottom', val);
                                              handleStyleChange(cfg.id, 'paddingLeft', val);
                                            } else {
                                              handleStyleChange(cfg.id, dim.key, val);
                                            }
                                          }}
                                          className="w-full bg-[#111113] border border-[#27272A] rounded-lg py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:border-[#10B981]"
                                        />
                                        <span className="text-[9px] font-mono text-gray-500 mt-0.5 block">
                                          {dim.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* 2. MARGIN TOP & BOTTOM */}
                                <div className="space-y-2 pt-2 border-t border-[#27272A]/70">
                                  <span className="text-[11px] font-mono font-semibold text-gray-300 block">
                                    Section Margin (px)
                                  </span>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <input
                                        type="number"
                                        placeholder="Top (0)"
                                        value={sectionLevelStyle.marginTop ?? ''}
                                        onChange={(e) => handleStyleChange(cfg.id, 'marginTop', e.target.value)}
                                        className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                                      />
                                      <span className="text-[9px] font-mono text-gray-500 mt-0.5 block">MARGIN TOP</span>
                                    </div>
                                    <div>
                                      <input
                                        type="number"
                                        placeholder="Bottom (0)"
                                        value={sectionLevelStyle.marginBottom ?? ''}
                                        onChange={(e) => handleStyleChange(cfg.id, 'marginBottom', e.target.value)}
                                        className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                                      />
                                      <span className="text-[9px] font-mono text-gray-500 mt-0.5 block">MARGIN BOTTOM</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. OPACITY */}
                                <div className="space-y-1 pt-2 border-t border-[#27272A]/70">
                                  <div className="flex justify-between text-[11px] font-mono">
                                    <span className="text-gray-300">Section Opacity</span>
                                    <span className="text-[#10B981]">{sectionLevelStyle.opacity ?? 100}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={sectionLevelStyle.opacity ?? 100}
                                    onChange={(e) => handleStyleChange(cfg.id, 'opacity', e.target.value)}
                                    className="w-full accent-[#10B981] cursor-pointer"
                                  />
                                </div>

                                {/* 4. RESPONSIVE VISIBILITY */}
                                <div className="space-y-2 pt-2 border-t border-[#27272A]/70">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] block">
                                    Responsive Visibility
                                  </span>
                                  {[
                                    { key: 'hideDesktop', label: 'Hide on Desktop' },
                                    { key: 'hideTablet', label: 'Hide on Tablet' },
                                    { key: 'hideMobile', label: 'Hide on Mobile' }
                                  ].map((vis) => (
                                    <label
                                      key={vis.key}
                                      className="flex items-center justify-between py-1 text-xs text-gray-300 cursor-pointer"
                                    >
                                      <span>{vis.label}</span>
                                      <input
                                        type="checkbox"
                                        checked={Boolean(sectionLevelStyle[vis.key])}
                                        onChange={(e) => handleStyleChange(cfg.id, vis.key, e.target.checked)}
                                        className="accent-[#10B981] w-4 h-4 rounded cursor-pointer"
                                      />
                                    </label>
                                  ))}
                                </div>

                                {/* 5. CUSTOM CSS ID & CLASS */}
                                <div className="space-y-2 pt-2 border-t border-[#27272A]/70">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] block">
                                    Attributes
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="Custom CSS ID"
                                    value={sectionLevelStyle.customId || ''}
                                    onChange={(e) => handleStyleChange(cfg.id, 'customId', e.target.value)}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Custom CSS Classes"
                                    value={sectionLevelStyle.customClass || ''}
                                    onChange={(e) => handleStyleChange(cfg.id, 'customClass', e.target.value)}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                                  />
                                </div>

                                {/* 6. RESET SECTION STYLE */}
                                <div className="pt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleResetSectionStyles(cfg.id)}
                                    className="w-full py-2 rounded-lg bg-[#27272A] hover:bg-red-950/60 hover:text-red-300 border border-[#3F3F46] text-xs font-mono font-semibold text-gray-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <RotateCcw size={12} />
                                    <span>Reset Section &amp; Widget Styles</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
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
          className="absolute top-3 z-40 bg-[#18181B] border border-l-0 border-[#27272A] text-gray-300 hover:text-white p-1.5 rounded-r-lg shadow-md transition-all cursor-pointer"
          style={{ left: sidebarOpen ? '360px' : '0' }}
          title={sidebarOpen ? 'Collapse Left Dock' : 'Expand Left Dock'}
        >
          {sidebarOpen ? <ChevronRight size={14} className="rotate-180" /> : <ChevronRight size={14} />}
        </button>

        {/* RIGHT PREVIEW CANVAS CONTAINER */}
        <main
          id="builder-canvas-scroll"
          className={`flex-1 bg-[#09090B] overflow-y-auto overflow-x-hidden flex flex-col items-center relative ${
            viewport === 'desktop' ? 'p-0' : 'p-4 sm:p-6'
          }`}
        >
          {/* Canvas Wrapper sizing based on chosen viewport */}
          <div
            className={`transition-all duration-300 ease-out bg-white text-[#111111] overflow-x-clip relative builder-preview-${viewport} ${
              viewport === 'desktop'
                ? 'w-full min-h-full'
                : viewport === 'tablet'
                ? 'w-[768px] max-w-full rounded-3xl border-8 border-[#27272A] shadow-[0_25px_60px_rgba(0,0,0,0.5)] my-4 overflow-hidden'
                : 'w-[390px] max-w-full rounded-[44px] border-[10px] border-[#27272A] shadow-[0_25px_60px_rgba(0,0,0,0.6)] my-4 overflow-hidden'
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

            {/* LIVE PORTFOLIO INSTANCE WITH BUILDER OVERRIDES & DIRECT WIDGET CLICK-TO-SELECT */}
            <Portfolio
              overrideSections={sections}
              isBuilderMode={true}
              showBuilderNavbar={showNavbar}
              activeSectionId={activeSectionId}
              activeFieldKey={activeFieldKey}
              onSelectSection={handleCanvasSelect}
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
            <AlertCircle size={16} className="text-amber-400" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
