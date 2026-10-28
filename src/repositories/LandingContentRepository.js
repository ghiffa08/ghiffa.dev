import { supabase } from '../lib/supabaseClient';

export const DEFAULT_LANDING_SECTIONS = {
  hero: {
    id: 'hero',
    title: 'ghiffa.dev',
    subtitle: 'Figma Interactive Canvas',
    is_active: true,
    content: {
      headline: 'Haikal Jibran Al-Ghiffarry',
      tagline: 'Building the bridge between bits and atoms.',
      ai_mode_label: 'AI Mode',
      email_label: 'Drop a message at',
      linkedin_label: 'Connect on LinkedIn',
      instagram_label: 'Connect on Instagram',
      skillstreak_label: 'Gamified platform'
    }
  },
  sticky_text: {
    id: 'sticky_text',
    title: 'Precision and Passion',
    subtitle: 'Tagline',
    is_active: true,
    content: {
      text_line_1: 'Building scalable web architectures',
      text_line_2: 'Designing custom IoT hardware',
      text_line_3: 'Bridging bits and atoms'
    }
  },
  services: {
    id: 'services',
    title: 'Our Capabilities',
    subtitle: 'Services',
    is_active: true,
    content: {
      card1_title: 'Mobile app services',
      card1_desc: 'Crafting intuitive, responsive, and high-performance mobile applications across iOS & Android tailored to elevate your user experience.',
      card1_footer: 'Native & cross-platform performance engineered with precision.',
      card2_title: 'Web development services',
      card2_desc: 'Engineering modern, ultra-fast web architectures from bespoke frontends to scalable enterprise backends.',
      card2_footer: 'Architected with modern standards for exceptional speed and SEO.',
      card3_title: 'IoT & hardware services',
      card3_desc: 'We take care of all technical aspects: custom PCB schematic & layout design, embedded IoT firmware, sensor telemetry, and continuous support.',
      card3_footer: 'Bridging hardware and software from prototype to reliable physical production.'
    }
  },
  about: {
    id: 'about',
    title: 'about me',
    subtitle: 'Selection Highlight',
    is_active: true,
    content: {
      education_title: 'Education',
      languages_title: 'Languages & Specialization',
      status_badge: 'Available for Full-Time & Contracts'
    }
  },
  journey: {
    id: 'journey',
    title: 'professional journey',
    subtitle: 'Experience',
    is_active: true,
    content: {
      badge_text: 'Career Roadmap'
    }
  },
  certifications: {
    id: 'certifications',
    title: 'Credentials & Achievements',
    subtitle: 'Certifications',
    is_active: true,
    content: {
      badge_text: 'Verified Credentials'
    }
  },
  works: {
    id: 'works',
    title: 'selected works',
    subtitle: 'Portfolio',
    is_active: true,
    content: {
      cta_text: 'Explore all works →'
    }
  },
  skillstreak: {
    id: 'skillstreak',
    title: 'skillstreak.id',
    subtitle: 'FEATURED PLATFORM',
    is_active: true,
    content: {
      heading: 'Master coding with real-time feedback and gamified progression.',
      desc: 'Level up your engineering skills through interactive bite-sized challenges, automated test suites, and developer streaks.',
      cta_text: 'Launch Skillstreak →',
      cta_url: 'https://skillstreak.id'
    }
  },
  articles: {
    id: 'articles',
    title: 'selected articles',
    subtitle: 'Journal',
    is_active: true,
    content: {
      cta_text: 'Explore all articles →'
    }
  },
  instagram: {
    id: 'instagram',
    title: 'instagram journal',
    subtitle: 'Social Feed',
    is_active: true,
    content: {
      handle: '@haikaljibraan',
      cta_text: 'Follow on Instagram'
    }
  },
  cta: {
    id: 'cta',
    title: 'Communication matters to start good things/',
    subtitle: 'Contact Inquiry',
    is_active: true,
    content: {
      subtitle: "Let's build a project together.",
      button_text: 'Start a conversation',
      call_text: "Leave us a message and we'll schedule a call."
    }
  },
  footer: {
    id: 'footer',
    title: 'ghiffa.dev',
    subtitle: 'Footer',
    is_active: true,
    content: {
      copyright: '© Haikal Jibran Al-Ghiffarry. All rights reserved.',
      location: 'Kuningan, Jawa Barat, Indonesia',
      email: 'hello@ghiffa.dev'
    }
  }
};

const LOCAL_STORAGE_KEY = 'ghiffa_elementor_landing_sections';

export const LandingContentRepository = {
  /**
   * Fetches all landing sections, merging Supabase data with fallback defaults
   */
  async getAllSections() {
    let remoteData = null;

    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        remoteData = data;
      }
    } catch {
      // Supabase table may not exist yet, fallback gracefully
    }

    // Check localStorage cache / draft
    let localCache = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) localCache = JSON.parse(cached);
      } catch {
        // ignore JSON parse error
      }
    }

    // Merge into dictionary: DEFAULT -> LOCAL -> REMOTE
    const result = { ...DEFAULT_LANDING_SECTIONS };

    // Apply local storage if any
    Object.keys(localCache).forEach((key) => {
      if (result[key]) {
        result[key] = {
          ...result[key],
          ...localCache[key],
          content: { ...result[key].content, ...(localCache[key]?.content || {}) }
        };
      }
    });

    // Apply remote data if available
    if (remoteData) {
      remoteData.forEach((item) => {
        const key = item.id;
        if (result[key]) {
          result[key] = {
            ...result[key],
            ...item,
            content: { ...result[key].content, ...(item.content || {}) }
          };
        } else {
          result[key] = item;
        }
      });
    }

    return result;
  },

  /**
   * Save a single section
   */
  async saveSection(id, payload) {
    const sectionData = {
      id,
      title: payload.title || '',
      subtitle: payload.subtitle || '',
      content: payload.content || {},
      is_active: payload.is_active !== undefined ? payload.is_active : true,
      updated_at: new Date().toISOString()
    };

    // Update localStorage immediately
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
        cached[id] = sectionData;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
      } catch {
        // non-fatal
      }
    }

    // Try saving to Supabase
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .upsert(sectionData, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('Could not persist to Supabase landing_sections:', error.message);
        return { success: true, savedLocally: true, warning: error.message };
      }
      return { success: true, data: data?.[0] };
    } catch (err) {
      console.warn('Supabase save error:', err.message);
      return { success: true, savedLocally: true, warning: err.message };
    }
  },

  /**
   * Save all sections in batch
   */
  async saveAllSections(sectionsMap) {
    const list = Object.values(sectionsMap).map((sec, idx) => ({
      id: sec.id,
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      content: sec.content || {},
      is_active: sec.is_active !== undefined ? sec.is_active : true,
      order_index: idx + 1,
      updated_at: new Date().toISOString()
    }));

    // Cache locally
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sectionsMap));
      } catch {
        // non-fatal
      }
    }

    // Persist to Supabase
    try {
      const { data, error } = await supabase
        .from('landing_sections')
        .upsert(list, { onConflict: 'id' });

      if (error) {
        return { success: true, savedLocally: true, warning: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: true, savedLocally: true, warning: err.message };
    }
  },

  /**
   * Reset a section or all sections to defaults
   */
  resetToDefaults(id = null) {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (id) {
        try {
          const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
          delete cached[id];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached));
        } catch {
          // non-fatal
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    return DEFAULT_LANDING_SECTIONS;
  }
};
