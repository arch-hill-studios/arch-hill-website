# Next.js + Sanity CMS Website Template

A production-ready website template featuring Next.js, Sanity CMS, and comprehensive SEO optimization.

## Features

- **Next.js** with App Router and React Server Components
- **Sanity CMS** for content management with live preview and visual editing
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling
- **Comprehensive SEO** (sitemap, robots.txt, structured data, canonical URLs)
- **Email Integration** with Resend for contact and application forms
- **PWA Support** with web manifest
- **Block-based Page Builder** for flexible content creation
- **Responsive Design** with mobile-first approach

## Quick Start

### Prerequisites

- Node.js (see `package.json` `engines` field or `.nvmrc` for version requirements)
- npm, yarn, or pnpm
- [Sanity.io](https://sanity.io) account
- [Resend](https://resend.com) account (for email functionality)

### 1. Clone and Install

```bash
git clone <repository-url> my-project
cd my-project
npm run setup
```

> **`npm run setup`** uses [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) to update all dependencies in `package.json` to their latest versions, then runs `npm install`. This ensures you start with the most up-to-date packages rather than the versions from when the template was created.
>
> If you prefer to keep the template's original dependency versions, run `npm install` instead.

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials. See `.env.example` for detailed documentation of each variable.

### 3. Set Up Sanity

1. Create a new project at [sanity.io/manage](https://sanity.io/manage)
2. Copy your Project ID to `.env.local`
3. Create API tokens:
   - **Viewer token** for read operations
   - **Editor token** for migration scripts (optional)
4. Add tokens to `.env.local`

### 4. Start Development

```bash
npm run dev
```

Visit:
- **Site**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## Configuration Checklist

After cloning, complete these steps to customize for your project:

### Required Configuration

- [ ] Set up Sanity project and add credentials to `.env.local`
- [ ] Update organization info in Sanity CMS (Site Management > Business & Contact Info)
- [ ] Replace logo images in `/public/images/logos/`
- [ ] Update brand colors in `src/app/globals.css`
- [ ] Set up Resend for email functionality

### Optional Configuration

- [ ] Upload brand text image in Sanity CMS (for styled brand display)
- [ ] Configure SEO metadata in Sanity CMS
- [ ] Set up social media links in Company Links
- [ ] Customize email templates in `src/lib/email-templates/`

See [docs/SETUP.md](docs/SETUP.md) for the complete setup guide.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (frontend)/        # Public-facing pages
│   ├── api/               # API routes
│   └── studio/            # Sanity Studio
├── components/            # React components
│   ├── _blocks/          # Page builder block components
│   ├── Header/           # Header and navigation
│   ├── Footer/           # Footer component
│   └── UI/               # Reusable UI components
├── lib/                   # Utilities and configuration
│   ├── constants.ts      # Site configuration
│   ├── organizationInfo.ts # Organization helpers
│   └── email-templates/  # Email HTML templates
├── sanity/               # Sanity CMS configuration
│   ├── schemaTypes/      # Content schemas
│   └── lib/              # Sanity utilities and queries
├── actions/              # Server actions for data fetching
└── contexts/             # React context providers
```

## Key Concepts

### Block-based Page Builder

Pages are built using a flexible block system with centralized block lists. See CLAUDE.md for the full block architecture documentation, including:
- Adding new block types
- Block rendering system and nesting restrictions
- TypeScript integration

### Live Preview

Sanity's live preview allows content editors to see changes in real-time. See CLAUDE.md for documentation on:
- How stega encoding works and using `stegaClean()`
- Implementing live editing data attributes
- Troubleshooting preview issues

### Data Fetching

This template uses cached data fetching with on-demand revalidation:
- Production: Data cached until webhook triggers revalidation
- Development: Fresh data on every request

## Scripts

```bash
npm run setup        # Update all deps to latest versions and install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript type checking
npm run typegen      # Generate Sanity types
npm run lint         # Run ESLint
```

## Brand Colors

Brand colors are defined in multiple files for performance optimization. When changing colors, update:

1. `src/app/globals.css` - Primary CSS variables
2. `src/app/layout.tsx` - Critical inline CSS
3. `src/app/manifest.ts` - PWA theme colors

See the comments in each file for detailed instructions.

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy

### Sanity Webhook

Set up a webhook in Sanity for on-demand revalidation:

1. Go to Sanity project settings > API > Webhooks
2. Create webhook pointing to `https://your-domain.com/api/revalidate`
3. Use the same secret as `SANITY_WEBHOOK_SECRET` in your environment

## Documentation

- [CLAUDE.md](CLAUDE.md) - AI development instructions, block architecture, live preview, and coding standards
- [Setup Guide](docs/SETUP.md) - Complete setup instructions
- [Dataset Management](docs/sanity-dataset-management.md) - Sanity dataset backup and sync

## License

MIT
