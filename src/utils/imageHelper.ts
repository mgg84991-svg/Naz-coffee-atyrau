import React from 'react';

// Guaranteed CDN fallbacks in case local image fails or is blocked
export const CDN_FALLBACKS: Record<string, string> = {
  coffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  specialty: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  bakery: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  breakfast: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
};

/**
 * Normalizes an image path so it is served cleanly both on local Vite and on Vercel production
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '/images/coffee_flat_white_cup_1790603521645.jpg';
  
  // Data URIs (uploaded base64 photos) or external HTTP URLs
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If the path was saved with /src/assets/images/, map it to /images/
  if (url.startsWith('/src/assets/images/')) {
    const filename = url.replace('/src/assets/images/', '');
    return `/images/${filename}`;
  }
  
  return url;
}

/**
 * Graceful image error handler that prevents broken image icons on Vercel or any network error
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  categoryOrFallback?: string
) {
  const img = event.currentTarget;
  if (img.dataset.fallbackTried === '2') {
    return;
  }

  if (!img.dataset.fallbackTried) {
    img.dataset.fallbackTried = '1';
    // Try the normalized local /images/ path first
    const currentSrc = img.src || '';
    if (currentSrc.includes('/src/assets/images/')) {
      const filename = currentSrc.split('/').pop() || '';
      img.src = `/images/${filename}`;
      return;
    }
  }

  // Second failure -> switch to guaranteed high-res Unsplash CDN fallback
  img.dataset.fallbackTried = '2';
  const category = categoryOrFallback && CDN_FALLBACKS[categoryOrFallback] ? categoryOrFallback : 'default';
  img.src = CDN_FALLBACKS[category] || CDN_FALLBACKS.default;
}
