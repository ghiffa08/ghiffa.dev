/**
 * Normalizes article read time to a consistent standard format (e.g. "3 MIN READ").
 * Handles inputs like "3 min", "3 min read", "5 MIN", "4 mins", etc.
 */
export function formatReadTime(raw) {
  if (!raw) return '3 MIN READ';
  const clean = String(raw).trim();
  const digits = clean.match(/\d+/)?.[0] || '3';
  return `${digits} MIN READ`;
}

export default formatReadTime;
