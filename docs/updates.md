# Template Updates

Instructions for applying updates to projects already created from this template.

---

## Logo from Sanity CMS (replaces hardcoded static logo)

**Problem:** The template originally hardcoded a logo path (`/images/logos/logo.png`) in Header, Footer, VerticalNav, and the contact email template. This required placing a static file in `public/images/logos/` and prevented CMS management of the logo.

**Solution:** The logo is now managed via Sanity CMS under **Site Management > Business & Contact Info**. It uses the `UnifiedImage` component for rendering. If no logo is uploaded, nothing renders (valid for text-only branding).

### Steps to implement

#### 1. Schema: Add `logo` field to `businessContactInfoType.ts`

**File:** `src/sanity/schemaTypes/businessContactInfoType.ts`

Add this field **before** the existing `brandTextImage` field:

```typescript
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
```

#### 2. Query: Add `logo` to GROQ query

**File:** `src/sanity/lib/queries.ts`

In `BUSINESS_CONTACT_INFO_QUERY`, add the `logo` projection before `brandTextImage`:

```groq
logo{
  asset,
  alt,
  hotspot,
  crop
},
```

#### 3. Regenerate types

```bash
npm run typegen
```

#### 4. Helper: Add `getLogo()` to `organizationInfo.ts`

**File:** `src/lib/organizationInfo.ts`

Add this helper function (before the `getBrandTextImage` helper):

```typescript
/**
 * Get logo from businessContactInfo.
 * Returns the image data if set, otherwise null.
 * Used in Header/Footer to display the business logo.
 * If null, no logo is rendered (valid scenario for text-only branding).
 */
export function getLogo(
  businessContactInfo?: BUSINESS_CONTACT_INFO_QUERYResult | null,
) {
  return businessContactInfo?.logo || null;
}
```

#### 5. Update Header.tsx

**File:** `src/components/Header/Header.tsx`

1. Add `getLogo` to the import from `@/lib/organizationInfo`
2. Get the logo: `const logo = getLogo(businessContactInfo);`
3. Replace the hardcoded `<UnifiedImage src='/images/logos/logo.png' ... />` with:

```tsx
{logo?.asset && (
  <UnifiedImage
    src={logo}
    alt={logo.alt || `${organizationName} Logo`}
    mode='sized'
    width={80}
    height={50}
    sizeContext='logo'
    objectFit='contain'
    className='w-14 md:w-20 h-auto'
    sizes='(max-width: 768px) 56px, 80px'
    priority
  />
)}
```

#### 6. Update Footer.tsx

**File:** `src/components/Footer/Footer.tsx`

Same pattern as Header:

1. Add `getLogo` to the import from `@/lib/organizationInfo`
2. Get the logo: `const logo = getLogo(businessContactInfo);`
3. Replace the hardcoded `<UnifiedImage src='/images/logos/logo.png' ... />` with the conditional pattern (same as Header but without `priority`)

#### 7. Update VerticalNav.tsx

**File:** `src/components/Header/VerticalNav/VerticalNav.tsx`

Same pattern as Header:

1. Add `getLogo` to the import from `@/lib/organizationInfo`
2. Get the logo: `const logo = getLogo(businessContactInfo);`
3. Replace the hardcoded `<UnifiedImage src='/images/logos/logo.png' ... />` with the conditional pattern (same as Header but without `priority`)

#### 8. Update contact email route

**File:** `src/app/api/contact/route.ts`

1. Add `getLogo` to the import from `@/lib/organizationInfo`
2. Add `import { urlFor } from '@/sanity/lib/image';`
3. Replace the hardcoded logo URL construction:

```typescript
// Before:
const logoUrl = `${baseUrl}/images/logos/logo.png`;

// After:
const logo = getLogo(businessContactInfo);
const logoUrl = logo?.asset ? urlFor(logo).width(160).url() : '';
```

#### 9. Update email template to handle missing logo

**File:** `src/lib/email-templates/contactConfirmationEmail.ts`

1. Make `logoUrl` optional in the interface: `logoUrl?: string;`
2. Wrap the logo `<td>` cell in a conditional:

```typescript
${logoUrl ? `<td align="center" valign="middle" style="padding-right: 12px;">
  <img src="${logoUrl}" alt="${organizationName} Logo" width="80" height="auto" ... />
</td>` : ''}
```

#### 10. Update ContactPageContent.tsx structured data

**File:** `src/components/pages/ContactPageContent.tsx`

1. Add `getLogo` to the import from `@/lib/organizationInfo`
2. Add `import { urlFor } from '@/sanity/lib/image';`
3. Replace the hardcoded publisher logo:

```typescript
// Before:
logo: `${baseUrl}/logo.png`,

// After:
const logo = getLogo(businessContactInfo);
const logoUrl = logo?.asset ? urlFor(logo).width(512).height(512).url() : undefined;
// Then in the publisher object:
...(logoUrl && { logo: logoUrl }),
```

#### 11. Clean up static file (if it exists)

Delete `public/images/logos/logo.png` if it exists — it is no longer needed.

#### 12. Verify

1. Run `npm run typegen` and `npm run typecheck`
2. Open Sanity Studio > Site Management > Business & Contact Info — verify the Logo upload field appears
3. Upload a logo — verify it displays in Header, Footer, and VerticalNav
4. Remove the logo — verify no broken image appears, just no logo rendered
5. Test the contact form email (if configured) — verify logo renders correctly with/without upload
