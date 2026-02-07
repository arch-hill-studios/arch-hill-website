# Comprehensive SEO Audit Checklist

This document provides a generalised, project-agnostic checklist of SEO issues to look for when auditing any website. Use this as a reference for the types of problems, their severity, and the level of detail expected in an audit.

---

## SECTION 1: CRITICAL PRE-LAUNCH / INFRASTRUCTURE ISSUES

### 1.1 Search Engine Indexing Blocked

- **What to check:** Is a `<meta name="robots" content="noindex, nofollow" />` tag present on production pages?
- **Common cause:** Staging/development environment flags not switched off for production deployment (e.g., environment variables like `NEXT_PUBLIC_ENV` or `NODE_ENV` not set to `production`)
- **Impact:** Site completely invisible to search engines
- **What to verify:**
  - [ ] Production environment variables are configured correctly
  - [ ] View page source in production confirms no `noindex` meta tag
  - [ ] Google Search Console sitemap has been submitted
  - [ ] First indexation confirmed within 48 hours of launch

### 1.2 Missing robots.txt

- **What to check:** Does `/robots.txt` return a valid response or 404?
- **Impact:** Search engines cannot understand crawling preferences
- **Expected content:**
  - `User-agent: *` with `Allow: /`
  - `Disallow` rules for admin areas (e.g., `/studio`, `/api/`, `/admin/`)
  - Sitemap reference pointing to `/sitemap.xml`
- **Verification:**
  - [ ] `/robots.txt` loads and shows correct content
  - [ ] Admin/private paths are disallowed
  - [ ] Sitemap URL is referenced and accessible

### 1.3 Missing XML Sitemap

- **What to check:** Does `/sitemap.xml` exist and include all public pages?
- **Impact:** Poor search engine discoverability of content
- **Expected behaviour:**
  - Dynamically generated from CMS content
  - Includes all public pages, blog posts, and other content types
  - Each URL has `<lastmod>`, `<changefreq>`, and `<priority>` values
  - Automatically updates when content is published or changed
- **Verification:**
  - [ ] `/sitemap.xml` loads and is valid XML
  - [ ] All public pages are included
  - [ ] Development/test pages are excluded (e.g., `/error-test`, `/test-*`, `/misc-ui`)
  - [ ] URLs are accessible and correct
  - [ ] `<lastmod>` dates reflect actual content updates

### 1.4 Missing Canonical Tags

- **What to check:** Do all pages have `<link rel="canonical" href="..." />` in the `<head>`?
- **Impact:** Potential duplicate content issues, diluted link equity
- **Expected behaviour:**
  - Every page has a canonical tag pointing to its preferred URL
  - Uses absolute URLs including the domain
  - Consistent protocol (HTTPS) and trailing slash handling
- **Verification:**
  - [ ] View source on multiple pages confirms canonical tags are present
  - [ ] Canonical URLs use HTTPS
  - [ ] No trailing slash inconsistencies

### 1.5 Production Domain URL Inconsistency

- **What to check:** Is the production domain configured consistently across the codebase?
- **Common problems:**
  - HTTP used instead of HTTPS (security warning, SEO penalty)
  - Trailing slash inconsistency (duplicate content risk)
  - Multiple environment variables for the same purpose (e.g., `NEXT_PUBLIC_SITE_URL` vs `NEXT_PUBLIC_BASE_URL`)
  - Environment variable undefined in production, causing fallback issues
- **Verification:**
  - [ ] Production domain uses HTTPS
  - [ ] No trailing slash inconsistency
  - [ ] Single, consistent base URL variable used throughout codebase
  - [ ] All metadata, sitemaps, and canonical tags use the correct domain

### 1.6 Incomplete or Placeholder Meta Descriptions

- **What to check:** Do any pages have placeholder text (e.g., "Lorem ipsum..."), incomplete sentences, or missing meta descriptions?
- **Impact:** Poor click-through rate from search results, unprofessional appearance
- **Quality standards:**
  - 120-155 characters optimal length
  - Includes target keyword naturally
  - Includes location if relevant for local SEO
  - Clear value proposition
  - Call-to-action where appropriate
- **Verification:**
  - [ ] All pages audited for placeholder/incomplete meta descriptions
  - [ ] 404 page has a meaningful meta description
  - [ ] No pages have empty or default descriptions

---

## SECTION 2: STRUCTURED DATA / SCHEMA MARKUP

### 2.1 No Structured Data Implementation

- **What to check:** Is JSON-LD schema markup present on pages?
- **Impact:** Missing rich snippets, reduced SERP visibility
- **Common missing schemas:**
  - **Organization** — business name, logo, contact, social profiles
  - **WebSite** — site search box, site name
  - **WebPage** — general page information
  - **Article** — blog posts, news articles (with author, dates, images)
  - **BreadcrumbList** — navigation breadcrumbs
  - **ImageObject** — featured images with detailed metadata
  - **LocalBusiness** — for businesses with physical locations (see Section 3)
  - **FAQPage** — for FAQ sections or pages
  - **Event** — for event listings
  - **Review / AggregateRating** — for testimonials and ratings
  - **Industry-specific schemas** — e.g., MusicRecording, MusicAlbum, Product, Service, Course, etc.
- **Verification:**
  - [ ] All pages have appropriate schema markup
  - [ ] Schema validates with Google Rich Results Test
  - [ ] No errors or warnings in structured data

### 2.2 Missing Breadcrumb Schema

- **What to check:** Do pages with breadcrumb navigation also have `BreadcrumbList` structured data?
- **Impact:** Missing breadcrumb rich snippets in search results
- **Verification:**
  - [ ] All pages with visual breadcrumbs also have BreadcrumbList schema
  - [ ] Breadcrumb trail matches actual navigation structure
  - [ ] Homepage, listing pages, detail pages, and legal pages all covered

### 2.3 Missing Article Metadata

- **What to check:** Do blog posts / articles include published and modified dates in both schema and HTML meta tags?
- **Impact:** Search engines may not detect content freshness optimally
- **Expected meta tags:**
  - `article:published_time`
  - `article:modified_time`
  - `article:author`
  - `article:section` (category)
- **Verification:**
  - [ ] Blog post pages include article metadata in `<meta>` tags
  - [ ] Article schema includes `datePublished` and `dateModified`

### 2.4 Missing FAQ Schema

- **What to check:** Does the site have FAQ content that could benefit from FAQPage schema?
- **Impact:** Missing FAQ rich snippets in search results
- **Verification:**
  - [ ] FAQ pages or sections have FAQPage structured data
  - [ ] Questions and answers are marked up correctly
  - [ ] Validates with Google Rich Results Test

### 2.5 Missing Review / Rating Schema

- **What to check:** Does the site display testimonials or reviews without corresponding schema?
- **Impact:** Missing star ratings in search results, reduced click-through rate
- **Verification:**
  - [ ] Testimonials/reviews have Review schema
  - [ ] AggregateRating schema is present if applicable
  - [ ] Reviews include author, date, rating value, and review body

---

## SECTION 3: LOCAL SEO

### 3.1 Missing LocalBusiness Structured Data

- **What to check:** Does the site represent a local business without LocalBusiness schema?
- **Impact:** Reduced local search visibility, no Google Maps integration, no local pack rankings
- **Required fields:**
  - Business name, description, URL
  - Telephone, email
  - Full postal address (street, city, postcode, region, country)
  - Geographic coordinates (latitude, longitude)
  - Opening hours (or "By Appointment Only")
  - Price range (if applicable)
  - Logo and images
  - Area served
  - Social media profile links (`sameAs`)
- **Verification:**
  - [ ] LocalBusiness schema is present on at least the homepage
  - [ ] All fields are populated with real data (no placeholders)
  - [ ] GPS coordinates are accurate
  - [ ] Validates with Google Rich Results Test

### 3.2 Missing Geographic Meta Tags

- **What to check:** Are location-specific meta tags present for local businesses?
- **Expected tags:**
  - `geo.region` (e.g., `US-CA`, `NZ-WKO`)
  - `geo.placename` (city/town name)
  - `geo.position` (latitude;longitude)
  - `ICBM` (latitude, longitude — legacy format)
- **Verification:**
  - [ ] Geographic meta tags present in page source
  - [ ] Coordinates match actual business location

### 3.3 No Google Business Profile Integration

- **What to check:** Has the business claimed and completed their Google Business Profile?
- **Impact:** Missing local pack rankings, map visibility
- **Tasks:**
  - [ ] Google Business Profile claimed and verified
  - [ ] All profile fields completed (100% completion)
  - [ ] High-quality photos added (10+)
  - [ ] Website ownership verified
  - [ ] Initial reviews requested from past clients
  - [ ] Categories set correctly

### 3.4 Missing Local Keywords in Strategic Locations

- **What to check:** Does the content target location-specific search queries?
- **Locations to optimise:**
  - Homepage H1/H2 headings
  - Meta descriptions
  - Service pages — mention service areas explicitly
  - Blog content — location-focused articles
  - Image alt text — include location where relevant
  - Footer — "Serving [Area] and Greater [Region]"
- **Content strategy suggestions:**
  - [ ] "Areas We Serve" section or page
  - [ ] Location-focused blog posts
  - [ ] Service area map or page

---

## SECTION 4: TECHNICAL SEO

### 4.1 Missing Viewport Meta Tag

- **What to check:** Does the root layout include a viewport meta tag?
- **Impact:** Mobile SEO and Core Web Vitals issues
- **Expected:** `<meta name="viewport" content="width=device-width, initial-scale=1" />`
- **Verification:**
  - [ ] Viewport tag present in page source

### 4.2 Missing or Incomplete Favicon / Icon Set

- **What to check:** Are all required icon files present and correctly named?
- **Required files:**
  - `favicon.ico` (32x32)
  - `icon.png` or `icon1.png` (32x32 PNG)
  - `icon2.png` (192x192 PNG) — for Android
  - `apple-icon.png` (180x180 PNG) — for iOS
  - `opengraph-image.png` (1200x630) — for social sharing (optional if CMS provides default OG image)
- **Common mistakes:**
  - Files prefixed with underscore (e.g., `_icon.png`) — framework ignores them
  - Missing larger icon sizes for PWA support
- **Verification:**
  - [ ] All icon files exist and are correctly named
  - [ ] Favicon appears in browser tabs across browsers
  - [ ] Social share preview shows correct image

### 4.3 Missing Web App Manifest

- **What to check:** Does `/manifest.webmanifest` or `/manifest.json` exist?
- **Impact:** "Add to Home Screen" functionality unavailable on mobile
- **Expected content:**
  - App name and short name
  - Description
  - Start URL
  - Display mode (e.g., `standalone`)
  - Theme and background colours matching brand
  - Icon references (192x192 and 512x512)
- **Verification:**
  - [ ] Manifest file loads at expected URL
  - [ ] Icons referenced in manifest exist
  - [ ] Brand colours are correct

### 4.4 Development / Test Pages in Production Sitemap

- **What to check:** Are internal test or development pages being included in the sitemap or accessible to crawlers?
- **Common examples:** `/error-test`, `/test-*`, `/misc-ui`, `/cards`, `/layouts`, `/debug-*`
- **Impact:** Crawl budget waste, confusing signals to search engines
- **Fix:**
  - Filter development pages from sitemap generation in production
  - Add `noindex` meta tag to test pages as a backup
- **Verification:**
  - [ ] Production sitemap contains only public-facing pages
  - [ ] Test pages are not indexable

### 4.5 Sitemap Cache Strategy

- **What to check:** Is the sitemap being cached appropriately?
- **Common issues:**
  - Cache headers being overridden by hosting platform (e.g., Vercel setting `max-age=0`)
  - Sitemap not refreshing when content changes
  - No revalidation strategy
- **Verification:**
  - [ ] Sitemap cache headers are appropriate
  - [ ] Sitemap reflects recent content changes

### 4.6 Title Tag Length Optimisation

- **What to check:** Do any page titles exceed 60 characters?
- **Impact:** Title truncation in search results
- **Best practices:**
  - 50-60 characters optimal for mobile
  - Include primary keyword
  - Include brand name
  - Unique for every page
  - Front-load important keywords
- **Verification:**
  - [ ] All page titles audited for length
  - [ ] No titles exceed 60 characters
  - [ ] Tested with SERP preview tool

### 4.7 Font Loading Optimisation

- **What to check:** Are web fonts loaded optimally?
- **Common issues:**
  - Google Fonts loaded via CSS `@import` instead of framework optimisation (e.g., `next/font`)
  - Render-blocking font requests
  - Flash of Invisible Text (FOIT) or Flash of Unstyled Text (FOUT)
- **Verification:**
  - [ ] Fonts loaded via framework optimisation (e.g., `next/font`)
  - [ ] No render-blocking font requests

---

## SECTION 5: IMAGE SEO & OPTIMISATION

### 5.1 Missing or Poor Alt Text

- **What to check:** Do all images have descriptive, meaningful alt text?
- **Common problems:**
  - Placeholder alt text (e.g., "test", "image", "photo")
  - Generic sequential alt text (e.g., "Gallery image 1", "Gallery image 2")
  - Missing alt text entirely
  - Keyword-stuffed alt text
- **Best practices:**
  - Descriptive and specific to the image content
  - Include location/context where relevant for local SEO
  - Natural language, not keyword stuffing
  - Different for each image (no duplicates)
  - Maximum 125 characters
- **Verification:**
  - [ ] All images audited for alt text quality
  - [ ] No placeholder or generic alt text remains
  - [ ] CMS schema enforces alt text as required field (or strongly encouraged)

### 5.2 Missing Image Schema Markup

- **What to check:** Do featured/content images have ImageObject structured data?
- **Impact:** Missed opportunity for image rich snippets
- **Images that should have schema:**
  - Blog post featured images
  - Gallery images
  - Profile/author images
  - Product images
- **Verification:**
  - [ ] Featured images include ImageObject schema
  - [ ] Schema includes name, description, content URL, and dimensions

### 5.3 Image Performance Optimisation

- **What to check:** Are images optimally delivered?
- **Opportunities:**
  - WebP/AVIF format with fallbacks
  - Blur-up placeholders (LQIP — Low Quality Image Placeholders)
  - Lazy loading for below-fold images
  - Priority loading for hero/above-fold images
  - Responsive `sizes` attribute for different viewports
  - Image file sizes under 200KB where possible
- **Verification:**
  - [ ] Modern image formats in use
  - [ ] Lazy loading implemented for below-fold images
  - [ ] Hero images have `priority` loading
  - [ ] Largest images audited and optimised

---

## SECTION 6: CONTENT OPTIMISATION

### 6.1 Blog Post / Article Content Depth

- **What to check:** Are content pages (blog posts, articles) substantial enough?
- **Best practices:**
  - Minimum 800 words for blog posts
  - 1500-2500 words for pillar/cornerstone content
  - Relevant keywords used naturally throughout
  - Proper heading hierarchy (H2, H3, H4)
  - Images with descriptive alt text
  - Internal and external links
- **Verification:**
  - [ ] Published content audited for word count
  - [ ] Thin content (< 800 words) identified and expanded
  - [ ] Heading hierarchy is correct

### 6.2 Limited Internal Linking Strategy

- **What to check:** Are there contextual internal links between related content?
- **Impact:** Poor link equity distribution, reduced crawl efficiency
- **Opportunities:**
  - Blog posts linking to relevant service/product pages
  - Service pages linking to related blog content
  - "Related articles" or "You might also like" sections
  - Contextual links within body content
  - Breadcrumb navigation (visual + schema)
- **Verification:**
  - [ ] Content pages have contextual internal links
  - [ ] Related content sections exist where appropriate
  - [ ] No orphaned pages (pages with no internal links pointing to them)

### 6.3 No Content Freshness Strategy

- **What to check:** Is there a plan for regular content updates?
- **Impact:** Reduced crawl frequency, stale content signals
- **Recommended strategy:**
  - Minimum 1 post per month
  - Mix of evergreen and timely topics
  - Refresh top-performing content annually
  - Content calendar with planned topics
- **Verification:**
  - [ ] Content calendar exists or is planned
  - [ ] Evergreen content topics identified
  - [ ] Process for refreshing old content established

### 6.4 Missing Video Content Integration

- **What to check:** Could the site benefit from video content, and if video exists, is it properly optimised?
- **Opportunities:**
  - Host on YouTube for discoverability
  - Embed on site with VideoObject schema
  - Optimise video titles and descriptions with keywords
  - Consider creating a video sitemap
- **Verification:**
  - [ ] Embedded videos have VideoObject schema
  - [ ] Video sitemap exists (if significant video content)

---

## SECTION 7: PERFORMANCE & CORE WEB VITALS

### 7.1 JavaScript Bundle Size

- **What to check:** Is the JavaScript bundle optimised for performance?
- **Impact:** Slower Largest Contentful Paint (LCP), reduced mobile performance
- **Optimisation opportunities:**
  - Bundle analysis (e.g., `@next/bundle-analyzer` for Next.js)
  - Lazy loading for below-fold components
  - Route-based code splitting
  - Minimise CMS query payload sizes
  - Dynamic imports for heavy components
  - Tree shaking unused code
- **Verification:**
  - [ ] Bundle analysed for large dependencies
  - [ ] Below-fold components lazy loaded
  - [ ] No unnecessary code shipped to client

### 7.2 Core Web Vitals

- **What to check:** Do all pages meet "Good" thresholds for Core Web Vitals?
- **Metrics:**
  - **LCP (Largest Contentful Paint):** < 2.5 seconds
  - **INP (Interaction to Next Paint):** < 200 milliseconds
  - **CLS (Cumulative Layout Shift):** < 0.1
- **Testing tools:**
  - Google PageSpeed Insights
  - Lighthouse (Chrome DevTools)
  - Google Search Console Core Web Vitals report
  - WebPageTest
- **Verification:**
  - [ ] Lighthouse score 90+ for performance
  - [ ] All Core Web Vitals in "Good" range
  - [ ] Tested on both mobile and desktop

### 7.3 Missing Performance / Analytics Monitoring

- **What to check:** Are analytics and performance monitoring tools set up?
- **Recommended tools:**
  - Google Analytics 4 — traffic, behaviour, conversions
  - Google Search Console — search performance, indexing status
  - Microsoft Clarity — session recordings, heatmaps (free)
  - Hosting analytics (e.g., Vercel Analytics) — Core Web Vitals monitoring
- **Verification:**
  - [ ] Analytics tracking code installed and verified
  - [ ] Google Search Console property verified
  - [ ] Conversion tracking configured for key actions (form submissions, CTAs)
  - [ ] Core Web Vitals monitoring active

---

## SECTION 8: ACCESSIBILITY & MOBILE UX (SEO Impact)

### 8.1 Skip-to-Content Link

- **What to check:** Is a "Skip to main content" link present for keyboard/screen reader users?
- **Impact:** Positive accessibility signal, minor SEO benefit
- **Verification:**
  - [ ] `<a href="#main-content">` or equivalent exists
  - [ ] Link is functional and visually hidden until focused

### 8.2 Mobile Usability

- **What to check:** Is the site fully optimised for mobile-first indexing?
- **Checklist:**
  - [ ] All pages tested on mobile devices (real and emulated)
  - [ ] Tap targets > 48x48px
  - [ ] Font sizes minimum 16px
  - [ ] Forms usable on mobile (inputs, selects, buttons)
  - [ ] No horizontal scrolling on any page
  - [ ] Navigation menu works smoothly on mobile
  - [ ] Tested on slow connections (3G simulation)
- **Testing tools:**
  - Google Mobile-Friendly Test
  - Chrome DevTools mobile emulation
  - Real device testing (iOS and Android)

---

## SECTION 9: COMPETITIVE ANALYSIS & MARKET RESEARCH

### 9.1 Competitor Keyword Gap Analysis

- **What to check:** What keywords are competitors ranking for that this site is not?
- **Tasks:**
  - [ ] Identify top 5 competitors in the local/niche market
  - [ ] Analyse their top-ranking keywords
  - [ ] Review their content topics and depth
  - [ ] Identify keyword gaps to target
  - [ ] Analyse their backlink profiles
  - [ ] Review their local SEO implementation (if applicable)
- **Tools:**
  - Ahrefs or SEMrush (keyword research, competitor analysis)
  - Google Search (manual analysis)
  - Google Business Profile competitor analysis

---

## IMPLEMENTATION PRIORITY MATRIX

### CRITICAL — Pre-Launch Blockers (Week 1)

1. Remove `noindex` from production (if applicable)
2. Fix production domain HTTPS / URL consistency
3. Create `robots.txt`
4. Create XML sitemap
5. Add canonical tags
6. Replace all placeholder meta descriptions
7. Implement core structured data (Organization, WebSite, WebPage)

### HIGH PRIORITY — SEO Foundation (Week 2-3)

8. Implement LocalBusiness schema (if local business)
9. Add geographic meta tags (if local business)
10. Set up Google Business Profile (if local business)
11. Complete favicon and icon set
12. Add viewport meta tag (if missing)
13. Improve image alt text quality
14. Implement breadcrumb navigation + schema

### MEDIUM PRIORITY — Enhancement (Month 1)

15. Implement Review/Rating schema
16. Add FAQ schema
17. Develop internal linking strategy
18. Content depth audit and optimisation
19. Performance audit and bundle optimisation
20. Set up analytics and monitoring
21. Clean up sitemap (remove dev/test pages)
22. Optimise title tag lengths
23. Optimise font loading

### LOW PRIORITY — Refinement (Month 2-3)

24. Create web app manifest
25. Industry-specific structured data
26. Content calendar and freshness strategy
27. Video content integration
28. Image performance optimisation (WebP, LQIP, lazy loading)
29. Competitor keyword gap analysis
30. Sitemap index for scalability (when > 50 URLs)

---

## SUCCESS METRICS TO TRACK

### Technical SEO

- [ ] Google Search Console indexing: 100% of pages
- [ ] Core Web Vitals: all "Good" thresholds
- [ ] Mobile usability: 0 errors
- [ ] Structured data: 0 errors, all enhancements valid
- [ ] Lighthouse performance score: 90+

### Local SEO (if applicable)

- [ ] Google Business Profile: 100% complete
- [ ] Local pack rankings: top 3 for primary keywords
- [ ] Reviews: 10+ Google reviews, 4.5+ average
- [ ] Local citations: 20+ directory listings
- [ ] Maps visibility for local searches

### Content & Engagement

- [ ] Organic traffic: +50% in 6 months
- [ ] Keyword rankings: 20+ keywords in top 10
- [ ] Blog engagement: 2+ min average time on page
- [ ] Conversion rate improvement: baseline + 20%
- [ ] Bounce rate: < 50% site-wide

### Competitive

- [ ] Keyword gaps: close 50% of identified gaps
- [ ] Domain authority: track and improve
- [ ] Backlink growth: +10 quality backlinks in 6 months
- [ ] Brand searches: monitor volume increase

---

## MAINTENANCE SCHEDULE

### Daily

- Monitor Google Search Console for crawl errors
- Check deployment status

### Weekly

- Review analytics for traffic patterns
- Check for new Google Business Profile reviews (if applicable)
- Monitor keyword rankings (if using rank tracker)

### Monthly

- Publish 1-2 new content pieces
- Review and update outdated content
- Check backlink profile
- Analyse competitor activity
- Review Core Web Vitals

### Quarterly

- Comprehensive SEO audit
- Content performance review
- Update structured data as needed
- Review and refresh evergreen content
- Analyse conversion funnel
- Adjust strategy based on results

---

## TOOLS & RESOURCES

### Essential (Free)

- Google Search Console
- Google Analytics 4
- Google Business Profile
- Google Rich Results Test
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)

### Recommended (Paid or Freemium)

- Ahrefs or SEMrush — keyword research, competitor analysis
- Microsoft Clarity — session recordings, heatmaps (free)
- Screaming Frog — technical site audits (free tier available)
- Hosting-specific analytics (e.g., Vercel Analytics)

### Development

- Bundle analyser (e.g., `@next/bundle-analyzer`)
- Chrome DevTools
- SERP preview tools

---

_This checklist is designed to be project-agnostic. Apply it to any website audit by examining each item against the specific site being analysed._
