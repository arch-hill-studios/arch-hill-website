# Template Updates

This document contains step-by-step instructions for AI assistants to implement updates in projects created from this template. Each update includes the exact files to modify, code to add, and commands to run.

---

## Dynamic Favicon from Sanity CMS

**Purpose:** Allow content editors to upload a custom favicon in Sanity Studio (Business & Contact Info section) instead of relying on the static fallback favicon files.

**How it works:** A `favicon` image field is added to the `businessContactInfo` schema. The frontend layout's `generateMetadata` always sets the `icons` metadata property programmatically — pointing to Sanity CDN URLs (16x16, 32x32, 180x180 Apple touch icon) when a favicon is uploaded, or static fallback files in `public/images/favicons/` otherwise. The static icon files are moved out of `src/app/` to prevent Next.js file-based auto-detection from overriding the programmatic metadata.

**Best format for upload:** Square PNG image, at least 512x512 pixels, with a transparent background. SVG files also work well.

### Step 1: Add favicon field to schema

**File:** `src/sanity/schemaTypes/businessContactInfoType.ts`

Add the following field after the `brandTextImage` field (after its closing `}),`):

```typescript
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
```

### Step 2: Move static icon files out of auto-detection

Move the static icon files from `src/app/` to `public/images/favicons/` so Next.js file-based icon detection doesn't override the programmatic metadata:

```bash
mkdir -p public/images/favicons
mv src/app/icon.png public/images/favicons/icon.png
mv src/app/apple-icon.png public/images/favicons/apple-icon.png
mv src/app/icon2.png public/images/favicons/icon2.png
mv src/app/icon3.png public/images/favicons/icon3.png
```

### Step 3: Update manifest.ts icon paths

**File:** `src/app/manifest.ts`

Update the PWA icon paths from `/icon2.png` and `/icon3.png` to `/images/favicons/icon2.png` and `/images/favicons/icon3.png`.

### Step 4: Add favicon to GROQ query

**File:** `src/sanity/lib/queries.ts`

Find the `BUSINESS_CONTACT_INFO_QUERY` and add the following after the `brandTextImage` projection (after its closing `},`):

```groq
favicon{
  asset
},
```

### Step 5: Regenerate types

Run:

```bash
npm run typegen
```

### Step 6: Update frontend layout generateMetadata

**File:** `src/app/(frontend)/layout.tsx`

**6a.** Add the `urlFor` import alongside the existing imports:

```typescript
import { urlFor } from '@/sanity/lib/image';
```

**6b.** In the `generateMetadata()` function, add favicon icon logic **before** the `if (!seoMetaData)` early return check. This is critical — the favicon must be computed and included in ALL return paths, including the early return when SEO metadata hasn't been configured yet.

Add the following block after `const orgDescription = ...` and **before** `if (!seoMetaData)`:

```typescript
// Favicon icons — computed before the seoMetaData check so they're included in all return paths
const favicon = businessContactInfo?.favicon;
const faviconIcons = favicon?.asset?._ref
  ? {
      icon: [
        { url: urlFor(favicon).size(32, 32).format('png').url(), sizes: '32x32', type: 'image/png' },
        { url: urlFor(favicon).size(16, 16).format('png').url(), sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: urlFor(favicon).size(180, 180).format('png').url(), sizes: '180x180', type: 'image/png' },
      ],
    }
  : {
      icon: [{ url: '/images/favicons/icon.png', sizes: '32x32', type: 'image/png' }],
      apple: [{ url: '/images/favicons/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    };
```

Then add `icons: faviconIcons` to the early return:

```typescript
if (!seoMetaData) {
  return {
    title: `${orgName} | ${orgDescription}`,
    description: `Welcome to ${orgName}`,
    icons: faviconIcons,
  };
}
```

And replace the final `return generateDefaultMetadata(...)` with:

```typescript
const baseMetadata = generateDefaultMetadata({
  seoMetaData,
  businessContactInfo,
  image: seoMetaData.defaultOgImage, // Set default OG image at layout level
});

return {
  ...baseMetadata,
  icons: faviconIcons,
};
```

### Step 7: Verify

Run:

```bash
npm run typecheck
```

Ensure no TypeScript errors. Then test:

1. Start dev server with `npm run dev`
2. In Sanity Studio, go to Site Management > Business & Contact Info
3. Upload a square PNG as the Favicon
4. Refresh the frontend — the browser tab should show the uploaded favicon
5. Remove the favicon in Sanity — the static fallback `icon.png` should be used instead

---

## Make Organisation Name and Description Optional

**Purpose:** Allow content editors to leave the Organisation Name and Organisation Description fields empty in Sanity. The frontend already uses placeholder defaults from `src/lib/organizationInfo.ts` (`DEFAULT_ORGANIZATION_NAME` and `DEFAULT_ORGANIZATION_DESCRIPTION`) when these values are not set, so no frontend changes are needed.

### Step 1: Remove required validation from schema

**File:** `src/sanity/schemaTypes/businessContactInfoType.ts`

Find the `organizationName` field and change its validation and description:

```typescript
// Change FROM:
description: 'The official name of your business or organisation',
validation: (Rule) => Rule.required().max(100),

// Change TO:
description: 'The official name of your business or organisation. If not set, a placeholder name is used.',
validation: (Rule) => Rule.max(100),
```

Find the `organizationDescription` field and change its validation and description:

```typescript
// Change FROM:
description: 'A brief description of your business or organisation',
validation: (Rule) => Rule.required().max(500),

// Change TO:
description: 'A brief description of your business or organisation. If not set, a placeholder description is used.',
validation: (Rule) => Rule.max(500),
```

### Step 2: Verify

Run:

```bash
npm run typecheck
```

No other changes are needed — the frontend already falls back to defaults via `getOrganizationName()` and `getOrganizationDescription()` in `src/lib/organizationInfo.ts`.
