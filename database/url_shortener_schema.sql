-- URL Shortener & QR Code Generator
-- Database Schema for ghiffa.dev

-- Table: shortened_urls
-- Stores shortened URLs with analytics tracking
CREATE TABLE IF NOT EXISTS shortened_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  qr_code_url TEXT,
  
  -- Analytics
  click_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT short_code_length CHECK (char_length(short_code) >= 4 AND char_length(short_code) <= 10)
);

-- Index for fast short_code lookup (most common query)
CREATE INDEX IF NOT EXISTS idx_shortened_urls_short_code ON shortened_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_shortened_urls_is_active ON shortened_urls(is_active);
CREATE INDEX IF NOT EXISTS idx_shortened_urls_created_at ON shortened_urls(created_at DESC);

-- Table: url_clicks
-- Detailed click tracking for analytics
CREATE TABLE IF NOT EXISTS url_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortened_url_id UUID REFERENCES shortened_urls(id) ON DELETE CASCADE,
  
  -- Analytics data
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country VARCHAR(2),
  
  -- Index for analytics queries
  CONSTRAINT fk_shortened_url FOREIGN KEY (shortened_url_id) REFERENCES shortened_urls(id)
);

CREATE INDEX IF NOT EXISTS idx_url_clicks_shortened_url_id ON url_clicks(shortened_url_id);
CREATE INDEX IF NOT EXISTS idx_url_clicks_clicked_at ON url_clicks(clicked_at DESC);

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on shortened_urls
DROP TRIGGER IF EXISTS update_shortened_urls_updated_at ON shortened_urls;
CREATE TRIGGER update_shortened_urls_updated_at
  BEFORE UPDATE ON shortened_urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE shortened_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_clicks ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active URLs for redirection
CREATE POLICY "Public can read active shortened URLs"
  ON shortened_urls FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users (admin) can manage URLs
CREATE POLICY "Authenticated users can manage shortened URLs"
  ON shortened_urls FOR ALL
  USING (auth.role() = 'authenticated');

-- Policy: Public can insert click tracking
CREATE POLICY "Public can track URL clicks"
  ON url_clicks FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can view click analytics
CREATE POLICY "Authenticated users can view click analytics"
  ON url_clicks FOR SELECT
  USING (auth.role() = 'authenticated');

-- Sample data for testing (optional)
-- INSERT INTO shortened_urls (short_code, original_url, title, description)
-- VALUES 
--   ('gh-port', 'https://github.com/ghiffa', 'GitHub Profile', 'My GitHub portfolio'),
--   ('resume', 'https://ghiffa.dev/files/resume.pdf', 'Resume Download', 'Download my latest resume');
