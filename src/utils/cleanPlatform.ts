/**
 * Utility function to clean platform strings by removing invisible characters and normalizing format
 * This prevents issues with copy/paste or data entry that includes invisible Unicode characters
 */
export function cleanPlatform(platform?: string | null): string {
  if (!platform) return 'genericLink';
  
  return platform
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E]/g, '') // Remove zero-width characters
    .replace(/[\u202A-\u202E]/g, '') // Remove text direction marks
    .trim() || 'genericLink';
}