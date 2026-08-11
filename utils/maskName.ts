/**
 * Reusable helper function to mask customer reviewer names for public privacy,
 * following ecommerce marketplace standards.
 * 
 * Examples:
 * - "Md Juyel Rana" -> "J**** R"
 * - "Rahim Uddin" -> "R**** U"
 * - "Jannatul Ferdous" -> "J**** F"
 * - "Karim" -> "K****"
 */
export function maskReviewerName(name?: string | null): string {
  if (!name || !name.trim()) {
    return "C****";
  }

  const rawWords = name.trim().split(/\s+/);

  // Filter out common honorifics if there are 3+ words (e.g. "Md", "Dr", "Mr", "Mrs")
  let words = rawWords;
  if (words.length > 2) {
    const firstLower = words[0].toLowerCase().replace(/[^a-z]/g, "");
    if (["md", "mohammad", "dr", "mr", "mrs", "ms"].includes(firstLower)) {
      words = words.slice(1);
    }
  }

  if (words.length === 1) {
    const w = words[0];
    const firstChar = w.charAt(0).toUpperCase();
    return `${firstChar}****`;
  }

  // Multi-word name: First word masked (F****) + Last word initial (L)
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  const firstMasked = `${firstWord.charAt(0).toUpperCase()}****`;
  const lastInitial = lastWord.charAt(0).toUpperCase();

  return `${firstMasked} ${lastInitial}`;
}
