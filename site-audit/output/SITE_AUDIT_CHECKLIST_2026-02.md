# Comprehensive Site Audit Checklist — Feb 2026

**Site:** Arch Hill Studios (ah-website-staging.vercel.app)
**Stack:** Next.js 16 (App Router) + Sanity CMS + Tailwind CSS v4 + React 19 + Vercel
**Audit Date:** 2026-02-26
**Previous Audit:** 2026-02-16 (`SITE_AUDIT_CHECKLIST.md`)
**Audited Against:** SEO reference checklist, OWASP Top 10, Core Web Vitals, WCAG 2.2 AA

---

## Severity Legend

| Symbol          | Meaning                                                |
| --------------- | ------------------------------------------------------ |
| :red_circle:    | **CRITICAL** — Must fix before production launch       |
| :orange_circle: | **HIGH** — Fix soon after launch / significant impact  |
| :yellow_circle: | **MEDIUM** — Should fix within first month             |
| :white_circle:  | **LOW** — Best practice / nice-to-have                 |
| :green_circle:  | **PASS** — No action needed                            |

---

## SECTION 1: SEO

### 1.1 Search Engine Indexing

- [x] :green_circle: **`noindex, nofollow` staging behaviour correct** — `src/app/layout.tsx:51` conditionally adds `<meta name='robots' content='noindex, nofollow' />` when `NEXT_PUBLIC_ENV !== 'production'`. Confirmed present on staging. Verify `NEXT_PUBLIC_ENV=production` is set in the production Vercel environment.
- [x] :green_circle: **Robots logic is environment-aware** — `shouldHideFromRobots = !isProd || MAINTENANCE_MODE_ENABLED` correctly gates indexing.
- [x] :green_circle: **404 page correctly noindexed** — `src/app/(frontend)/not-found.tsx:18` sets `robots: 'noindex, nofollow'`.

### 1.2 Robots.txt

- [ ] :yellow_circle: **Double slash in sitemap URL** — `src/app/robots.txt/route.ts:16` constructs `${baseUrl}/sitemap.xml` using `process.env.NEXT_PUBLIC_BASE_URL` directly (not via `getBaseUrl()`). If `NEXT_PUBLIC_BASE_URL` is set with a trailing slash (e.g. `https://example.com/`), the result is `https://example.com//sitemap.xml`. Confirmed on staging: `Sitemap: https://ah-website-staging.vercel.app//sitemap.xml`. Fix by importing and using `getBaseUrl()` from `src/lib/metadata.ts`, which already strips trailing slashes.
- [x] :green_circle: **Admin/private paths disallowed** — `/admin/`, `/api/`, `/draft/`, `/studio/`, `/dev-test/` all blocked.

### 1.3 XML Sitemap

- [ ] :yellow_circle: **Double slashes in all sitemap URLs** — Same root cause as robots.txt above: `src/app/sitemap.xml/route.ts:17` uses `process.env.NEXT_PUBLIC_BASE_URL` directly. Results in URLs like `https://ah-website-staging.vercel.app//terms-and-conditions`. This risks canonicalization confusion for crawlers. Fix: use `getBaseUrl()` from `src/lib/metadata.ts` in both `route.ts` files.
- [x] :green_circle: **`/sitemap.xml` returns valid XML** — Includes homepage, legal pages, and dynamic pages.
- [x] :green_circle: **FAQ conditionally included** — Only appears in sitemap when the FAQ document exists in Sanity.
- [x] :green_circle: **Dev-test pages excluded** — Filtered via `startsWith('dev-test')` check.
- [x] :green_circle: **`<lastmod>` present on all entries** — Homepage uses `getHomePageLastModified()`, other pages use `_updatedAt`.
- [x] :green_circle: **ISR cache strategy** — `revalidate = 3600` (1 hour) on the sitemap route.

### 1.4 Canonical Tags

- [x] :green_circle: **Canonical tags present on all pages** — Generated via `generateCanonicalUrl()` in `src/lib/metadata.ts`.
- [x] :green_circle: **Trailing slash stripping** — `getBaseUrl()` removes trailing slashes consistently.
- [x] :green_circle: **HTTPS and absolute URLs** — All canonical tags use full HTTPS base URL.

### 1.5 Meta Descriptions & Titles

- [x] :green_circle: **Dynamic meta descriptions per page** — Generated from CMS content with site-wide fallback.
- [x] :yellow_circle: **Legal pages share generic site description** — Terms & Conditions and Privacy Policy use the default site description. Add page-specific descriptions in Sanity CMS.
- [ ] :white_circle: **About page meta description is very short** — `"The people and space behind the sound"` (44 chars) is below the recommended 120–155 character range. Expand in CMS.

### 1.6 Open Graph & Social Meta

- [x] :green_circle: **OG and Twitter Card tags present on all pages** — Title, description, URL, image (1200x630), type on all pages.
- [ ] :yellow_circle: **OG image alt text malformed** — `src/lib/metadata.ts:77` constructs `ogImageAlt` as `` `${siteTitle} - ${title || siteTagline}` ``. Since `siteTagline` already includes a leading ` | ` (e.g. ` | Auckland Rehearsal & Recording Space`), the result is `"Arch Hill Studios -  | Auckland Rehearsal & Recording Space"` — confirmed on the live staging homepage. Strip the leading ` | ` from `siteTagline` before using it in the alt string.

### 1.7 Structured Data / Schema Markup

- [x] :green_circle: **Organization schema** — Present globally via root layout.
- [x] :green_circle: **MusicVenue / LocalBusiness schema** — Comprehensive: address, geo, hours, price range, service areas, sameAs. `MusicVenue` type now used (HIGH item from previous audit now resolved).
- [x] :green_circle: **WebSite schema** — Present with site name, URL, description.
- [x] :green_circle: **BreadcrumbList schema** — Structured data breadcrumbs generated correctly.
- [x] :green_circle: **FAQPage schema** — Present when FAQ content exists, extracted from page content blocks.
- [x] :green_circle: **Article schema** — Applied to FAQ and legal pages with dates, author, publisher.
- [x] :green_circle: **ImageObject schema** — Generated by `UnifiedImage` component with `generateSchema` prop.
- [ ] :yellow_circle: **Missing `Service` schema** — Individual services (rehearsal, recording, drum tuition, PA hire) have no `Service` structured data. Adding per-service schema would improve SERP visibility for service-specific searches.
- [ ] :white_circle: **Missing `ProfilePage` schema** — The About/founder content could use `ProfilePage` schema to strengthen E-E-A-T signals.
- [ ] :white_circle: **Validate all structured data** — Run Google Rich Results Test against all pages to confirm no errors or warnings.

### 1.8 Local SEO

- [x] :green_circle: **Geographic meta tags** — `geo.region` (NZ-AUK), `geo.placename` (Grey Lynn), `geo.position`, `ICBM` all present.
- [x] :green_circle: **LocalBusiness schema comprehensive** — Address, phone, email, hours, coordinates, service areas, social profiles.
- [ ] :yellow_circle: **No "Areas We Serve" page** — Local SEO benefit of explicit service area content page remains unrealised.
- [ ] :white_circle: **Google Business Profile setup** — Verify GBP is claimed, verified, and 100% complete before public launch.

### 1.9 Image SEO

- [x] :green_circle: **Image block uses CMS alt text** — `src/components/_blocks/Image.tsx:94` now uses `image?.alt || 'Image'`. The fallback `'Image'` is still generic but acceptable as a last resort.
- [x] :green_circle: **CMS schema supports alt text** — Alt field present in image schema with helpful editor description.
- [x] :green_circle: **UnifiedImage handles alt properly** — Cleans with `stegaClean()`, provides fallback text.
- [ ] :white_circle: **Consider making alt text required in Sanity schema** — Enforcing alt text at the CMS level prevents editors from accidentally publishing images without descriptions.

### 1.10 Breadcrumbs

- [ ] :orange_circle: **Visual breadcrumb navigation still disabled** — `src/components/UI/Breadcrumb.tsx:16` still returns `null`. All breadcrumb JSX is commented out. Visual breadcrumbs help both UX and SEO. Re-enable or redesign to fit the site aesthetic.
- [x] :green_circle: **Breadcrumb structured data working** — `BreadcrumbStructuredData` component generates correct JSON-LD on all content pages.

### 1.11 Font Loading

- [x] :green_circle: **Using `next/font/google`** — Inter and Bebas Neue loaded via framework optimisation.
- [x] :green_circle: **`display: 'swap'`** — No FOIT; text visible immediately with fallback font.

### 1.12 Content & E-E-A-T

- [ ] :yellow_circle: **No blog or article content** — No blog document type or content publishing strategy. Regular content publishing builds topical authority for musicians and recording studio searches.
- [ ] :yellow_circle: **Limited internal linking** — No "related content" cross-linking between pages.
- [ ] :white_circle: **Content freshness strategy** — Establish a content calendar (minimum 1 post/month) to maintain crawl frequency signals.

### 1.13 Analytics & Monitoring

- [ ] :orange_circle: **No analytics implementation** — Confirmed via live site inspection: no GA4, Vercel Analytics, Microsoft Clarity, or equivalent. Without analytics, there is no data to support decisions, track conversions, or diagnose drop-off.
- [ ] :orange_circle: **No Google Search Console setup** — No verification meta tag or DNS verification detected. GSC must be set up to monitor indexing, search performance, and Core Web Vitals.
- [ ] :yellow_circle: **No Core Web Vitals monitoring** — Add `@vercel/analytics` + `web-vitals` or Vercel Speed Insights for ongoing performance tracking in production.

### 1.14 Favicons & Manifest

- [x] :green_circle: **Favicon set complete** — 32x32, 16x16, 180x180 (Apple) served via Sanity CMS with static fallback.
- [x] :green_circle: **Web app manifest** — Valid at `/manifest.webmanifest` with correct metadata, theme colours, and icon references.

### 1.15 Emerging SEO (2025–2026)

- [ ] :white_circle: **AI Overview optimisation** — Structure FAQ and service content with clear, direct answers in first paragraphs to increase citation probability in Google's AI Overviews. FAQPage schema and concise H2/H3 headings support this.
- [ ] :white_circle: **AVIF image format** — `next.config.ts:56` now has `formats: ['image/avif', 'image/webp']`. Confirm AVIF is being served via Vercel's image CDN (check Network tab in browser DevTools). ✅ **Code is correct** — AVIF is configured.
- [ ] :white_circle: **Speculation Rules API** — Consider adding prefetch hints for likely navigation paths (e.g., services → contact) for faster perceived navigation in Chrome 109+.

---

## SECTION 2: SECURITY

### 2.1 Security Headers

- [x] :green_circle: **Content-Security-Policy implemented** — CSP added in `next.config.ts` covering frontend routes. Studio routes get shared headers only (acceptable tradeoff due to Sanity Studio's complexity).
- [x] :green_circle: **X-Content-Type-Options: nosniff** — Present on all routes.
- [x] :green_circle: **Referrer-Policy: strict-origin-when-cross-origin** — Present on all routes.
- [x] :green_circle: **Permissions-Policy** — Camera, microphone, geolocation all disabled.
- [x] :green_circle: **Cross-Origin-Opener-Policy: same-origin** — Present on all routes.
- [x] :green_circle: **X-Frame-Options replaced by CSP `frame-ancestors`** — `frame-ancestors 'self' https://*.sanity.studio` correctly allows Presentation Tool embedding while blocking external framing. This is the modern, preferred approach.
- [x] :green_circle: **`X-Powered-By` header suppressed** — `poweredByHeader: false` in `next.config.ts:53`.
- [x] :green_circle: **HSTS present** — Provided by Vercel platform.
- [ ] :yellow_circle: **CSP uses `'unsafe-inline'` for `script-src`** — The comments in `next.config.ts` acknowledge this is a known limitation of Next.js App Router's inline script injection for hydration. This is a widely accepted tradeoff, but a nonce-based CSP via middleware would provide significantly stronger XSS protection. Track as technical debt. Implementation guide: Next.js docs on [CSP with nonces](https://nextjs.org/docs/app/guides/content-security-policy).

### 2.2 API Route Security

- [x] :green_circle: **Rate limiting enabled in production** — `ENABLE_RATE_LIMITING = process.env.NEXT_PUBLIC_ENV === 'production'` at `src/app/api/contact/route.ts:28`. Now automatically enabled in production.
- [x] :green_circle: **Error details hidden in production** — `details` field only returned in `NEXT_PUBLIC_ENV !== 'production'` environments (`route.ts:298`).
- [x] :green_circle: **Webhook signature verification** — `src/app/api/revalidate/route.ts` uses `parseBody` with `SANITY_WEBHOOK_SECRET`.
- [x] :green_circle: **Input validation and sanitization** — Email regex, required fields, honeypot, HTML strip, JS URI scheme stripping. Sanitization is meaningfully improved over the previous audit.
- [ ] :yellow_circle: **In-memory rate limiting not serverless-safe** — `route.ts:34` uses a `Map` that resets on every cold start of the serverless function. Under traffic spikes or after deployment, rate limits effectively reset. Migrate to [Upstash Redis](https://upstash.com/) or Vercel KV for persistent rate limiting.
- [ ] :yellow_circle: **No CSRF protection on contact form** — POST endpoint has no CSRF token. The honeypot deters bots but not forged cross-origin submissions. Consider adding a `SameSite=Strict` cookie-based CSRF check or an API-backed CSRF token.
- [ ] :white_circle: **`any` type cast in contact API route** — `src/app/api/contact/route.ts:203` uses `(adminEmailResult.error as any).statusCode`. This ESLint violation (`no-explicit-any`) should use a typed interface or `unknown` with type narrowing.

### 2.3 Authentication & Draft Mode

- [x] :green_circle: **Draft mode properly gated** — `defineEnableDraftMode` with token authentication.
- [x] :green_circle: **Sanity tokens server-side only** — Not exposed in client bundle.
- [x] :green_circle: **No hardcoded secrets** — All sensitive values via environment variables.
- [x] :green_circle: **`.env` files not committed** — `.gitignore` properly excludes env files.

### 2.4 Environment Variables

- [x] :green_circle: **`NEXT_PUBLIC_*` used appropriately** — Only non-sensitive values are prefixed.
- [ ] :white_circle: **`NEXT_PUBLIC_CONTACT_EMAIL` env var** — Not present in the current codebase (contact email is now `RESEND_CONTACT_EMAIL` server-only). Confirmed resolved.

### 2.5 Dependency Security

- [ ] :orange_circle: **Run `npm audit` and address findings** — Dependencies include `next@^16.1.6`, `sanity@^5.8.1`, `resend@^6.9.1`, and `react@19.2.4`. No audit has been documented. Run `npm audit --audit-level=high` before production launch and address all critical/high severity vulnerabilities.
- [x] :green_circle: **Dependencies are current** — `next` 16.x (latest major), `react` 19.x (latest), `tailwindcss` 4.x (latest). Stack is modern with no obviously outdated major versions.

### 2.6 XSS Prevention

- [x] :green_circle: **No `dangerouslySetInnerHTML` with user input** — Only used for trusted content: inline critical CSS and JSON-LD structured data.
- [x] :green_circle: **React's default escaping** — JSX automatically escapes interpolated values.
- [x] :green_circle: **Contact form inputs sanitized** — HTML tags, JS URI schemes, and null bytes stripped before email sending.

---

## SECTION 3: PERFORMANCE

### 3.1 Core Web Vitals

**Current thresholds (unchanged 2024–2026):**
- LCP (Largest Contentful Paint): < 2.5s (Good)
- INP (Interaction to Next Paint): < 200ms (Good) — replaced FID in March 2024
- CLS (Cumulative Layout Shift): < 0.1 (Good)

- [ ] :yellow_circle: **No CWV measurement in place** — Without Vercel Analytics or web-vitals library, there is no real-user monitoring data. Add to `src/app/(frontend)/layout.tsx` or install `@vercel/analytics`.
- [x] :green_circle: **Fonts use `display: swap`** — No FOIT; minimises CLS from font loading.
- [x] :green_circle: **Critical CSS inlined** — `src/app/layout.tsx:66-83` inlines essential brand colours and header height. Reduces LCP on first paint.
- [x] :green_circle: **Hero images use `priority` loading** — First hero image in `HeroImages.tsx:97` has `priority={index === 0}`.
- [x] :green_circle: **Off-screen carousels pause** — Both `HeroImages.tsx` and `ServiceImageSlideshow.tsx` now use `useIsVisible` hook to pause `setInterval` when scrolled off-screen. Resolves previous MEDIUM issues.

### 3.2 Client-Side JavaScript

- [x] :green_circle: **Server-first architecture** — All pages and layouts are Server Components by default.
- [x] :green_circle: **Sanity Studio dynamically imported** — `src/app/studio/[[...tool]]/page.tsx` uses `dynamic()` with `ssr: false`.
- [x] :green_circle: **Console statements removed in production** — `next.config.ts:67` has `removeConsole` for production builds.
- [ ] :yellow_circle: **HeroVideo has excessive `console.log` calls** — `src/components/HomeHero/HeroVideo.tsx` contains 7 `console.log` and `console.error` calls for debugging video loading. While these are stripped by `removeConsole` in production builds, they clutter development output significantly. Remove or replace with a conditional debug flag.
- [ ] :yellow_circle: **No bundle analyzer configured** — `@next/bundle-analyzer` is not in the project. Without visibility into the client bundle, large dependencies (react-icons icon sets, Sanity SDK chunks) cannot be identified and optimised.

### 3.3 Image Optimisation

- [x] :green_circle: **AVIF format enabled** — `next.config.ts:56` has `formats: ['image/avif', 'image/webp']`. 30–50% smaller than WebP.
- [x] :green_circle: **UnifiedImage component** — Auto-sizing, DPI multipliers, LQIP blur placeholders, responsive `sizes`, schema markup. Well-implemented.
- [x] :green_circle: **Background image uses Next.js Image** — `src/app/layout.tsx:96-107` now uses `<Image>` with `priority` for the fixed background. Resolves previous HIGH issue.
- [ ] :yellow_circle: **HeroVideo `preload='auto'`** — `src/components/HomeHero/HeroVideo.tsx:64` downloads the entire video file on page load. Change to `preload='metadata'` (or `preload='none'` with a visible poster image) to prevent unnecessary bandwidth usage and LCP degradation on pages with a hero video.

### 3.4 Caching Strategy

- [x] :green_circle: **Tag-based revalidation** — All data fetches use `revalidate: false` with document-type tags in production.
- [x] :green_circle: **Environment-aware caching** — Dev uses `revalidate: 0`; production uses webhook-triggered invalidation.
- [x] :green_circle: **Sitemap cached with ISR** — 1-hour revalidation via `revalidate = 3600`.

### 3.5 Bundle & CSS

- [x] :green_circle: **CSS optimisation enabled** — `optimizeCss: true` and `cssChunking: 'strict'` for production.
- [x] :green_circle: **Tailwind CSS v4** — Custom utility classes in `globals.css` with responsive variants. Well-structured.
- [ ] :yellow_circle: **react-icons used across 10+ components** — Multiple icon sets (Fa, Md, Go, Fi) imported, each adding to the client bundle. Consolidate to a single icon set or migrate to custom SVG components for icon-heavy paths.

### 3.6 Third-Party Resources

- [x] :green_circle: **YouTube and Google Maps lazy loaded** — Both use `loading='lazy'` on iframes.
- [x] :green_circle: **Sanity CDN resource hints** — `dns-prefetch` and `preconnect` for `cdn.sanity.io`.
- [ ] :white_circle: **No preconnect hints for YouTube/Maps** — `<link rel="preconnect">` for `www.youtube.com` and `maps.googleapis.com` would reduce connection setup time for pages that embed these. Low priority unless embeds appear above the fold.

---

## SECTION 4: ACCESSIBILITY

### 4.1 Document Structure

- [x] :green_circle: **Language attribute set** — `<html lang='en'>`.
- [x] :green_circle: **Viewport allows zoom** — No `user-scalable=no` or `maximum-scale=1` restrictions.
- [x] :green_circle: **Semantic HTML structure** — Proper use of `<header>`, `<main>`, `<footer>`, `<nav>`.
- [x] :green_circle: **Skip link present** — `src/components/UI/SkipLink.tsx` with `href="#main-content"`, visually hidden until focused.

### 4.2 Forms

- [x] :green_circle: **Form error messages linked to inputs** — `TextInput.tsx:46-52` and `TextArea.tsx:46-52` both use `aria-describedby={`${id}-error`}` linked to `<p id="${id}-error">`. Resolves previous CRITICAL issue.
- [x] :green_circle: **Form success/error status announced** — `ContactForm.tsx:177` and `195` both use `role='alert'` on status message containers. Resolves previous CRITICAL issue.
- [x] :green_circle: **Radio/Checkbox groups use fieldset/legend** — Both `RadioGroup.tsx:32` and `CheckboxGroup.tsx:41` now use `<fieldset>` + `<legend>` pattern with `aria-describedby` on the fieldset. Resolves previous CRITICAL issue.
- [x] :green_circle: **`aria-invalid` on error state** — Form inputs correctly set `aria-invalid='true'` when validation fails.
- [x] :green_circle: **Labels present on all inputs** — `htmlFor` paired with input `id`.
- [x] :green_circle: **Honeypot properly hidden** — `aria-hidden='true'` and `tabIndex={-1}` applied.
- [x] :green_circle: **Form input focus ring** — Changed to `focus:ring-2` (resolves previous MEDIUM issue).

### 4.3 Keyboard Navigation

- [x] :green_circle: **MoreInfoToggle is a proper button** — `src/components/UI/MoreInfoToggle.tsx:21` now uses `<button>` with `aria-expanded` and `aria-label`. Resolves previous CRITICAL issue.
- [x] :green_circle: **Focus trapping in modals** — `useFocusTrap` cycles Tab/Shift+Tab within modals and navigation.
- [x] :green_circle: **Modal uses native `<dialog>`** — `src/components/UI/Modal.tsx:64` uses the `<dialog>` element with `showModal()` / `close()`. Native browser focus management and keyboard handling.
- [x] :green_circle: **Escape key closes overlays** — Menu, modal, and navigation all respond to Escape.
- [x] :green_circle: **Focus restoration** — Focus returns to trigger element when overlays close.
- [x] :green_circle: **ImageGalleryModal arrow key navigation** — Left/Right arrow keys navigate between images (`ImageGalleryModal.tsx:78-91`). Resolves previous MEDIUM issue.
- [ ] :orange_circle: **ExpandingContentWrapper hides content from screen readers when collapsed** — `src/components/UI/ExpandingContentWrapper.tsx:38-44`: when collapsed, the content wrapper has `max-h-0 opacity-0` via CSS, but no `aria-hidden`, `visibility: hidden`, or `inert` attribute. Screen readers will still read the "collapsed" content. Add `aria-hidden={!isExpanded}` on the content container. **WCAG 1.3.1 failure.**
- [ ] :orange_circle: **MoreInfoToggle missing `aria-controls`** — `src/components/UI/MoreInfoToggle.tsx` has `aria-expanded` but no `aria-controls`. The expandable content container in `ExpandingContentWrapper.tsx` has no `id`. Screen readers cannot identify what is being expanded. Add an `id` to the expandable container and `aria-controls={contentId}` to the toggle button. **WCAG 4.1.2 concern.**

### 4.4 Modal Accessibility

- [ ] :orange_circle: **ImageGalleryModal ARIA ID mismatch** — `src/components/Modals/ImageGalleryModal.tsx:171-175` passes `aria-labelledby='image-modal-title'` and `aria-describedby='image-modal-description'` to the `Modal` component. However, the elements inside have `id='gallery-modal-title'` (line 177) and `id='gallery-modal-description'` (line 180). The `<dialog>` element's `aria-labelledby` and `aria-describedby` therefore reference non-existent IDs, making the dialog title and description inaccessible to screen readers. Align all IDs. **WCAG 1.3.1 failure.**
- [x] :green_circle: **Modal close button accessible** — `<button aria-label='Close modal'>` present.
- [x] :green_circle: **Image counter announced** — `role='status' aria-live='polite'` on counter element in gallery modal.

### 4.5 Interactive Elements

- [x] :green_circle: **CTA component uses correct semantics** — Intelligently switches between `<button>` and `<a>` based on props.
- [x] :green_circle: **FAQBlock uses correct accordion pattern** — `<button aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>` with matching `id` on answer panel.
- [ ] :yellow_circle: **ServiceCard title uses `<p>` instead of a heading** — `src/components/_blocks/ServiceCard.tsx:77` renders service titles as `<p className='text-h3'>`. On a page with an H2 section heading, service card titles should be `<h3>` (or appropriate level) for correct document outline. Screen readers rely on heading hierarchy for navigation. **WCAG 1.3.1 concern.**
- [ ] :yellow_circle: **HeroVideo missing accessibility attribute** — `src/components/HomeHero/HeroVideo.tsx:51` renders a muted, auto-playing decorative `<video>` with no `aria-hidden='true'`. Background videos used purely for aesthetic effect should be hidden from assistive technologies. Add `aria-hidden='true'` to the video element and its container.
- [ ] :white_circle: **ImageGallery buttons have invalid `aria-describedby`** — `src/components/_blocks/ImageGallery.tsx:97` uses `aria-describedby={`gallery-image-${idx}`}` but there is no matching `id` element in the DOM. The `<figcaption>` doesn't have an `id`. Either remove the orphaned attribute or add a matching `id` to the caption element.
- [ ] :white_circle: **FAQBlock answer panel missing `role="region"` + `aria-labelledby`** — Per the [ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), the expanded panel should have `role="region"` and `aria-labelledby` referencing the header button. Low priority as the current pattern is functionally usable.

### 4.6 Focus Indicators

- [x] :green_circle: **Menu button has focus indicator** — `src/components/Header/MenuButton.tsx:25` now uses `focus-visible:ring-2 focus-visible:ring-brand-primary`. Resolves previous HIGH issue.
- [x] :green_circle: **CTA focus indicators** — `focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary`.
- [x] :green_circle: **Skip link focus indicator** — Clear visible focus ring.
- [x] :green_circle: **Form inputs** — `focus:ring-2` (increased from `ring-1` in previous audit).
- [ ] :white_circle: **Menu button touch target size** — `w-8 h-8` (32×32px). WCAG 2.5.8 minimum is 24×24px (passes), but 44×44px is recommended. Consider increasing to `w-11 h-11` (44px).

### 4.7 Screen Reader Support

- [x] :green_circle: **Footer contact links have accessible names** — `aria-label={detail.value}` provides the contact detail text as an accessible name for all phone, email, and address links.
- [x] :green_circle: **Footer social links have accessible names** — `aria-label={link.label}` on all social icon links.
- [x] :green_circle: **Loading overlay announced** — `role='dialog'`, `aria-modal='true'`, `aria-label='Page loading'`.
- [x] :green_circle: **Decorative background image** — `alt=''` and `aria-hidden='true'` on `<Image>` in root layout.
- [ ] :yellow_circle: **YouTube iframe title still generic** — `src/components/_blocks/YouTubeVideo.tsx:41` still uses `title='YouTube Video'` for all embeds, regardless of the video content. Update the schema to include a `title` field and use it here: `title={stegaClean(title) || 'YouTube Video'}`. **WCAG 1.2.1 concern.**

### 4.8 WCAG 2.2 Specific Criteria

- [x] :green_circle: **Focus Not Obscured (2.4.11)** — `scroll-padding-top: 70px` prevents focused elements from being hidden behind the sticky header.
- [x] :green_circle: **Consistent Help (3.2.6)** — Contact information appears in footer consistently across all pages.
- [ ] :white_circle: **Target Size Minimum (2.5.8)** — Menu button at 32px passes the 24px minimum but is borderline. Most other interactive elements exceed 44px.

### 4.9 EU Accessibility Act (2025)

- [ ] :yellow_circle: **EU Accessibility Act compliance** — The EU Accessibility Act entered enforcement in June 2025. If this site has EU users or the business operates in the EU, ensure full WCAG 2.1 AA compliance is documented and an accessibility statement is published. As a New Zealand-based business with potential international reach, this is worth noting.

---

## SECTION 5: IMPLEMENTATION PRIORITY MATRIX

### :red_circle: CRITICAL — Fix Before Production Launch

_No new CRITICAL issues found. All CRITICAL items from the previous audit have been resolved._

| # | Issue | Category | Status vs Previous Audit |
|---|-------|----------|--------------------------|
| — | All 9 previous CRITICAL issues | Various | ✅ All fixed |

### :orange_circle: HIGH — Fix Within First Week

| # | Issue | Category | Location |
|---|-------|----------|----------|
| 1 | Set up analytics (GA4, GSC, Vercel Analytics) | SEO | External services / `layout.tsx` |
| 2 | Re-enable visual breadcrumb navigation | SEO | `src/components/UI/Breadcrumb.tsx:16` |
| 3 | Fix ExpandingContentWrapper: add `aria-hidden` on collapsed content | Accessibility | `ExpandingContentWrapper.tsx:38` |
| 4 | Fix MoreInfoToggle: add `id` to content div + `aria-controls` to button | Accessibility | `ExpandingContentWrapper.tsx` + `MoreInfoToggle.tsx` |
| 5 | Fix ImageGalleryModal ARIA ID mismatch | Accessibility | `ImageGalleryModal.tsx:171-175` |
| 6 | Run `npm audit` and fix vulnerabilities | Security | Terminal |

### :yellow_circle: MEDIUM — Fix Within First Month

| # | Issue | Category | Location |
|---|-------|----------|----------|
| 7 | Fix double-slash bug in sitemap and robots.txt URLs | SEO | `sitemap.xml/route.ts:17`, `robots.txt/route.ts:5` |
| 8 | Fix malformed OG image alt text | SEO | `src/lib/metadata.ts:77` |
| 9 | Add unique meta descriptions for legal pages | SEO | CMS |
| 10 | Add `Service` structured data schemas | SEO | `src/lib/structuredData.ts` |
| 11 | YouTube iframe title: use CMS `title` field | Accessibility | `YouTubeVideo.tsx:41` |
| 12 | ServiceCard: use semantic `<h3>` for service title | Accessibility | `ServiceCard.tsx:77` |
| 13 | HeroVideo: add `aria-hidden='true'` to decorative video | Accessibility | `HeroVideo.tsx:50-51` |
| 14 | HeroVideo: change `preload='auto'` to `preload='metadata'` | Performance | `HeroVideo.tsx:64` |
| 15 | Add bundle analyzer | Performance | `next.config.ts` / dev deps |
| 16 | Remove or guard HeroVideo debug `console.log` calls | Performance | `HeroVideo.tsx` |
| 17 | Implement persistent rate limiting (Upstash Redis / Vercel KV) | Security | `src/app/api/contact/route.ts` |
| 18 | Add CWV monitoring (Vercel Analytics or `web-vitals`) | Performance | `src/app/(frontend)/layout.tsx` |
| 19 | Set up Google Search Console + submit sitemap | SEO | External / Vercel |
| 20 | Write content for About meta description (expand to 120–155 chars) | SEO | CMS |

### :white_circle: LOW — Best Practice / Refinement

| # | Issue | Category | Location |
|---|-------|----------|----------|
| 21 | Add `ProfilePage` schema to About page | SEO | `structuredData.ts` |
| 22 | Create "Areas We Serve" page | SEO | New page |
| 23 | Add blog content type + sitemap integration | SEO | Schema, actions, sitemap |
| 24 | Content freshness strategy / calendar | SEO | Process |
| 25 | Consolidate react-icons to single icon set | Performance | Multiple component files |
| 26 | Add `preconnect` hints for YouTube/Google Maps | Performance | `src/app/layout.tsx` |
| 27 | Implement CSP nonce-based approach via middleware | Security | `src/middleware.ts` |
| 28 | Add CSRF protection to contact form | Security | `ContactForm.tsx` + API route |
| 29 | Fix `any` type cast in contact API route | Security | `src/app/api/contact/route.ts:203` |
| 30 | Fix ImageGallery invalid `aria-describedby` | Accessibility | `ImageGallery.tsx:97` |
| 31 | Add `role="region"` + `aria-labelledby` to FAQBlock answer panels | Accessibility | `FAQBlock.tsx` |
| 32 | Increase menu button touch target to 44×44px | Accessibility | `MenuButton.tsx` |
| 33 | Add Speculation Rules API for prefetching key routes | Performance | `src/app/layout.tsx` |
| 34 | Validate all structured data with Google Rich Results Test | SEO | External tool |
| 35 | Add AI Overview optimisation: direct-answer paragraph structure | SEO | Content authoring |
| 36 | Make image alt text required field in Sanity schema | SEO | Image schema |
| 37 | Add explicit accessibility statement (for EU Accessibility Act) | Accessibility | New page |

---

## SECTION 6: WHAT HAS BEEN FIXED SINCE LAST AUDIT

The following issues from the 2026-02-16 audit have been resolved:

### CRITICAL (all resolved ✅)
- ✅ Security headers implemented: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy (`next.config.ts`)
- ✅ `X-Powered-By` suppressed: `poweredByHeader: false`
- ✅ Rate limiting auto-enabled in production (`NEXT_PUBLIC_ENV === 'production'`)
- ✅ Error details hidden in production (only exposed in non-production builds)
- ✅ Form `aria-describedby`: error messages now properly linked to inputs (`TextInput.tsx`, `TextArea.tsx`)
- ✅ Form status announcements: success/error divs now have `role='alert'`
- ✅ MoreInfoToggle: converted from `<div onClick>` to semantic `<button>` with `aria-expanded` and `aria-label`
- ✅ Radio/Checkbox groups: now use `<fieldset>` + `<legend>` pattern with proper `aria-describedby`
- ✅ Muted text contrast: verified as passing on dark backgrounds (main usage context)

### HIGH (all resolved ✅)
- ✅ Image block alt text: now uses `image?.alt` from CMS field
- ✅ Footer icon links accessible names: `aria-label` added to all contact and social links
- ✅ Menu button focus ring: `focus-visible:ring-2 focus-visible:ring-brand-primary` added
- ✅ Background image: migrated from `<img>` to Next.js `<Image>` with `priority`
- ✅ AVIF format: `formats: ['image/avif', 'image/webp']` enabled in `next.config.ts`

### MEDIUM (all resolved ✅)
- ✅ HeroImages carousel: pauses when off-screen via `useIsVisible` hook
- ✅ ServiceImageSlideshow: pauses when off-screen via `useIsVisible` hook
- ✅ Form input focus ring: increased from `ring-1` to `ring-2`
- ✅ ImageGalleryModal: arrow key navigation (Left/Right) implemented
- ✅ Modal: migrated to native `<dialog>` element for improved accessibility
- ✅ MusicVenue schema: added alongside LocalBusiness schema
- ✅ Footer headings: changed from `<h4>` to `<p>` elements to avoid heading hierarchy issues

---

## SECTION 7: THINGS DONE WELL

The following aspects are well-implemented and should be maintained:

**SEO:**
- Comprehensive, up-to-date structured data (Organization, MusicVenue/LocalBusiness, WebSite, Article, BreadcrumbList, FAQPage, ImageObject)
- Environment-aware `noindex`/`nofollow` gating — no accidental staging indexation
- Smart canonical URL generation with consistent trailing slash handling and `getBaseUrl()` utility
- Full OG and Twitter Card implementation with fallback image chain
- Geographic meta tags for local SEO (region, placename, coordinates)
- `next/font/google` with `display: swap` — no FOIT
- AVIF + WebP image format delivery via Next.js Image

**Security:**
- Comprehensive security headers implemented (CSP, COOP, COEP, Referrer-Policy, Permissions-Policy)
- `frame-ancestors` for Presentation Tool while blocking external framing
- Sanity webhook signature verification
- Server-only tokens, no hardcoded secrets
- Honeypot + input validation + HTML/URI sanitization on contact form
- Draft mode properly gated
- Rate limiting enabled in production

**Performance:**
- Server-first architecture (React Server Components by default)
- Tag-based ISR with Sanity webhook revalidation
- Critical CSS inlining for LCP optimisation
- UnifiedImage with DPI-aware sizing, LQIP, lazy loading, and schema markup
- Hero image with `priority` loading
- Sanity Studio dynamically imported (`ssr: false`)
- Off-screen carousel/slideshow pause via IntersectionObserver
- Efficient GROQ queries with specific field projections
- DNS prefetch + preconnect for Sanity CDN
- `removeConsole` in production builds

**Accessibility:**
- Skip-to-content link with visible focus state
- Semantic HTML structure with proper landmarks
- Focus trapping in modals with native `<dialog>` element
- Focus restoration on overlay close
- Body scroll lock with reference counting (prevents page jumping)
- Escape key closes all overlays
- Loading overlay announced to screen readers
- Viewport allows pinch-to-zoom
- CTA component with intelligent button/link semantics
- `scroll-padding-top` prevents focus obscuring by sticky header
- Form accessibility: `aria-invalid`, `aria-describedby`, `role='alert'`, `fieldset/legend`
- Image gallery modal with arrow key, swipe, and thumbnail navigation
- `role='status' aria-live='polite'` on gallery image counter

---

_Audit performed using static code analysis, live site inspection of `https://ah-website-staging.vercel.app/`, and 2025–2026 best practice research. For dynamic testing, run Lighthouse, axe DevTools, and WAVE against the live site. For real-world CWV data, use Google PageSpeed Insights and Chrome UX Report after production traffic accumulates._
