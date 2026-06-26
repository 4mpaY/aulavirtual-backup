import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/aX1AXnUxb9VrNj7wDDrh48g57kI2/uploads/1768259579772-sout-logo.jpeg",
  url,
  type = 'website',
  structuredData
}: SEOProps) => {
  const siteTitle = "SOUT Training Center";
  const fullTitle = `${title} | ${siteTitle}`;
  const baseUrl = "https://soutrainingcenter.com";
  const canonicalUrl = url ? `${baseUrl}${url}` : baseUrl;

  // Ensure image is absolute URL
  const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="es_PE" />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
