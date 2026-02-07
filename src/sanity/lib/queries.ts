import { defineQuery } from 'next-sanity';

// Reusable internal link dereferencing with href computation and section anchor support
const internalLinkProjection = `{
  _id,
  _type,
  title,
  "slug": select(
    _type == "homePage" => {"current": ""},
    _type == "faqPage" => {"current": "faq"},
    _type == "contactGeneralContent" => {"current": "contact"},
    _type == "termsAndConditions" => {"current": "terms-and-conditions"},
    _type == "privacyPolicy" => {"current": "privacy-policy"},
    slug
  ),
  "pageType": _type,
  "href": select(
    _type == "homePage" => "/",
    _type == "faqPage" => "/faq",
    _type == "contactGeneralContent" => "/contact",
    _type == "termsAndConditions" => "/terms-and-conditions",
    _type == "privacyPolicy" => "/privacy-policy",
    "/" + slug.current
  )
}`;

// Enhanced link projection that includes section anchors
const fullLinkProjection = `
  ...,
  internalLink->${internalLinkProjection},
  "computedHref": select(
    linkType == "external" => externalUrl,
    linkType == "internal" && defined(pageSectionId) && pageSectionId != "" =>
      coalesce(internalLink->${internalLinkProjection}.href, "/") + "#" + pageSectionId,
    linkType == "internal" =>
      coalesce(internalLink->${internalLinkProjection}.href, "/"),
    "/"
  )
`;

// Simple content projection for deeply nested content (inside cards)
// Cards can only contain CONTENT_ONLY_BLOCKS (no nested layouts/cards)
const cardContentProjection = `
  ...,
  _type == "ctaButton" => {${fullLinkProjection}},
  _type == "ctaCalloutLink" => {${fullLinkProjection}},
  _type == "imageBlock" => {
    ...,
    image{
      asset,
      alt,
      hotspot,
      crop
    }
  },
  _type == "imageGallery" => {
    ...,
    images[]{
      _key,
      image{
        asset,
        alt,
        hotspot,
        crop
      }
    }
  }
`;

// Closing card projection that properly expands card content including CTAs
const closingCardProjection = `{
  ...,
  image{
    asset,
    alt,
    hotspot,
    crop
  },
  content[]{${cardContentProjection}}
}`;

// Single content block projection for top-level content
//
// NESTING RULES (enforced by schema):
// - Top-level: Can contain twoColumnLayout, gridLayout, card, and all content blocks
// - Layout blocks (grid/twoColumn): Can contain cards and content blocks (LAYOUT_CHILD_BLOCKS)
// - Cards: Can only contain content blocks (CONTENT_ONLY_BLOCKS) - NO nested cards or layouts
//
// This controlled nesting ensures all internal link references are properly dereferenced
// without hitting GROQ recursion limits.
const contentProjection = `
  ...,
  image{
    asset,
    alt,
    hotspot,
    crop
  },
  _type == "imageGallery" => {
    ...,
    images[]{
      _key,
      image{
        asset,
        alt,
        hotspot,
        crop
      }
    }
  },
  _type == "pageSection" => {
    ...,
    anchorId,
    topText
  },
  _type == "subSection" => {
    ...,
    anchorId
  },
  _type == "subSubSection" => {
    ...,
    anchorId
  },
  _type == "contentWrapper" => {
    ...,
    backgroundStyle,
    useCompactGap
  },
  _type == "ctaButton" => {${fullLinkProjection}},
  _type == "ctaCalloutLink" => {${fullLinkProjection}},
  _type == "card" => {${fullLinkProjection}},
  _type == "ctaCard" => {${fullLinkProjection}},
  _type == "twoColumnLayout" => {
    ...,
    leftColumn[]{
      ...,
      _type == "card" => {${fullLinkProjection}},
      _type == "ctaButton" => {${fullLinkProjection}},
      _type == "ctaCalloutLink" => {${fullLinkProjection}},
      _type == "imageBlock" => {
        ...,
        image{
          asset,
          alt,
          hotspot,
          crop
        }
      },
      _type == "imageGallery" => {
        ...,
        images[]{
          _key,
          image{
            asset,
            alt,
            hotspot,
            crop
          }
        }
      }
    },
    rightColumn[]{
      ...,
      _type == "card" => {${fullLinkProjection}},
      _type == "ctaButton" => {${fullLinkProjection}},
      _type == "ctaCalloutLink" => {${fullLinkProjection}},
      _type == "imageBlock" => {
        ...,
        image{
          asset,
          alt,
          hotspot,
          crop
        }
      },
      _type == "imageGallery" => {
        ...,
        images[]{
          _key,
          image{
            asset,
            alt,
            hotspot,
            crop
          }
        }
      }
    }
  },
  _type == "gridLayout" => {
    ...,
    content[]{
      ...,
      _type == "card" => {${fullLinkProjection}},
      _type == "ctaButton" => {${fullLinkProjection}},
      _type == "ctaCalloutLink" => {${fullLinkProjection}},
      _type == "imageBlock" => {
        ...,
        image{
          asset,
          alt,
          hotspot,
          crop
        }
      },
      _type == "imageGallery" => {
        ...,
        images[]{
          _key,
          image{
            asset,
            alt,
            hotspot,
            crop
          }
        }
      }
    }
  }
`;

// Recursive content structure with 4 levels of nesting
// This is the complete content pattern that can be reused across queries
const recursiveContent = `content[]{${contentProjection},
  "content": content[]{${contentProjection},
    "content": content[]{${contentProjection},
      "content": content[]{${contentProjection}
      }
    }
  }
}`;

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  subtitle,
  slug,
  ${recursiveContent},
  heroImage{
    asset,
    alt,
    hotspot,
    crop
  },
  hasClosingCard,
  closingCard${closingCardProjection}
}`);

// Home Page Hero Query - fetches the hero section data
export const HOME_PAGE_HERO_QUERY = defineQuery(`*[_id == "homePageHero"][0]{
  _id,
  _type,
  heroStyle,
  heroImages[]{
    _key,
    _type,
    asset,
    alt,
    hotspot,
    crop
  },
  heroVideo{
    asset
  },
  heroImageTransitionDuration,
  h1Title,
  mainTitle,
  subTitle,
  heroCallToActionList[]{
    _type,
    _key,
    _type == "embeddedCtaButton" => {${fullLinkProjection}},
    _type == "embeddedCtaEmailButton" => {...}
  },
  hideScrollIndicator,
  heroDefaultContentPosition,
  heroContentPosition
}`);

// Home Page Sections Query - fetches the custom sections data
export const HOME_PAGE_SECTIONS_QUERY = defineQuery(`*[_id == "homePageSections"][0]{
  _id,
  _type,
  ${recursiveContent}
}`);

export const HEADER_QUERY = defineQuery(`*[_id == "header"][0]{
  _id,
  _type,
  showVerticalNavOnDesktop,
  horizontalNav[]{${fullLinkProjection}},
  horizontalNavCtas[]{
    _type,
    _key,
    _type == "embeddedCtaButton" => {${fullLinkProjection}},
    _type == "embeddedCtaEmailButton" => {...}
  },
  verticalNav[]{
    _type,
    hideSection,
    hideOnDesktop,
    heading,
    links[]{${fullLinkProjection}}
  },
  verticalNavCtas[]{
    _type,
    _key,
    _type == "embeddedCtaButton" => {${fullLinkProjection}},
    _type == "embeddedCtaEmailButton" => {...}
  }
}`);

export const SEO_META_DATA_QUERY = defineQuery(`*[_id == "seoMetaData"][0]{
  _id,
  _type,
  siteTitle,
  siteTagline,
  siteDescription,
  seoKeywords,
  defaultOgImage{
    asset,
    alt,
    hotspot,
    crop
  }
}`);

export const BUSINESS_CONTACT_INFO_QUERY = defineQuery(`*[_id == "businessContactInfo"][0]{
  _id,
  _type,
  organizationName,
  organizationDescription,
  brandTextImage{
    asset,
    alt,
    hotspot,
    crop
  },
  organizationEmail,
  organizationPhone,
  organizationAddress,
  googleMapsLink,
  googleMapsEmbedCode,
  businessLocation{
    streetAddress,
    addressLocality,
    postalCode,
    addressRegion,
    addressCountry,
    latitude,
    longitude,
    regionCode
  },
  businessHours,
  priceRange,
  serviceAreas[]{
    areaType,
    areaName
  }
}`);

export const COMPANY_LINKS_QUERY = defineQuery(`*[_id == "companyLinks"][0]{
  _id,
  _type,
  companyLinks{
    _type,
    socialLinksArray[]{
      _key,
      platform,
      url,
      customTitle,
      hideFromFooter
    }
  }
}`);

export const CONTACT_FORM_SETTINGS_QUERY = defineQuery(`*[_id == "contactFormSettings"][0]{
  _id,
  _type,
  formTitle,
  formSubtitle,
  successHeading,
  successMessage
}`);

export const FOOTER_QUERY = defineQuery(`*[_type == "footer" && _id == "footer"][0]{
  _id,
  _type,
  footerMessages[]{
    _key,
    title,
    message
  },
  quickLinks[]{
    _key,
    label,
    ${fullLinkProjection}
  },
  copyrightText
}`);

// Sitemap queries
export const ALL_PAGES_QUERY = defineQuery(`*[_type == "page" && defined(slug.current)]{
  _id,
  _updatedAt,
  title,
  slug
}`);

// Legal document queries
export const TERMS_AND_CONDITIONS_QUERY = defineQuery(`*[_id == "termsAndConditions"][0]{
  _id,
  _type,
  _updatedAt,
  hide,
  title,
  topText,
  ${recursiveContent}
}`);

export const PRIVACY_POLICY_QUERY = defineQuery(`*[_id == "privacyPolicy"][0]{
  _id,
  _type,
  _updatedAt,
  hide,
  title,
  topText,
  ${recursiveContent}
}`);

export const FAQ_PAGE_QUERY = defineQuery(`*[_id == "faqPage"][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  subtitle,
  ${recursiveContent}
}`);

// Legal pages visibility query for footer
export const LEGAL_PAGES_VISIBILITY_QUERY = defineQuery(`{
  "termsAndConditions": *[_id == "termsAndConditions"][0]{_id, hide},
  "privacyPolicy": *[_id == "privacyPolicy"][0]{_id, hide}
}`);

// Contact General Content query
export const CONTACT_GENERAL_CONTENT_QUERY = defineQuery(`*[_id == "contactGeneralContent"][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  subtitle,
  introduction,
  emailTitle,
  phoneTitle,
  closingCardTitle,
  closingCardBody,
  closingCardCtaText,
  linkType,
  internalLink->{
    _id,
    _type,
    title,
    "slug": select(
      _type == "homePage" => {"current": ""},
      _type == "faqPage" => {"current": "faq"},
      _type == "contactGeneralContent" => {"current": "contact"},
      _type == "termsAndConditions" => {"current": "terms-and-conditions"},
      _type == "privacyPolicy" => {"current": "privacy-policy"},
      slug
    ),
    "href": select(
      _type == "homePage" => "/",
      _type == "faqPage" => "/faq",
      _type == "contactGeneralContent" => "/contact",
      _type == "termsAndConditions" => "/terms-and-conditions",
      _type == "privacyPolicy" => "/privacy-policy",
      "/" + slug.current
    )
  },
  externalUrl,
  pageSectionId,
  openInNewTab
}`);

// Contact Confirmation Email query
export const CONTACT_CONFIRMATION_EMAIL_QUERY = defineQuery(`*[_id == "contactConfirmationEmail"][0]{
  _id,
  _type,
  emailGreeting,
  emailIntroMessage,
  emailOutroMessage
}`);

