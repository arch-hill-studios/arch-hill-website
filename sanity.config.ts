'use client';

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { colorInput } from '@sanity/color-input';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { resolve } from '@/sanity/presentation/resolve';
import { protectedDocumentActions } from './src/sanity/actions/protectedDocumentActions';
// Document actions temporarily removed to fix build
// import { UpdateAnchorReferencesAction } from './src/sanity/actions/UpdateAnchorReferencesAction';
// import { DebugAnchorReferencesAction } from './src/sanity/actions/DebugAnchorReferencesAction';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    colorInput(),
  ],
  document: {
    newDocumentOptions: (prev) =>
      prev.filter(
        (item) =>
          ![
            'siteSettings',
            'header',
            'footer',
            'homePage',
            'companyLinks',
            'clients',
            'equipmentListSingleton',
            'termsAndConditions',
            'privacyPolicy',
          ].includes(item.templateId)
      ),
    actions: protectedDocumentActions,
    // Document actions temporarily removed to fix build
    // actions: (prev, { schemaType }) => {
    //   const pageTypes = ['page', 'homePage'];
    //   if (pageTypes.includes(schemaType)) {
    //     return [...prev, UpdateAnchorReferencesAction, DebugAnchorReferencesAction];
    //   }
    //   return prev;
    // },
  },
  studio: {
    components: {
      layout: (props) => {
        // Import editor styles
        if (typeof document !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/sanity-editor-styles.css';
          if (!document.head.querySelector('link[href="/sanity-editor-styles.css"]')) {
            document.head.appendChild(link);
          }
        }
        // Filter out non-DOM props to avoid React warnings
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { disableTransition, ...safeProps } = props as typeof props & { disableTransition?: boolean };
        return props.renderDefault(safeProps);
      },
    },
  },
});
