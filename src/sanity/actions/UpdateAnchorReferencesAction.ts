// AI Helper: This is a Sanity document action that allows manual updating of anchor references

import { DocumentActionComponent } from 'sanity'
import { AnchorReferenceUpdater } from '../lib/anchorReferenceUpdater'
import { useClient } from 'sanity'

export const UpdateAnchorReferencesAction: DocumentActionComponent = (props) => {
  const { id, type, draft, published } = props
  const client = useClient()

  // Only show this action for documents that contain sections
  const validTypes = ['page', 'homePage']
  if (!validTypes.includes(type)) {
    return null
  }

  const referenceUpdater = new AnchorReferenceUpdater(client)

  return {
    label: 'Update Anchor References',
    icon: () => '🔄',
    tone: 'primary',
    onHandle: async () => {
      const document = draft || published
      if (!document?.content) {
        alert('No content found in this document')
        return
      }

      // Extract all sections with anchor IDs
      const getAllSections = (content: unknown[]): Array<{ title: string; anchorId: string; _key?: string }> => {
        const sections: Array<{ title: string; anchorId: string; _key?: string }> = []
        
        const processSections = (items: unknown[]) => {
          if (!Array.isArray(items)) return;
          
          for (const item of items) {
            const section = item as {
              _type?: string;
              title?: string;
              anchorId?: string;
              _key?: string;
              content?: unknown[];
            };
            
            if (section._type === 'pageSection' || section._type === 'subSection' || section._type === 'subSubSection') {
              if (section.anchorId && section.title) {
                sections.push({
                  title: section.title,
                  anchorId: section.anchorId,
                  _key: section._key
                });
              }
              
              // Process nested content
              if (section.content) {
                processSections(section.content);
              }
            }
          }
        }

        processSections(content)
        return sections
      }

      const sections = getAllSections((document.content as unknown[]) || [])
      
      if (sections.length === 0) {
        alert('No sections with anchor IDs found in this document')
        return
      }

      const sectionTitles = sections.map(s => `• ${s.title} (${s.anchorId})`).join('\n')
      
      const confirm = window.confirm(
        `This will scan all documents for broken anchor references to sections in this document and update them.\n\nSections found:\n${sectionTitles}\n\nContinue?`
      )
      
      if (!confirm) return

      try {
        let totalUpdated = 0
        let totalDocuments = 0
        
        // For each section, regenerate its anchor ID and update references
        for (const section of sections) {
          // Regenerate the anchor ID from the current title
          const newAnchorId = section.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 50)

          // Only update if the anchor ID would be different
          if (newAnchorId !== section.anchorId) {
            const result = await referenceUpdater.updateAnchorReferences({
              documentId: id,
              oldAnchorId: section.anchorId,
              newAnchorId: newAnchorId,
              sectionKey: section._key
            })

            if (result.success) {
              totalUpdated += result.updatedReferences
              totalDocuments += result.updatedDocuments
            }
          }
        }

        if (totalUpdated > 0) {
          alert(`Successfully updated ${totalUpdated} reference${totalUpdated !== 1 ? 's' : ''} across ${totalDocuments} document${totalDocuments !== 1 ? 's' : ''}`)
        } else {
          alert('No references needed updating')
        }
      } catch (error) {
        console.error('Error updating references:', error)
        alert(`Error updating references: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }
}