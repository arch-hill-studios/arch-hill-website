import React from 'react';
import Link from 'next/link';
import { SocialIcon, type SocialPlatform, getPlatformLabel } from '@/utils/socialIcons';

interface SocialLinkProps {
  platform: SocialPlatform;
  url: string;
  label?: string; // Optional custom label, falls back to platform default
  className?: string;
  dataAttributes?: Record<string, string>; // For Sanity visual editing
}

const SocialLink: React.FC<SocialLinkProps> = ({ 
  platform, 
  url, 
  label, 
  className = '',
  dataAttributes = {}
}) => {
  const displayLabel = label || getPlatformLabel(platform);

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-3 px-4 py-3 
        bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300
        rounded-lg transition-all duration-200 hover:shadow-sm
        text-body-base text-gray-700 hover:text-gray-900
        group w-full
        ${className}
      `.trim()}
      {...dataAttributes}
    >
      <SocialIcon 
        platform={platform} 
        className="text-brand-secondary text-body-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
      />
      <span className="truncate">{displayLabel}</span>
    </Link>
  );
};

export default SocialLink;