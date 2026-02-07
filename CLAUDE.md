# AI Development Instructions

This file contains instructions for AI assistants working on this project.

## MVC Architecture

**CRITICAL: This project follows an MVC (Model-View-Controller) architecture. Always maintain this separation of concerns when adding new features.**

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| **Model** | `src/sanity/` | Data definitions, GROQ queries, schema types |
| **View** | `src/components/`, `src/app/(frontend)/` | UI rendering, React components, page layouts |
| **Controller** | `src/actions/` | Data fetching, business logic, server actions |

### Model Layer (`src/sanity/`)

- **Schemas** (`src/sanity/schemaTypes/`): Define content structure and validation rules
- **Queries** (`src/sanity/lib/queries.ts`): GROQ queries for fetching data
- **Types** (auto-generated via `npm run typegen`): TypeScript types from schemas
- **Fetch utilities** (`src/sanity/lib/fetch.ts`): Low-level fetch with caching/revalidation

### Controller Layer (`src/actions/`)

- Server action functions that call `staticSanityFetch` with queries and tags
- Organized by domain: `pages.ts`, `siteData.ts`, `legal.ts`, `faq.ts`
- Barrel-exported from `src/actions/index.ts`
- Handles data fetching logic, caching tags, and type assertions
- **Pages call action functions - they never query Sanity directly**

### View Layer (`src/components/` and `src/app/(frontend)/`)

- **Page files** (`src/app/(frontend)/*/page.tsx`): Call action functions, pass data to components
- **Page content components** (`src/components/pages/`): Full page layouts receiving data as props
- **Block components** (`src/components/_blocks/`): Individual content blocks
- **UI components** (`src/components/UI/`): Reusable UI elements

### When Adding a New Feature

1. **Model**: Define schema in `src/sanity/schemaTypes/`, add GROQ query in `queries.ts`, run `npm run typegen`
2. **Controller**: Create action function in `src/actions/`, export from `index.ts`
3. **View**: Create page in `src/app/(frontend)/`, create components in `src/components/`

**Never skip layers** - pages should not contain GROQ queries or direct Sanity client calls. Always go through action functions.

## Block System Architecture

**CRITICAL: This project uses a centralized block system.**

### Quick Reference

**When adding a new block type:**

1. Create schema in `src/sanity/schemaTypes/blocks/`
2. Add to appropriate block list in `src/sanity/schemaTypes/shared/blockLists.ts` (usually `CONTENT_ONLY_BLOCKS` for content blocks, or `STANDARD_BLOCK_LIST` for layout blocks)
3. Register in `src/sanity/schemaTypes/index.ts`
4. Run `npm run typegen`
5. Create component in `src/components/_blocks/`
6. Add to `blockRenderer.tsx` (type import, component import, BlockType union, switch case)
7. Add type definitions to `src/types/blocks.ts`
8. Run `npm run typecheck`

**Key benefits of this system:**
- Single source of truth for block lists
- New blocks automatically appear everywhere (PageBuilder, Cards, TwoColumn, Grid)
- Compile-time safety with TypeScript exhaustiveness checking
- No manual schema updates across multiple files

### Block Lists (`src/sanity/schemaTypes/shared/blockLists.ts`)

| Block List | Purpose | Contains |
|---|---|---|
| `CONTENT_ONLY_BLOCKS` | Pure content blocks, safe at any depth | richText, images, videos, widgets, CTAs, lists, forms, etc. |
| `LAYOUT_CHILD_BLOCKS` | Inside layout components (grid/twoColumn) | `CONTENT_ONLY_BLOCKS` + card containers (no nested layouts) |
| `STANDARD_BLOCK_LIST` | Universal top-level content | `CONTENT_ONLY_BLOCKS` + layout blocks |
| `PAGE_ROOT_BLOCK_LIST` | Page builder root level | pageSections + `STANDARD_BLOCK_LIST` |

Adding a content block to `CONTENT_ONLY_BLOCKS` automatically makes it available in all other lists (DRY).

### Nesting Restrictions

**To prevent GROQ query depth issues and infinite recursion, strict nesting rules are enforced:**

- **Top-level content**: Can contain all layout blocks and content blocks
- **Layout blocks**: Can contain cards and content blocks, but NOT nested layout blocks
- **Cards**: Can contain content blocks only - NO layouts or nested cards

**Maximum safe depth:**
- **Level 1**: Top-level -> Layout blocks
- **Level 2**: Layout blocks -> Cards
- **Level 3**: Cards -> CTAs with internal links (properly dereferenced)

Without these restrictions, infinitely deep structures would break GROQ queries and cause internal link dereferencing failures.

### Section Nesting Rules

Sections enforce hierarchical nesting:
- **PageSection** (h2) -> can contain SubSections + standard blocks
- **SubSection** (h3) -> can contain SubSubSections + standard blocks
- **SubSubSection** (h4) -> can contain standard blocks only (no nested sections)

Created via `createSectionBlockList(allowedChildSections)` function.

### Exhaustiveness Check Protection

TypeScript exhaustiveness checking in `blockRenderer.tsx` prevents missing block implementations:

```typescript
default: {
  const exhaustiveCheck: never = typedBlock;
  // If you see a TypeScript error here, you're missing a case in the switch statement
}
```

**Error message you'll see:**
```
Type 'WithKey<SomeBlockType>' is not assignable to type 'never'
```

This means you added a block to the type system but forgot to implement rendering for it.

## Sanity Live Preview and Stega Encoding

**CRITICAL: String comparisons in Sanity live preview mode require special handling.**

Sanity's live preview embeds invisible Unicode characters (stega encoding) into strings for click-to-edit functionality. This causes string comparisons to fail unexpectedly.

### Quick Reference

**Always use `stegaClean()` when comparing Sanity string values:**

```typescript
import { stegaClean } from 'next-sanity';

// ✅ CORRECT - Works in both production and Presentation mode
const filtered = items.filter(item =>
  stegaClean(item.category) === stegaClean(selectedCategory)
);

// ✅ CORRECT - Switch statements
switch (stegaClean(block._type)) {
  case 'richText': return <RichText {...block} />;
}

// ✅ CORRECT - Conditional rendering
const isDark = stegaClean(visualStyle) === 'dark';
```

**When to use `stegaClean()`:**
- String equality comparisons (`===`, `==`)
- Array `includes`/`indexOf` with string values
- Switch statements on string values from Sanity
- Object key lookups using strings from Sanity

**When NOT needed:**
- Display purposes (invisible characters don't appear in UI)
- Numeric/boolean comparisons (not affected)
- Null/undefined checks (work normally)
- Passing strings as props (only clean at point of comparison)

**Common mistakes:**
- Clean BOTH sides: `stegaClean(a) === stegaClean(b)` (not just one side)
- Clean at point of comparison, NOT when receiving data (breaks live editing)

## Sanity Live Editing Data Attributes

**When creating components that display CMS content, always implement live editing support so content updates appear instantly in Sanity Studio's Presentation view.**

### Implementation Pattern

```tsx
import { createDataAttribute } from 'next-sanity';

interface ComponentProps {
  title?: string;
  description?: string;
  documentId?: string;
  documentType?: string;
  titlePath?: string;
  descriptionPath?: string;
}

const YourComponent = ({
  title, description, documentId, documentType, titlePath, descriptionPath
}: ComponentProps) => {
  const getTitleDataAttribute = () => {
    if (!documentId || !documentType || !titlePath) return {};
    return createDataAttribute({
      id: documentId,
      type: documentType,
      path: titlePath,
    }).data;
  };

  return (
    <div>
      {title && <h2 {...getTitleDataAttribute()}>{title}</h2>}
    </div>
  );
};
```

### Field Path Construction

- Simple field: `fieldName`
- Nested in block: `${blockPath}.fieldName`
- Array item: `${blockPath}[${index}].fieldName`
- Object property: `${blockPath}.objectName.fieldName`
- Rich text: `${blockPath}.content`

### Parent Component Integration

Pass live editing props from the parent (e.g., PageBuilder):

```tsx
<YourComponent
  title={block.title}
  documentId={documentId}
  documentType={documentType}
  titlePath={`${blockPath}.title`}
/>
```

### Checklist

- [ ] Import `createDataAttribute` from `next-sanity`
- [ ] Add live editing props (`documentId`, `documentType`, `*Path`) to component interface
- [ ] Create data attribute helper functions for each editable field
- [ ] Apply data attributes to the elements displaying CMS content
- [ ] Pass correct field paths from parent component
- [ ] Test in Sanity Studio Presentation view

## Sanity CMS Schema Development

When working with Sanity schema types, please follow these guidelines:

### Schema Structure and Validation

- Always include proper field validation (required fields, character limits, etc.)
- Use descriptive field names and titles
- Provide helpful descriptions for content editors
- Include preview configurations where appropriate
- Follow the existing naming conventions in the codebase

### AI Helper Comment

When creating or modifying Sanity schema files, include this standardized comment at the top of each schema file to help AI assistants understand the context:

```javascript
// AI Helper: This is a Sanity CMS schema definition. It defines the structure and validation rules for content types.
// When modifying, ensure all fields have appropriate validation, titles, and descriptions for content editors.
// Follow the existing patterns in other schema files for consistency.
```

This comment should be referenced and applied consistently across all schema files to maintain development standards.

### Singleton Page Implementation Checklist

**CRITICAL: When creating singleton pages (pages that should only exist once), you MUST complete ALL of these steps to ensure proper integration:**

#### 1. Schema Definition

Create the singleton schema with proper structure:

```javascript
export const newSingletonType = defineType({
  name: 'newSingletonName',
  title: 'New Singleton Page Title',
  type: 'document',
  icon: YourChosenIcon,
  fields: [
    // Your fields here
  ],
  preview: {
    prepare() {
      return {
        title: 'New Singleton Page Title'
      };
    }
  }
});
```

#### 2. Desk Structure Configuration

**Update `src/sanity/structure.ts`** to:

- Add the singleton to the appropriate section in the desk structure
- Ensure it appears as a single item, not a list
- Group it logically with related singletons

```javascript
S.listItem()
  .title('New Singleton Page Title')
  .id('newSingletonName')
  .child(S.document().schemaType('newSingletonName').documentId('newSingletonName'))
```

#### 3. Protected Document Actions

**Update `src/sanity/lib/protectedDocumentActions.ts`** to prevent deletion and duplication:

```javascript
const PROTECTED_SINGLETON_IDS = [
  'homePage',
  'header',
  'footer',
  // ... existing singletons
  'newSingletonName', // ADD NEW SINGLETON HERE
];
```

This prevents the singleton from:

- Being deleted accidentally
- Being duplicated (which would break the singleton pattern)
- Appearing in the create menu (+ button) in Sanity Studio

#### 4. Internal Link System Integration

**Update `src/sanity/schemaTypes/shared/linkSystem.ts`** to make the singleton selectable in internal links:

```javascript
export const LINKABLE_PAGE_TYPES = [
  { type: 'homePage' },
  // ... existing linkable types
  { type: 'newSingletonName' }, // ADD NEW SINGLETON HERE
];
```

#### 5. GROQ Query URL Generation

**Update `src/sanity/lib/queries.ts`** to include URL generation for the singleton:

```javascript
const internalLinkProjection = `{
  // ... existing fields
  "href": select(
    _type == "homePage" => "/",
    // ... existing URL mappings
    _type == "newSingletonName" => "/your-url-path",
    "/" + slug.current
  )
}`;
```

#### 6. Validation Checklist

After implementing a singleton page, verify:

- [ ] Singleton does NOT appear in Sanity Studio's create menu (+ button)
- [ ] Singleton cannot be deleted or duplicated in Sanity Studio
- [ ] Singleton appears in internal link selection dropdowns
- [ ] CTAs linking to the singleton generate correct URLs
- [ ] The singleton appears properly in the desk structure

#### Common Mistakes to Avoid:

- **Forgetting step 3**: Singleton will appear in create menu and can be deleted
- **Forgetting step 4**: Singleton won't be available for internal linking
- **Forgetting step 5**: Internal links to singleton will generate incorrect URLs
- **Inconsistent naming**: Use the same identifier across all files

#### Why This Process Matters:

Singletons represent unique pages that should only exist once (like "About Us", "Contact", etc.). If any step is missed:

- Content editors might accidentally create duplicates
- Links to the singleton might break
- The singleton might be accidentally deleted
- The admin interface becomes confusing

**ALWAYS complete all 6 steps when creating any singleton page to ensure proper functionality and prevent issues discovered later.**

## Data Fetching & Revalidation Architecture

**CRITICAL: This project uses cached data fetching with on-demand revalidation via Sanity webhooks.**

### Architecture Overview

The `(frontend)` layout checks for draft mode on each request. The data fetching is cached separately from the page rendering:

- **Public visitors**: `draftMode().isEnabled` = false → page renders with cached Sanity data
- **Sanity editors (draft mode)**: `draftMode().isEnabled` = true → SanityLive provides real-time content updates
- **Local development**: Data fetching uses `revalidate: 0` so changes appear immediately on refresh

```
Request → (frontend)/layout.tsx
  │
  ├─ draftMode().isEnabled = false (public user)
  │   - Data fetched via staticSanityFetch (cached with tags)
  │   - No SanityLive/VisualEditing components rendered
  │
  └─ draftMode().isEnabled = true (Sanity editor)
      - SanityLive provides real-time content updates
      - VisualEditing enables click-to-edit in Presentation Tool
```

### Data Fetching with staticSanityFetch

The `staticSanityFetch` function (`src/sanity/lib/fetch.ts`) handles caching differently based on environment:

- **Development** (`NODE_ENV === 'development'`): Uses `revalidate: 0` — fresh data on every request
- **Production**: Uses `revalidate: false` with tags — cached indefinitely until webhook revalidates

```typescript
const data = await authenticatedClient.fetch<T>(query, await params, {
  next: isDev
    ? { revalidate: 0 }
    : { tags, revalidate: false },
});
```

### When Adding a New Action Function

1. Create the action in `src/actions/` with the standard pattern:
   ```typescript
   import { staticSanityFetch } from '@/sanity/lib/fetch';

   export async function getNewData(): Promise<NEW_QUERYResult> {
     const { data } = await staticSanityFetch({
       query: NEW_QUERY,
       tags: ['sanity', 'newDocumentType'], // Tag with the Sanity _type
     });
     return data as NEW_QUERYResult;
   }
   ```
2. **Always include tags**: `['sanity', '<documentType>']` — the document type tag enables targeted revalidation via webhook, and `'sanity'` is the catch-all tag
3. The webhook endpoint (`src/app/api/revalidate/route.ts`) automatically handles new document types — no changes needed there

### When Adding a New Page

1. **Create the page** in `src/app/(frontend)/your-page/page.tsx`
   - Fetch data using action functions (they use `staticSanityFetch` internally)
   - Create and render the page content

2. **No additional setup needed for Presentation Tool** — the `(frontend)/layout.tsx` automatically handles draft mode detection and renders SanityLive/VisualEditing when needed

### Avoiding Duplicated Fetch Logic Across Pages

**CRITICAL: Never duplicate the same data fetching calls across multiple page files. Consolidate shared fetching into a single place so changes only need to happen once.**

This project uses two levels of consolidation:

#### 1. Layout-Level Data (Fetched Once for All Pages)

Data needed by **every** page (header, footer, SEO metadata, business contact info, company links, legal page visibility) is fetched once in `src/app/(frontend)/layout.tsx` and passed down through the `BaseLayout` component. Individual pages **never** fetch this data themselves.

**When adding new site-wide data** (e.g., a new global setting or navigation element):
- Add the fetch to the layout's `Promise.all()` — NOT to every page file
- Pass it through `BaseLayout` to the components that need it

#### 2. Shared Page-Level Data (`getPageBuilderData()`)

Data needed by **most pages but not the layout** (e.g., SEO metadata for page-level meta tags, contact form settings for inline forms) is consolidated into `getPageBuilderData()` in `src/actions/siteData.ts`. Pages call this single function instead of making multiple individual calls.

```typescript
// ✅ CORRECT - Single call for all shared page data
const [page, pageBuilderData] = await Promise.all([
  getPageBySlug(slug),
  getPageBuilderData(),
]);

// ❌ WRONG - Duplicating individual calls in every page file
const [page, seoData, contactInfo, companyLinks, formSettings] = await Promise.all([
  getPageBySlug(slug),
  getSeoMetaData(),
  getBusinessContactInfo(),
  getCompanyLinks(),
  getContactFormSettings(),
]);
```

**When adding new shared page data:**
1. Add it to the `PageBuilderData` interface in `src/actions/siteData.ts`
2. Add the fetch call to `getPageBuilderData()`'s `Promise.all()`
3. All pages automatically receive the new data — no per-page changes needed

**Why this matters:** Without consolidation, adding or changing shared data requires editing every `page.tsx` file in the project. With consolidation, changes happen in one place.

### Revalidation & Caching

- **Production data** uses `revalidate: false` — cached indefinitely until explicitly revalidated
- **Revalidation** is triggered by a Sanity webhook → `POST /api/revalidate` → `revalidateTag(documentType)`
- **Tag strategy**: Every fetch is tagged with `['sanity', '<documentType>']`
  - `revalidateTag('faqPage')` — invalidates only FAQ-related data
  - `revalidateTag('sanity')` — invalidates ALL Sanity data (nuclear option)

### Key Files

| File | Purpose |
|---|---|
| `src/sanity/lib/fetch.ts` | Static fetch function (`staticSanityFetch`) with environment-aware caching |
| `src/sanity/lib/live.ts` | Live fetch function (from `defineLive`) for real-time updates in draft mode |
| `src/app/api/revalidate/route.ts` | Webhook endpoint for on-demand revalidation |
| `src/app/(frontend)/layout.tsx` | Layout with draft mode detection — renders SanityLive/VisualEditing when in draft mode |
| `src/proxy.ts` | Handles maintenance mode and dev-test route blocking |

### Common Mistakes to Avoid

- **Forgetting tags on new action functions** — without tags, the webhook can't invalidate the cached data
- **Using `revalidate: 0` or `no-store` in production** — this disables caching entirely; use `revalidate: false` with tag-based revalidation instead

### Debugging

- **Content not updating after publish?** — Check the webhook is configured correctly in Sanity dashboard, verify `SANITY_WEBHOOK_SECRET` matches, and check `/api/revalidate` logs in Vercel
- **Local dev changes not appearing?** — Restart the dev server to ensure `NODE_ENV` is correctly set to `'development'`
- **Presentation Tool not connecting?** — Ensure you're logged into Sanity Studio and have editor permissions

## Typography Guidelines

**IMPORTANT: Always use custom font size classes from globals.css instead of native Tailwind font size classes.**

### Custom Font Size Classes Available:

- **Headings**: `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-h5`, `text-h6`
- **Body Text**: `text-body-xs`, `text-body-sm`, `text-body-base`, `text-body-lg`, `text-body-xl`, `text-body-2xl`, `text-body-3xl`, `text-body-4xl`, `text-body-5xl`, `text-body-6xl`, `text-body-7xl`, `text-body-8xl`, `text-body-9xl`

### Mapping Guide:

- `text-xs` → `text-body-xs`
- `text-sm` → `text-body-sm`
- `text-base` → `text-body-base`
- `text-lg` → `text-body-lg`
- `text-xl` → `text-body-xl`
- `text-2xl` → `text-body-2xl`
- `text-3xl` → `text-body-3xl`
- `text-4xl` → `text-body-4xl`
- `text-5xl` → `text-body-5xl`
- `text-6xl` → `text-body-6xl`
- `text-7xl` → `text-body-7xl`
- `text-8xl` → `text-body-8xl`
- `text-9xl` → `text-body-9xl`

### Usage Guidelines:

- **Use `text-h*` classes** for actual headings that need specific heading styling (font weight, etc.)
- **Use `text-body-*` classes** for all other text sizing needs, including icons and decorative text

**These custom classes include responsive behavior and proper line heights. Never use native Tailwind font size classes like `text-xs`, `text-sm`, `text-lg`, `text-xl`, `text-2xl`, etc.**

## Tailwind CSS Class Syntax

**IMPORTANT: This project uses Tailwind CSS v4. Always use the shortest canonical form of a Tailwind utility class.**

Tailwind v4 introduced shorter canonical equivalents for many utility classes. The linter rule `suggestCanonicalClasses` flags non-canonical usage. When writing or modifying Tailwind classes, always use the modern canonical form — whether that means dropping unnecessary brackets, using a shorter class name, or both.

### Examples

| Non-canonical (avoid) | Canonical (use this) |
|---|---|
| `flex-shrink-0` | `shrink-0` |
| `flex-grow` | `grow` |
| `overflow-clip` | `clip` |
| `aspect-[4/3]` | `aspect-4/3` |
| `aspect-[16/9]` | `aspect-16/9` |
| `grid-cols-[3]` | `grid-cols-3` |

This is not an exhaustive list — the principle applies to **all** Tailwind utilities. If a shorter or simpler form exists, use it.

### Linting After Major Features

After completing a major feature or making widespread UI changes, run the CSS linter to catch any non-canonical classes that were introduced:

```bash
npx @tailwindcss/cli lint src/
```

This catches issues that manual review will miss, since the linter knows Tailwind's full class mapping. This is not needed for every small change — use judgement.

## Colour Usage Guidelines

**IMPORTANT: When implementing UI features where colours have not been explicitly specified, always prioritise readability, contrast, and brand consistency.**

### Colour Selection Priority

When colours are not defined in the request, follow this priority order:

1. **Use existing brand/theme colours** defined as CSS custom properties in `src/app/globals.css`. Check what `--color-*` variables are available and use them via Tailwind classes or `var()` — never duplicate raw hex values that already exist as variables.
2. **Use existing Tailwind theme colours** if the brand palette doesn't cover the need (e.g., grays, status colours).
3. **Define a new CSS custom property** in `globals.css` if a genuinely new colour is needed for the project. Then reference it via Tailwind or `var()`.
4. **Hard-code a colour value in the component file only as a last resort**, and only when the colour is truly one-off and component-specific.

### Contrast and Readability Requirements

- **Always ensure sufficient colour contrast** between text and its background. Follow WCAG 2.1 AA minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold).
- **Never place light text on light backgrounds or dark text on dark backgrounds.** When in doubt, test the combination visually or use a contrast checker.
- **Be especially careful with vibrant/saturated brand colours as text** — many brand accent colours have poor contrast on white backgrounds for body text. Use them for accents, buttons, and headings rather than small body text on light backgrounds.
- **For text-heavy sections**, prefer high-contrast pairings: dark text (near-black) on light backgrounds, or white/off-white text on dark backgrounds. Check `globals.css` for the project's designated dark and light colour variables.

### Common Mistakes to Avoid

- **Using vibrant brand accent colours for body text on light backgrounds** — often fails WCAG contrast requirements
- **Hard-coding hex values** when the colour already exists as a CSS custom property
- **Duplicating colour definitions** across component files instead of referencing globals
- **Choosing colours purely for aesthetics** without checking readability at small font sizes
- **Using opacity/transparency** to create text colours that end up with insufficient contrast

## Rich Text (Portable Text) Implementation

**CRITICAL: All Rich Text components MUST handle blank lines properly to ensure content editors can add spacing in their content.**

### The Problem

By default, PortableText renders empty blocks without any content, causing blank lines entered by editors in Sanity to disappear in the front-end rendering. This creates frustration for content editors who expect blank lines to create visual spacing.

### The Solution

All PortableText component configurations must check for empty blocks and render a non-breaking space (`&nbsp;`) to preserve blank lines.

### Standard Implementation Pattern

When creating new PortableText components or modifying existing ones, **ALWAYS** include empty block handling for ALL block styles:

```typescript
import React from 'react';
import { PortableTextComponents } from 'next-sanity';

export const createComponents = (): PortableTextComponents => {
  return {
    block: {
      normal: ({ children }) => {
        // Handle empty blocks (empty lines) - render a paragraph with a non-breaking space
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <p className='text-body-base'>&nbsp;</p>;
        }

        // Check if children contains only empty spans or text nodes
        const hasOnlyEmptyContent = React.Children.toArray(children).every(child => {
          if (typeof child === 'string') {
            return child.trim() === '';
          }
          // Check if it's a React element with empty content
          if (React.isValidElement(child)) {
            const props = child.props as { children?: unknown };
            if (props.children) {
              const childContent = props.children;
              return typeof childContent === 'string' && childContent.trim() === '';
            }
          }
          return false;
        });

        if (hasOnlyEmptyContent) {
          return <p className='text-body-base'>&nbsp;</p>;
        }

        return <p className='text-body-base'>{children}</p>;
      },

      // Apply the same pattern to ALL other block styles
      'body-xs': ({ children }) => {
        if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
          return <figcaption className='text-body-xs'>&nbsp;</figcaption>;
        }
        return <figcaption className='text-body-xs'>{children}</figcaption>;
      },

      // ... repeat for body-sm, body-lg, body-xl, body-2xl, body-3xl, standout, etc.
    },
    // ... other component configurations
  };
};
```

### Rendering Rich Text with PortableTextWrapper

**CRITICAL: Always use the `PortableTextWrapper` component to render PortableText content.**

The `PortableTextWrapper` component (`src/components/UI/PortableTextWrapper.tsx`) provides:

- **Intelligent paragraph spacing**: Uses `[&>:not(:empty)+:not(:empty)]:mt-2` for smart spacing
- **Centralized spacing logic**: Single source of truth for Rich Text spacing
- **Smart spacing behavior**:
  - Shift+Return (soft break): No extra spacing (same paragraph)
  - Return (new paragraph): `mt-2` spacing between consecutive paragraphs
  - Return twice (blank line): Empty `<p></p>` provides spacing, **no margin added after**

**Implementation Details:**

Empty blocks are rendered as truly empty `<p></p>` elements (no `&nbsp;`), which allows the CSS `:empty` selector to work correctly. Two CSS rules work together:

1. `[&>:empty]:min-h-[1lh]` - Gives empty elements a minimum height of one line-height
2. `[&>:not(:empty)+:not(:empty)]:mt-2` - Only adds `mt-2` between non-empty elements

This prevents double-spacing after blank lines while ensuring blank lines create visible vertical space.

**Spacing Logic:**

```
<p>First paragraph</p>      ← No margin (first element)
<p>Second paragraph</p>      ← mt-2 (non-empty after non-empty)
<p></p>                      ← No margin added (blank line is the spacing)
<p>After blank line</p>      ← No margin (after empty element)
```

**Usage:**

```typescript
import PortableTextWrapper from '@/components/UI/PortableTextWrapper';
import { createComponents } from '@/sanity/portableTextComponents';

const components = createComponents('center');

<PortableTextWrapper
  value={content}
  components={components}
  className="prose prose-slate max-w-xl text-center"
  dataAttributes={createSanityDataAttribute(id, type, 'field')}
/>
```

### Reference Implementations

The codebase has two reference implementations with proper blank line handling:

1. **Standard Rich Text**: `src/sanity/portableTextComponents.tsx`
   - Used by: RichText blocks, TextImage blocks
   - Function: `createComponents(alignment)`
   - Rendered via: `PortableTextWrapper`

2. **Hero Rich Text**: `src/components/HomeHero/heroRichTextComponents.tsx`
   - Used by: Hero Title component
   - Function: `createHeroRichTextComponents(alignment)`
   - Includes font scaling for hero sections
   - Rendered via: `PortableTextWrapper`

### Checklist for New Rich Text Components

When creating a new PortableText component configuration:

- [ ] **Use PortableTextWrapper**: Always render with `PortableTextWrapper` instead of raw `PortableText`
- [ ] Import React: `import React from 'react';`
- [ ] Check for empty children: `!children || children.length === 0 || children === ''`
- [ ] Check for whitespace-only content using `React.Children.toArray()`
- [ ] **Render truly empty elements** `<p></p>` for empty blocks (NOT `<p>&nbsp;</p>`) to enable CSS `:empty` selector
- [ ] Apply the same pattern to custom block styles (standout, callout, etc.)
- [ ] Test in Sanity Studio by adding blank lines between paragraphs
- [ ] Verify blank lines render with proper spacing in the front-end
- [ ] Verify paragraph spacing works correctly (Return creates spacing, Shift+Return doesn't)
- [ ] Verify NO extra margin appears after blank lines

### Common Mistakes to Avoid

❌ **Wrong - No empty block handling:**

```typescript
normal: ({ children }) => <p className='text-body-base'>{children}</p>
```

❌ **Wrong - Using &nbsp; instead of truly empty:**

```typescript
normal: ({ children }) => {
  if (!children) return <p className='text-body-base'>&nbsp;</p>; // ❌ Breaks :empty selector
  return <p className='text-body-base'>{children}</p>;
}
```

✅ **Correct - Truly empty elements for CSS :empty selector:**

```typescript
normal: ({ children }) => {
  if (!children || (Array.isArray(children) && children.length === 0) || children === '') {
    return <p className='text-body-base'></p>; // ✅ Truly empty for :empty selector
  }

  const hasOnlyEmptyContent = React.Children.toArray(children).every(child => {
    if (typeof child === 'string') return child.trim() === '';
    if (React.isValidElement(child)) {
      const props = child.props as { children?: unknown };
      if (props.children) {
        return typeof props.children === 'string' && props.children.trim() === '';
      }
    }
    return false;
  });

  if (hasOnlyEmptyContent) {
    return <p className='text-body-base'></p>; // ✅ Truly empty
  }

  return <p className='text-body-base'>{children}</p>;
}
```

### Why This Matters

- **Content Editor Experience**: Editors expect blank lines to work like any word processor
- **Design Flexibility**: Allows editors to control spacing without developer intervention
- **Consistency**: Ensures all Rich Text fields behave the same way across the site
- **Maintenance**: Prevents recurring bug reports about "blank lines not working"

**When in doubt, copy the pattern from `src/sanity/portableTextComponents.tsx` - it's the proven reference implementation.**

## TypeScript Guidelines

**IMPORTANT: Never use `any` type - the ESLint configuration prohibits this.**

### Schema Field Removal Protocol

When removing fields from Sanity schemas that are referenced in frontend components:

1. **Remove field from schema** (e.g., `sectionFactory.ts`)
2. **Regenerate types** using `npm run typegen`
3. **Update PageBuilder references** using proper typing:

   ```typescript
   // ❌ Wrong - ESLint error
   textAlign={(block as any).textAlign}

   // ✅ Correct - Use specific type assertion
   textAlign={(block as { textAlign?: string }).textAlign}
   ```

### Type-Safe Field Access

When accessing potentially undefined fields from removed schema properties:

- Use type assertions with specific interface definitions
- Avoid `any` type at all costs
- Consider making the field optional (`?:`) in component interfaces
- Add explanatory comments about field availability

## Unified Image Component Usage

**CRITICAL: Use the UnifiedImage component for all image handling to ensure consistency, performance, and SEO.**

### Overview

The `UnifiedImage` component (`@/components/UI/UnifiedImage`) automatically handles:

- **Auto-sizing for crisp images**: Automatically requests 2-3x display size from Sanity for high-DPI displays
- **Schema markup generation**: Adds ImageObject structured data for SEO
- **Responsive optimization**: Generates appropriate sizes for different breakpoints
- **Null/undefined handling**: Built-in validation and fallback rendering
- **Modal support**: Optional full-screen image viewing
- **Sanity live editing**: Proper data attributes for Studio editing

### Basic Usage Patterns

#### 1. Blog Card Images

```typescript
<div className="relative w-full aspect-4/3 overflow-hidden">
  <UnifiedImage
    src={post.mainImage}
    alt={`${post.title} image`}
    mode="fill"
    sizeContext="card"
    objectFit="cover"
    generateSchema
    schemaContext="blog"
  />
</div>
```

#### 2. Header/Logo Images

```typescript
<UnifiedImage
  src={headerData.logo}
  alt="Company Logo"
  mode="sized"
  width={180}
  height={125}
  sizeContext="logo"
  objectFit="contain"
  documentId={headerData._id}
  documentType="header"
  fieldPath="logo"
/>
```

#### 3. Profile Images

```typescript
<UnifiedImage
  src={profileImage}
  alt="Profile image"
  mode="fill"
  sizeContext="profile"
  objectFit="cover"
  sizes="(max-width: 768px) 150px, 200px"
/>
```

#### 4. Gallery Images with Modal

```typescript
<UnifiedImage
  src={image}
  alt={`Gallery image ${index + 1}`}
  mode="fill"
  sizeContext="gallery"
  objectFit="cover"
  enableModal
  modalCaption="Optional caption"
  sizes="(max-width: 768px) 50vw, 33vw"
/>
```

#### 5. Hero/Background Images

```typescript
<UnifiedImage
  src={heroImage}
  alt=""
  mode="fill"
  sizeContext="hero"
  objectFit="cover"
  priority
  sizes="100vw"
/>
```

#### 6. Icon Images

```typescript
<UnifiedImage
  src={icon}
  alt="Icon description"
  mode="sized"
  width={24}
  height={24}
  sizeContext="icon"
  objectFit="contain"
/>
```

### CRITICAL: Image Implementation Error Prevention

**ALWAYS follow these patterns to avoid Next.js Image errors:**

#### ✅ CORRECT: Sized Mode Pattern (Preferred for most cases)

```typescript
// Use for logos, content images, cards - any image where you want responsive sizing
<UnifiedImage
  src={image}
  alt="Description"
  mode="sized"
  width={1200}          // Explicit width for Next.js optimization
  height={800}          // Explicit height for Next.js optimization
  sizeContext="full"    // Or appropriate context
  objectFit="cover"
  className="w-full h-auto rounded-lg"  // REQUIRED: w-full h-auto for responsive
  enableModal
  generateSchema
  schemaContext="article"
/>
```

#### ✅ CORRECT: Fill Mode Pattern (For constrained containers only)

```typescript
// Use ONLY when you have a container with defined dimensions
<div className="relative w-full aspect-4/3 overflow-hidden">
  <UnifiedImage
    src={image}
    alt="Description"
    mode="fill"
    sizeContext="gallery"
    objectFit="cover"
    fillContainer={true}  // Default - creates relative positioning
    sizes="(max-width: 768px) 100vw, 50vw"
    enableModal
  />
</div>
```

#### ❌ WRONG: Common Patterns That Cause Errors

**Never do this - causes aspect ratio warnings:**

```typescript
// ❌ WRONG: Sized mode without proper className
<UnifiedImage
  mode="sized"
  width={800}
  height={600}
  className="w-full"  // Missing h-auto
/>

// ❌ WRONG: Fill mode without proper container
<UnifiedImage
  mode="fill"  // No relative positioned parent
/>

// ❌ WRONG: fillContainer=false without absolute positioned parent
<div className="static">  // Should be relative
  <UnifiedImage
    mode="fill"
    fillContainer={false}
  />
</div>
```

#### Mode Selection Guidelines

**Use `mode="sized"`** when:

- Logo images (Header, Footer, Navigation)
- Content images in articles/blogs
- Card images that need responsive sizing
- Any image that should scale with container width

**Use `mode="fill"`** when:

- Hero background images
- Gallery thumbnails in fixed-size grids
- Images in containers with specific aspect ratios
- You have a container with defined dimensions (relative w-full h-full)

#### Mandatory Props for Each Mode

**For `mode="sized"` (ALWAYS include these):**

- `width` and `height` - Explicit dimensions for Next.js
- `className="w-full h-auto"` - Responsive scaling
- `sizeContext` - Appropriate size context

**For `mode="fill"` (ALWAYS include these):**

- Parent container with `relative` positioning
- `sizes` prop for responsive images
- `fillContainer={true}` (default) or proper absolute positioning setup

### Key Props

#### Size Context (Automatic Optimization)

- `sizeContext="icon"`: 24px base, 3x multiplier (72px from Sanity)
- `sizeContext="thumbnail"`: 64px base, 2.5x multiplier (160px from Sanity)
- `sizeContext="logo"`: 200px base, 2x multiplier (400px from Sanity)
- `sizeContext="profile"`: 300px base, 2x multiplier (600px from Sanity)
- `sizeContext="card"`: 200px base, 2x multiplier (400px from Sanity)
- `sizeContext="gallery"`: 300px base, 2x multiplier (600px from Sanity)
- `sizeContext="hero"`: 800px base, 2x multiplier (1600px from Sanity)
- `sizeContext="full"`: 1200px base, 1.5x multiplier (1800px from Sanity)

#### Layout Modes

- `mode="fill"`: Use with containers that have defined dimensions/aspect ratios
- `mode="sized"`: Use with explicit width/height props

#### Fill Mode Options

- `fillContainer={true}` (default): Creates positioned container for fill images (use for logos, contained images)
- `fillContainer={false}`: No container positioning, lets image fill parent directly (use for backgrounds, hero images)

#### Object Fit

- `objectFit="cover"`: Crops image to fill container (default)
- `objectFit="contain"`: Scales image to fit within container

#### Schema Generation

- `generateSchema={true}`: Adds ImageObject structured data
- `schemaContext="blog|article|gallery|profile"`: Context for schema generation

**IMPORTANT: Schema markup is required for all featured/content images for SEO:**

- **Blog images**: Use `generateSchema schemaContext="blog"`
- **Content/article images**: Use `generateSchema schemaContext="article"`
- **Gallery images**: Use `generateSchema schemaContext="gallery"`
- **Profile/user images**: Use `generateSchema schemaContext="profile"`

### Advanced Usage

#### Custom Display Sizes

```typescript
<UnifiedImage
  src={image}
  displaySize={{ width: 400, height: 300 }}
  dpiMultiplier={3}
  mode="fill"
/>
```

#### Responsive Sizes

```typescript
<UnifiedImage
  src={image}
  responsiveSizes={{
    mobile: { width: 400, height: 300 },
    tablet: { width: 600, height: 450 },
    desktop: { width: 800, height: 600 }
  }}
  sizes="(max-width: 768px) 400px, (max-width: 1024px) 600px, 800px"
  mode="fill"
/>
```

### Sanity Image Array Handling

**The UnifiedImage component automatically handles invalid images, but you should still filter arrays:**

```typescript
// ✅ Recommended pattern with UnifiedImage
const validImages = images?.filter(item => item.image?.asset?._ref) || [];

{validImages.map((item, index) => (
  <UnifiedImage
    key={item._key || index}
    src={item.image}
    alt={`Gallery image ${index + 1}`}
    mode="fill"
    sizeContext="gallery"
    // Component handles null/undefined gracefully
  />
))}
```

### Migration from Old Patterns

- **Replace** `urlFor(image).width(X).height(Y).url()` → Use `sizeContext` or `displaySize`
- **Replace** manual `object-cover`/`object-contain` classes → Use `objectFit` prop
- **Replace** custom modal implementations → Use `enableModal={true}`
- **Replace** manual schema generation → Use `generateSchema={true}`
- **Replace** manual alt text fallbacks → Component handles automatically

### Performance Benefits

- **Automatic DPI optimization**: No more blurry images on high-resolution displays
- **Optimal Sanity requests**: Automatically calculates best image dimensions
- **Built-in Next.js optimization**: Proper `sizes`, `priority`, and responsive handling
- **Consistent quality settings**: Optimal quality for each context

### Maintenance Requirements

**CRITICAL: When adding new image components, you MUST:**

1. **Use UnifiedImage instead of Next.js Image** - Never use native `next/image` directly
2. **Add schema markup for content images** - Use `generateSchema={true}` with appropriate `schemaContext`
3. **Choose appropriate size context** - Use predefined contexts (icon, thumbnail, card, gallery, hero, full) for optimal sizing
4. **Provide meaningful alt text** - Essential for accessibility and SEO
5. **Add proper sizes prop** - For responsive images, especially with `mode="fill"`

**Schema markup is required for:**

- Featured images (blog posts, articles)
- Gallery images and collections
- Profile/author images
- Content images within rich text

## SEO Sitemap Maintenance

**CRITICAL: When adding new document types or routes, the sitemap must be updated to maintain SEO.**

### Sitemap Implementation

The XML sitemap is generated dynamically at `/sitemap.xml` using the route handler at `src/app/sitemap.xml/route.ts`. It automatically includes:

- Static pages (home, blog index)
- Dynamic pages from Sanity (`page` document type)
- Blog posts (`blogPost` document type)

### When to Update Sitemap

**YOU MUST update the sitemap when:**

1. **Adding new document types** with public-facing pages
2. **Adding new static routes** (new page components)
3. **Changing URL structure** for existing content types
4. **Adding new index/listing pages**

### How to Update Sitemap

1. **Add query to `src/sanity/lib/queries.ts`** for new document type:

   ```typescript
   export const ALL_NEW_TYPE_QUERY = defineQuery(`*[_type == "newType" && defined(slug.current)]{
     _id,
     _updatedAt,
     title,
     slug
   }`);
   ```

2. **Add action to appropriate file in `src/actions/`**:

   ```typescript
   export async function getAllNewTypeForSitemap() {
     const { data: items } = await sanityFetch({
       query: ALL_NEW_TYPE_QUERY,
     });
     return items;
   }
   ```

3. **Export from `src/actions/index.ts`**

4. **Update `src/app/sitemap.xml/route.ts`**:
   - Import the new action
   - Add to Promise.all() fetch
   - Add URL mapping to dynamicUrls array with appropriate priority and changefreq

### URL Priority Guidelines

- Homepage: 1.0
- Main index pages: 0.9
- Category/listing pages: 0.8
- Individual content pages: 0.6-0.7
- Archive/old content: 0.5

### Change Frequency Guidelines

- Homepage: weekly
- Blog index: daily (if content updates frequently)
- Category pages: weekly
- Individual content: monthly
- Static pages: monthly

**Failure to update the sitemap when adding new content types will result in poor SEO performance and content discovery issues.**

## SEO Implementation Maintenance

**CRITICAL: All SEO features must be maintained when making structural changes to the website.**

### Implemented SEO Features

The website has comprehensive SEO implementation including:

- **XML Sitemap** (`/sitemap.xml`) - Dynamically generated
- **Robots.txt** (`/robots.txt`) - Static configuration
- **Breadcrumbs** - Dynamic navigation aids
- **Canonical URLs** - Prevents duplicate content issues
- **Structured Data (JSON-LD)** - Rich snippets for search engines

### Breadcrumb Maintenance

**Location**: `src/components/ui/Breadcrumb.tsx`

**MUST update breadcrumbs when:**

1. **Adding new page types** or content types
2. **Changing URL structure** or routing patterns
3. **Adding nested navigation** or hierarchical content
4. **Modifying page titles** or display names

**How to update breadcrumbs:**

1. Add new route patterns to the breadcrumb mapping logic
2. Ensure proper parent-child relationships for nested pages
3. Update the breadcrumb generation for new content types
4. Test breadcrumb paths match actual navigation structure

### Canonical URL Maintenance

**Location**: Meta tags in page components and layout files

**MUST update canonical URLs when:**

1. **Changing domain** or subdomain structure
2. **Modifying URL patterns** for existing content types
3. **Adding URL parameters** that should be canonicalized
4. **Implementing URL redirects** or aliases

**How to maintain canonical URLs:**

1. Ensure all pages have proper canonical meta tags
2. Use absolute URLs (including domain)
3. Point to the preferred version of duplicate content
4. Update the canonical URL generation logic for new page types

### Structured Data (JSON-LD) Maintenance

**Location**: Various page components with structured data scripts

**MUST update structured data when:**

1. **Adding new content types** (Article, Event, Organization, etc.)
2. **Changing content structure** or available fields
3. **Adding new schema.org types** for rich snippets
4. **Modifying business information** (contact, address, etc.)

**How to update structured data:**

1. **For new content types**: Add appropriate schema.org JSON-LD scripts
2. **For content changes**: Update existing structured data to match new fields
3. **For business info**: Update Organization schema across all pages
4. **Validation**: Test with Google's Rich Results Test tool

**Common structured data types to maintain:**

- **WebSite** - Homepage search box and site info
- **Organization** - Business details and contact info
- **Article** - Blog posts and content pages
- **Event** - Event listings and details
- **BreadcrumbList** - Navigation breadcrumbs
- **WebPage** - General page information
- **ImageObject** - Featured images with detailed metadata (automatically handled by UnifiedImage component)

### Robots.txt Maintenance

**Location**: `src/app/robots.txt/route.ts`

**MUST update robots.txt when:**

1. **Adding admin/private sections** that should be blocked
2. **Changing sitemap URL** or adding new sitemaps
3. **Adding crawl directives** for specific user agents
4. **Blocking specific URL patterns** or directories

**How to update robots.txt:**

1. Add new Disallow rules for private content
2. Update sitemap references if sitemap location changes
3. Add specific crawl rules for different bots if needed
4. Test that important content is not accidentally blocked

### SEO Testing Checklist

**After making changes that affect SEO, ALWAYS verify:**

1. **Sitemap validation**: Visit `/sitemap.xml` and ensure new content appears
2. **Robots.txt check**: Visit `/robots.txt` and verify directives are correct
3. **Breadcrumb testing**: Navigate through pages and check breadcrumb accuracy
4. **Canonical URL verification**: View page source and confirm canonical tags
5. **Structured data validation**: Use Google's Rich Results Test
6. **Mobile-friendly test**: Ensure responsive design maintains SEO benefits

### SEO Impact Assessment

**Before making these changes, consider SEO impact:**

- **URL structure changes**: May affect existing search rankings
- **Content type additions**: Require comprehensive SEO implementation
- **Navigation changes**: Must be reflected in breadcrumbs and structured data
- **Meta tag modifications**: Could affect search result appearance
- **Schema changes**: May break existing structured data

**Always test SEO changes in staging environment before production deployment.**

## Critical CSS Performance Optimization

**CRITICAL: This project uses intentional CSS duplication for performance optimization.**

### Overview

The website implements critical CSS inlining in `src/app/layout.tsx` to improve Core Web Vitals and reduce render-blocking. This creates **intentional duplication** between two files that must be kept in sync.

### Files with Duplicated Styles

**Primary styles:** `src/app/globals.css`
**Critical inline styles:** `src/app/layout.tsx` (in `<style>` tag)

### Maintenance Requirements

**When modifying these style categories, update BOTH files:**

1. **Brand colors** (`--color-brand-primary`, `--color-brand-secondary`, etc.)
2. **Typography** (`text-body-base`, heading sizes, line heights)
3. **Layout positioning** (`scroll-padding-top`, header positioning)
4. **Critical spacing** (margins, padding for above-the-fold content)
5. **Interactive elements** (button styles, hover states)

### Why This Pattern Exists

- **Performance**: Critical styles load immediately, preventing render blocking
- **LCP optimization**: Above-the-fold content renders faster
- **Core Web Vitals**: Reduces Largest Contentful Paint and Cumulative Layout Shift
- **User experience**: Prevents Flash of Unstyled Content (FOUC)

### Warning System

Both files contain prominent warnings with ⚠️ symbols:

- `globals.css` - Warning at the top of the file
- `layout.tsx` - Warning before the inline `<style>` tag

### Best Practices

1. **Always check both files** when making style changes
2. **Test performance impact** after modifications
3. **Keep critical CSS minimal** - only above-the-fold essentials
4. **Update cross-references** if file locations change
5. **Document new duplications** if adding critical styles

### Alternative Approaches Considered

- **CSS-in-JS critical extraction**: More complex, harder to maintain
- **Build-time critical CSS tools**: Additional build complexity
- **No critical CSS**: Worse Core Web Vitals scores

**The current approach prioritizes maintainability while achieving performance goals.**

## Body Scroll Lock Management

**CRITICAL: Prevent page jumping when opening/closing modals, navigation, and overlays.**

### The Problem

The website uses `useBodyScrollLock` hook in multiple components to prevent background scrolling when overlays are open. However, when multiple components use this hook simultaneously, it can cause page jumping issues due to scroll position conflicts.

### Components Using Body Scroll Lock

These components currently use the `useBodyScrollLock` hook:

- **VerticalNav** (`src/components/Header/VerticalNav/VerticalNav.tsx`)
- **Modal** (`src/components/UI/Modal.tsx`)
- **LoadingOverlay** (`src/components/UI/LoadingOverlay.tsx`)

### Root Cause of Page Jumping

When multiple components lock body scroll simultaneously:

1. **First component** (e.g., Modal) captures original scroll position Y and applies CSS lock
2. **Second component** (e.g., VerticalNav) captures scroll position (now 0 due to fixed positioning) and tries to apply lock again
3. **Components close in different order** than they opened
4. **Wrong scroll position gets restored**, causing the page to jump

### The Reference Counting Solution

The `useBodyScrollLock` hook (`src/hooks/useBodyScrollLock.ts`) now implements reference counting:

```typescript
// Global state tracks multiple simultaneous locks
let lockCount = 0;
let originalScrollY = 0;
let isCurrentlyLocked = false;

// Only the FIRST lock captures scroll position
// Only the LAST unlock restores scroll position
```

### Critical Implementation Rules

**✅ DO:**

- Use `useBodyScrollLock(isOpen)` for any component that needs to prevent background scrolling
- Trust the hook to handle multiple simultaneous locks correctly
- Keep the hook implementation centralized in `src/hooks/useBodyScrollLock.ts`

**❌ NEVER:**

- Create custom scroll lock implementations for individual components
- Directly manipulate `document.body.style` for scroll prevention
- Use multiple different scroll lock libraries or approaches
- Remove the reference counting logic from the hook

### Why This Issue Keeps Recurring

1. **Multiple components need scroll lock** - Modal, Navigation, LoadingOverlay
2. **Hook appears to work in isolation** - Testing single components doesn't reveal the conflict
3. **Edge case combinations** - Users opening multiple overlays simultaneously
4. **Previous fixes were component-specific** - Didn't address the multi-component conflict

### Warning Signs of Regression

If users report page jumping when:

- Opening vertical navigation while a modal is open
- Closing modals after using navigation
- Loading overlays appearing during navigation
- Any combination of overlays being used together

**IMMEDIATELY check if:**

1. New components are using custom scroll lock instead of `useBodyScrollLock`
2. The reference counting logic has been removed from the hook
3. Multiple instances of scroll lock management exist

### Debugging Steps

If page jumping returns:

1. **Check hook usage**: `grep -r "useBodyScrollLock" src/`
2. **Verify single implementation**: Ensure only one scroll lock hook exists
3. **Test component combinations**: Open Modal → Open VerticalNav → Close in various orders
4. **Console log the lock count**: Add temporary logging to the hook to track reference counting

### Prevention Checklist

Before adding new overlay/modal components:

- [ ] Use `useBodyScrollLock(isOpen)` for scroll prevention
- [ ] Never implement custom scroll lock solutions
- [ ] Test with existing overlays (Modal, VerticalNav, LoadingOverlay)
- [ ] Verify no page jumping occurs when opening/closing in various combinations
- [ ] Check that only one body scroll lock implementation exists in the codebase

**This issue has been fixed multiple times. The solution is reference counting in the hook. Do not create alternative scroll lock implementations.**

## Anchor Link Navigation and Scroll Lock System

**CRITICAL: Understanding the complex interaction between anchor links, loading states, and scroll locks.**

### The Problem

The website has a sophisticated interaction between multiple systems that can cause anchor link failures and page jumping:

1. **Loading States**: `LoadingOverlay` appears during page navigation with scroll lock
2. **Navigation Menu**: `VerticalNav` uses scroll lock when open
3. **Anchor Links**: `NavigationScroll` attempts to scroll to hash fragments
4. **Scroll Restoration**: Multiple scroll locks can conflict and cause position jumping

### Root Cause of Issues

**Anchor Links Failing (especially in local development):**

- `LoadingOverlay` uses `useBodyScrollLock` during page loading
- When loading finishes, scroll restoration happens AFTER `NavigationScroll` attempts anchor navigation
- This causes anchor scrolling to be overridden, leaving user at top of page

**Page Jumping When Opening/Closing Navigation:**

- When scroll locks are applied/removed, scrollbar appearance changes cause layout shifts
- Multiple components using scroll lock simultaneously can restore wrong scroll positions
- Body positioning changes without scrollbar width compensation cause visual jumps

### Current Implementation (Fixed)

#### 1. Enhanced Scroll Lock System (`src/hooks/useBodyScrollLock.ts`)

**Features:**

- **Reference counting**: Tracks multiple simultaneous scroll locks
- **Scrollbar compensation**: Prevents layout shift when scrollbar disappears
- **Event system**: Notifies when all scroll locks are released
- **Position restoration**: Only restores scroll position when ALL locks are released

**Key Implementation Details:**

```typescript
// Global state prevents conflicts
let lockCount = 0;
let originalScrollY = 0;
let isCurrentlyLocked = false;

// Scrollbar width compensation prevents jumping
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.body.style.paddingRight = `${scrollbarWidth}px`;

// Custom event notifies when safe to scroll
window.dispatchEvent(new CustomEvent(SCROLL_UNLOCK_EVENT));
```

#### 2. Anchor Link Navigation (`src/components/NavigationScroll.tsx`)

**Features:**

- **Dual waiting system**: Waits for both page readiness AND scroll lock release
- **Event-driven scrolling**: Uses custom events to know when scroll restoration is complete
- **Pending scroll tracking**: Maintains intended scroll target until conditions are met
- **Fallback mechanisms**: Multiple strategies to ensure anchor scrolling succeeds

**Key Implementation Details:**

```typescript
// Waits for scroll locks before attempting navigation
const waitForScrollUnlockAndScroll = () => {
  if (scrollLockStatus.isAnyScrollLocked()) {
    // Wait for all locks to be released
    const cleanup = scrollLockStatus.onScrollUnlocked(() => {
      setTimeout(attemptScroll, 50); // Small delay ensures restoration is complete
    });
    return cleanup;
  } else {
    attemptScroll(); // Safe to scroll immediately
  }
};
```

#### 3. Component Integration

**Components using scroll lock:**

- `LoadingOverlay` - During page loading
- `VerticalNav` - When navigation menu is open
- `Modal` - When modals are displayed

**All components use the same `useBodyScrollLock` hook to ensure proper coordination.**

### Troubleshooting Guide

#### Anchor Links Not Working

**Symptoms:** Links with `#section` work on production but fail locally, user ends up at top of page
**Likely Causes:**

1. Loading overlay scroll lock is interfering with anchor navigation
2. Page content not ready when scroll attempt occurs
3. Target element not yet rendered in DOM

**Debugging Steps:**

1. Check if issue only occurs with loading state
2. Verify `isPageReady` is being set correctly
3. Confirm target element exists when scroll attempts
4. Look for console errors in `NavigationScroll` component

#### Page Jumping When Using Navigation

**Symptoms:** Content shifts left/right when opening/closing vertical nav
**Likely Causes:**

1. Scrollbar width not being compensated
2. Multiple scroll locks conflicting
3. Custom scroll lock implementation bypassing the reference counting system

**Debugging Steps:**

1. Check if multiple components are using different scroll lock methods
2. Verify `paddingRight` compensation is being applied
3. Test with single vs multiple overlays open
4. Ensure only `useBodyScrollLock` hook is used (no custom implementations)

#### Loading State Conflicts

**Symptoms:** Anchor links work sometimes but not others, inconsistent behavior
**Likely Causes:**

1. Race condition between loading finish and scroll attempt
2. `setPageReady` not being called correctly
3. Scroll unlock event not firing

**Debugging Steps:**

1. Add logging to `NavigationScroll` to track when scroll attempts occur
2. Verify `PageReadyTrigger` is properly detecting content readiness
3. Check timing of `LoadingOverlay` hide and scroll unlock events

### Prevention Guidelines

#### When Adding New Overlays/Modals

**✅ DO:**

- Use `useBodyScrollLock(isOpen)` for scroll prevention
- Test with existing overlays (navigation + new component simultaneously)
- Verify no layout shifting when opening/closing
- Ensure anchor links work with new component open

**❌ NEVER:**

- Create custom scroll lock implementations
- Directly manipulate `document.body.style` for scroll prevention
- Use multiple different scroll lock libraries
- Bypass the reference counting system

#### When Modifying Navigation/Loading Logic

**✅ DO:**

- Maintain the dual-waiting system (page ready + scroll unlock)
- Use the event-driven approach for coordination
- Test anchor links in local development environment
- Verify smooth navigation menu interactions

**❌ NEVER:**

- Remove the scroll unlock event system
- Attempt anchor navigation before page/scroll readiness
- Create competing scroll restoration logic

### Code Locations

- **Scroll lock hook**: `src/hooks/useBodyScrollLock.ts`
- **Anchor navigation**: `src/components/NavigationScroll.tsx`
- **Loading overlay**: `src/components/UI/LoadingOverlay.tsx`
- **Vertical navigation**: `src/components/Header/VerticalNav/VerticalNav.tsx`
- **Page ready detection**: `src/components/PageReadyTrigger.tsx`
- **Page load context**: `src/contexts/PageLoadContext.tsx`

**IMPORTANT: These systems work together as a coordinated whole. Modifying one component without understanding the others can reintroduce the issues this solution was designed to fix.**

## React Component Template

### Arrow Function Components (rafce pattern)

**IMPORTANT: Always use arrow function syntax for React components following the `rafce` pattern:**

```tsx
import React from 'react'

const ComponentName = () => {
  return (
    <div>ComponentName</div>
  )
}

export default ComponentName
```

**Key requirements:**

- Use arrow function syntax `const ComponentName = () => {}`
- Use `export default` at the bottom of component files
- Import React at the top: `import React from 'react'`
- Use this pattern for all new `.tsx` component files

## General Development Guidelines

- Follow existing code patterns and conventions
- Ensure proper TypeScript types are maintained
- Test changes thoroughly before committing
- Use existing utility functions and components where possible

### DRY Principles

Keep code DRY (Don't Repeat Yourself) where it makes sense:

- **Extract shared logic** into reusable utility functions or custom hooks when the same logic appears in multiple places
- **Create shared components** for UI patterns that repeat across the codebase
- **Use constants and configuration objects** instead of duplicating magic strings or values
- **Don't force DRY prematurely** — if two pieces of code look similar but serve different purposes or are likely to diverge, it's fine to keep them separate. Premature abstraction is worse than a little duplication

### Component File Size and Decomposition

Break down large `.tsx` files into smaller, focused components to keep files readable and maintainable:

- **Extract sub-components** when a component file grows beyond a manageable size or when a section of JSX has clear standalone responsibility
- **Co-locate related components** by placing extracted sub-components in the same directory (e.g., `ComponentName/ComponentName.tsx` with helpers alongside it)
- **Keep each component focused** on a single responsibility — if a component handles rendering, state management, and data transformation, consider splitting those concerns
- **Use the existing patterns** in the codebase as a guide (e.g., `Header/`, `Footer/`, `Forms/` directories that group related components together)

### Minimising `'use client'` Usage

**IMPORTANT: This is a Next.js App Router project — components are Server Components by default. Only add `'use client'` when absolutely necessary, and push it as far down the component tree as possible.**

Server Components can fetch data, access backend resources directly, and keep JavaScript out of the client bundle. Adding `'use client'` to a file turns that component **and everything it imports** into client-side code, losing all those benefits.

**When `'use client'` is required:**

- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
- Browser-only APIs (`window`, `document`, `localStorage`, etc.)
- Third-party libraries that use any of the above

**When `'use client'` is NOT needed:**

- Components that only receive props and render JSX
- Components that only call server actions or fetch data
- Components that only use server-safe utilities

**Strategy — extract the interactive part into a sub-component:**

Rather than making an entire component a client component, extract only the interactive piece into a small client sub-component and keep the parent as a Server Component.

```tsx
// ❌ WRONG - Entire component is now client-side just because of one click handler
'use client';

const ArticlePage = ({ article }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article>
      <h1>{article.title}</h1>
      <PortableText value={article.content} />     {/* Large static content now in client bundle */}
      <button onClick={() => setLiked(!liked)}>Like</button>
    </article>
  );
};
```

```tsx
// ✅ CORRECT - Only the interactive button is a client component
// LikeButton.tsx
'use client';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
};

// ArticlePage.tsx (Server Component - no 'use client')
const ArticlePage = ({ article }) => {
  return (
    <article>
      <h1>{article.title}</h1>
      <PortableText value={article.content} />
      <LikeButton />
    </article>
  );
};
```

**Practical guidelines:**

- **Before adding `'use client'`**, check if the interactive part can be extracted into a smaller sub-component
- **Co-locate client sub-components** alongside the parent (e.g., `ComponentName/LikeButton.tsx`)
- **Page files (`page.tsx`) should never need `'use client'`** — they are server entry points that fetch data and compose components
- **Layout files (`layout.tsx`) should never need `'use client'`** — same reasoning as pages
- **It's fine for leaf components to be client components** — small interactive widgets, form inputs, toggles, modals, etc. are natural client boundaries
- **`error.tsx` and `loading.tsx` are exceptions** — Next.js requires `error.tsx` to be a Client Component

### TypeScript Error Checking

**IMPORTANT: Always run `npm run typecheck` after making code changes** to ensure TypeScript errors are caught early. This script performs type checking without compilation and is faster than a full build.

**When to run typecheck:**

- After modifying component interfaces or props
- After changing import/export statements
- After adding or removing dependencies
- After schema changes that affect types
- After any code changes (unless trivial changes like comments)

**Skip only for:**

- Adding comments or documentation
- Modifying CSS/styling without type changes
- Non-code file changes (README, configs without type impact)

```bash
npm run typecheck
```
