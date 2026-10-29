-- ============================================================
-- Table: landing_sections (PortoBuilder CMS)
-- Stores all landing page section copywriting & visibility
-- Seeded with 100% original hardcoded copywriting from f50ff68
-- ============================================================

CREATE TABLE IF NOT EXISTS public.landing_sections (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  content JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;

-- Public Read Policy (Everyone can view the landing page sections)
DROP POLICY IF EXISTS "Allow public read access on landing_sections" ON public.landing_sections;
CREATE POLICY "Allow public read access on landing_sections"
  ON public.landing_sections
  FOR SELECT
  USING (true);

-- Authenticated Write Policy (Admin can insert/update/delete)
DROP POLICY IF EXISTS "Allow authenticated write access on landing_sections" ON public.landing_sections;
CREATE POLICY "Allow authenticated write access on landing_sections"
  ON public.landing_sections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow anon upsert if needed by dev/admin dashboard when using anon key
DROP POLICY IF EXISTS "Allow anon upsert on landing_sections" ON public.landing_sections;
CREATE POLICY "Allow anon upsert on landing_sections"
  ON public.landing_sections
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Seed / Upsert 100% Original Hardcoded Copywriting (12 Sections)
-- ============================================================
INSERT INTO public.landing_sections (id, title, subtitle, is_active, order_index, content, updated_at)
VALUES
  (
    'hero',
    'ghiffa.dev',
    'Figma Interactive Canvas',
    true,
    1,
    '{
      "headline": "Haikal Jibran Al-Ghiffarry",
      "tagline": "Building the bridge between bits and atoms.",
      "ai_mode_label": "AI Mode",
      "email_label": "Drop a message at",
      "email_value": "hello@ghiffa.dev",
      "email_url": "mailto:hello@ghiffa.dev",
      "linkedin_label": "Connect on LinkedIn",
      "linkedin_value": "Haikal Jibran",
      "linkedin_url": "https://www.linkedin.com/in/haikal-jibran-al-ghiffarry?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "instagram_label": "Connect on Instagram",
      "instagram_value": "@haikaljibraan",
      "instagram_url": "https://instagram.com/haikaljibraan",
      "skillstreak_label": "Gamified platform",
      "skillstreak_value": "skillstreak.id",
      "skillstreak_url": "https://skillstreak.id",
      "github_label": "Repositories at",
      "github_value": "ghiffa08",
      "github_url": "https://github.com/ghiffa08",
      "github_contributions": "4,622+"
    }'::jsonb,
    now()
  ),
  (
    'sticky_text',
    'Building the bridge between bits and atoms for companies, governments, and organizations.',
    'Following our goal of making the internet a better place.',
    true,
    2,
    '{
      "headline": "Building the bridge between bits and atoms for companies, governments, and organizations.",
      "subtitle": "Following our goal of making the internet a better place.",
      "text_line_1": "Building scalable web architectures",
      "text_line_2": "Designing custom IoT hardware",
      "text_line_3": "Bridging bits and atoms"
    }'::jsonb,
    now()
  ),
  (
    'services',
    'Our Capabilities',
    'Services',
    true,
    3,
    '{
      "card1_title": "Mobile app services",
      "card1_desc": "Crafting intuitive, responsive, and high-performance mobile applications across iOS & Android tailored to elevate your user experience.",
      "card1_footer": "From mobile UI design to scalable cross-platform application deployment.",
      "card2_title": "Web development services",
      "card2_desc": "Specializing in modern, fully self-manageable websites and web applications built on cutting-edge stacks for top performance, speed, and security.",
      "card2_footer": "Fullstack web architecture tailored to each client following international standards.",
      "card3_title": "IoT & hardware services",
      "card3_desc": "We take care of all technical aspects: custom PCB schematic & layout design, embedded IoT firmware, sensor telemetry, and continuous support.",
      "card3_footer": "Bridging hardware and software from prototype to reliable physical production."
    }'::jsonb,
    now()
  ),
  (
    'about',
    'about me',
    'Selection Highlight',
    true,
    4,
    '{
      "education_title": "Education",
      "languages_title": "Languages & Specialization",
      "status_badge": "Available for Full-Time & Contracts"
    }'::jsonb,
    now()
  ),
  (
    'journey',
    'professional journey',
    'Experience',
    true,
    5,
    '{
      "badge_text": "Career Roadmap"
    }'::jsonb,
    now()
  ),
  (
    'certifications',
    'Credentials & Achievements',
    'Certifications',
    true,
    6,
    '{
      "badge_text": "Verified Credentials"
    }'::jsonb,
    now()
  ),
  (
    'works',
    'selected works',
    'Portfolio',
    true,
    7,
    '{
      "cta_text": "Explore all works →"
    }'::jsonb,
    now()
  ),
  (
    'skillstreak',
    'skillstreak.id',
    'FEATURED PLATFORM',
    true,
    8,
    '{
      "heading": "The fastest path from zero to deployable engineer, built like a game and engineered for the real world.",
      "desc": "Most developers quit because learning feels like a grind with no visible progress. skillstreak.id changes the feedback loop with XP rewards, daily streak accountability, and real-time code evaluations.",
      "cta_text": "Get Early Access",
      "cta_url": "https://skillstreak.id"
    }'::jsonb,
    now()
  ),
  (
    'articles',
    'selected articles',
    'Journal',
    true,
    9,
    '{
      "cta_text": "Explore all articles →"
    }'::jsonb,
    now()
  ),
  (
    'instagram',
    'instagram posts',
    'Social Feed',
    true,
    10,
    '{
      "handle": "@haikaljibraan",
      "cta_text": "Follow on Instagram"
    }'::jsonb,
    now()
  ),
  (
    'cta',
    'communication matters',
    'Contact Inquiry',
    true,
    11,
    '{
      "highlight_text": "to start good things/",
      "subtitle": "I''m currently available for freelance worldwide and full-time engineering roles. Feel free to contact me if you want to collaborate on future projects or have a chat.",
      "button_text": "Let''s Connect With Me",
      "button_url": "mailto:hello@ghiffa.dev"
    }'::jsonb,
    now()
  ),
  (
    'footer',
    'ghiffa.dev',
    'Footer',
    true,
    12,
    '{
      "desc": "Crafting robust web applications, responsive digital products, and connected IoT systems from Kuningan, West Java.",
      "copyright": "Haikal Jibran Al-Ghiffarry",
      "location": "Kuningan, West Java, ID",
      "email": "hello@ghiffa.dev"
    }'::jsonb,
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  is_active = EXCLUDED.is_active,
  order_index = EXCLUDED.order_index,
  updated_at = now();
