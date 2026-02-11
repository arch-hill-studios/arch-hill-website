// Block types that support unlimited nesting
// This type represents any block that can contain other blocks


import type { Divider, RichText, Statement, Quote, TwoColumnLayout, ExpandingContent, ResponsiveWrapper, GridLayout, ImageBlock as SanityImageBlock, ImageGallery, GoogleMap, YouTubeVideo, PageSection, CtaButton, CtaCalloutLink, Card, EmbeddedCtaButton, SubSection, SubSubSection, ContentWrapper, CompanyLinksBlock, IconList, DetailedList, BlockListWithStats, CheckList, ItemList, ServiceCard, FaqBlock, ServiceList, ContactSection } from '@/sanity/types';

export interface BaseBlock {
  _key: string;
  _type: string;
}

export interface SectionBlock extends BaseBlock {
  _type: 'section';
  title?: string;
  subtitle?: string;
  content?: NestedBlock[];
}

// Use generated Sanity types for proper typing
// Override generated types to make title required (validation ensures this)
export type PageSectionBlock = Omit<PageSection, 'title'> & { _key: string; title: string };
export type SubSectionBlock = Omit<SubSection, 'title'> & { _key: string; title: string };
export type SubSubSectionBlock = Omit<SubSubSection, 'title'> & { _key: string; title: string };
export type ContentWrapperBlock = ContentWrapper & { _key: string };
export type DividerBlock = Divider & { _key: string };
export type RichTextBlock = RichText & { _key: string };
export type StatementBlock = Statement & { _key: string };
export type QuoteBlock = Quote & { _key: string };
export type TwoColumnLayoutBlock = TwoColumnLayout & { _key: string };
export type ExpandingContentBlock = ExpandingContent & { _key: string };
export type ResponsiveWrapperBlock = ResponsiveWrapper & { _key: string };
export type GridLayoutBlock = GridLayout & { _key: string };
export type ImageBlock = SanityImageBlock & { _key: string };
export type ImageGalleryBlock = ImageGallery & { _key: string };
export type GoogleMapBlock = GoogleMap & { _key: string };
export type YouTubeVideoBlock = YouTubeVideo & { _key: string };
export type CTAButtonBlock = CtaButton & { _key: string };
export type CTACalloutLinkBlock = CtaCalloutLink & { _key: string };
export type CardBlock = Card & { _key: string };
export type EmbeddedCTAButtonBlock = EmbeddedCtaButton & { _key: string };
export type CompanyLinksBlockType = CompanyLinksBlock & { _key: string };
export type IconListBlock = IconList & { _key: string };
export type DetailedListBlock = DetailedList & { _key: string };
export type BlockListWithStatsBlock = BlockListWithStats & { _key: string };
export type CheckListBlock = CheckList & { _key: string };
export type ItemListBlock = ItemList & { _key: string };
export type ServiceCardBlock = ServiceCard & { _key: string };
export type FAQBlockType = FaqBlock & { _key: string };
export type ServiceListBlock = ServiceList & { _key: string };
export type ContactSectionBlock = ContactSection & { _key: string };

// Union of all possible block types (current and future)
export type NestedBlock =
  | PageSectionBlock
  | SubSectionBlock
  | SubSubSectionBlock
  | ContentWrapperBlock
  | SectionBlock
  | DividerBlock
  | RichTextBlock
  | StatementBlock
  | QuoteBlock
  | TwoColumnLayoutBlock
  | ExpandingContentBlock
  | ResponsiveWrapperBlock
  | GridLayoutBlock
  | ImageBlock
  | ImageGalleryBlock
  | GoogleMapBlock
  | YouTubeVideoBlock
  | CTAButtonBlock
  | CTACalloutLinkBlock
  | CardBlock
  | CompanyLinksBlockType
  | IconListBlock
  | DetailedListBlock
  | BlockListWithStatsBlock
  | CheckListBlock
  | ItemListBlock
  | ServiceCardBlock
  | FAQBlockType
  | ServiceListBlock
  | ContactSectionBlock;

// Union of blocks that can contain nested content
export type BlockWithContent = PageSectionBlock | SubSectionBlock | SubSubSectionBlock | ContentWrapperBlock | SectionBlock;

// Type guard functions
export const isBlockWithContent = (block: NestedBlock): block is BlockWithContent => {
  return block._type === 'pageSection' || block._type === 'subSection' || block._type === 'subSubSection' || block._type === 'contentWrapper' || block._type === 'section';
};

export const isPageSectionBlock = (block: NestedBlock): block is PageSectionBlock => {
  return block._type === 'pageSection';
};

export const isSubSectionBlock = (block: NestedBlock): block is SubSectionBlock => {
  return block._type === 'subSection';
};

export const isSubSubSectionBlock = (block: NestedBlock): block is SubSubSectionBlock => {
  return block._type === 'subSubSection';
};

export const isContentWrapperBlock = (block: NestedBlock): block is ContentWrapperBlock => {
  return block._type === 'contentWrapper';
};

export const isSectionBlock = (block: NestedBlock): block is SectionBlock => {
  return block._type === 'section';
};

export const isDividerBlock = (block: NestedBlock): block is DividerBlock => {
  return block._type === 'divider';
};

export const isRichTextBlock = (block: NestedBlock): block is RichTextBlock => {
  return block._type === 'richText';
};

export const isStatementBlock = (block: NestedBlock): block is StatementBlock => {
  return block._type === 'statement';
};

export const isQuoteBlock = (block: NestedBlock): block is QuoteBlock => {
  return block._type === 'quote';
};

export const isTwoColumnLayoutBlock = (block: NestedBlock): block is TwoColumnLayoutBlock => {
  return block._type === 'twoColumnLayout';
};

export const isExpandingContentBlock = (block: NestedBlock): block is ExpandingContentBlock => {
  return block._type === 'expandingContent';
};

export const isResponsiveWrapperBlock = (block: NestedBlock): block is ResponsiveWrapperBlock => {
  return block._type === 'responsiveWrapper';
};

export const isGridLayoutBlock = (block: NestedBlock): block is GridLayoutBlock => {
  return block._type === 'gridLayout';
};

export const isImageBlock = (block: NestedBlock): block is ImageBlock => {
  return block._type === 'imageBlock';
};

export const isImageGalleryBlock = (block: NestedBlock): block is ImageGalleryBlock => {
  return block._type === 'imageGallery';
};

export const isGoogleMapBlock = (block: NestedBlock): block is GoogleMapBlock => {
  return block._type === 'googleMap';
};

export const isYouTubeVideoBlock = (block: NestedBlock): block is YouTubeVideoBlock => {
  return block._type === 'youTubeVideo';
};

export const isCTAButtonBlock = (block: NestedBlock): block is CTAButtonBlock => {
  return block._type === 'ctaButton';
};

export const isCTACalloutLinkBlock = (block: NestedBlock): block is CTACalloutLinkBlock => {
  return block._type === 'ctaCalloutLink';
};

export const isCardBlock = (block: NestedBlock): block is CardBlock => {
  return block._type === 'card';
};

export const isCompanyLinksBlock = (block: NestedBlock): block is CompanyLinksBlockType => {
  return block._type === 'companyLinksBlock';
};

export const isIconListBlock = (block: NestedBlock): block is IconListBlock => {
  return block._type === 'iconList';
};

export const isDetailedListBlock = (block: NestedBlock): block is DetailedListBlock => {
  return block._type === 'detailedList';
};

export const isItemListBlock = (block: NestedBlock): block is ItemListBlock => {
  return block._type === 'itemList';
};

export const isFAQBlock = (block: NestedBlock): block is FAQBlockType => {
  return block._type === 'faqBlock';
};

export const isServiceListBlock = (block: NestedBlock): block is ServiceListBlock => {
  return block._type === 'serviceList';
};

export const isContactSectionBlock = (block: NestedBlock): block is ContactSectionBlock => {
  return block._type === 'contactSection';
};
