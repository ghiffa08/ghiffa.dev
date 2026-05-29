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
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
