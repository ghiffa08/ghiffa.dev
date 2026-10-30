export async function uploadToCloudinary(file) {
  const cloudName = 'tabpnp3a';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET environment variable is not defined.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  const secureUrl = data.secure_url;

  // Inject automatic optimization transformations (f_auto,q_auto) right after /upload/
  return secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
}

/**
 * Optimizes Cloudinary and external image URLs to save free tier bandwidth:
 * - Injects 'f_auto,q_auto' (WebP/AVIF format + intelligent compression)
 * - Optionally injects target width (w_xxx,c_limit) so mobile/desktop users don't download multi-megabyte originals
 * - Returns original URL untouched if not from Cloudinary
 * 
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options { width: number, quality: 'auto' | number }
 * @returns {string} Highly optimized, CDN-cached image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('res.cloudinary.com')) return url;

  const { width, quality = 'auto' } = options;
  const transforms = [`f_auto`, `q_${quality}`];

  if (width && typeof width === 'number') {
    transforms.push(`w_${width}`, 'c_limit');
  }

  const transformString = transforms.join(',');

  // If already contains transformations after /upload/
  if (url.includes('/upload/f_auto,q_auto/')) {
    if (width) {
      return url.replace('/upload/f_auto,q_auto/', `/upload/${transformString}/`);
    }
    return url;
  }

  // Clean insert right after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}
