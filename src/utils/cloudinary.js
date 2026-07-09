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
