/**
 * SEO Optimization Utilities
 */

export const setSeoMeta = (title, description, keywords = '', image = '') => {
  // Set page title
  document.title = `${title} - RentEase`;

  // Update or create meta tags
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', keywords);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:image', image);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', image);
};

const updateMetaTag = (attribute, name, content) => {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export const getSeoData = (page, params = {}) => {
  const seoData = {
    home: {
      title: 'Affordable Furniture & Appliance Rentals | RentEase',
      description: 'Rent premium furniture and appliances at unbeatable prices. Save up to 70% compared to buying. Free delivery and installation included.',
      keywords: 'furniture rental, appliance rental, rent furniture online, affordable rentals',
    },
    products: {
      title: `Browse ${params.category || 'All'} Rentals | RentEase`,
      description: `Explore our wide range of ${params.category || 'premium'} furniture and appliances available for rent. Flexible terms, affordable prices.`,
      keywords: `${params.category || 'furniture'} rental, ${params.category || 'appliances'} for rent`,
    },
    productDetails: {
      title: `${params.productName} for Rent | RentEase`,
      description: `Rent ${params.productName} starting from ₹${params.price}/month. Damage protection, free delivery, and flexible rental terms included.`,
      keywords: `rent ${params.productName}, ${params.productName} rental cost`,
    },
    cart: {
      title: 'Your Rental Cart | RentEase',
      description: 'Review your rental items, apply discounts, and proceed to checkout securely.',
      keywords: 'rental cart, checkout',
    },
    checkout: {
      title: 'Secure Checkout | RentEase',
      description: 'Complete your rental order securely. We accept all major payment methods.',
      keywords: 'checkout, payment, rental booking',
    },
  };

  return seoData[page] || seoData.home;
};

export const generateSchemaMarkup = (type, data) => {
  const schemas = {
    product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating,
        reviewCount: data.reviewCount,
      },
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'RentEase',
      url: 'https://rentease.com',
      logo: 'https://rentease.com/logo.png',
      sameAs: [
        'https://facebook.com/rentease',
        'https://twitter.com/rentease',
        'https://instagram.com/rentease',
      ],
    },
  };

  return schemas[type] || {};
};

export const addStructuredData = (schema) => {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.innerHTML = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
};

export const sanitizeUrl = (url) => {
  return encodeURI(url.trim());
};

export const generateMetaRobots = (indexing = true, following = true) => {
  const content = `${indexing ? 'index' : 'noindex'}, ${following ? 'follow' : 'nofollow'}`;
  updateMetaTag('name', 'robots', content);
};
