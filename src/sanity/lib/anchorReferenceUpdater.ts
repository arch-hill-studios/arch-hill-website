// AI Helper: This service handles updating references to anchor IDs when they change
// It finds all documents that reference an old anchor ID and updates them to the new one

import type { SanityClient } from 'sanity';

interface AnchorUpdateData {
  documentId: string;
  oldAnchorId: string;
  newAnchorId: string;
  sectionKey?: string;
}

/**
 * Service to find and update all references to changed anchor IDs
 */
export class AnchorReferenceUpdater {
  private client: SanityClient;

  constructor(client: SanityClient) {
    this.client = client;
  }

  /**
   * Find all documents that reference a specific anchor ID
   */
  private async findReferencingDocuments(documentId: string, anchorId: string) {
    // Query both published and draft documents
    const cleanDocId = documentId.replace('drafts.', '');
    const draftDocId = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`;
    
    // Use a broader query that finds any document with navigation or content arrays
    // Then filter them in JavaScript for anchor references
    const query = `*[_type in ["header", "page", "footer"] || defined(content) || defined(horizontalNav) || defined(verticalNav)]{
      _id,
      _type,
      _rev,
      title,
      content,
      horizontalNav,
      verticalNav
    }`;

    const allDocs = await this.client.fetch(query);
    
    // Filter documents that actually contain the anchor ID in their content
    const filteredDocs = allDocs.filter((doc: unknown) => {
      const typedDoc = doc as { _id: string; content?: unknown; horizontalNav?: unknown; verticalNav?: unknown };
      const hasReference = 
        this.documentContainsAnchorReference(typedDoc.content, documentId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.content, cleanDocId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.content, draftDocId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.horizontalNav, documentId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.horizontalNav, cleanDocId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.horizontalNav, draftDocId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.verticalNav, documentId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.verticalNav, cleanDocId, anchorId) ||
        this.documentContainsAnchorReference(typedDoc.verticalNav, draftDocId, anchorId);
      
      return hasReference;
    });
    
    return filteredDocs;
  }

  /**
   * Recursively check if content contains a reference to the specific anchor ID
   */
  private documentContainsAnchorReference(content: unknown, targetDocId: string, anchorId: string): boolean {
    if (!content || !Array.isArray(content)) return false;
    
    // Also check for clean document ID (without drafts. prefix)
    const cleanTargetDocId = targetDocId.replace('drafts.', '');
    
    for (const item of content) {
      if (!item || typeof item !== 'object') continue;
      
      const typedItem = item as {
        _type?: string;
        internalLink?: { _ref?: string };
        pageSectionId?: string;
        content?: unknown;
        cards?: unknown[];
      };
      
      // Check direct reference (check both draft and published versions)
      if ((typedItem.internalLink?._ref === targetDocId || typedItem.internalLink?._ref === cleanTargetDocId) && 
          typedItem.pageSectionId === anchorId) {
        return true;
      }
      
      // Check nested content
      if (typedItem.content && this.documentContainsAnchorReference(typedItem.content, targetDocId, anchorId)) {
        return true;
      }
      
      // Check cards array (for cardGrid)
      if (typedItem.cards && Array.isArray(typedItem.cards)) {
        if (this.documentContainsAnchorReference(typedItem.cards, targetDocId, anchorId)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Update a single document's anchor references
   */
  private async updateDocumentReferences(
    documentId: string,
    oldAnchorId: string,
    newAnchorId: string,
    targetDocumentId: string
  ): Promise<number> {
    try {
      // Get the current document
      const document = await this.client.getDocument(documentId);
      if (!document) return 0;

      // Build patches for all matching references
      const patches: Array<{ path: string; value: string }> = [];
      
      // Function to recursively find and update anchor references
      const findAndUpdateReferences = (content: unknown, basePath = 'content') => {
        if (!Array.isArray(content)) return;
        
        // Handle both draft and published document IDs
        const cleanTargetDocId = targetDocumentId.replace('drafts.', '');
        const draftTargetDocId = targetDocumentId.startsWith('drafts.') ? targetDocumentId : `drafts.${targetDocumentId}`;
        
        content.forEach((item, index) => {
          if (!item || typeof item !== 'object') return;
          
          const typedItem = item as {
            _type?: string;
            internalLink?: { _ref?: string };
            pageSectionId?: string;
            content?: unknown;
            cards?: unknown[];
          };

          const itemPath = `${basePath}[${index}]`;
          
          // Check if this item references our target document (any version) with the old anchor
          const refMatches = typedItem.internalLink?._ref === targetDocumentId || 
                           typedItem.internalLink?._ref === cleanTargetDocId || 
                           typedItem.internalLink?._ref === draftTargetDocId;
          
          if (refMatches && typedItem.pageSectionId === oldAnchorId) {
            patches.push({
              path: `${itemPath}.pageSectionId`,
              value: newAnchorId
            });
          }

          // Recursively check nested content
          if (typedItem.content) {
            findAndUpdateReferences(typedItem.content, `${itemPath}.content`);
          }
          
          // Check cards array (for cardGrid)
          if (typedItem.cards && Array.isArray(typedItem.cards)) {
            findAndUpdateReferences(typedItem.cards, `${itemPath}.cards`);
          }
        });
      };

      // Find all references in the document content
      if (Array.isArray(document.content)) {
        findAndUpdateReferences(document.content, 'content');
      }
      
      // Check navigation arrays for header documents
      if (Array.isArray(document.horizontalNav)) {
        findAndUpdateReferences(document.horizontalNav, 'horizontalNav');
      }
      
      if (Array.isArray(document.verticalNav)) {
        findAndUpdateReferences(document.verticalNav, 'verticalNav');
      }


      // Apply patches if any were found
      if (patches.length > 0) {
        // Use a single transaction to apply all patches
        const transaction = this.client.transaction();
        
        patches.forEach(patch => {
          // Create proper patch object
          transaction.patch(documentId, {
            set: {
              [patch.path]: patch.value
            }
          });
        });
        
        await transaction.commit();
        return patches.length;
      }

      return 0;
    } catch (error) {
      console.error(`Error updating references in document ${documentId}:`, error);
      throw error;
    }
  }

  /**
   * Main method to update all references when an anchor ID changes
   */
  async updateAnchorReferences({
    documentId,
    oldAnchorId,
    newAnchorId
  }: AnchorUpdateData): Promise<{
    success: boolean;
    updatedDocuments: number;
    updatedReferences: number;
    error?: string;
  }> {
    try {
      // Find all documents that reference the old anchor ID
      const referencingDocuments = await this.findReferencingDocuments(documentId, oldAnchorId);
      
      if (!referencingDocuments || referencingDocuments.length === 0) {
        return {
          success: true,
          updatedDocuments: 0,
          updatedReferences: 0
        };
      }

      let totalUpdatedReferences = 0;
      let updatedDocumentsCount = 0;

      // Update each referencing document
      for (const doc of referencingDocuments) {
        try {
          const updatedCount = await this.updateDocumentReferences(
            doc._id,
            oldAnchorId,
            newAnchorId,
            documentId
          );

          if (updatedCount && updatedCount > 0) {
            totalUpdatedReferences += updatedCount;
            updatedDocumentsCount++;
          }
        } catch {
          // Continue with other documents even if one fails
        }
      }

      const result = {
        success: true,
        updatedDocuments: updatedDocumentsCount,
        updatedReferences: totalUpdatedReferences
      };

      return result;

    } catch (error) {
      return {
        success: false,
        updatedDocuments: 0,
        updatedReferences: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}