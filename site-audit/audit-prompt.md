# Site Audit — SEO, Security, Performance & Accessibility

## Claude Code Prompt

"Go through this website in extreme detail and audit it across four areas: **SEO**, **security**, **performance**, and **accessibility**. For each area, find all issues — both technical and on-page — so the site is production-ready and competitive.

**SEO:** Use the reference checklist at `/site-audit/references/SEO_AUDIT_CHECKLIST.md` as a starting point — it covers the baseline SEO issues and level of detail I expect. However, don't treat it as exhaustive. Please also research current SEO best practices, recent algorithm updates, and any emerging trends (e.g., AI overviews, E-E-A-T signals, Core Web Vitals changes, new schema types, etc.) and check the website against those as well.

**Security:** Audit for common web security vulnerabilities — OWASP Top 10 issues (XSS, injection, CSRF, etc.), insecure headers (missing CSP, HSTS, X-Frame-Options, etc.), exposed environment variables or secrets, insecure API routes, missing rate limiting, dependency vulnerabilities, and any other security concerns relevant to the stack.

**Performance:** Audit for performance bottlenecks — large JavaScript bundles, unoptimised images, render-blocking resources, excessive client-side JavaScript, missing caching strategies, slow server responses, layout shifts, and anything else that impacts Core Web Vitals or page load speed.

**Accessibility:** Audit against WCAG 2.1 AA standards — missing or incorrect ARIA attributes, poor colour contrast, missing form labels, keyboard navigation issues, screen reader compatibility, focus management, heading hierarchy, and any other accessibility gaps.

If you find issues beyond what the reference checklist covers in any of these areas, include them. Once you're done, document everything as a single checklist-style document organised by category (SEO, Security, Performance, Accessibility) and place it in `/site-audit/output/`."

## Google PageSpeed

Once the above has been implemented, run the website through Google PageSpeed (or something similar) to catch any remaining performance and accessibility issues that may have been missed.
