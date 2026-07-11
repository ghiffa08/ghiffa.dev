import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEO({
  title,
  description,
  name = 'Ghiffa.dev',
  type = 'website',
  url = 'https://ghiffa.dev',
  image = 'https://ghiffa.dev/og-image.jpg',
  author = 'Haikal Jibran Al Ghiffarry',
  publishedDate,
  jsonLd,
}) {
  const isArticle = type === 'article';
  const siteTitle = title ? `${title} | ${name}` : name;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@ghiffa_dev" />

      {/* Conditional metadata for articles */}
      {isArticle && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}

      {/* JSON-LD Structured Data Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://ghiffa.dev/#website",
              "url": "https://ghiffa.dev",
              "name": "ghiffa.dev | Haikal Jibran Al-Ghiffarry",
              "description": "Personal website and portfolio of Haikal Jibran Al-Ghiffarry."
            },
            {
              "@type": "Person",
              "@id": "https://ghiffa.dev/#person",
              "name": "Haikal Jibran Al-Ghiffarry",
              "url": "https://ghiffa.dev",
              "jobTitle": ["IoT Engineer", "Fullstack Web Developer"],
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Universitas Kuningan"
              },
              "sameAs": [
                "https://github.com/ghiffa",
                "https://linkedin.com/in/haikaljibran"
              ]
            }
          ]
        })}
      </script>
    </Helmet>
  );
}
