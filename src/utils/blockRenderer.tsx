import React from 'react';
import { createDataAttribute } from 'next-sanity';
import type {
  RichText as RichTextType,
  Statement as StatementType,
  Quote as QuoteType,
  TwoColumnLayout as TwoColumnLayoutType,
  ExpandingContent as ExpandingContentType,
  CtaButton as CtaButtonType,
  CtaCalloutLink as CtaCalloutLinkType,
  Card as CardType,
  ImageBlock as ImageBlockType,
  ImageGallery as ImageGalleryType,
  GoogleMap as GoogleMapType,
  YouTubeVideo as YouTubeVideoType,
  CompanyLinksBlock as CompanyLinksBlockType,
  IconList as IconListType,
  DetailedList as DetailedListType,
  BlockListWithStats as BlockListWithStatsType,
  CheckList as CheckListType,
  ItemList as ItemListType,
  ServiceCard as ServiceCardType,
  Divider as DividerType,
  ResponsiveWrapper as ResponsiveWrapperType,
  GridLayout as GridLayoutType,
  FaqBlock as FaqBlockType,
  ServiceList as ServiceListType,
} from '@/sanity/types';
import type { PageBuilderData } from '@/actions';
import { getGoogleMapsEmbedCode } from '@/lib/organizationInfo';

// Import all block components
import RichText from '@/components/_blocks/RichText';
import Statement from '@/components/_blocks/Statement';
import Quote from '@/components/_blocks/Quote';
import TwoColumnLayout from '@/components/_blocks/TwoColumnLayout';
import ExpandingContent from '@/components/_blocks/ExpandingContent';
import CTAButton from '@/components/_blocks/CTAButton';
import CTACalloutLinkComponent from '@/components/_blocks/CTACalloutLink';
import CardComponent from '@/components/_blocks/Card';
import ImageBlock from '@/components/_blocks/Image';
import ImageGallery from '@/components/_blocks/ImageGallery';
import GoogleMap from '@/components/_blocks/GoogleMap';
import YouTubeVideo from '@/components/_blocks/YouTubeVideo';
import CompanyLinksBlock from '@/components/_blocks/CompanyLinksBlock';
import IconList from '@/components/_blocks/IconList';
import DetailedList from '@/components/_blocks/DetailedList';
import BlockListWithStats from '@/components/_blocks/BlockListWithStats';
import CheckList from '@/components/_blocks/CheckList';
import ItemList from '@/components/_blocks/ItemList';
import ServiceCard from '@/components/_blocks/ServiceCard';
import Divider from '@/components/UI/Divider';
import ResponsiveWrapper from '@/components/_blocks/ResponsiveWrapper';
import GridLayout from '@/components/_blocks/GridLayout';
import FAQBlock from '@/components/_blocks/FAQBlock';
import ServiceList from '@/components/_blocks/ServiceList/ServiceList';

interface RenderBlockConfig {
  projectId?: string;
  dataset?: string;
  baseUrl?: string;
}

interface RenderBlockOptions {
  documentId?: string;
  documentType?: string;
  blockPath: string;
  pageBuilderData: PageBuilderData;
  alignment?: 'left' | 'center' | 'right';
  config?: RenderBlockConfig;
}

// Add _key to block types (added by Sanity when blocks are in arrays)
type WithKey<T> = T & { _key: string };

// Union type of all possible block types with _key
type BlockType =
  | WithKey<RichTextType>
  | WithKey<StatementType>
  | WithKey<QuoteType>
  | WithKey<TwoColumnLayoutType>
  | WithKey<ExpandingContentType>
  | WithKey<CtaButtonType>
  | WithKey<CtaCalloutLinkType>
  | WithKey<CardType>
  | WithKey<ImageBlockType>
  | WithKey<ImageGalleryType>
  | WithKey<GoogleMapType>
  | WithKey<YouTubeVideoType>
  | WithKey<CompanyLinksBlockType>
  | WithKey<IconListType>
  | WithKey<DetailedListType>
  | WithKey<BlockListWithStatsType>
  | WithKey<CheckListType>
  | WithKey<ItemListType>
  | WithKey<ServiceCardType>
  | WithKey<DividerType>
  | WithKey<ResponsiveWrapperType>
  | WithKey<GridLayoutType>
  | WithKey<FaqBlockType>
  | WithKey<ServiceListType>;

/**
 * Shared block rendering logic used by both PageBuilder and Card components.
 * This eliminates duplication and ensures consistent block rendering across the app.
 */
export const renderBlock = (block: unknown, options: RenderBlockOptions): React.ReactNode => {
  const {
    documentId,
    documentType,
    blockPath,
    pageBuilderData,
    alignment = 'center',
    config,
  } = options;

  // Destructure for easier access
  const { seoMetaData, companyLinks, contactFormSettings } = pageBuilderData;

  // Type narrow to BlockType
  const typedBlock = block as BlockType;

  // Wrapper for Sanity live editing
  const BlockWrapper = ({ children }: { children: React.ReactNode }) => {
    if (documentId && documentType && config) {
      return (
        <div
          data-sanity={createDataAttribute({
            ...config,
            id: documentId,
            type: documentType,
            path: blockPath,
          }).toString()}>
          {children}
        </div>
      );
    }
    return <div>{children}</div>;
  };

  switch (typedBlock._type) {
    case 'divider': {
      const dividerBlock = typedBlock as WithKey<DividerType>;
      return (
        <BlockWrapper key={dividerBlock._key}>
          <Divider size='half' color='dark' />
        </BlockWrapper>
      );
    }

    case 'richText': {
      const richTextBlock = typedBlock as WithKey<RichTextType>;
      return (
        <BlockWrapper key={richTextBlock._key}>
          <RichText
            {...richTextBlock}
            inheritAlignment={alignment}
            fullWidth={
              documentType === 'blogPost' ||
              documentType === 'termsAndConditions' ||
              documentType === 'privacyPolicy'
            }
          />
        </BlockWrapper>
      );
    }

    case 'statement': {
      const statementBlock = typedBlock as WithKey<StatementType>;
      return (
        <BlockWrapper key={statementBlock._key}>
          <Statement {...statementBlock} />
        </BlockWrapper>
      );
    }

    case 'quote': {
      const quoteBlock = typedBlock as WithKey<QuoteType>;
      return (
        <BlockWrapper key={quoteBlock._key}>
          <Quote {...quoteBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'twoColumnLayout': {
      const twoColBlock = typedBlock as WithKey<TwoColumnLayoutType>;
      return (
        <BlockWrapper key={twoColBlock._key}>
          <TwoColumnLayout
            {...twoColBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
            pageBuilderData={pageBuilderData}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'expandingContent': {
      const expandingContentBlock = typedBlock as WithKey<ExpandingContentType>;
      return (
        <BlockWrapper key={expandingContentBlock._key}>
          <ExpandingContent
            {...expandingContentBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
            pageBuilderData={pageBuilderData}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'ctaButton': {
      const ctaButtonBlock = typedBlock as WithKey<CtaButtonType>;
      return (
        <BlockWrapper key={ctaButtonBlock._key}>
          <CTAButton {...ctaButtonBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'ctaCalloutLink': {
      const ctaCalloutBlock = typedBlock as WithKey<CtaCalloutLinkType>;
      return (
        <BlockWrapper key={ctaCalloutBlock._key}>
          <CTACalloutLinkComponent {...ctaCalloutBlock} />
        </BlockWrapper>
      );
    }

    case 'card': {
      const cardBlock = typedBlock as WithKey<CardType>;
      return (
        <BlockWrapper key={cardBlock._key}>
          <CardComponent {...cardBlock} />
        </BlockWrapper>
      );
    }

    case 'imageBlock': {
      const imageBlockBlock = typedBlock as WithKey<ImageBlockType>;
      return (
        <BlockWrapper key={imageBlockBlock._key}>
          <ImageBlock
            {...imageBlockBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'imageGallery': {
      const imageGalleryBlock = typedBlock as WithKey<ImageGalleryType>;
      return (
        <BlockWrapper key={imageGalleryBlock._key}>
          <ImageGallery
            {...imageGalleryBlock}
            documentId={documentId}
            documentType={documentType}
            pathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'googleMap': {
      const googleMapBlock = typedBlock as WithKey<GoogleMapType>;
      const embedCode = getGoogleMapsEmbedCode(pageBuilderData.businessContactInfo);
      return (
        <BlockWrapper key={googleMapBlock._key}>
          <GoogleMap googleMapsEmbedCode={embedCode} />
        </BlockWrapper>
      );
    }

    case 'youTubeVideo': {
      const youTubeBlock = typedBlock as WithKey<YouTubeVideoType>;
      return (
        <BlockWrapper key={youTubeBlock._key}>
          <YouTubeVideo {...youTubeBlock} />
        </BlockWrapper>
      );
    }

    case 'companyLinksBlock': {
      const companyLinksBlockBlock = typedBlock as WithKey<CompanyLinksBlockType>;
      return (
        <BlockWrapper key={companyLinksBlockBlock._key}>
          <CompanyLinksBlock
            {...companyLinksBlockBlock}
            companyLinks={companyLinks?.companyLinks || null}
          />
        </BlockWrapper>
      );
    }

    case 'iconList': {
      const iconListBlock = typedBlock as WithKey<IconListType>;
      return (
        <BlockWrapper key={iconListBlock._key}>
          <IconList
            {...iconListBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'detailedList': {
      const detailedListBlock = typedBlock as WithKey<DetailedListType>;
      return (
        <BlockWrapper key={detailedListBlock._key}>
          <DetailedList
            {...detailedListBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'blockListWithStats': {
      const blockListWithStatsBlock = typedBlock as WithKey<BlockListWithStatsType>;
      return (
        <BlockWrapper key={blockListWithStatsBlock._key}>
          <BlockListWithStats
            {...blockListWithStatsBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'checkList': {
      const checkListBlock = typedBlock as WithKey<CheckListType>;
      return (
        <BlockWrapper key={checkListBlock._key}>
          <CheckList
            {...checkListBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'itemList': {
      const itemListBlock = typedBlock as WithKey<ItemListType>;
      return (
        <BlockWrapper key={itemListBlock._key}>
          <ItemList {...itemListBlock} inheritAlignment={alignment} />
        </BlockWrapper>
      );
    }

    case 'serviceCard': {
      const serviceCardBlock = typedBlock as WithKey<ServiceCardType>;
      return (
        <BlockWrapper key={serviceCardBlock._key}>
          <ServiceCard
            {...serviceCardBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'responsiveWrapper': {
      const responsiveWrapperBlock = typedBlock as WithKey<ResponsiveWrapperType>;
      return (
        <BlockWrapper key={responsiveWrapperBlock._key}>
          <ResponsiveWrapper
            {...responsiveWrapperBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
            pageBuilderData={pageBuilderData}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'gridLayout': {
      const gridLayoutBlock = typedBlock as WithKey<GridLayoutType>;
      return (
        <BlockWrapper key={gridLayoutBlock._key}>
          <GridLayout
            {...gridLayoutBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
            pageBuilderData={pageBuilderData}
            alignment={alignment}
          />
        </BlockWrapper>
      );
    }

    case 'faqBlock': {
      const faqBlock = typedBlock as WithKey<FaqBlockType>;
      return (
        <BlockWrapper key={faqBlock._key}>
          <FAQBlock
            {...faqBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    case 'serviceList': {
      const serviceListBlock = typedBlock as WithKey<ServiceListType>;
      return (
        <BlockWrapper key={serviceListBlock._key}>
          <ServiceList
            {...serviceListBlock}
            documentId={documentId}
            documentType={documentType}
            fieldPathPrefix={blockPath}
          />
        </BlockWrapper>
      );
    }

    default: {
      // TypeScript exhaustiveness check - this ensures all BlockType cases are handled
      // If you get a TypeScript error here, you're missing a case in the switch statement
      const exhaustiveCheck: never = typedBlock;

      if (process.env.NODE_ENV === 'development') {
        const unknownBlock = exhaustiveCheck as { _type?: string };
        console.warn(
          `[blockRenderer] Unhandled block type: "${unknownBlock._type || 'unknown'}"`,
          '\nBlock data:',
          exhaustiveCheck,
          '\nThis block type may need to be added to the renderBlock switch statement in src/utils/blockRenderer.tsx'
        );
      }
      return null;
    }
  }
};
