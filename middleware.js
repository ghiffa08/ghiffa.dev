export const config = {
  matcher: '/article/:slug*',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Deteksi bot sosial media (WhatsApp, Twitter, FB, dll)
  const isBot = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot|Pinterest|Slackbot|TelegramBot|Discordbot/i.test(userAgent);

  if (isBot) {
    const parts = url.pathname.split('/article/');
    if (parts.length > 1) {
      const slug = parts[1].replace(/\/$/, '');
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/articles?slug=eq.${slug}&select=title,description,cover_image`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          
          const data = await res.json();
          if (data && data.length > 0) {
            const article = data[0];
            let imageUrl = 'https://ghiffa.dev/og-image.jpg';
            
            if (article.cover_image) {
              if (article.cover_image.startsWith('http')) {
                imageUrl = article.cover_image;
              } else {
                imageUrl = `${supabaseUrl}/storage/v1/object/public/article-covers/${article.cover_image}`;
              }
            }

            // Kembalikan HTML ringan khusus bot yang berisi meta tag OG
            return new Response(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>${article.title} | Ghiffa.dev</title>
  <meta name="description" content="${article.description}">
  <meta property="og:title" content="${article.title} | Ghiffa.dev">
  <meta property="og:description" content="${article.description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${url.href}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${article.description}">
  <meta name="twitter:image" content="${imageUrl}">
</head>
<body></body>
</html>`, {
              status: 200,
              headers: { 
                'Content-Type': 'text/html',
                'Cache-Control': 's-maxage=86400, stale-while-revalidate'
              }
            });
          }
        } catch (e) {
          console.error('Middleware Error:', e);
        }
      }
    }
  }

  // Jika pengunjung bukan bot (manusia), lanjutkan normal ke React SPA
}
