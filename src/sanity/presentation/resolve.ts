import { defineLocations, PresentationPluginOptions } from 'sanity/presentation';

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/${doc?.slug}`,
          },
        ],
      }),
    }),
    homePage: defineLocations({
      select: {
        title: 'title',
      },
      resolve: () => ({
        locations: [
          {
            title: 'Home',
            href: `/`,
          },
        ],
      }),
    }),
  },
};
