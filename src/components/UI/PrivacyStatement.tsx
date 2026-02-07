import React from 'react';
import Link from 'next/link';
import { MdLock, MdOpenInNew } from 'react-icons/md';

interface PrivacyStatementProps {
  title?: string | null;
  body?: string | null;
}

const PrivacyStatement = ({ title, body }: PrivacyStatementProps) => {
  // Default values if not provided from Sanity
  const displayTitle = title || 'Your Privacy Matters';
  const defaultBody = `I take your privacy seriously. All information you provide will be used solely for processing your coaching application and creating your personalised fitness plan.

I will never share your personal information with third parties, and it will only be retained for as long as necessary to provide my coaching services to you.`;

  const displayBody = body || defaultBody;

  // Split body into paragraphs for rendering (split by double newlines)
  const paragraphs = displayBody.split('\n\n').filter((p) => p.trim());

  return (
    <div className='bg-brand-gradient-charcoal-linear rounded-lg p-8 max-w-3xl mx-auto'>
      <div className='flex items-start gap-4 text-left'>
        <MdLock className='w-6 h-6 text-brand-primary shrink-0 mt-1' />
        <div>
          <h3 className='text-h6 font-semibold text-gradient-primary mb-3'>{displayTitle}</h3>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className='text-body-base text-brand-white mb-3'>
              {paragraph}
            </p>
          ))}
          <Link
            href='/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
            className='text-brand-primary hover:text-brand-secondary transition-colors text-body-base underline inline-flex items-center gap-1'>
            Read my full Privacy Policy
            <MdOpenInNew className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyStatement;
