import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const DOMAIN = 'https://ghiffa.dev';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

async function generateSEO() {
  console.log("Fetching dynamic data for sitemap...");
  
  // Fetch Projects
  const { data: projects } = await supabase
    .from('projects')
    .select('title, updated_at');
    
  // Fetch Articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  if (projects) {
    projects.forEach((project) => {
      sitemap += `  <url>
    <loc>${DOMAIN}/project/${slugify(project.title)}</loc>
    <lastmod>${(project.updated_at || today).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });
  }

  if (articles) {
    articles.forEach((article) => {
      sitemap += `  <url>
    <loc>${DOMAIN}/article/${article.slug}</loc>
    <lastmod>${(article.updated_at || today).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });
  }

  sitemap += `</urlset>`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log("✅ sitemap.xml generated successfully!");

  const robotsTxt = `User-agent: *
Allow: /

# Explicitly allow AI crawlers
User-agent: Googlebot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: CCBot
Allow: /

# Disallow Admin dashboard
User-agent: *
Disallow: /admin

Sitemap: ${DOMAIN}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log("✅ robots.txt generated successfully!");
}

generateSEO().catch(console.error);
