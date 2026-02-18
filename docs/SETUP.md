# Complete Setup Guide

This guide walks you through setting up a new project using this template.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Sanity CMS Configuration](#sanity-cms-configuration)
4. [Environment Variables](#environment-variables)
5. [Brand Customization](#brand-customization)
6. [Email Configuration](#email-configuration)
7. [Deployment](#deployment)
8. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** installed (see `package.json` `engines` field or `.nvmrc` for version requirements)
- A **Sanity.io** account ([sign up free](https://sanity.io))
- A **Resend** account for emails ([sign up free](https://resend.com))
- A **Vercel** account for deployment ([sign up free](https://vercel.com))

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url> my-project
cd my-project
```

### 2. Install Dependencies

```bash
npm run setup
```

> **`npm run setup`** uses [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) to update all dependencies to their latest versions, then runs `npm install`. If you prefer to keep the template's original versions, run `npm install` instead.

### 3. Create Environment File

```bash
cp .env.example .env.local
```

---

## Sanity CMS Configuration

### 1. Create a Sanity Project

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click "Create new project"
3. Name your project and select a plan
4. Note your **Project ID** from the project dashboard

### 2. Create API Tokens

In your Sanity project settings:

1. Go to **Settings > API > Tokens**
2. Create a **Viewer** token (for read operations)
3. Create an **Editor** token (optional, for migration scripts)
4. Copy these tokens to your `.env.local`

### 3. Configure CORS Origins

In Sanity project settings:

1. Go to **Settings > API > CORS origins**
2. Add your development URL: `http://localhost:3000`
3. Add your production URL when ready

### 4. Update Environment Variables

In `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="development"
SANITY_API_READ_TOKEN="your-viewer-token"
SANITY_API_WRITE_TOKEN="your-editor-token"
```

### 5. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000/studio](http://localhost:3000/studio) to access Sanity Studio.

### 6. Configure Business Information

In Sanity Studio:

1. Go to **Site Management > Business & Contact Info**
2. Fill in your organization details:
   - Organization Name
   - Organization Description
   - Contact Email, Phone, Address
   - Business Location (for SEO structured data)
   - Business Hours, Price Range, Service Areas

---

## Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (usually `development` or `production`) |
| `SANITY_API_READ_TOKEN` | Sanity API token with Viewer permissions |
| `NEXT_PUBLIC_BASE_URL` | Your site URL (e.g., `http://localhost:3000` for dev) |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_CONTACT_EMAIL` | Email for form submissions |
| `RESEND_FROM_EMAIL` | Sender email for automated messages |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `SANITY_API_WRITE_TOKEN` | Sanity API token with Editor permissions (for scripts) |
| `SANITY_WEBHOOK_SECRET` | Secret for webhook revalidation |
| `NEXT_PUBLIC_ENV` | Set to `production` for live site |

---

## Brand Customization

### Logo Images

Replace the logo files in `/public/images/logos/`:

- `logo.png` - Main logo (used in header/footer)

### Brand Colors

Brand colors are defined in **multiple files** for performance optimization. Update all of these:

#### 1. Primary CSS Variables (`src/app/globals.css`)

```css
:root {
  --color-brand-primary: #your-primary-color;
  --color-brand-secondary: #your-secondary-color;
  --color-brand-charcoal: #your-dark-color;
  /* ... other color variables */
}
```

#### 2. Critical Inline CSS (`src/app/layout.tsx`)

Find the `<style>` tag and update the same color values:

```tsx
<style dangerouslySetInnerHTML={{__html: `
  :root {
    --color-brand-primary: #your-primary-color;
    /* ... */
  }
`}} />
```

#### 3. PWA Manifest (`src/app/manifest.ts`)

```typescript
const THEME_COLOR = '#your-primary-color';
const BACKGROUND_COLOR = '#your-dark-color';
```

### Brand Text Image (Optional)

Instead of displaying your organization name as text, you can upload a styled brand image:

1. In Sanity Studio, go to **Site Management > Business & Contact Info**
2. Upload an image to **Brand Text Image**
3. Add alt text for accessibility

If not set, the organization name will display as styled text.

---

## Email Configuration

### 1. Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to `.env.local`:

```bash
RESEND_API_KEY="re_your_api_key"
```

### 2. Configure Email Addresses

```bash
# Where form submissions are sent
RESEND_CONTACT_EMAIL="contact@yoursite.com"

# Sender address for automated emails
# Development: Use Resend's test domain
RESEND_FROM_EMAIL="Your Site <onboarding@resend.dev>"
```

### 3. Production Email Setup

For production, verify your domain in Resend:

1. Go to Resend dashboard > Domains
2. Add and verify your domain
3. Update `RESEND_FROM_EMAIL` to use your domain

---

## Deployment

### Vercel Deployment

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables from `.env.local`
4. Set `NEXT_PUBLIC_ENV` to `production`
5. Set `NEXT_PUBLIC_BASE_URL` to your production domain
6. Deploy

### Environment Variables for Production

Update these for production:

```bash
NEXT_PUBLIC_ENV="production"
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_SANITY_DATASET="production"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

---

## Post-Deployment

### 1. Set Up Sanity Webhook

For on-demand revalidation when content changes:

1. In Sanity, go to **Settings > API > Webhooks**
2. Create a new webhook:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Secret**: Same as `SANITY_WEBHOOK_SECRET`
   - **Trigger on**: Create, Update, Delete
3. Add the secret to your Vercel environment variables

### 2. Configure Production CORS

In Sanity project settings:

1. Go to **Settings > API > CORS origins**
2. Add your production domain

### 3. Set Up SEO Metadata

In Sanity Studio:

1. Go to **Site Management > SEO Meta Data**
2. Configure:
   - Site Title
   - Site Description
   - Default OG Image
   - Keywords

### 4. Configure Social Links

In Sanity Studio:

1. Go to **Company Links**
2. Add your social media profiles
3. These appear in the footer and structured data

---

## Verification Checklist

Before going live, verify:

- [ ] All environment variables are set in production
- [ ] Logo images are replaced
- [ ] Brand colors are updated in all 3 files
- [ ] Organization info is complete in Sanity
- [ ] Email sending works (test contact form)
- [ ] Sanity webhook is configured
- [ ] CORS origins include production domain
- [ ] SEO metadata is configured
- [ ] Site displays correctly on mobile

---

## Troubleshooting

### Sanity Studio Won't Load

- Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Verify CORS origins include your development URL

### Emails Not Sending

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- In production, ensure domain is verified

### Content Not Updating

- Check webhook is configured in Sanity
- Verify `SANITY_WEBHOOK_SECRET` matches in both places
- Check Vercel function logs for revalidation errors

### TypeScript Errors After Schema Changes

Run type generation:

```bash
npm run typegen
```

---

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
