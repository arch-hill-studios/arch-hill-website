import { type SchemaTypeDefinition } from 'sanity';


import { blockContentType } from './blockContentType';
import { pageType } from './pageType';
import { homePageType } from './homePageType';
import { homePageHeroType } from './homePageHeroType';
import { homePageSectionsType } from './homePageSectionsType';
import { headerType } from './headerType';
import { footerType } from './footerType';
import { pageBuilderType } from './pageBuilderType';
import { pageSectionType } from './pageSectionType';
import { subSectionType } from './subSectionType';
import { subSubSectionType } from './subSubSectionType';
import { contentWrapperType } from './contentWrapperType';
import { dividerType } from './blocks/dividerType';
import { richTextType } from './blocks/richTextType';
import { responsiveWrapperType } from './blocks/responsiveWrapperType';
import { gridLayoutType } from './blocks/gridLayoutType';
import { imageType } from './blocks/imageType';
import { imageGalleryType } from './blocks/imageGalleryType';
import { googleMapType } from './blocks/googleMapType';
import { youTubeVideoType } from './blocks/youTubeVideoType';
import { quoteType } from './blocks/quoteType';
import { statementType } from './blocks/statementType';
import { twoColumnLayoutType } from './blocks/twoColumnLayoutType';
import { expandingContentType } from './blocks/expandingContentType';
import { ctaButtonType } from './blocks/ctaButtonType';
import { ctaCalloutLinkType } from './blocks/ctaCalloutLinkType';
import { cardType } from './blocks/cardType';
import { embeddedCtaButtonType } from './blocks/embeddedCtaButtonType';
import { homeHeroCtaButtonType } from './blocks/homeHeroCtaButtonType';
import { companyLinksBlockType } from './blocks/companyLinksBlockType';
import { iconListType } from './blocks/iconListType';
import { detailedListType } from './blocks/detailedListType';
import { blockListWithStatsType } from './blocks/blockListWithStatsType';
import { checkListType } from './blocks/checkListType';
import { itemListType } from './blocks/itemListType';
import { serviceCardType } from './blocks/serviceCardType';
import { seoMetaDataType } from './seoMetaDataType';
import { companyLinksType } from './companyLinksType';
import { companyLinksArrayType } from './shared/socialLinksArrayType';
import { ctaListType } from './shared/ctaListType';
import { navLinkType } from './navigation/navLinkType';
import { verticalNavLinkType } from './navigation/verticalNavLinkType';
import { verticalNavDividerType } from './navigation/verticalNavDividerType';
import { navSectionType } from './navigation/navSectionType';
import { termsAndConditionsType } from './termsAndConditionsType';
import { privacyPolicyType } from './privacyPolicyType';
import { contactFormSettingsType } from './contactFormSettingsType';
import { contactGeneralContentType } from './contactGeneralContentType';
import { contactConfirmationEmailType } from './contactConfirmationEmailType';
import { faqPageType } from './faqPageType';
import { faqBlockType } from './blocks/faqBlockType';
import { businessContactInfoType } from './businessContactInfoType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    businessContactInfoType,
    seoMetaDataType,
    companyLinksType,
    contactFormSettingsType,
    homePageType,
    homePageHeroType,
    homePageSectionsType,
    pageType,
    faqPageType,
    contactGeneralContentType,
    contactConfirmationEmailType,
    termsAndConditionsType,
    privacyPolicyType,
    blockContentType,
    // Objects
    headerType,
    footerType,
    pageBuilderType,
    pageSectionType,
    subSectionType,
    subSubSectionType,
    contentWrapperType,
    dividerType,
    richTextType,
    responsiveWrapperType,
    gridLayoutType,
    imageType,
    imageGalleryType,
    googleMapType,
    youTubeVideoType,
    quoteType,
    statementType,
    twoColumnLayoutType,
    expandingContentType,
    ctaButtonType,
    ctaCalloutLinkType,
    cardType,
    embeddedCtaButtonType,
    homeHeroCtaButtonType,
    companyLinksBlockType,
    iconListType,
    detailedListType,
    blockListWithStatsType,
    checkListType,
    itemListType,
    serviceCardType,
    faqBlockType,
    // Shared Components
    companyLinksArrayType,
    ctaListType,
    // Navigation Components
    navLinkType,
    verticalNavLinkType,
    verticalNavDividerType,
    navSectionType,
  ],
};
