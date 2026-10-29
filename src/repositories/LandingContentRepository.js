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
      email_value: 'hello@ghiffa.dev',
      email_url: 'mailto:hello@ghiffa.dev',
      linkedin_label: 'Connect on LinkedIn',
      linkedin_value: 'Haikal Jibran',
      linkedin_url: 'https://www.linkedin.com/in/haikal-jibran-al-ghiffarry?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      instagram_label: 'Connect on Instagram',
      instagram_value: '@haikaljibraan',
      instagram_url: 'https://instagram.com/haikaljibraan',
      skillstreak_label: 'Gamified platform',
      skillstreak_value: 'skillstreak.id',
      skillstreak_url: 'https://skillstreak.id',
      github_label: 'Repositories at',
      github_value: 'ghiffa08',
      github_url: 'https://github.com/ghiffa08',
      github_contributions: '4,622+'
    }
  },
  sticky_text: {
    id: 'sticky_text',
    title: 'Building the bridge between bits and atoms for companies, governments, and organizations.',
    subtitle: 'Following our goal of making the internet a better place.',
    is_active: true,
    content: {
      headline: 'Building the bridge between bits and atoms for companies, governments, and organizations.',
      subtitle: 'Following our goal of making the internet a better place.',
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
      card1_footer: 'From mobile UI design to scalable cross-platform application deployment.',
      card2_title: 'Web development services',
      card2_desc: 'Specializing in modern, fully self-manageable websites and web applications built on cutting-edge stacks for top performance, speed, and security.',
      card2_footer: 'Fullstack web architecture tailored to each client following international standards.',
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
      heading: 'The fastest path from zero to deployable engineer, built like a game and engineered for the real world.',
      desc: 'Most developers quit because learning feels like a grind with no visible progress. skillstreak.id changes the feedback loop with XP rewards, daily streak accountability, and real-time code evaluations.',
      cta_text: 'Get Early Access',
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
    title: 'instagram posts',
    subtitle: 'Social Feed',
    is_active: true,
    content: {
      handle: '@haikaljibraan',
      cta_text: 'Follow on Instagram'
    }
  },
  cta: {
    id: 'cta',
    title: 'communication matters',
    subtitle: 'Contact Inquiry',
    is_active: true,
    content: {
      highlight_text: 'to start good things/',
      subtitle: "I'm currently available for freelance worldwide and full-time engineering roles. Feel free to contact me if you want to collaborate on future projects or have a chat.",
      button_text: "Let's Connect With Me",
      button_url: 'mailto:hello@ghiffa.dev'
    }
  },
  footer: {
    id: 'footer',
    title: 'ghiffa.dev',
    subtitle: 'Footer',
    is_active: true,
    content: {
      desc: 'Crafting robust web applications, responsive digital products, and connected IoT systems from Kuningan, West Java.',
      copyright: 'Haikal Jibran Al-Ghiffarry',
      location: 'Kuningan, West Java, ID',
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

    // Merge into dictionary: DEFAULT -> LOCAL -> REMOTE (Supabase is authoritative!)
    const result = JSON.parse(JSON.stringify(DEFAULT_LANDING_SECTIONS));

    // Apply local storage if any, EXCEPT if it contains deprecated slang/placeholder strings
    const DEPRECATED_STRINGS = [
      'got a cool idea?',
      'make it happen/',
      'Hit Me Up',
      'Punya ide project seru',
      'Bikin aplikasi mobile yang sat-set',
      'Mobile App Development',
      'Fullstack Web Systems',
      'IoT & Hardware Systems',
      'Master coding with real-time feedback',
      'Launch Skillstreak',
      'Open for Tech Collabs',
      'instagram journal',
      'Kuningan, Jawa Barat, Indonesia',
      'Precision Web Architecture'
    ];
    const hasDeprecatedString = (obj) => {
      const raw = JSON.stringify(obj || '');
      return DEPRECATED_STRINGS.some((s) => raw.includes(s));
    };

    Object.keys(localCache).forEach((key) => {
      if (result[key] && !hasDeprecatedString(localCache[key])) {
        result[key] = {
          ...result[key],
          ...localCache[key],
          content: { ...result[key].content, ...(localCache[key]?.content || {}) }
        };
      }
    });

    // Apply remote Supabase data if available (authoritative source of truth)
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

      // Sync clean merged state back to localStorage so stale caches are purged
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
        } catch {
          // ignore
        }
      }
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
