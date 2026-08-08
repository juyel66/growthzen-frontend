export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
];

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/svg',
];

export const ACCEPT_IMAGE_STRING =
  'image/jpeg,image/jpg,image/pjpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,image/svg,.jpg,.jpeg,.png,.webp,.avif,.gif,.svg';

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];

export const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
];


export const ACCEPT_VIDEO_STRING =
  'video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm';

export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const rawMime = file.type ? file.type.split(';')[0]?.trim().toLowerCase() : '';
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  const isValidMime = rawMime ? ALLOWED_IMAGE_MIME_TYPES.includes(rawMime) : false;
  const isValidExt = ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  const isValidType = isValidMime || isValidExt;

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported image format "${extension || file.type}". Allowed formats: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum allowed size of 10 MB (${formatFileSize(file.size)})`,
    };
  }

  return { valid: true };
}


export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const rawMime = file.type ? file.type.split(';')[0]?.trim().toLowerCase() : '';
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  const isValidMime = rawMime ? ALLOWED_VIDEO_MIME_TYPES.includes(rawMime) : false;
  const isValidExt = ALLOWED_VIDEO_EXTENSIONS.includes(extension);

  const isValidType = isValidMime || isValidExt;

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported video format "${extension || file.type}". Allowed formats: ${ALLOWED_VIDEO_EXTENSIONS.join(', ')}`,
    };
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum allowed size of 100 MB (${formatFileSize(file.size)})`,
    };
  }




  return { valid: true };
}

