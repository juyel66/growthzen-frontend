/**
 * Phone Number Validation & Normalization Utility for Bangladesh Mobile Numbers
 */

export const normalizeBDMobileNumber = (phone: string): string => {
  if (!phone) return '';
  const trimmed = phone.trim();
  // Remove non-digit characters
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length === 13 && digitsOnly.startsWith('8801')) {
    return digitsOnly.substring(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('01')) {
    return digitsOnly;
  }
  return digitsOnly;
};

export const isValidBDMobileNumber = (phone: string): boolean => {
  if (!phone) return false;
  const normalized = normalizeBDMobileNumber(phone);
  return /^01[3-9]\d{8}$/.test(normalized);
};
