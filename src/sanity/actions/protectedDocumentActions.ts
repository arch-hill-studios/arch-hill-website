// AI Helper: This file defines document actions that prevent deletion and duplication of protected Sanity documents.
// These actions ensure that critical singleton documents cannot be accidentally deleted or duplicated.

import { DocumentActionsResolver } from 'sanity';

// List of document types that should be protected from deletion and duplication
const PROTECTED_DOCUMENT_TYPES = [
  'businessContactInfo',
  'seoMetaData',
  'header',
  'footer',
  'homePage',
  'homePageHero',
  'homePageSections',
  'faqPage',
  'contactFormSettings',
  'contactConfirmationEmail',
  'companyLinks',
  'termsAndConditions',
  'privacyPolicy'
];

export const protectedDocumentActions: DocumentActionsResolver = (prev, { schemaType }) => {
  // If this is a protected document type, filter out delete and duplicate actions
  if (PROTECTED_DOCUMENT_TYPES.includes(schemaType)) {
    return prev.filter(
      (action) =>
        action.action !== 'delete' &&
        action.action !== 'duplicate'
    );
  }

  // For all other document types, return the default actions
  return prev;
};