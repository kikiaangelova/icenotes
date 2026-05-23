import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE = 'https://skategoals.com';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Per-route SEO head. Sets unique title/description/canonical/og:* and
 * optional JSON-LD. The sitewide og:image fallback in index.html is
 * kept for non-JS social crawlers — pass `image` here only when the
 * page has a more specific preview.
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  path,
  type = 'website',
  image,
  jsonLd,
}) => {
  const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE}${image}`) : `${SITE}/og-image.png`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};
