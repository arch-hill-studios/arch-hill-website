// AI Helper: This is a Sanity CMS schema definition for orderable social links arrays.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import {
  SOCIAL_PLATFORMS,
  validatePlatformUrl,
  detectPlatformFromUrl,
  getPlatformByKey,
} from './platformsConfig';
import React from 'react';
import { useFormValue } from 'sanity';

// Platform emoji mapping for Sanity previews
const getPlatformEmoji = (platformKey: string): string => {
  const emojiMap: Record<string, string> = {
    facebook: '📘', // Blue Facebook-like icon
    instagram: '📷', // Camera for Instagram
    youtube: '📺', // TV for YouTube
    linkedin: '👔', // Professional/business attire for LinkedIn
    twitter: '❌', // X symbol for Twitter/X
    tiktok: '🎬', // Clapper board for TikTok
    soundcloud: '🎵', // Musical note for SoundCloud
    bandcamp: '🎸', // Guitar for Bandcamp
    spotify: '🎧', // Headphones for Spotify
    itunes: '🍎', // Apple for iTunes/Apple Music
    officialWebsite: '🌐', // Globe for official website
    genericLink: '🔗', // Chain link for generic links
  };

  return emojiMap[platformKey] || '🔗';
};

const createSocialLinksArrayField = (
  includeOfficialWebsite: boolean = false,
  hideFooterOption: boolean = true
) => {
  // Only platforms available for manual selection when auto-detection fails
  const fallbackPlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => platform.key === 'officialWebsite' || platform.key === 'genericLink'
  ).filter((platform) => includeOfficialWebsite || platform.key !== 'officialWebsite');

  // Generate platform list for description
  const generatePlatformList = () => {
    const relevantPlatforms = includeOfficialWebsite 
      ? SOCIAL_PLATFORMS 
      : SOCIAL_PLATFORMS.filter(p => p.key !== 'officialWebsite');
    
    return relevantPlatforms
      .map(platform => `${getPlatformEmoji(platform.key)} ${platform.label}`)
      .join(', ');
  };

  return defineField({
    name: 'socialLinksArray',
    title: 'Social Links',
    type: 'array',
    description: `Add social media links by pasting the URL. The platform will be auto-detected when possible. Each social platform can only be added once, but you can add multiple Generic Link entries.

Supported platforms: ${generatePlatformList()}`,
    of: [
      {
        type: 'object',
        name: 'socialLinkItem',
        title: 'Social Link',
        fields: [
          defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            description:
              'Paste the complete URL here. The platform will be automatically detected.',
            validation: (Rule) =>
              Rule.required()
                .uri({
                  scheme: ['http', 'https'],
                  allowRelative: false,
                })
                .custom((value, context) => {
                  const parent = context.parent as { platform?: string };
                  if (value && parent?.platform) {
                    return validatePlatformUrl(parent.platform, value);
                  }
                  return true;
                }),
          }),
          defineField({
            name: 'detectedPlatform',
            title: 'Detected Platform',
            type: 'string',
            readOnly: true,
            description: 'Automatically detected from the URL above',
            hidden: ({ parent }) => {
              if (!parent?.url) return true;
              const detected = detectPlatformFromUrl(parent.url);
              return !detected;
            },
            components: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              field: (props: any) => {
                const DetectedPlatformField = () => {
                  // Get the parent path and use it to get the URL value
                  const pathSegments = props.path;
                  const parentPath = pathSegments.slice(0, -1);
                  const urlPath = [...parentPath, 'url'];
                  const parentValue = useFormValue(urlPath);
                  const detected = parentValue
                    ? detectPlatformFromUrl(parentValue as string)
                    : null;

                  if (!detected) return null;

                  return React.createElement(
                    'div',
                    {
                      style: { marginBottom: '16px' },
                    },
                    [
                      React.createElement(
                        'label',
                        {
                          key: 'label',
                          style: {
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#ffffff',
                            marginBottom: '8px',
                          },
                        },
                        'Detected Platform'
                      ),
                      React.createElement(
                        'div',
                        {
                          key: 'content',
                          style: {
                            padding: '8px 12px',
                            backgroundColor: '#000000',
                            border: '1px solid #7c7c7d',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '500',
                          },
                        },
                        `✅ ${detected.label}`
                      ),
                      React.createElement(
                        'div',
                        {
                          key: 'description',
                          style: {
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px',
                          },
                        },
                        'Automatically detected from the URL above'
                      ),
                    ]
                  );
                };

                return React.createElement(DetectedPlatformField);
              },
            },
          }),
          defineField({
            name: 'platform',
            title: 'Platform',
            type: 'string',
            description: 'Since the platform could not be auto-detected, please select it manually',
            options: {
              list: fallbackPlatforms.map((platform) => ({
                title: platform.label,
                value: platform.key,
              })),
              layout: 'dropdown',
            },
            hidden: ({ parent }) => {
              if (!parent?.url) return true;
              const detected = detectPlatformFromUrl(parent.url);
              return !!detected;
            },
            validation: (Rule) =>
              Rule.custom((value, context) => {
                const parent = context.parent as { url?: string; platform?: string };
                if (!parent?.url) return true;

                const detected = detectPlatformFromUrl(parent.url);
                if (!detected && !value) {
                  return 'Please select a platform since it could not be auto-detected';
                }
                return true;
              }),
          }),
          defineField({
            name: 'customTitle',
            title: 'Custom Title',
            type: 'string',
            description: 'Required for generic links, optional for others',
            hidden: ({ parent }) => {
              if (!parent?.url) return true;
              const detected = detectPlatformFromUrl(parent.url);
              const finalPlatform = detected?.key || parent?.platform;
              return finalPlatform !== 'genericLink';
            },
            validation: (Rule) =>
              Rule.custom((value, context) => {
                const parent = context.parent as { url?: string; platform?: string };
                if (!parent?.url) return true;

                const detected = detectPlatformFromUrl(parent.url);
                const finalPlatform = detected?.key || parent.platform;

                if (finalPlatform === 'genericLink' && !value) {
                  return 'Custom title is required for generic links';
                }
                if (value && value.length > 50) {
                  return 'Custom title must be 50 characters or less';
                }
                return true;
              }),
          }),
          ...(hideFooterOption
            ? [
                defineField({
                  name: 'hideFromFooter',
                  title: 'Hide from Footer',
                  type: 'boolean',
                  description: 'Hide this link from appearing in the site footer',
                  initialValue: false,
                }),
              ]
            : []),
        ],
        preview: {
          select: {
            platform: 'platform',
            url: 'url',
            customTitle: 'customTitle',
          },
          prepare({ platform, url, customTitle }) {
            // Auto-detect platform from URL
            const detected = detectPlatformFromUrl(url);
            const finalPlatform = detected || getPlatformByKey(platform);

            const title = finalPlatform?.key === 'genericLink' ? customTitle : finalPlatform?.label;

            // Show truncated full URL instead of just domain
            let displayUrl = url || '';
            if (displayUrl.length > 60) {
              displayUrl = displayUrl.substring(0, 57) + '...';
            }

            return {
              title: title || 'Untitled Link',
              subtitle: displayUrl,
              media: () => {
                if (detected) return getPlatformEmoji(detected.key);
                if (finalPlatform?.key) return getPlatformEmoji(finalPlatform.key);
                return '🔗'; // Default fallback
              },
            };
          },
        },
      },
    ],
    validation: (Rule) =>
      Rule.custom((items) => {
        if (!Array.isArray(items)) return true;

        // Get final platforms (detected or manually selected)
        const finalPlatforms = items
          .map((item) => {
            const typedItem = item as { url?: string; platform?: string };
            if (!typedItem.url) return null;

            const detected = detectPlatformFromUrl(typedItem.url);
            return detected?.key || typedItem.platform;
          })
          .filter(Boolean) as string[];

        // Check for duplicate platforms (except those that allow multiple)
        const platformsAllowingMultiple = SOCIAL_PLATFORMS.filter((p) => p.allowMultiple).map(
          (p) => p.key
        );

        const singleEntryPlatforms = finalPlatforms.filter(
          (platform) => !platformsAllowingMultiple.includes(platform)
        );
        const uniqueSingleEntry = [...new Set(singleEntryPlatforms)];

        if (singleEntryPlatforms.length !== uniqueSingleEntry.length) {
          return 'Each social platform can only be added once. Only Generic Link entries can be added multiple times.';
        }

        return true;
      }),
  });
};

// Company Links Array Type (excludes officialWebsite, includes footer option)
export const companyLinksArrayType = defineType({
  name: 'companyLinksArray',
  title: 'Company Social Links',
  type: 'object',
  icon: LinkIcon,
  description: 'Manage company social media links with automatic platform detection',
  fields: [
    createSocialLinksArrayField(false, true), // excludeOfficialWebsite=false, hideFooterOption=true
  ],
  preview: {
    select: {
      socialLinksArray: 'socialLinksArray',
    },
    prepare({ socialLinksArray }) {
      const count = Array.isArray(socialLinksArray) ? socialLinksArray.length : 0;
      const linkText = count === 1 ? 'link' : 'links';

      return {
        title: 'Company Social Links',
        subtitle: `${count} ${linkText} configured`,
        media: LinkIcon,
      };
    },
  },
});

