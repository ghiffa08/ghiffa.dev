-- =========================================================================
-- LANDING PAGE SECTIONS & ELEMENTOR-STYLE CMS SCHEMA
-- Table: public.landing_sections
-- Allows all landing page copy, headlines, and section configs to be dynamically managed
-- =========================================================================

CREATE TABLE IF NOT EXISTS "public"."landing_sections" (
    "id" text PRIMARY KEY,
    "title" text NOT NULL,
    "subtitle" text,
    "content" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."landing_sections" ENABLE ROW LEVEL SECURITY;

-- Public can read all active landing sections
DROP POLICY IF EXISTS "Allow public read-only for landing_sections" ON "public"."landing_sections";
CREATE POLICY "Allow public read-only for landing_sections"
ON "public"."landing_sections" FOR SELECT
USING (true);

-- Authenticated admins can insert/update/delete landing sections
DROP POLICY IF EXISTS "Allow authenticated full access for landing_sections" ON "public"."landing_sections";
CREATE POLICY "Allow authenticated full access for landing_sections"
ON "public"."landing_sections" FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- DEFAULT SEED DATA
INSERT INTO "public"."landing_sections" ("id", "title", "subtitle", "content", "order_index", "is_active")
VALUES
(
  'hero',
  'ghiffa.dev',
  'Figma Interactive Canvas',
  '{
    "headline": "Haikal Jibran Al-Ghiffarry",
    "tagline": "Building the bridge between bits and atoms.",
    "ai_mode_label": "AI Mode",
    "email_label": "Drop a message at",
    "linkedin_label": "Connect on LinkedIn",
    "instagram_label": "Connect on Instagram",
    "skillstreak_label": "Gamified platform"
  }'::jsonb,
  1,
  true
),
(
  'sticky_text',
  'Precision and Passion',
  'Tagline',
  '{
    "text_line_1": "Building scalable web architectures",
    "text_line_2": "Designing custom IoT hardware",
    "text_line_3": "Bridging bits and atoms"
  }'::jsonb,
  2,
  true
),
(
  'services',
  'Our Capabilities',
  'Services',
  '{
    "card1_title": "Mobile app services",
    "card1_desc": "Crafting intuitive, responsive, and high-performance mobile applications across iOS & Android tailored to elevate your user experience.",
    "card1_footer": "Native & cross-platform performance engineered with precision.",
    "card2_title": "Web development services",
    "card2_desc": "Engineering modern, ultra-fast web architectures from bespoke frontends to scalable enterprise backends.",
    "card2_footer": "Architected with modern standards for exceptional speed and SEO.",
    "card3_title": "IoT & hardware services",
    "card3_desc": "We take care of all technical aspects: custom PCB schematic & layout design, embedded IoT firmware, sensor telemetry, and continuous support.",
    "card3_footer": "Bridging hardware and software from prototype to reliable physical production."
  }'::jsonb,
  3,
  true
),
(
  'about',
  'about me',
  'Selection Highlight',
  '{
    "education_title": "Education",
    "languages_title": "Languages & Specialization",
    "status_badge": "Available for Full-Time & Contracts"
  }'::jsonb,
  4,
  true
),
(
  'journey',
  'professional journey',
  'Experience',
  '{
    "badge_text": "Career Roadmap"
  }'::jsonb,
  5,
  true
),
(
  'certifications',
  'Credentials & Achievements',
  'Certifications',
  '{
    "badge_text": "Verified Credentials"
  }'::jsonb,
  6,
  true
),
(
  'works',
  'selected works',
  'Portfolio',
  '{
    "cta_text": "Explore all works →"
  }'::jsonb,
  7,
  true
),
(
  'skillstreak',
  'skillstreak.id',
  'FEATURED PLATFORM',
  '{
    "heading": "Master coding with real-time feedback and gamified progression.",
    "desc": "Level up your engineering skills through interactive bite-sized challenges, automated test suites, and developer streaks.",
    "cta_text": "Launch Skillstreak →",
    "cta_url": "https://skillstreak.id"
  }'::jsonb,
  8,
  true
),
(
  'articles',
  'selected articles',
  'Journal',
  '{
    "cta_text": "Explore all articles →"
  }'::jsonb,
  9,
  true
),
(
  'instagram',
  'instagram journal',
  'Social Feed',
  '{
    "handle": "@haikaljibraan",
    "cta_text": "Follow on Instagram"
  }'::jsonb,
  10,
  true
),
(
  'cta',
  'Communication matters to start good things/',
  'Contact Inquiry',
  '{
    "subtitle": "Let''s build a project together.",
    "button_text": "Start a conversation",
    "call_text": "Leave us a message and we''ll schedule a call."
  }'::jsonb,
  11,
  true
),
(
  'footer',
  'ghiffa.dev',
  'Footer',
  '{
    "copyright": "© Haikal Jibran Al-Ghiffarry. All rights reserved.",
    "location": "Kuningan, Jawa Barat, Indonesia",
    "email": "hello@ghiffa.dev"
  }'::jsonb,
  12,
  true
)
ON CONFLICT ("id") DO UPDATE
SET
  "title" = EXCLUDED."title",
  "subtitle" = EXCLUDED."subtitle",
  "content" = EXCLUDED."content",
  "order_index" = EXCLUDED."order_index",
  "updated_at" = timezone('utc'::text, now());
