import { defineField, defineType } from 'sanity';
import { EarthGlobeIcon } from '@sanity/icons';

export const googleMapType = defineType({
  name: 'googleMap',
  title: 'Google Map',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'placeholder',
      title: 'Google Map Configuration',
      type: 'string',
      readOnly: true,
      initialValue: 'Map uses embed code from Business & Contact Info',
      description:
        'To edit the Google Maps embed code, go to Site Management → Business & Contact Info → Google Maps Embed Code',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Google Map',
        subtitle: 'Uses embed code from Business & Contact Info',
        media: EarthGlobeIcon,
      };
    },
  },
});
