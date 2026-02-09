# Template Updates Guide

This document contains instructions for updating a project that was created from this template. Each section covers a different area that may need changing to bring the project in line with the latest template or to customise it for a new client.

---

## Colour Scheme

The template ships with a generic slate/blue colour scheme. When creating a new project, update the colours to match the client's brand.

### Current Default Colour Scheme

| Variable | Hex | Description |
|----------|-----|-------------|
| `--color-brand-primary` | `#3b82f6` | Primary brand colour (blue-500) |
| `--color-brand-secondary` | `#60a5fa` | Secondary brand colour (blue-400) |
| `--color-brand-dark` | `#1e293b` | Dark background (slate-800) |
| `--color-brand-dark-light` | `#334155` | Lighter dark background (slate-700) |
| `--color-brand-white` | `#ffffff` | White |
| `--color-brand-offwhite` | `#f1f5f9` | Off-white for form inputs etc. (slate-100) |
| Dark gradient start | `#475569` | Gradient start (slate-600) |
| Dark gradient end | `#0f172a` | Gradient end (slate-900) |
| Metal gradient end | `#94a3b8` | Metal gradient end (slate-400) |

### Architecture

The colour system works as follows:
- **5 definition files** contain the actual hex values (listed below)
- **~45+ component files** reference colours via Tailwind classes like `text-brand-primary`, `bg-brand-dark`, etc.
- Component files automatically pick up new colours when the CSS variables change - no component edits needed

The body background uses `bg-brand-dark-light` (the lighter dark shade), while the header and footer use the darker `bg-brand-dark` to create visual contrast. The header fades in with scroll-based opacity via inline rgba.

### Files to Update (5 files total)

#### 1. `src/app/globals.css` (Master colour definitions)

This is the **primary source of truth** for all colours. Update the `@theme` block:

```css
@theme {
  --color-brand-primary: #YOUR_PRIMARY;
  --color-brand-secondary: #YOUR_SECONDARY;
  --color-brand-dark: #YOUR_DARK_BG;
  --color-brand-dark-light: #YOUR_LIGHTER_DARK_BG;
  --color-brand-white: #ffffff;
  --color-brand-offwhite: #YOUR_OFFWHITE;

  /* Dark gradient color stops (for use with opacity) */
  --color-dark-gradient-start: R, G, B; /* Your gradient start in RGB */
  --color-dark-gradient-end: R, G, B; /* Your gradient end in RGB */

  /* Update all gradient definitions with matching colours */
  --background-image-brand-gradient-dark-linear: linear-gradient(90deg, #GRADIENT_START 0%, #GRADIENT_END 100%);
  --background-image-brand-gradient-dark-diag: linear-gradient(135deg, #GRADIENT_START 0%, #GRADIENT_END 100%);
  --background-image-brand-gradient-dark-radial: radial-gradient(circle, #GRADIENT_START 0%, #GRADIENT_END 100%);
  /* brand-gradient-primary uses the CSS variables automatically */
  --background-image-brand-gradient-metal: linear-gradient(135deg, #ffffff 0%, #YOUR_METAL_END 100%);
  /* brand-gradient-firey uses the CSS variables automatically */
}
```

#### 2. `src/app/layout.tsx` (Inline critical CSS + header background)

Update the inline `<style>` tag that duplicates the brand colours for performance:

```tsx
/* Essential brand colors for immediate render */
:root {
  --color-brand-primary: #YOUR_PRIMARY;
  --color-brand-secondary: #YOUR_SECONDARY;
}
```

Also update the header background colour in `src/components/Header/Header.tsx`. The header uses an inline style with rgba for scroll-based opacity:

```tsx
backgroundColor: `rgba(R, G, B, ${headerOpacity})`,
```

Replace `R, G, B` with the RGB values of your dark background colour.

#### 3. `src/app/manifest.ts` (PWA theme colours)

Update the hardcoded constants:

```typescript
const THEME_COLOR = '#YOUR_PRIMARY'; // --color-brand-primary
const BACKGROUND_COLOR = '#YOUR_DARK_BG'; // --color-brand-dark
```

#### 4. `src/sanity/editor-styles.css` (Sanity Studio editor)

Update the hardcoded hex values for blockquote borders and link colours:

- **Line ~65**: Blockquote border colour (should match primary)
- **Line ~98**: Link colour (should match secondary)
- **Line ~103**: Link hover colour (should match primary)

#### 5. `src/lib/email-templates/emailStyles.ts` (Email templates)

Update the brand colour constants in `EMAIL_COLORS`:

```typescript
// Brand colors
brandGold: '#YOUR_PRIMARY',       // Primary brand colour
brandOrange: '#YOUR_SECONDARY',   // Secondary brand colour (links, accents)

// Border and divider colors
infoBoxBorder: '#YOUR_PRIMARY',   // Primary brand border for info boxes
footerDivider: 'rgba(R, G, B, 0.3)', // Semi-transparent primary brand divider

// Link colors
linkColor: '#YOUR_SECONDARY',     // Secondary brand for clickable links
```

Note: The property names `brandGold` and `brandOrange` are legacy names. They can be renamed if desired, but it requires updating all references in the email template files.

### Colour Selection Tips

When choosing your brand colours, keep these guidelines in mind:

- **Primary colour**: Used for CTAs, accents, highlights, active states. Should have good contrast against both dark and light backgrounds.
- **Secondary colour**: Used for links, hover states, subtle accents. Typically a lighter or complementary shade of the primary.
- **Dark colours**: The site uses a dark theme by default. The dark colours form the main background. Choose colours with enough contrast between `dark` and `dark-light`.
- **Off-white**: Used for form input backgrounds and light accent areas. Should be a very light tint, not pure white.
- **Gradient stops**: The dark gradients should blend naturally between your dark background tones.

#### WCAG Contrast Requirements

- Normal text: 4.5:1 contrast ratio minimum
- Large text (18px+ or 14px+ bold): 3:1 contrast ratio minimum
- Test your colour combinations at https://webaim.org/resources/contrastchecker/

---

## Remove OPTS Button and Dev Colour/Hero Switcher

The template ships with a temporary development feature: an "OPTS" button in the header that opens a modal for switching colour schemes and hero styles at runtime. This should be removed when creating a new project.

### What to Remove

#### 1. Delete these files

- `src/components/UI/ColorSwitchModal.tsx` — the options modal component
- `src/contexts/ColorContext.tsx` — colour scheme switching context and provider
- `src/contexts/HeroStyleContext.tsx` — hero style override context and provider

#### 2. `src/components/Header/Header.tsx`

Remove the following:

- The `ColorSwitchModal` import
- The `isColorModalOpen` state variable
- The OPTS `<button>` element (marked with `TEMPORARY_DEV` comment)
- The `<ColorSwitchModal>` render at the bottom of the component

#### 3. `src/components/Layout/BaseLayout.tsx`

Remove the following:

- The `ColorProvider` import from `@/contexts/ColorContext`
- The `HeroStyleProvider` import from `@/contexts/HeroStyleContext`
- The `<ColorProvider>` and `<HeroStyleProvider>` wrapper elements in the JSX (keep the children they wrap)

#### 4. `src/components/HomeHero/Hero.tsx`

Remove the following:

- The `useHeroStyle` import from `@/contexts/HeroStyleContext`
- The `useHeroStyle()` hook call (`const { currentStyle: overrideStyle, isOverrideActive } = useHeroStyle()`)

Then simplify the hero style determination line from:

```typescript
const currentHeroStyle = isOverrideActive ? overrideStyle : (stegaClean(heroStyle) || 'default');
```

To:

```typescript
const currentHeroStyle = stegaClean(heroStyle) || 'default';
```

### Verification

- [ ] The OPTS button no longer appears in the header
- [ ] No console errors related to missing contexts
- [ ] Hero style is determined solely by the Sanity CMS value
- [ ] `npm run typecheck` passes with no new errors

---

## Fix Sanity Type Names After `npm run typegen`

After running `npm run typegen`, the generated type names in `src/sanity/types.ts` use underscored `_RESULT` suffixes (e.g. `PAGE_QUERY_RESULT`), but the codebase may still reference the old camelCase `Result` suffix (e.g. `PAGE_QUERYResult`). All imports and references must match the generated names.

### How to Fix

Run this find-and-replace across all `.ts` and `.tsx` files in `src/` (**excluding** `src/sanity/types.ts` which is auto-generated):

| Old name | New name |
|---|---|
| `CONTACT_CONFIRMATION_EMAIL_QUERYResult` | `CONTACT_CONFIRMATION_EMAIL_QUERY_RESULT` |
| `CONTACT_GENERAL_CONTENT_QUERYResult` | `CONTACT_GENERAL_CONTENT_QUERY_RESULT` |
| `LEGAL_PAGES_VISIBILITY_QUERYResult` | `LEGAL_PAGES_VISIBILITY_QUERY_RESULT` |
| `CONTACT_FORM_SETTINGS_QUERYResult` | `CONTACT_FORM_SETTINGS_QUERY_RESULT` |
| `BUSINESS_CONTACT_INFO_QUERYResult` | `BUSINESS_CONTACT_INFO_QUERY_RESULT` |
| `TERMS_AND_CONDITIONS_QUERYResult` | `TERMS_AND_CONDITIONS_QUERY_RESULT` |
| `HOME_PAGE_SECTIONS_QUERYResult` | `HOME_PAGE_SECTIONS_QUERY_RESULT` |
| `HOME_PAGE_HERO_QUERYResult` | `HOME_PAGE_HERO_QUERY_RESULT` |
| `PRIVACY_POLICY_QUERYResult` | `PRIVACY_POLICY_QUERY_RESULT` |
| `SEO_META_DATA_QUERYResult` | `SEO_META_DATA_QUERY_RESULT` |
| `COMPANY_LINKS_QUERYResult` | `COMPANY_LINKS_QUERY_RESULT` |
| `ALL_PAGES_QUERYResult` | `ALL_PAGES_QUERY_RESULT` |
| `FAQ_PAGE_QUERYResult` | `FAQ_PAGE_QUERY_RESULT` |
| `HEADER_QUERYResult` | `HEADER_QUERY_RESULT` |
| `FOOTER_QUERYResult` | `FOOTER_QUERY_RESULT` |
| `PAGE_QUERYResult` | `PAGE_QUERY_RESULT` |

**Important:** Apply longer names first to avoid partial matches (e.g. `HOME_PAGE_HERO_QUERYResult` before `PAGE_QUERYResult`).

### Verification

- [ ] `npm run typecheck` passes with no errors

---

## Site-Wide Horizontal Padding

Horizontal padding (edge-of-screen to content) is managed via a single constant in `src/utils/spacingConstants.ts`:

```typescript
export const sitePaddingX = 'px-6 sm:px-20';
```

This constant is imported and used by:

| Component | File |
|---|---|
| **Header** | `src/components/Header/Header.tsx` |
| **Footer** | `src/components/Footer/Footer.tsx` |
| **SectionContainer** | `src/components/Layout/SectionContainer.tsx` (via combined `sectionContainerPadding`) |
| **Container** | `src/components/Layout/Container.tsx` |
| **PageHero** | `src/components/Page/PageHero.tsx` |

To change the site-wide horizontal padding, update `sitePaddingX` in `spacingConstants.ts` and all components will pick up the new value automatically. Do not hardcode `px-*` values in these components.

---

## Verification Checklist

After making changes from the sections above:

- [ ] Run `npm run dev` and visually inspect the site
- [ ] Check the header, footer, CTAs, and links use the new colours
- [ ] Check form inputs use the new off-white
- [ ] Check gradients look correct (dark gradients, primary gradient)
- [ ] Check the Sanity Studio editor styles (blockquotes, links)
- [ ] Check email templates render with correct colours (send a test contact form submission)
- [ ] Verify sufficient colour contrast for accessibility
- [ ] Verify horizontal padding is consistent across header, body content, and footer
