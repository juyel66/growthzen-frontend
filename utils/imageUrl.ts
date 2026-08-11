/**
 * Formats image URLs by ensuring relative upload paths prepend the backend API origin.
 */
export const formatImageUrl = (url: string | null | undefined, fallbackSrc: string = '/placeholder-product.png'): string => {
  if (!url || typeof url !== 'string') return fallbackSrc;

  const trimmed = url.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return fallbackSrc;

  // Return absolute or data URLs as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Extract base origin from NEXT_PUBLIC_API_URL or default to localhost:5000
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  const baseOrigin = apiUrl.replace(/\/api\/v1\/?$/, '');

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${baseOrigin}${cleanPath}`;
};

export default formatImageUrl;
