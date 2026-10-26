-- Article Medium Features Schema
ALTER TABLE articles ADD COLUMN IF NOT EXISTS claps_count integer DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags text[] DEFAULT ARRAY[]::text[];

CREATE TABLE IF NOT EXISTS article_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE article_responses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'article_responses' AND policyname = 'Public can view article responses'
  ) THEN
    CREATE POLICY "Public can view article responses" ON article_responses FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'article_responses' AND policyname = 'Public can insert article responses'
  ) THEN
    CREATE POLICY "Public can insert article responses" ON article_responses FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'article_responses' AND policyname = 'Admin manage article responses'
  ) THEN
    CREATE POLICY "Admin manage article responses" ON article_responses FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END
$$;
