# Comprehensive Site Audit Checklist

**Site:** Arch Hill Studios (ah-website-development.vercel.app)
**Stack:** Next.js (App Router) + Sanity CMS + Tailwind CSS v4 + Vercel
**Audit Date:** 2026-02-16
**Audited Against:** SEO reference checklist, OWASP Top 10, Core Web Vitals, WCAG 2.2 AA

---

## Severity Legend

| Symbol          | Meaning                                                |
| --------------- | ------------------------------------------------------ |
| :red_circle:    | **CRITICAL** -- Must fix before production launch      |
| :orange_circle: | **HIGH** -- Fix soon after launch / significant impact |
| :yellow_circle: | **MEDIUM** -- Should fix within first month            |
| :white_circle:  | **LOW** -- Best practice / nice-to-have                |
| :green_circle:  | **PASS** -- No action needed                           |

---

## SECTION 1: SEO

### 1.1 Search Engine Indexing

- [ ] :red_circle: **`noindex, nofollow` on all pages in development deployment** -- Root layout (`src/app/layout.tsx:50`) conditionally adds `<meta name='robots' content='noindex, nofollow' />` when `NEXT_PUBLIC_ENV !== 'production'`. Confirmed present on all pages of the dev deployment. **Verify** that `NEXT_PUBLIC_ENV=production` is set in the production Vercel environment so this tag is removed on the live site.
- [ ] :red_circle: ~**Production domain placeholder not replaced** -- `src/lib/constants.ts:12` has `PRODUCTION_DOMAIN` defaulting to `'https://your-domain.com'`. If `NEXT_PUBLIC_BASE_URL` is not set in production, all canonical URLs, sitemap URLs, OG URLs, and robots.txt will point to a non-existent domain.~
- [x] :green_circle: **Robots logic is environment-aware** -- `shouldHideFromRobots = !isProd || SITE_CONFIG.MAINTENANCE_MODE_ENABLED` correctly gates indexing.
- [x] :green_circle: **404 page correctly noindexed** -- `src/app/(frontend)/not-found.tsx:18` sets `robots: 'noindex, nofollow'`.

### 1.2 Robots.txt

- [x] :green_circle: **`/robots.txt` returns valid content** -- User-agent, Allow, Disallow rules, and Sitemap reference all present.
- [x] :green_circle: **Admin/private paths disallowed** -- `/admin/`, `/api/`, `/draft/`, `/studio/`, `/dev-test/` all blocked.
- [x] :green_circle: **Sitemap URL referenced** -- Points to `${baseUrl}/sitemap.xml`.
- [x] :yellow_circle: ~**No `Crawl-delay` directive** -- Consider adding for polite crawling if traffic becomes significant.~

### 1.3 XML Sitemap

- [x] :green_circle: **`/sitemap.xml` returns valid XML** -- Includes homepage, FAQ, legal pages, and dynamic pages.
- [x] :green_circle: **Dev-test pages excluded** -- `src/app/sitemap.xml/route.ts:56` filters pages starting with `dev-test`.
- [x] :green_circle: **ISR cache strategy** -- `revalidate = 3600` (1 hour).
- [x] :yellow_circle: **Homepage and FAQ missing `<lastmod>`** -- Static pages at `route.ts:28-29` have no `lastmod` value. Homepage should use the most recent content update date.
- [ ] ~:yellow_circle: **No blog posts in sitemap** -- If blog content is planned, the sitemap generation needs updating.~
- [ ] ~:white_circle: **No image sitemap** -- Image-heavy pages (galleries) could benefit from image sitemap entries.~

### 1.4 Canonical Tags

- [x] :green_circle: **Canonical tags present on all pages** -- Generated via `generateCanonicalUrl()` in `src/lib/metadata.ts:24-29`.
- [x] :green_circle: **Trailing slash consistency** -- Properly strips trailing slashes except for root `/`.
- [x] :green_circle: **Uses HTTPS and absolute URLs** -- Canonical URLs use the full base URL.

### 1.5 Meta Descriptions

- [x] :green_circle: **Dynamic meta descriptions** -- Generated per page from CMS content with fallback to site description.
- [x] :yellow_circle: **Legal pages share same generic description** -- Terms & Conditions and Privacy Policy pages use the site-wide default description rather than page-specific ones. Each should have a unique, relevant description.
- [ ] ~:yellow_circle: ~**Verify all page descriptions are 120-155 characters** -- Audit each page's meta description length for optimal SERP display.~

### 1.6 Title Tags

- [x] :green_circle: **Unique titles per page** -- Format: `{Site Title} | {Page Title}`.
- [ ] :yellow_circle: ~**Check title length** -- Ensure all titles are under 60 characters. Current homepage title "Arch Hill Studios | Auckland Rehearsal & Recording Space" is 56 characters (good), but verify all dynamic page titles.~

### 1.7 Structured Data / Schema Markup

- [x] :green_circle: **Organization schema** -- Present on all pages via `BaseLayout.tsx`.
- [x] :green_circle: **LocalBusiness schema** -- Comprehensive with address, geo, hours, price range, service areas, sameAs.
- [x] :green_circle: **WebSite schema** -- Present with site name, URL, description.
- [x] :green_circle: **BreadcrumbList schema** -- Generated via `BreadcrumbStructuredData.tsx` on content pages.
- [x] :green_circle: **Article schema** -- Applied to FAQ and legal pages with dates, author, publisher.
- [x] :green_circle: **FAQPage schema** -- Present on FAQ page with proper Question/Answer structure.
- [x] :green_circle: **ImageObject schema** -- Generated by UnifiedImage component with `generateSchema` prop.
- [x] :yellow_circle: **Missing `MusicVenue` or `EntertainmentBusiness` schema** -- As a rehearsal/recording studio, consider using a more specific schema type alongside LocalBusiness (e.g., `MusicVenue` subtype) for richer search results.
- [ ] :yellow_circle: ~**Missing `Service` schema** -- Individual services (rehearsal, recording, drum tuition, PA hire) could have Service schema for better SERP visibility.~
- [ ] :white_circle: ~**Missing `ProfilePage` schema** -- The About/founder page could use ProfilePage schema to strengthen E-E-A-T signals.~
- [ ] :white_circle: ~**Validate all structured data** -- Run Google Rich Results Test against every page to catch errors or warnings.~

### 1.8 Open Graph / Social Meta

- [x] :green_circle: **OG tags present** -- `og:title`, `og:description`, `og:url`, `og:image` (1200x630), `og:type` on all pages.
- [x] :green_circle: **Twitter Card tags present** -- `summary_large_image` with title, description, image.
- [x] :green_circle: **Image fallback strategy** -- Page-specific > site default from Sanity > static fallback.
- [x] :green_circle: **Article type switching** -- `og:type` dynamically set to `article` when publishedTime is present.

### 1.9 Local SEO

- [x] :green_circle: **Geographic meta tags** -- `geo.region` (NZ-AUK), `geo.placename` (Grey Lynn), `geo.position`, `ICBM` all present.
- [x] :green_circle: **LocalBusiness schema comprehensive** -- Address, phone, email, hours, coordinates, price range, service areas, social profiles.
- [ ] :yellow_circle: ~**No "Areas We Serve" page** -- Could strengthen local SEO with explicit service area content.~
- [ ] :white_circle: ~**Google Business Profile setup** -- Verify GBP is claimed, verified, and 100% complete.~

### 1.10 Image SEO

- [x] :orange_circle: **Image block uses hardcoded alt text** -- `src/components/_blocks/Image.tsx:99` uses `alt="Content image"` instead of the actual alt text from the CMS schema field. Should be `alt={stegaClean(image.alt) || 'Content image'}`.
- [ ] :orange_circle: ~**Multiple images on About page have null alt text** -- 10+ content and gallery images observed with missing alt text on the deployed site.~
- [x] :green_circle: **CMS schema supports alt text** -- `imageType.ts` includes alt field with helpful description for editors.
- [x] :green_circle: **UnifiedImage handles alt properly** -- Cleans with `stegaClean()`, provides fallback.
- [ ] :yellow_circle: ~**Consider making alt text required in CMS schema** -- Add validation to encourage editors to always provide alt text.~

### 1.11 Breadcrumbs

- [ ] :orange_circle: ~**Visual breadcrumb navigation disabled** -- `src/components/UI/Breadcrumb.tsx:16` returns `null`. Visual breadcrumbs are commented out (lines 17-43). Only structured data breadcrumbs are active.~
- [x] :green_circle: **Breadcrumb structured data working** -- BreadcrumbStructuredData component generates correct JSON-LD.
- [ ] :orange_circle: ~**Re-enable visual breadcrumbs** -- Content pages should show visual breadcrumb navigation for UX and SEO.~

### 1.12 Font Loading

- [x] :green_circle: **Using `next/font/google`** -- Both Inter and Bebas Neue loaded via framework optimization.
- [x] :green_circle: **`display: 'swap'`** -- No FOIT, text visible immediately with fallback font.
- [x] :green_circle: **Selective font weights** -- Inter: 300/400/500/600, Bebas Neue: 400 only.

### 1.13 Content & E-E-A-T

- [ ] :yellow_circle: ~**No blog/article content** -- No blog post document type found. Regular content publishing builds topical authority and supports SEO.~
- [ ] :yellow_circle: ~**Limited internal linking** -- No "related content" or contextual cross-linking between pages observed.~
- [ ] :white_circle: ~**Content freshness strategy** -- Establish a content calendar with at least 1 post per month.~
- [ ] :white_circle: ~**Author bio/credentials** -- Founder page exists but could be enhanced with Person schema and more explicit experience signals.~

### 1.14 Emerging SEO (2025-2026)

- [ ] :white_circle: ~**AI Overviews optimization** -- Structure content with clear, direct answers in first paragraphs for potential AI Overview citations.~
- [ ] :white_circle: ~**Helpful Content alignment** -- Ensure all content demonstrates first-hand expertise and leaves readers satisfied.~
- [ ] :white_circle: ~**AVIF image format** -- Enable in `next.config.ts` with `images.formats: ['image/avif', 'image/webp']` for 30-50% smaller images.~
- [ ] :white_circle: ~**Speculation Rules API** -- Consider adding as progressive enhancement for faster perceived navigation.~

### 1.15 Favicon & Icons

- [x] :green_circle: **Favicon set complete** -- 32x32, 16x16, 180x180 (Apple), 192x192, 512x512 (manifest).
- [x] :green_circle: **Web app manifest** -- Valid at `/manifest.webmanifest` with correct metadata.
- [x] :green_circle: **CMS-managed favicon** -- Falls back to static files if Sanity favicon not set.

### 1.16 Analytics & Monitoring

- [ ] :orange_circle: ~**No analytics implementation detected** -- No Google Analytics, GA4, Microsoft Clarity, or Vercel Analytics found in the frontend code.~
- [ ] :orange_circle: ~**No Google Search Console verification** -- Verify GSC is set up and sitemap submitted.~
- [ ] :yellow_circle: ~**No Core Web Vitals monitoring** -- Consider Vercel Analytics or web-vitals library for ongoing CWV tracking.~

---

## SECTION 2: SECURITY

### 2.1 Security Headers

- [x] :red_circle: **No Content-Security-Policy (CSP) header** -- No CSP configured in `next.config.ts`, middleware, or response headers. This is the most impactful missing security header. Implement a baseline CSP allowing `'self'`, Sanity CDN, YouTube, and Google Maps.
- [x] :red_circle: **No X-Content-Type-Options header** -- Missing `nosniff` header. Prevents MIME-type sniffing attacks. Add `X-Content-Type-Options: nosniff`.
- [x] :red_circle: **No X-Frame-Options header** -- Site can be embedded in iframes by any domain, enabling clickjacking attacks. Add `X-Frame-Options: SAMEORIGIN` or use CSP `frame-ancestors`.
- [x] :red_circle: **No Referrer-Policy header** -- No control over what referrer information is sent. Add `Referrer-Policy: strict-origin-when-cross-origin`.
- [x] :red_circle: **No Permissions-Policy header** -- No restriction on browser feature access (camera, microphone, geolocation). Add `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- [x] :green_circle: **HSTS present** -- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (provided by Vercel).
- [x] :orange_circle: **`X-Powered-By: Next.js` exposed on Studio** -- The `/studio` route returns `X-Powered-By: Next.js` header, leaking framework information. Set `poweredByHeader: false` in `next.config.ts`.
- [x] :yellow_circle: **Missing Cross-Origin headers** -- Consider adding `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` for enhanced isolation.

### 2.2 CORS

- [ ] :orange_circle: ~**`Access-Control-Allow-Origin: *` on all responses** -- Vercel's default adds this to all responses. For API routes handling sensitive data (contact form), this is too permissive. Configure specific CORS headers for API routes.~

### 2.3 API Route Security

- [x] :red_circle: **Rate limiting DISABLED on contact form** -- `src/app/api/contact/route.ts:28` has `ENABLE_RATE_LIMITING = false`. This allows unlimited form submissions, enabling spam, abuse, and potential cost escalation from Resend email API calls. **Enable before production.**
- [x] :orange_circle: **Error response leaks internal details** -- `src/app/api/contact/route.ts:286-293` returns `details: errorMessage` which could expose internal error messages to attackers. Remove the `details` field from error responses in production.
- [ ] ~~:orange_circle: **In-memory rate limiting not suitable for serverless** -- Even when enabled, the Map-based rate limiter (`route.ts:34`) resets on each serverless function cold start. Consider Upstash Redis or Vercel KV for persistent rate limiting.~~
- [x] :green_circle: **Webhook signature verification** -- `src/app/api/revalidate/route.ts` uses `parseBody` with `SANITY_WEBHOOK_SECRET` for proper signature validation.
- [x] :green_circle: **Input validation on contact form** -- Email regex validation, required field checks, honeypot bot detection all present.
- [x] :green_circle: **Input sanitization** -- `sanitizeInput()` strips `<>` characters. Basic but functional for email content.
- [x] :yellow_circle: **Sanitization could be stronger** -- Current sanitization only strips `<>`. Consider a library like `DOMPurify` for more thorough sanitization, or at minimum strip common injection patterns.

### 2.4 Authentication & Draft Mode

- [x] :green_circle: **Draft mode properly gated** -- Uses `defineEnableDraftMode` from `next-sanity/draft-mode` with token authentication.
- [x] :green_circle: **Sanity tokens not exposed client-side** -- Token is server-side only (`src/sanity/lib/token.ts`).
- [ ] :yellow_circle: ~**Sanity Studio publicly accessible** -- `/studio` returns HTTP 200 for unauthenticated users (Sanity handles its own auth, but consider additional IP restriction or auth layer for production).~

### 2.5 Environment Variables & Secrets

- [x] :green_circle: **No hardcoded secrets in codebase** -- All sensitive values use environment variables.
- [x] :green_circle: **`.env` files not committed** -- `.gitignore` properly excludes env files.
- [x] :green*circle: \*\*NEXT_PUBLIC* variables appropriately used\*\* -- Only non-sensitive values (base URL, Sanity project ID/dataset, environment name) are prefixed with `NEXT_PUBLIC_`.
- [x] :yellow*circle: **`NEXT_PUBLIC_CONTACT_EMAIL` could be server-only** -- Contact email is used in `src/app/api/contact/route.ts` (server-side only) but uses `NEXT_PUBLIC*` prefix, exposing it to the client bundle unnecessarily.

### 2.6 XSS Prevention

- [x] :green_circle: **No `dangerouslySetInnerHTML` with user input** -- Only used for trusted content: inline critical CSS and JSON-LD structured data scripts.
- [x] :green_circle: **React's default escaping** -- JSX automatically escapes interpolated values.
- [x] :green_circle: **Form inputs sanitized before email rendering** -- Contact form strips `<>` characters.
- [x] :green_circle: **Portable Text rendering** -- Sanity's PortableText component handles content from CMS editors. Ensure no custom serializers allow raw HTML injection.

### 2.7 Dependency Security

- [ ] :orange_circle: ~**Run `npm audit` and fix vulnerabilities** -- No evidence of regular dependency auditing. Run `npm audit` and address critical/high severity issues.~
- [ ] :yellow_circle: ~**`styled-components` is a dependency** -- Only used by Sanity Studio. Verify it's not adding unnecessary client-side weight or exposing vulnerabilities.~

### 2.8 CSRF Protection

- [ ] :yellow_circle: ~**No CSRF token on contact form** -- The contact form POST endpoint has no CSRF protection. While the honeypot helps against basic bots, a determined attacker could forge submissions. Consider adding a CSRF token or using SameSite cookie-based protection.~

### 2.9 Information Disclosure

- [ ] :yellow_circle: ~**Revalidation endpoint leaks document info** -- `src/app/api/revalidate/route.ts:39-43` returns `type` and `id` of revalidated documents in the response. While authenticated via webhook secret, consider returning minimal information.~
- [ ] :yellow_circle: ~**Error handler logs environment details** -- `src/app/api/contact/route.ts:274-280` logs env var presence to server console. While not returned to client, ensure Vercel logs are access-restricted.~

---

## SECTION 3: PERFORMANCE

### 3.1 Client-Side JavaScript

- [x] :green_circle: **Server-first architecture** -- All pages and layouts are server components by default.
- [x] :green_circle: **Sanity Studio dynamically imported** -- `src/app/studio/[[...tool]]/page.tsx` uses `dynamic()` with `ssr: false`.
- [ ] :yellow_circle: ~**24 client components identified** -- While most are justified (Header, Modal, forms, animations), review `ContentWrapper.tsx` and `ResponsiveWrapper.tsx` which appear to be pure presentation and could be server components.~
- [ ] :yellow_circle: ~**Header component overly complex** -- `src/components/Header/Header.tsx` manages scroll state, opacity, transitions, and menu state simultaneously. Consider extracting scroll logic into a `useHeaderScroll()` hook.~

### 3.2 Bundle Size

- [ ] :orange_circle: ~**No bundle analyzer configured** -- No `@next/bundle-analyzer` or similar tool. Add to dev dependencies and integrate into build process for visibility.~
- [ ] :orange_circle: ~**16 separate react-icons imports across codebase** -- Each imports from different icon sets (Fa, Fi, Md, Go), adding an estimated 15-25 KB gzipped. Consider consolidating to a single icon set or migrating to custom SVG icons (~2-3 KB).~
- [x] :green_circle: **Console statements removed in production** -- `next.config.ts:16` has `removeConsole` for production builds.
- [x] :green_circle: **CSS optimization enabled** -- `optimizeCss: true` and `cssChunking: 'strict'` in next.config.ts.

### 3.3 Image Optimization

- [x] :green_circle: **UnifiedImage component well-implemented** -- Auto-sizing, DPI multipliers, blur placeholders (LQIP), responsive sizes, schema markup.
- [x] :green_circle: **Hero images use `priority` loading** -- `HeroImages.tsx:91` marks first image with `priority={index === 0}`.
- [x] :green_circle: **All content images use Next.js Image** -- No unoptimized content images detected.
- [x] :orange_circle: **Background image not optimized** -- `src/app/layout.tsx:96-104` uses raw `<img>` tag for body background. Should use Next.js Image component with `fill` mode or convert to CSS background with optimized source.
- [x] :yellow_circle: **AVIF not enabled** -- `next.config.ts` does not include `images.formats: ['image/avif', 'image/webp']`. Enabling AVIF gives 30-50% smaller images than WebP.
- [ ] :yellow_circle: ~**Hero video preload** -- `src/components/HomeHero/HeroVideo.tsx:64` uses `preload='auto'` which downloads the full video eagerly. Consider `preload='metadata'` with a poster image for better LCP.~

### 3.4 Caching Strategy

- [x] :green_circle: **Tag-based revalidation** -- All data fetches use `revalidate: false` with document-type tags in production.
- [x] :green_circle: **Environment-aware caching** -- Development uses `revalidate: 0` for fresh data; production uses indefinite caching with webhook revalidation.
- [x] :green_circle: **Webhook revalidation working** -- `src/app/api/revalidate/route.ts` properly revalidates by document type.
- [x] :green_circle: **Sitemap cached with ISR** -- 1-hour revalidation.

### 3.5 Core Web Vitals

- [ ] :yellow_circle: ~**Potential CLS from header transitions** -- Header transitions from transparent to opaque during scroll. Ensure transitions use `transform`/`opacity` only (GPU-accelerated) to avoid layout shifts.~
- [ ] :yellow_circle: ~**Hero video may hurt LCP** -- If hero displays video instead of image, LCP could suffer. Ensure a poster/fallback image loads first.~
- [x] :yellow_circle: **Service slideshow auto-play runs off-screen** -- `src/components/_blocks/ServiceList/ServiceImageSlideshow.tsx` runs `setInterval` even when the component is scrolled off-viewport. Add `IntersectionObserver` to pause when not visible.
- [x] :yellow_circle: **Hero image carousel runs off-screen** -- `src/components/HomeHero/HeroImages.tsx:36-47` has a 4-second interval that continues even when hero is scrolled off. Pause with `IntersectionObserver`.
- [x] :green_circle: **Fonts use `display: swap`** -- No FOIT, minimizes CLS from font loading.
- [x] :green_circle: **Critical CSS inlined** -- `src/app/layout.tsx:65-82` inlines essential styles to prevent FOUC and improve LCP.

### 3.6 Third-Party Resources

- [ ] :yellow_circle: ~**Missing preconnect hints for embeds** -- No `<link rel="preconnect">` for `youtube.com` or `maps.googleapis.com`. Only `cdn.sanity.io` has preconnect. Add hints if embeds appear above the fold.~
- [x] :green_circle: **YouTube and Google Maps lazy loaded** -- Both use `loading='lazy'` on iframes.
- [x] :green_circle: **No analytics scripts blocking render** -- No third-party analytics detected in frontend.

### 3.7 Loading States

- [x] :green_circle: **Loading overlay implemented** -- Animated soundwave bars during page navigation.
- [ ] :yellow_circle: ~**No skeleton screens** -- Users see a blank page with loading animation on slow connections. Skeleton screens for critical page sections would improve perceived performance.~
- [x] :green_circle: **Resource hints** -- `dns-prefetch` and `preconnect` for Sanity CDN.

### 3.8 CSS

- [x] :green_circle: **Tailwind v4 with custom utilities** -- Well-structured globals.css (~424 lines).
- [ ] :yellow_circle: ~**CSS duplication maintenance burden** -- Critical CSS duplicated across `globals.css`, `layout.tsx`, and `manifest.ts`. Risk of desynchronization. Consider a shared constants file or build-time extraction.~
- [ ] :yellow_circle: ~**Header height synced across 4 files** -- `Header.tsx` (`h-[70px]`), `layout.tsx` (`scroll-padding`), `spacingConstants.ts`, and `styles.module.css`. A single source of truth would reduce maintenance risk.~

### 3.9 Rendering & Memoization

- [ ] :white_circle: ~**AnimateIn creates per-instance observers** -- Each scroll animation component creates its own `IntersectionObserver`. For pages with 50+ animated elements, consider a shared observer pattern.~
- [ ] :white_circle: ~**UnifiedImage could use `React.memo()`** -- Has 12 `useMemo` hooks inside but the component itself is not memoized.~
- [x] :green_circle: **Proper memoization in complex components** -- `useCallback` and `useMemo` used appropriately in Header, ServiceImageSlideshow, PageLoadContext.
- [x] :green_circle: **No over-fetching from Sanity** -- GROQ queries use specific field projections, no wildcard fetches.

---

## SECTION 4: ACCESSIBILITY

### 4.1 Skip-to-Content Link

- [x] :green_circle: **Skip link present** -- `src/components/UI/SkipLink.tsx` with `href="#main-content"`.
- [x] :green_circle: **Visually hidden until focused** -- Uses `sr-only focus:not-sr-only` with clear focus ring.
- [x] :green_circle: **Main content landmark** -- `<main id='main-content'>` in BaseLayout.

### 4.2 Document Structure

- [x] :green_circle: **Language attribute set** -- `<html lang='en'>`.
- [x] :green_circle: **Viewport allows zoom** -- No `user-scalable=no` or `maximum-scale=1` restrictions.
- [x] :green_circle: **Semantic HTML structure** -- Proper use of `<header>`, `<main>`, `<footer>`, `<nav>` elements.

### 4.3 Heading Hierarchy

- [x] :yellow_circle: **H4 used in footer section headings** -- Footer uses `<h4>` for "Contact" and "Quick Links" which may skip heading levels depending on page structure. Consider using a more appropriate level or `<div>` with ARIA.
- [x] :yellow_circle: **Verify no heading level skipping** -- Ensure all pages follow H1 > H2 > H3 > H4 without gaps. Hero pages use SR-only H1 which is good, but confirm subsequent headings start at H2.
- [x] :green_circle: **Semantic heading elements used** -- Custom typography system uses proper `<h1>`-`<h6>` elements.

### 4.4 Form Accessibility

- [x] :red_circle: **Form error messages not linked to inputs** -- TextInput, TextArea, and other form components display error messages but do not connect them via `aria-describedby`. Error `<p>` elements need an `id`, and inputs need `aria-describedby={errorId}`. **WCAG 3.3.1 failure.**
- [x] :red_circle: **Form success/error alerts not announced** -- `src/components/Forms/ContactForm/ContactForm.tsx:176-180` and `194-199` show success/error messages in regular `<div>` elements without `role='alert'` or `aria-live`. Screen readers will not announce these status changes. **WCAG 4.1.3 failure.**
- [ ] :red_circle: ~**Radio/Checkbox groups use invalid structure** -- `RadioGroup.tsx` and `CheckboxGroup.tsx` use `<label htmlFor={id}>` with the same `id` for multiple inputs, creating invalid HTML. Should use `<fieldset>` + `<legend>` pattern. **WCAG 1.3.1 failure.**~
- [x] :green_circle: **Labels present on all inputs** -- `htmlFor` paired with input `id` on text inputs.
- [x] :green_circle: **`aria-invalid` on error state** -- Form inputs correctly set `aria-invalid='true'` when validation fails.
- [x] :green_circle: **Honeypot properly hidden** -- Uses `aria-hidden='true'` and `tabIndex={-1}`.
- [x] :green_circle: **Required field indicators** -- Red asterisk shown for required fields.

### 4.5 Keyboard Navigation

- [x] :red_circle: **MoreInfoToggle not keyboard accessible** -- `src/components/UI/MoreInfoToggle.tsx:22-25` uses `<div onClick={...}>` without keyboard support. Missing `role='button'`, `tabIndex={0}`, and `onKeyDown` handler for Enter/Space. **WCAG 2.1.1 failure.**
- [x] :orange_circle: **Menu button has no visible focus indicator** -- `src/components/Header/MenuButton.tsx:25` uses `focus:outline-none` with no replacement focus ring. Add `focus:ring-2 focus:ring-brand-primary`. **WCAG 2.4.7 failure.**
- [x] :green_circle: **Focus trapping in modals** -- `useFocusTrap` hook properly cycles Tab/Shift+Tab within modals and navigation.
- [x] :green_circle: **Escape key closes overlays** -- Menu, modal, and navigation all respond to Escape key.
- [x] :green_circle: **Focus restoration** -- Focus returns to trigger element when overlays close.
- [x] :green_circle: **Body scroll lock with reference counting** -- Prevents conflicts between multiple overlays.
- [x] :yellow_circle: **Image gallery modal missing arrow key navigation** -- Previous/Next buttons are keyboard accessible via Tab, but arrow keys would improve the experience.

### 4.6 Color Contrast

### 4.6 Color Contrast

- [x] ~~:red_circle: **Muted text on light backgrounds fails WCAG AA** -- `#999999` (text-brand-muted) on `#fff7db` (text-brand-white) = ~2.5:1 contrast ratio. Minimum for normal text is 4.5:1. **WCAG 1.4.3 failure.**~~
- [x] ~~:orange_circle: **Secondary color on light backgrounds may fail** -- `#1c2d6b` (text-brand-secondary) on `#fff7db` = ~1.8:1 ratio. Fails WCAG AA for text.~~
- [x] ~~:yellow_circle: **Placeholder text opacity** -- Form inputs use `placeholder:text-white/50` which may have insufficient contrast. Verify ratio meets 4.5:1.~~
- [x] :green_circle: **Primary colors on dark backgrounds** -- `#fff7db` on `#6b1c1c` = 11.2:1 (excellent). `#fff7db` on `#1c2d6b` = 12.4:1 (excellent).

### 4.7 Images & Media

- [ ] :orange_circle: ~**YouTube video has generic title** -- `src/components/_blocks/YouTubeVideo.tsx:41` uses `title='YouTube Video'` for all embeds. Should use the actual video title from CMS data. **WCAG 1.2.1 concern.**~
- [ ] :yellow_circle: ~**Hero video missing accessibility attributes** -- `src/components/HomeHero/HeroVideo.tsx:50-65` has no `title`, `aria-label`, or caption track. If purely decorative, add `aria-hidden='true'`. If content-bearing, add description.~
- [x] :green_circle: **Decorative background image properly handled** -- `src/app/layout.tsx:94-105` uses `alt=''` and `aria-hidden='true'`.
- [x] :green_circle: **UnifiedImage handles alt text** -- Cleans with `stegaClean()`, provides fallback.

### 4.8 Interactive Elements

- [ ] :red_circle: ~**MoreInfoToggle uses div instead of button** -- `src/components/UI/MoreInfoToggle.tsx:21-26` has `onClick` on a `<div>`. Must be converted to `<button>` element for proper semantics, keyboard support, and screen reader announcement. **WCAG 4.1.2 failure.**~
- [x] :green_circle: **CTA component uses correct semantics** -- Intelligently switches between `<button>` and `<a>` based on props.
- [x] :green_circle: **Modal close button** -- Proper `<button>` with `aria-label='Close modal'`.
- [x] :green_circle: **Disabled states accessible** -- Uses native `disabled` attribute with visual indicators.

### 4.9 Focus Indicators

- [x] :orange_circle: **Menu button focus ring missing** -- `focus:outline-none` with no replacement. See 4.5 above.
- [x] :yellow_circle: **Form input focus ring too thin** -- Uses `focus:ring-1` (1px). WCAG 2.2 recommends at least 2px. Increase to `focus:ring-2`.
- [x] :green_circle: **CTA focus indicators** -- `focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary` provides clear visible focus.
- [x] :green_circle: **Skip link focus indicator** -- Clear focus ring with brand secondary color.

### 4.10 Screen Reader Support

- [x] :orange_circle: **Footer icon-only links may lack accessible names** -- Phone, email, and social media links in footer use icons (FaPhoneAlt, MdEmail, etc.). Verify all have `aria-label` or visible text providing accessible names.
- [x] :green_circle: **Loading overlay announced** -- `role='dialog'`, `aria-modal='true'`, `aria-label='Page loading'`.
- [x] :green_circle: **SR-only text used appropriately** -- Hero H1 uses `sr-only` class for screen reader access.
- [x] :green_circle: **Modal titles and descriptions** -- Proper ARIA attributes for dialog semantics.

### 4.11 Touch Targets

- [ ] :yellow_circle: ~**Menu button below recommended size** -- `src/components/Header/MenuButton.tsx:25` is `w-8 h-8` (32x32px). WCAG 2.2 AA requires minimum 24x24px (passes) but 44x44px is recommended. Increase to at least `w-10 h-10` (40px) or `w-11 h-11` (44px).~
- [x] :green_circle: **CTA buttons meet guidelines** -- `min-h-[56px]` exceeds 44px recommendation.
- [x] :green_circle: **Form inputs adequate** -- `py-3` padding provides sufficient touch target height.
- [x] :green_circle: **Navigation links adequate** -- `py-3.5 px-5` on vertical nav links provides 56px+ height.

### 4.12 WCAG 2.2 New Criteria

- [x] :green_circle: **Focus Not Obscured (2.4.11)** -- `scroll-padding-top: 70px` ensures focused elements below the sticky header are not obscured.
- [ ] :yellow_circle: ~**Target Size Minimum (2.5.8)** -- Menu button at 32px passes the 24px minimum but is borderline. All other interactive elements appear to meet this criterion.~
- [x] :green_circle: **Consistent Help (3.2.6)** -- Contact information appears in footer consistently across all pages.

---

## SECTION 5: IMPLEMENTATION PRIORITY MATRIX

### :red_circle: CRITICAL -- Fix Before Production Launch

| #   | Issue                                                                                                    | Category      | Location                               |
| --- | -------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------- |
| 1   | Verify `NEXT_PUBLIC_ENV=production` in production Vercel env                                             | SEO           | Vercel Dashboard                       |
| 2   | Replace production domain placeholder or set `NEXT_PUBLIC_BASE_URL`                                      | SEO           | `src/lib/constants.ts:12` / Vercel env |
| 3   | Add security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) | Security      | `next.config.ts` headers config        |
| 4   | Enable rate limiting on contact form                                                                     | Security      | `src/app/api/contact/route.ts:28`      |
| 5   | Fix form `aria-describedby` for error messages                                                           | Accessibility | All form components                    |
| 6   | Add `role='alert'` to form success/error messages                                                        | Accessibility | `ContactForm.tsx:176,194`              |
| 7   | Fix MoreInfoToggle keyboard accessibility                                                                | Accessibility | `MoreInfoToggle.tsx:21-26`             |
| 8   | Fix Radio/Checkbox group HTML structure                                                                  | Accessibility | `RadioGroup.tsx`, `CheckboxGroup.tsx`  |
| 9   | Fix muted text color contrast                                                                            | Accessibility | `globals.css` / component styles       |

### :orange_circle: HIGH -- Fix Within First Week

| #   | Issue                                             | Category      | Location                              |
| --- | ------------------------------------------------- | ------------- | ------------------------------------- |
| 10  | Fix Image block alt text (use CMS alt field)      | SEO           | `src/components/_blocks/Image.tsx:99` |
| 11  | Re-enable visual breadcrumb navigation            | SEO           | `src/components/UI/Breadcrumb.tsx:16` |
| 12  | Set up analytics (GA4, GSC, CWV monitoring)       | SEO           | Frontend code / external services     |
| 13  | Remove error details from contact API response    | Security      | `src/app/api/contact/route.ts:291`    |
| 14  | Run `npm audit` and fix vulnerabilities           | Security      | Terminal                              |
| 15  | Optimize background image in root layout          | Performance   | `src/app/layout.tsx:96`               |
| 16  | Add bundle analyzer                               | Performance   | `next.config.ts` / dev dependencies   |
| 17  | Consolidate react-icons imports                   | Performance   | Multiple component files              |
| 18  | Add focus ring to menu button                     | Accessibility | `MenuButton.tsx:25`                   |
| 19  | Verify footer icon links have accessible names    | Accessibility | `Footer.tsx`                          |
| 20  | Fix YouTube video title                           | Accessibility | `YouTubeVideo.tsx:41`                 |
| 21  | Disable `poweredByHeader` in next.config          | Security      | `next.config.ts`                      |
| 22  | Fix secondary color contrast on light backgrounds | Accessibility | Component styles                      |

### :yellow_circle: MEDIUM -- Fix Within First Month

| #   | Issue                                              | Category      | Location                                      |
| --- | -------------------------------------------------- | ------------- | --------------------------------------------- |
| 23  | Add `lastmod` to homepage and FAQ in sitemap       | SEO           | `sitemap.xml/route.ts:28-29`                  |
| 24  | Write unique meta descriptions for legal pages     | SEO           | CMS / metadata generation                     |
| 25  | Add MusicVenue/Service structured data schemas     | SEO           | `src/lib/structuredData.ts`                   |
| 26  | Implement persistent rate limiting (Upstash/Redis) | Security      | `src/app/api/contact/route.ts`                |
| 27  | Add CSRF protection to contact form                | Security      | `ContactForm.tsx` / API route                 |
| 28  | Enable AVIF image format                           | Performance   | `next.config.ts`                              |
| 29  | Pause off-screen carousels/slideshows              | Performance   | `HeroImages.tsx`, `ServiceImageSlideshow.tsx` |
| 30  | Add skeleton screens for page loads                | Performance   | Loading components                            |
| 31  | Add preconnect hints for YouTube/Maps              | Performance   | `src/app/layout.tsx`                          |
| 32  | Increase form input focus ring to `ring-2`         | Accessibility | `formStyles.ts`                               |
| 33  | Add hero video accessibility attributes            | Accessibility | `HeroVideo.tsx`                               |
| 34  | Increase menu button touch target size             | Accessibility | `MenuButton.tsx`                              |
| 35  | Rename `NEXT_PUBLIC_CONTACT_EMAIL` to server-only  | Security      | Env vars / contact route                      |
| 36  | Fix hero video preload strategy                    | Performance   | `HeroVideo.tsx:64`                            |
| 37  | Unify CSS constants (header height, brand colors)  | Performance   | Multiple files                                |
| 38  | Add image gallery arrow key navigation             | Accessibility | `ImageGalleryModal.tsx`                       |
| 39  | Check placeholder text contrast ratios             | Accessibility | Form components                               |

### :white_circle: LOW -- Best Practice / Refinement

| #   | Issue                                                         | Category    | Location                  |
| --- | ------------------------------------------------------------- | ----------- | ------------------------- |
| 40  | Add blog post content type                                    | SEO         | Schema, actions, sitemap  |
| 41  | Create "Areas We Serve" page                                  | SEO         | New page                  |
| 42  | Add ProfilePage schema to About page                          | SEO         | `structuredData.ts`       |
| 43  | Build content freshness strategy / calendar                   | SEO         | Process                   |
| 44  | Implement AI Overview optimizations                           | SEO         | Content structure         |
| 45  | Add Speculation Rules API for prefetching                     | Performance | Root layout               |
| 46  | Implement View Transitions API                                | Performance | Root layout / CSS         |
| 47  | Implement shared IntersectionObserver for animations          | Performance | `AnimateIn.tsx`           |
| 48  | Wrap UnifiedImage with React.memo()                           | Performance | `UnifiedImage.tsx`        |
| 49  | Convert ContentWrapper/ResponsiveWrapper to server components | Performance | Component files           |
| 50  | Add Crawl-delay to robots.txt                                 | SEO         | `robots.txt/route.ts`     |
| 51  | Image sitemap for gallery content                             | SEO         | `sitemap.xml/route.ts`    |
| 52  | Cross-Origin Isolation headers                                | Security    | `next.config.ts`          |
| 53  | Add SRI for any external CDN resources                        | Security    | Layout / external scripts |
| 54  | Validate all structured data with Rich Results Test           | SEO         | External tool             |

---

## THINGS DONE WELL

The following aspects of the site are well-implemented and should be maintained:

**SEO:**

- Comprehensive structured data (Organization, LocalBusiness, WebSite, Article, BreadcrumbList, FAQPage, ImageObject)
- Environment-aware noindex/nofollow gating
- Smart canonical URL generation with trailing slash consistency
- Full OG and Twitter Card implementation with image fallback chain
- Geographic meta tags for local SEO
- Proper font loading with `next/font/google` and `display: swap`

**Security:**

- Sanity webhook signature verification
- Server-only Sanity tokens
- No hardcoded secrets
- Honeypot bot detection on contact form
- Input validation and sanitization
- Draft mode properly gated

**Performance:**

- Server-first architecture (server components by default)
- Tag-based ISR revalidation with webhook support
- Critical CSS inlining for LCP optimization
- UnifiedImage component with DPI-aware sizing, LQIP, and lazy loading
- Hero images with priority loading
- Sanity Studio dynamically imported
- Console removal in production builds
- Efficient GROQ queries with specific projections (no over-fetching)
- DNS prefetch and preconnect for Sanity CDN

**Accessibility:**

- Skip-to-content link with visible focus state
- Semantic HTML structure (header, main, footer, nav)
- Focus trapping in modals with focus restoration
- Body scroll lock reference counting
- Escape key closes all overlays
- Loading overlay properly announced to screen readers
- Viewport allows pinch-to-zoom
- CTA component with intelligent button/link semantics
- Decorative images properly marked with aria-hidden
- `scroll-padding-top` prevents focus obscuring by sticky header

---

_Audit performed using static code analysis, live site inspection, and current (2025-2026) best practice research. For dynamic testing, run Lighthouse, axe DevTools, and WAVE against the deployed site. For real-world CWV data, use Google PageSpeed Insights and Chrome UX Report after the site has production traffic._
