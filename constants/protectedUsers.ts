export const PROTECTED_SUPER_ADMIN_EMAILS = [
  "mdjuyelrana.com.bd1@gmail.com",
  "mohammadjuyelranabd@gmail.com",
  "mdjuyelrana99730@gmail.com",
  "mdjuyelrana294922@gmail.com",
].map((e) => e.toLowerCase());

export const isProtectedSuperAdmin = (
  email?: string | null,
  role?: string | null
): boolean => {
  const normalizedRole = (role || "").toUpperCase();
  if (normalizedRole === "SUPER_ADMIN") return true;
  if (!email) return false;
  return PROTECTED_SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
};
