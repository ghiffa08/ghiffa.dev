-- =========================================================================
-- DATABASE AUDIT & FREE-TIER OPTIMIZATION SQL (ghiffa.dev)
-- Generated based on audit.md recommendations (Fase 3: Security & Database Hardening)
-- =========================================================================

-- 1. ATOMIC CLAP INCREMENT RPC (Eliminates select-before-update & race conditions)
CREATE OR REPLACE FUNCTION increment_article_claps(article_id uuid, amount int)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET claps_count = COALESCE(claps_count, 0) + amount
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. ROW LEVEL SECURITY (RLS) POLICIES FOR ALL PUBLIC TABLES

-- Enable RLS across all tables
ALTER TABLE IF EXISTS "public"."articles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."qualifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."general_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."personal_info" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."contact_messages" ENABLE ROW LEVEL SECURITY;

-- Drop existing public policies to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read-only for articles" ON "public"."articles";
DROP POLICY IF EXISTS "Allow public read-only for projects" ON "public"."projects";
DROP POLICY IF EXISTS "Allow public read-only for experiences" ON "public"."experiences";
DROP POLICY IF EXISTS "Allow public read-only for qualifications" ON "public"."qualifications";
DROP POLICY IF EXISTS "Allow public read-only for general_settings" ON "public"."general_settings";
DROP POLICY IF EXISTS "Allow public read-only for personal_info" ON "public"."personal_info";
DROP POLICY IF EXISTS "Allow public insert messages with valid content" ON "public"."contact_messages";

-- Public read policies
CREATE POLICY "Allow public read-only for articles"
ON "public"."articles" FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only for projects"
ON "public"."projects" FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only for experiences"
ON "public"."experiences" FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only for qualifications"
ON "public"."qualifications" FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only for general_settings"
ON "public"."general_settings" FOR SELECT
USING (true);

CREATE POLICY "Allow public read-only for personal_info"
ON "public"."personal_info" FOR SELECT
USING (true);

-- Contact messages insert policy: validates minimum content lengths to block empty spam
CREATE POLICY "Allow public insert messages with valid content"
ON "public"."contact_messages" FOR INSERT
WITH CHECK (
  length(trim(name)) >= 2 AND
  length(trim(email)) >= 5 AND
  length(trim(message)) >= 10
);
