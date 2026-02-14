'use client';

import React from 'react';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import CTA from '@/components/UI/CTA';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { MdError } from 'react-icons/md';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <>
      {/* Hero Section */}
      <PageHero title='Something Went Wrong' />

      {/* Breadcrumb */}
      <Breadcrumb pageTitle='Error' />

      <Container>
        <div className='flex flex-col items-center text-center pb-12 md:pb-16'>
          {/* Graphic */}
          <MdError className='text-[150px] sm:text-[250px] text-brand-primary mb-8 md:mb-12' />

          {/* Message */}
          <div className='max-w-2xl mb-8 md:mb-12'>
            <p className='text-body-lg leading-relaxed mb-6'>
              An unexpected error occurred while processing your request. This could be a temporary
              issue with our services. Please try again, or contact us if the problem persists.
            </p>

            {/* Error details for development (hidden in production) */}
            {process.env.NODE_ENV === 'development' && (
              <details className='mt-4 p-4 bg-gray-100 rounded-lg text-left max-w-lg'>
                <summary className='cursor-pointer text-body-sm font-medium text-black mb-2'>
                  Error Details (Development Only)
                </summary>
                <pre className='text-body-xs text-gray-600 whitespace-pre-wrap wrap-break-word'>
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <CTA href='/' variant='filled' className='text-body-lg'>
            Back to Home Page
          </CTA>
        </div>
      </Container>
    </>
  );
}
