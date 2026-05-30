SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- DROP OLD TABLES
DROP TABLE IF EXISTS "public"."hero_section" CASCADE;
DROP TABLE IF EXISTS "public"."about_section" CASCADE;
DROP TABLE IF EXISTS "public"."contact_section" CASCADE;

-- NEW RELATIONAL TABLES
CREATE TABLE IF NOT EXISTS "public"."general_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "app_name" "text" DEFAULT 'ghiffa.dev' NOT NULL,
    "seo_title" "text" DEFAULT 'Portfolio & Resume' NOT NULL,
    "seo_description" "text" DEFAULT 'Creative Software Engineer specializing in scalable web systems, intuitive interfaces, and AI implementations. Based in Kuningan, Indonesia.',
    "maintenance_mode" boolean DEFAULT false
);

ALTER TABLE "public"."general_settings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."personal_info" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "full_name" "text" DEFAULT 'Haikal Jibran Al Ghiffarry' NOT NULL,
    "role" "text" DEFAULT 'Systems Architect & Full-stack Developer' NOT NULL,
    "headline" "text" DEFAULT 'Crafting digital experiences with precision and passion.' NOT NULL,
    "about_content" "text" DEFAULT 'I am a software engineer...' NOT NULL,
    "cv_url" "text",
    "email" "text" DEFAULT 'hello@ghiffa.dev' NOT NULL,
    "phone_number" "text",
    "availability_status" "text" DEFAULT 'Available for work' NOT NULL,
    "social_links" "jsonb" DEFAULT '{"github": "", "linkedin": "", "instagram": ""}'::"jsonb" NOT NULL,
    "skills" "jsonb" DEFAULT '["REACT", "NEXT.JS", "TAILWIND CSS", "LARAVEL", "NODE.JS", "EXPRESS", "POSTGRESQL", "MYSQL", "SUPABASE", "GSAP", "WEB DESIGN", "UI/UX", "EMBEDDED SYSTEM", "LORA CONNECTION", "IOT"]'::"jsonb" NOT NULL
);

ALTER TABLE "public"."personal_info" OWNER TO "postgres";

-- EXISTING TABLES (Kept as is, assuming clean)
CREATE TABLE IF NOT EXISTS "public"."articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "title" "text" NOT NULL,
    "slug" "text" UNIQUE NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "cover_image" "text" NOT NULL,
    "read_time" "text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);
ALTER TABLE "public"."articles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."bio_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "url" "text" NOT NULL,
    "featured" boolean DEFAULT false,
    "order_index" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);
ALTER TABLE "public"."bio_links" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."experiences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "period" "text" NOT NULL,
    "role" "text" NOT NULL,
    "company" "text" NOT NULL,
    "description" "text" NOT NULL,
    "order_index" integer DEFAULT 0
);
ALTER TABLE "public"."experiences" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "title" "text" NOT NULL,
    "slug" "text" UNIQUE NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "content" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "tech_stack" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "client" "text" NOT NULL,
    "year" "text" NOT NULL,
    "link" "text",
    "github_url" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);
ALTER TABLE "public"."projects" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."qualifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() PRIMARY KEY,
    "type" "text" NOT NULL,
    "period" "text" NOT NULL,
    "title" "text" NOT NULL,
    "institution" "text" NOT NULL,
    "description" "text",
    "order_index" integer DEFAULT 0,
    CONSTRAINT "qualifications_type_check" CHECK (("type" = ANY (ARRAY['education'::"text", 'honor'::"text", 'certification'::"text"])))
);
ALTER TABLE "public"."qualifications" OWNER TO "postgres";

-- RLS POLICIES
ALTER TABLE "public"."general_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."personal_info" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."articles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bio_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."qualifications" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access general_settings" ON "public"."general_settings" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read general_settings" ON "public"."general_settings" FOR SELECT USING (true);

CREATE POLICY "Admin full access personal_info" ON "public"."personal_info" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read personal_info" ON "public"."personal_info" FOR SELECT USING (true);

CREATE POLICY "Admin full access articles" ON "public"."articles" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read articles" ON "public"."articles" FOR SELECT USING (status = 'published');

CREATE POLICY "Admin full access bio_links" ON "public"."bio_links" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read bio_links" ON "public"."bio_links" FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access experiences" ON "public"."experiences" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read experiences" ON "public"."experiences" FOR SELECT USING (true);

CREATE POLICY "Admin full access projects" ON "public"."projects" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read projects" ON "public"."projects" FOR SELECT USING (true);

CREATE POLICY "Admin full access qualifications" ON "public"."qualifications" USING (auth.role() = 'authenticated');
CREATE POLICY "Public read qualifications" ON "public"."qualifications" FOR SELECT USING (true);

-- INITIAL SEED DATA
INSERT INTO "public"."general_settings" (id, app_name) VALUES (gen_random_uuid(), 'ghiffa.dev') ON CONFLICT DO NOTHING;
INSERT INTO "public"."personal_info" (id, full_name) VALUES (gen_random_uuid(), 'Haikal Jibran Al Ghiffarry') ON CONFLICT DO NOTHING;
