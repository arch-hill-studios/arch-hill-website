// AI Helper: This is a custom Sanity input component for anchor ID fields with a working Generate button.

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StringInputProps, set, unset, useFormValue, useClient } from 'sanity';
import { AnchorReferenceUpdater } from '../lib/anchorReferenceUpdater';
import { apiVersion } from '../env';

interface SectionData {
  _type: string;
  _key?: string;
  title?: string;
  anchorId?: string;
  content?: SectionData[];
}

interface ExtendedProps extends StringInputProps {
  parent?: SectionData;
  document?: {
    content?: SectionData[];
  };
}

export const AnchorIdInput = (props: ExtendedProps) => {
  const { value, onChange, elementProps, path } = props;
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingReferences, setIsUpdatingReferences] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastGeneratedRef = useRef<string>('');
  const originalAnchorIdRef = useRef<string>('');

  const client = useClient({ apiVersion });
  const referenceUpdater = useRef(new AnchorReferenceUpdater(client));

  // Use Sanity's useFormValue to get the parent section data
  const document = useFormValue([]) as { _id?: string; content?: SectionData[] }; // Get the entire document

  // Get the parent path by removing the last segment (which is 'anchorId')
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as SectionData; // Get the parent section

  // Track original anchor ID before any changes
  useEffect(() => {
    if (value && !originalAnchorIdRef.current) {
      originalAnchorIdRef.current = value;
    }
  }, [value]);

  // Generate anchor ID from title with uniqueness checking
  const generateAnchorId = useCallback(
    (title: string) => {
      let generated = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars except word chars, spaces, hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .slice(0, 50);

      // Ensure the ID doesn't start with a number (invalid CSS selector)
      if (generated && /^\d/.test(generated)) {
        generated = 'section-' + generated;
      }

      // Check for duplicates and auto-increment
      if (document?.content) {
        const getAllSections = (content: SectionData[]): SectionData[] => {
          const sections: SectionData[] = [];
          for (const item of content || []) {
            if (
              item._type === 'pageSection' ||
              item._type === 'subSection' ||
              item._type === 'subSubSection'
            ) {
              sections.push(item);
              if (item.content) {
                sections.push(...getAllSections(item.content));
              }
            }
          }
          return sections;
        };

        const allSections = getAllSections(document.content);
        const currentSection = parent;

        // Find existing anchor IDs to avoid duplicates
        const existingIds = allSections
          .filter((section) => section._key !== currentSection?._key)
          .map((section) => section.anchorId)
          .filter(Boolean);

        let finalId = generated;
        let counter = 1;

        // Keep incrementing until we find a unique ID
        while (existingIds.includes(finalId)) {
          counter++;
          finalId = `${generated}-${counter}`;
        }

        return finalId;
      }

      return generated;
    },
    [document, parent]
  );

  // Simple reference update function
  const updateReferences = useCallback(
    async (oldAnchorId: string, newAnchorId: string) => {
      if (!document?._id || !oldAnchorId || !newAnchorId || oldAnchorId === newAnchorId) {
        return;
      }

      setIsUpdatingReferences(true);
      setUpdateStatus('Searching for references...');

      try {
        const result = await referenceUpdater.current.updateAnchorReferences({
          documentId: document._id,
          oldAnchorId,
          newAnchorId,
          sectionKey: parent._key,
        });

        if (result.success && result.updatedReferences > 0) {
          setUpdateStatus(
            `✅ Updated ${result.updatedReferences} reference${result.updatedReferences !== 1 ? 's' : ''}`
          );
        } else {
          setUpdateStatus('ℹ️ No references found to update');
        }
      } catch {
        setUpdateStatus('❌ Failed to update references');
      } finally {
        setIsUpdatingReferences(false);
        setTimeout(() => setUpdateStatus(''), 3000);
      }
    },
    [document?._id, parent._key]
  );

  // Debounced auto-generate anchor ID when title changes
  useEffect(() => {
    const title = parent?.title;

    // Clear existing timeout and reset loading state
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      setIsGenerating(false);
    }

    // Auto-generate whenever there's a title
    if (title) {
      // First generate the ID to see if it would be different
      const generated = generateAnchorId(title);

      // Only update if the generated ID is different from current value AND different from last generated
      if (generated && generated !== value && generated !== lastGeneratedRef.current) {
        setIsGenerating(true);

        // Safety timeout to ensure loading state doesn't get stuck
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
        }
        safetyTimeoutRef.current = setTimeout(() => {
          setIsGenerating(false);
        }, 2000);

        // Debounce the generation by 500ms
        debounceTimeoutRef.current = setTimeout(() => {
          try {
            // Capture the current value before changing it
            const oldValue = value || originalAnchorIdRef.current;
            onChange(set(generated));
            // Only store the generated value AFTER successful onChange
            lastGeneratedRef.current = generated;

            // Trigger reference update if we have a valid old value
            if (oldValue && oldValue !== generated && oldValue.length > 0) {
              setTimeout(() => {
                updateReferences(oldValue, generated);
              }, 500);
            }
          } catch {
            // Error setting anchor ID
          } finally {
            if (safetyTimeoutRef.current) {
              clearTimeout(safetyTimeoutRef.current);
            }
            setIsGenerating(false);
          }
        }, 500);
      } else {
        // No generation needed, ensure loading state is cleared
        setIsGenerating(false);
      }
    } else {
      // If title is cleared and we have a value, clear the anchor ID
      if (value) {
        onChange(unset());
        lastGeneratedRef.current = '';
      }
      setIsGenerating(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      setIsGenerating(false);
    };
  }, [parent?.title, value, generateAnchorId, onChange, updateReferences]);

  const handleRegenerate = useCallback(() => {
    setIsRegenerating(true);

    const title = parent?.title;

    if (title) {
      const generated = generateAnchorId(title);
      if (generated) {
        lastGeneratedRef.current = generated;
        onChange(set(generated));
      } else {
        onChange(unset());
      }
    } else {
      // Fallback if no title is available
      const demoId = `section-${Date.now()}`;
      lastGeneratedRef.current = demoId;
      onChange(set(demoId));
    }

    setIsRegenerating(false);
  }, [parent, generateAnchorId, onChange]);

  const isLoading = isGenerating || isRegenerating || isUpdatingReferences;

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            {...elementProps}
            type='text'
            value={value || ''}
            placeholder='Auto-generated from section title'
            readOnly
            style={{
              width: '100%',
              padding: '10px 12px',
              paddingRight: isGenerating ? '40px' : '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              backgroundColor: isGenerating ? '#f9fafb' : '',
              opacity: isGenerating ? 0.7 : 1,
              cursor: isGenerating ? 'wait' : 'not-allowed',
              color: isGenerating ? '#495057' : '#ffffff',
              borderStyle: 'dashed',
            }}
            disabled={isGenerating}
          />
          {isGenerating && (
            <div
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #f59e0b',
                borderRadius: '50%',
                transformOrigin: 'center',
              }}
              className='spinner'
            />
          )}
        </div>
        <button
          type='button'
          onClick={handleRegenerate}
          disabled={isLoading}
          style={{
            padding: '10px 16px',
            backgroundColor: isLoading ? '#9ca3af' : '#4b72f4',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}>
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .spinner {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
          }
        `,
        }}
      />
      {value && !isGenerating && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#6b7280',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}>
          Auto-generated anchor: <strong>#{value}</strong> • Use &ldquo;Regenerate&rdquo; to update
        </div>
      )}
      {isGenerating && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#9ca3af',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}>
          Generating anchor ID from title...
        </div>
      )}
      {isUpdatingReferences && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#f59e0b',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}>
          🔄 Updating references...
        </div>
      )}
      {updateStatus && !isUpdatingReferences && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: updateStatus.includes('✅')
              ? '#10b981'
              : updateStatus.includes('❌')
                ? '#ef4444'
                : '#6b7280',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}>
          {updateStatus}
        </div>
      )}
    </div>
  );
};
