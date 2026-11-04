/**
 * Utility functions for data formatting and score normalization
 */

/**
 * Normalizes scores that might be strings, numbers, or null/undefined
 * into a safe number clamped between 0 and 100.
 */
export function normalizeScore(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Determines score rating category and corresponding color classes
 */
export function getScoreRating(score) {
  const normalized = normalizeScore(score);
  if (normalized >= 80) {
    return {
      label: 'Good',
      color: 'emerald',
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30',
      fillClass: 'bg-emerald-500',
    };
  }
  if (normalized >= 50) {
    return {
      label: 'Needs Work',
      color: 'amber',
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-500/10',
      borderClass: 'border-amber-500/30',
      fillClass: 'bg-amber-500',
    };
  }
  return {
    label: 'Critical',
    color: 'rose',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/30',
    fillClass: 'bg-rose-500',
  };
}

/**
 * Format date string into human-readable representation
 */
export function formatDate(dateString) {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Capitalize string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
