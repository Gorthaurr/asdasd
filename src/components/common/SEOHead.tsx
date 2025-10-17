import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'TechnoFame - Премиальная бытовая техника',
  description = 'Премиальная бытовая техника от ведущих мировых производителей. Широкий ассортимент, гарантия качества, быстрая доставка.',
  keywords = 'бытовая техника, холодильники, стиральные машины, телевизоры, ноутбуки, смартфоны',
  ogTitle,
  ogDescription,
  ogImage = 'https://technofame.store/icons/og-image.png',
  ogUrl,
  canonical
}) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalOgUrl = ogUrl || window.location.href;
  const finalCanonical = canonical || window.location.href;

  React.useEffect(() => {
    // Обновляем title
    document.title = title;
    
    // Обновляем мета-теги
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', finalOgTitle, 'property');
    updateMetaTag('og:description', finalOgDescription, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:url', finalOgUrl, 'property');
    updateMetaTag('twitter:title', finalOgTitle, 'name');
    updateMetaTag('twitter:description', finalOgDescription, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');
    
    // Обновляем canonical
    updateCanonical(finalCanonical);
  }, [title, description, keywords, finalOgTitle, finalOgDescription, ogImage, finalOgUrl, finalCanonical]);

  return null;
};

const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateCanonical = (href: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', href);
};

export default SEOHead;


















