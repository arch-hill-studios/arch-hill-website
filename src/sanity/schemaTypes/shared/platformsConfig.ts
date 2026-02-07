// AI Helper: This is a shared configuration file for social platforms. It provides the single source of truth
// for all social platform definitions used across Sanity schemas and frontend components.
// When adding new platforms, only modify this file to maintain consistency.

export interface PlatformConfig {
  key: string;
  label: string;
  icon: string;
  placeholder: string;
  urlValidation?: (value: string) => boolean | string;
  allowMultiple?: boolean;
}

export const SOCIAL_PLATFORMS: PlatformConfig[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'facebook',
    placeholder: 'https://facebook.com/yourpage',
    urlValidation: (value: string) =>
      value.includes('facebook.com') || 'Please enter a valid Facebook URL',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'instagram',
    placeholder: 'https://instagram.com/yourusername',
    urlValidation: (value: string) =>
      value.includes('instagram.com') || 'Please enter a valid Instagram URL',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: 'youtube',
    placeholder: 'https://youtube.com/c/yourchannel',
    urlValidation: (value: string) =>
      value.includes('youtube.com') ||
      value.includes('youtu.be') ||
      'Please enter a valid YouTube URL',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: 'users',
    placeholder: 'https://linkedin.com/in/yourprofile or https://linkedin.com/company/yourcompany',
    urlValidation: (value: string) =>
      value.includes('linkedin.com') || 'Please enter a valid LinkedIn URL',
  },
  {
    key: 'twitter',
    label: 'X',
    icon: 'x',
    placeholder: 'https://x.com/yourusername or https://twitter.com/yourusername',
    urlValidation: (value: string) =>
      value.includes('twitter.com') ||
      value.includes('x.com') ||
      'Please enter a valid X URL',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    icon: 'tiktok',
    placeholder: 'https://tiktok.com/@yourusername',
    urlValidation: (value: string) =>
      value.includes('tiktok.com') || 'Please enter a valid TikTok URL',
  },
  {
    key: 'soundcloud',
    label: 'SoundCloud',
    icon: 'soundcloud',
    placeholder: 'https://soundcloud.com/yourusername',
    urlValidation: (value: string) =>
      value.includes('soundcloud.com') || 'Please enter a valid SoundCloud URL',
  },
  {
    key: 'bandcamp',
    label: 'Bandcamp',
    icon: 'bandcamp',
    placeholder: 'https://yourbandname.bandcamp.com',
    urlValidation: (value: string) =>
      value.includes('bandcamp.com') || 'Please enter a valid Bandcamp URL',
  },
  {
    key: 'spotify',
    label: 'Spotify',
    icon: 'spotify',
    placeholder: 'https://open.spotify.com/artist/...',
    urlValidation: (value: string) =>
      value.includes('spotify.com') || 'Please enter a valid Spotify URL',
  },
  {
    key: 'itunes',
    label: 'Apple Music',
    icon: 'itunes',
    placeholder: 'https://music.apple.com/artist/...',
    urlValidation: (value: string) =>
      value.includes('apple.com') ||
      value.includes('itunes.apple.com') ||
      value.includes('music.apple.com') ||
      'Please enter a valid iTunes/Apple Music URL',
  },
  {
    key: 'officialWebsite',
    label: 'Official Website',
    icon: 'officialWebsite',
    placeholder: 'https://yourwebsite.com',
    allowMultiple: false,
  },
  {
    key: 'genericLink',
    label: 'Generic Link',
    icon: 'genericLink',
    placeholder: 'https://example.com',
    allowMultiple: true,
  },
];

// Helper functions for easy access
export const getPlatformByKey = (key: string): PlatformConfig | undefined => {
  return SOCIAL_PLATFORMS.find((platform) => platform.key === key);
};

export const getPlatformOptions = () => {
  return SOCIAL_PLATFORMS.map((platform) => ({
    title: platform.label,
    value: platform.key,
  }));
};

export const validatePlatformUrl = (platform: string, url: string): true | string => {
  const config = getPlatformByKey(platform);
  if (!config?.urlValidation) return true;
  const result = config.urlValidation(url);
  return result === true ? true : typeof result === 'string' ? result : 'Invalid URL';
};

// Auto-detect platform from URL
export const detectPlatformFromUrl = (url: string): PlatformConfig | null => {
  if (!url) return null;
  
  // Check each platform's validation pattern to find a match
  for (const platform of SOCIAL_PLATFORMS) {
    // Skip generic platforms that don't have specific URL patterns
    if (platform.key === 'genericLink' || platform.key === 'officialWebsite') {
      continue;
    }
    
    // Use the platform's validation function to check if URL matches
    if (platform.urlValidation) {
      const result = platform.urlValidation(url);
      if (result === true) {
        return platform;
      }
    }
  }
  
  return null;
};
