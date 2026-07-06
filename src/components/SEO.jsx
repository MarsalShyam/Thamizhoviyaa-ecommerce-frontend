import { useEffect } from 'react';

const SEO = ({ title, description, keywords, schema }) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = `${title} | Thamizhoviyaa Herbal Products`;
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${title} | Thamizhoviyaa Herbal Products`);
    }

    // 2. Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', description);
    }

    // 3. Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        metaKeywords.setAttribute('content', keywords);
        document.head.appendChild(metaKeywords);
      }
    }
    // 4. Structured Data (Schema.org)
    if (schema) {
      let script = document.querySelector('script[type="application/ld+json"][id="seo-schema"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'seo-schema');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else {
      // Remove if no schema is provided to prevent stale data
      const script = document.querySelector('script[type="application/ld+json"][id="seo-schema"]');
      if (script) {
        script.remove();
      }
    }
  }, [title, description, keywords, schema]);

  return null;
};

export default SEO;
