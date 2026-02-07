import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaSoundcloud,
  FaBandcamp,
  FaSpotify,
  FaApple,
  FaGlobe,
  FaLink,
  FaLinkedin
} from 'react-icons/fa';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { SOCIAL_PLATFORMS, getPlatformByKey } from '@/sanity/schemaTypes/shared/platformsConfig';

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'soundcloud'
  | 'bandcamp'
  | 'spotify'
  | 'itunes'
  | 'officialWebsite'
  | 'genericLink';

interface SocialIconConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color?: string; // Optional for platform-specific colors if needed later
}

const iconComponents = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  twitter: FaXTwitter, // Updated to X icon
  x: FaXTwitter, // Alternative key for X platform
  tiktok: FaTiktok,
  soundcloud: FaSoundcloud,
  bandcamp: FaBandcamp,
  spotify: FaSpotify,
  itunes: FaApple,
  officialWebsite: FaGlobe,
  genericLink: FaLink,
};

// Generate socialIconMap from the shared configuration
export const socialIconMap: Record<SocialPlatform, SocialIconConfig> = 
  SOCIAL_PLATFORMS.reduce((acc, platform) => {
    acc[platform.key as SocialPlatform] = {
      icon: iconComponents[platform.key as keyof typeof iconComponents],
      label: platform.label,
    };
    return acc;
  }, {} as Record<SocialPlatform, SocialIconConfig>);

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = '' }) => {
  const config = socialIconMap[platform];
  // Fallback to genericLink icon if platform config doesn't exist
  const IconComponent = config?.icon || socialIconMap.genericLink.icon;
  
  return <IconComponent className={className} />;
};

// Helper function to get the platform type from a URL or field name
export const getPlatformFromField = (fieldName: string): SocialPlatform => {
  const platform = getPlatformByKey(fieldName);
  return (platform?.key as SocialPlatform) || 'genericLink';
};

// Helper function to get platform label
export const getPlatformLabel = (platform: SocialPlatform): string => {
  return socialIconMap[platform]?.label || 'Link';
};

// Helper function to get all available platforms
export const getAllPlatforms = () => SOCIAL_PLATFORMS;

// Helper function to get platform config
export const getPlatformConfig = (platform: string) => getPlatformByKey(platform);