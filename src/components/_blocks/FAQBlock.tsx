import React, { useState } from 'react';
import { FaqBlock } from '@/sanity/types';
import { createSanityDataAttribute } from '@/utils/sectionHelpers';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface FAQBlockProps extends Omit<FaqBlock, '_type' | '_key'> {
  className?: string;
  documentId?: string;
  documentType?: string;
  fieldPathPrefix?: string;
}

const FAQBlock = ({
  faqItems = [],
  className = '',
  documentId,
  documentType,
  fieldPathPrefix = '',
}: FAQBlockProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`.trim()}>
      <div className='space-y-4'>
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          const itemPath = fieldPathPrefix
            ? `${fieldPathPrefix}.faqItems[${index}]`
            : `faqItems[${index}]`;

          return (
            <div
              key={item._key}
              className='rounded-lg overflow-hidden bg-black shadow-sm hover:shadow-md transition-shadow duration-500'>
              {/* Question Header - Clickable */}
              <button
                onClick={() => toggleItem(index)}
                className='group w-full flex items-center justify-between p-6 text-left transition-colors duration-500 cursor-pointer'
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}>
                <span
                  {...(documentId && documentType
                    ? createSanityDataAttribute(documentId, documentType, `${itemPath}.question`)
                    : {})}
                  className='text-body-lg text-brand-white pr-4'>
                  {item.question}
                </span>
                <div className='shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-brand-secondary transition-all duration-500 ease-out'>
                  {isOpen ? <FaMinus className='w-4 h-4' /> : <FaPlus className='w-4 h-4' />}
                </div>
              </button>

              {/* Answer Content - Expandable */}
              <div
                id={`faq-answer-${index}`}
                className={`grid transition-all duration-500 ease-out bg-brand-white/20 ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}>
                <div className='overflow-hidden'>
                  <div
                    {...(documentId && documentType
                      ? createSanityDataAttribute(documentId, documentType, `${itemPath}.answer`)
                      : {})}
                    className='px-6 py-6 text-left text-body-base leading-relaxed whitespace-pre-wrap'>
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQBlock;
