// AI Helper: This is a searchable dropdown component for selecting section anchor IDs from a specific page.

import React, { useState, useEffect, useMemo } from 'react';
import { StringInputProps, useClient, useFormValue, set, unset } from 'sanity';
import { apiVersion } from '../env';

interface SectionOption {
  value: string;
  label: string;
  type: string;
}

interface SectionDropdownProps extends StringInputProps {
  internalPageRef?: string;
}

export const SectionDropdown = (props: SectionDropdownProps) => {
  const { value, onChange, elementProps, path } = props;
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const client = useClient({ apiVersion });

  // Get the parent path by removing the last segment (which is 'pageSectionId')
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as { internalLink?: { _ref: string } };

  // Get the internal page reference from the parent object
  const internalPageRef = parent?.internalLink?._ref || null;

  // Fetch sections when internal page changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!internalPageRef) {
        setSections([]);
        return;
      }

      setIsLoading(true);
      try {
        // GROQ query to get all sections with anchor IDs from the selected page
        const query = `*[_id == $pageId][0]{
          content[]{
            _type,
            _type == "pageSection" => {
              title,
              anchorId,
              "type": "Page Section"
            },
            _type == "subSection" => {
              title,
              anchorId,
              "type": "Sub Section"
            },
            _type == "subSubSection" => {
              title,
              anchorId,
              "type": "Sub-Sub Section"
            },
            content[]{
              _type,
              _type == "pageSection" => {
                title,
                anchorId,
                "type": "Page Section"
              },
              _type == "subSection" => {
                title,
                anchorId,
                "type": "Sub Section"
              },
              _type == "subSubSection" => {
                title,
                anchorId,
                "type": "Sub-Sub Section"
              },
              content[]{
                _type,
                _type == "pageSection" => {
                  title,
                  anchorId,
                  "type": "Page Section"
                },
                _type == "subSection" => {
                  title,
                  anchorId,
                  "type": "Sub Section"
                },
                _type == "subSubSection" => {
                  title,
                  anchorId,
                  "type": "Sub-Sub Section"
                }
              }[]
            }[]
          }[]
        }`;

        const result = await client.fetch(query, { pageId: internalPageRef });

        // Flatten and filter sections that have anchor IDs
        const flattenSections = (content: unknown[]): SectionOption[] => {
          const options: SectionOption[] = [];

          const processSections = (sections: unknown[]) => {
            for (const item of sections || []) {
              const section = item as {
                anchorId?: string;
                title?: string;
                type?: string;
                content?: unknown[];
              };
              if (section && section.anchorId && section.title && section.type) {
                options.push({
                  value: section.anchorId,
                  label: `${section.title} (${section.type})`,
                  type: section.type,
                });
              }

              // Process nested content
              if (section?.content) {
                processSections(section.content);
              }
            }
          };

          processSections(content);
          return options;
        };

        const sectionOptions = flattenSections(result?.content || []);
        setSections(sectionOptions);
      } catch (error) {
        console.error('Error fetching sections:', error);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, [internalPageRef, client]);

  // Filter sections based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm) return sections;
    return sections.filter(
      (section) =>
        section.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sections, searchTerm]);

  const handleSelect = (sectionValue: string) => {
    onChange(set(sectionValue));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(unset());
  };

  return (
    <div style={{ position: 'relative' }}>
      {!internalPageRef ? (
        <div
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#f9fafb',
            color: '#6b7280',
            fontSize: '14px',
          }}>
          Please select an Internal Link first
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                {...elementProps}
                type='text'
                value={isOpen ? searchTerm : value || ''}
                placeholder={
                  isLoading ? 'Loading sections...' : 'Select from dropdown only'
                }
                readOnly={!isOpen}
                onChange={(e) => {
                  if (isOpen) {
                    setSearchTerm(e.target.value);
                  }
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  backgroundColor: isOpen ? '#fff' : '#f8f9fa',
                  cursor: isOpen ? 'text' : 'pointer',
                  color: '#495057',
                  borderStyle: isOpen ? 'solid' : 'dashed',
                }}
              />

              {isOpen && sections.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}>
                  {filteredSections.length === 0 ? (
                    <div style={{ padding: '8px 12px', color: '#6b7280' }}>
                      No sections found matching &ldquo;{searchTerm}&rdquo;
                    </div>
                  ) : (
                    filteredSections.map((section) => (
                      <button
                        key={section.value}
                        type='button'
                        onClick={() => handleSelect(section.value)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          fontSize: '14px',
                          borderBottom: '1px solid #f3f4f6',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}>
                        <div style={{ fontWeight: '500', marginBottom: '2px', color: '#111827' }}>
                          {section.label}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#374151',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          }}>
                          #{section.value}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {value && (
              <button
                type='button'
                onClick={handleClear}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#4b72f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                }}>
                Clear
              </button>
            )}
          </div>

          {value && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}>
              Selected anchor: <strong>#{value}</strong> • Click field to change selection
            </div>
          )}

          {sections.length === 0 && !isLoading && internalPageRef && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#2d8cf1',
              }}>
              No linkable sections found on selected page.
            </div>
          )}
        </>
      )}
    </div>
  );
};
