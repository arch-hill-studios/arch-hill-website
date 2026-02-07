import { defineField, defineType } from 'sanity';
import { PlayIcon } from '@sanity/icons';

export const youTubeVideoType = defineType({
  name: 'youTubeVideo',
  title: 'YouTube Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description: 'Enter the full YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
          })
          .custom((url) => {
            if (!url) return 'URL is required';
            
            const youtubeRegex = /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            
            if (!youtubeRegex.test(url)) {
              return 'Please enter a valid YouTube URL';
            }
            
            return true;
          }),
    }),
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({ url }) {
      return {
        title: 'YouTube Video',
        subtitle: url ? `YouTube: ${url.slice(0, 50)}${url.length > 50 ? '...' : ''}` : 'No URL provided',
        media: PlayIcon,
      };
    },
  },
});