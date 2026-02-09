// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.

import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const businessContactInfoType = defineType({
  name: 'businessContactInfo',
  title: 'Business & Contact Info',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organisation Name',
      type: 'string',
      description: 'The official name of your business or organisation. If not set, a placeholder name is used.',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'organizationDescription',
      title: 'Organisation Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of your business or organisation. If not set, a placeholder description is used.',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Optional logo image (used in Header/Footer). If not set, no logo is displayed.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description:
            'Describe the logo for accessibility (e.g., "Company Name Logo")',
        }),
      ],
    }),
    defineField({
      name: 'brandTextImage',
      title: 'Brand Text Image',
      type: 'image',
      description:
        'Optional styled image of your brand name (used in Header/Footer next to logo). If not set, displays the organisation name as plain text.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description:
            'Describe the brand image for accessibility (e.g., "Company Name Logo Text")',
        }),
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description:
        'Custom favicon (browser tab icon). For best results, upload a square PNG image at least 512x512 pixels with a transparent background. SVG files also work well. If not set, the default fallback favicon is used.',
      options: {
        accept: 'image/png,image/svg+xml,image/x-icon',
      },
    }),
    defineField({
      name: 'organizationEmail',
      title: 'Organisation Email',
      type: 'string',
      description: 'Primary contact email address (e.g., "info@example.com")',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email', invert: false }).error(
          'Please enter a valid email address',
        ),
    }),
    defineField({
      name: 'organizationPhone',
      title: 'Organisation Phone',
      type: 'string',
      description: 'Primary contact phone number (e.g., "+64 210 123 454")',
    }),
    defineField({
      name: 'organizationAddress',
      title: 'Organisation Address',
      type: 'string',
      description: 'Business address for display (e.g., "Auckland, New Zealand")',
    }),
    defineField({
      name: 'googleMapsLink',
      title: 'Google Maps Link',
      type: 'url',
      description: 'Link to your Google Maps location (e.g., "https://maps.app.goo.gl/...")',
    }),
    defineField({
      name: 'googleMapsEmbedCode',
      title: 'Google Maps Embed Code',
      type: 'text',
      description:
        'Go to Google Maps → Search for location → Click "Share" → Select "Embed a map" → Copy the entire iframe HTML code and paste it here. The map will automatically maintain a 4:3 aspect ratio.',
      validation: (Rule) =>
        Rule.custom((embedCode) => {
          if (!embedCode) return true;
          const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/i;
          const match = embedCode.match(iframeRegex);
          if (!match) return 'Please paste the complete iframe embed code from Google Maps';
          if (!match[1].includes('google.com/maps/embed')) {
            return 'The iframe must contain a Google Maps embed URL';
          }
          return true;
        }),
    }),
    // Business Location Details - Used for LocalBusiness structured data (SEO)
    defineField({
      name: 'businessLocation',
      title: 'Business Location',
      type: 'object',
      description:
        'Detailed address and geographic data used for LocalBusiness structured data (SEO)',
      fields: [
        defineField({
          name: 'streetAddress',
          title: 'Street Address',
          type: 'string',
          description: 'Street address (e.g., "123 Main Street")',
        }),
        defineField({
          name: 'addressLocality',
          title: 'City/Locality',
          type: 'string',
          description: 'City or locality (e.g., "Auckland")',
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          description: 'Postal/ZIP code (e.g., "1021")',
        }),
        defineField({
          name: 'addressRegion',
          title: 'Region/State',
          type: 'string',
          description: 'Region or state (e.g., "Auckland")',
        }),
        defineField({
          name: 'addressCountry',
          title: 'Country Code',
          type: 'string',
          description: 'ISO country code (e.g., "NZ")',
        }),
        defineField({
          name: 'latitude',
          title: 'Latitude',
          type: 'string',
          description: 'GPS latitude coordinate (e.g., "-36.859063")',
        }),
        defineField({
          name: 'longitude',
          title: 'Longitude',
          type: 'string',
          description: 'GPS longitude coordinate (e.g., "174.748266")',
        }),
        defineField({
          name: 'regionCode',
          title: 'Region Code',
          type: 'string',
          description: 'ISO 3166-2 region code (e.g., "NZ-AUK" for Auckland, New Zealand)',
        }),
      ],
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours',
      type: 'string',
      description: 'Business hours description (e.g., "By Appointment Only", "Mon-Fri 9am-5pm")',
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'Price range indicator for structured data (e.g., "$", "$$", "$$$", "$$$$")',
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      description: 'Geographic areas served by the business (used for local/regional SEO)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'areaType',
              title: 'Area Type',
              type: 'string',
              description: 'Type of area (e.g., "Country", "City", "State", "Region")',
            }),
            defineField({
              name: 'areaName',
              title: 'Area Name',
              type: 'string',
              description: 'Name of the area (e.g., "New Zealand", "Auckland")',
            }),
          ],
          preview: {
            select: {
              areaType: 'areaType',
              areaName: 'areaName',
            },
            prepare({ areaType, areaName }) {
              return {
                title: areaName || 'Unnamed Area',
                subtitle: areaType || 'No type specified',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Business & Contact Info',
        subtitle: 'Organisation details and contact information',
      };
    },
  },
});
