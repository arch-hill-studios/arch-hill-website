import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/Page/PageHero';
import Container from '@/components/Layout/Container';
import CTA from '@/components/UI/CTA';
import Breadcrumb from '@/components/UI/Breadcrumb';
import { fetchOrganizationName } from '@/lib/organizationInfo';

const META_DESCRIPTION = 'Sorry, the page you are looking for could not be found.';

export async function generateMetadata(): Promise<Metadata> {
  const orgName = await fetchOrganizationName();

  return {
    title: `Page Not Found - ${orgName}`,
    description: META_DESCRIPTION,
    robots: 'noindex, nofollow',
    openGraph: {
      title: `Page Not Found - ${orgName}`,
      description: META_DESCRIPTION,
      type: 'website',
    },
  };
}

const navigationLinks = [
  {
    href: '/contact',
    title: 'Contact Me',
    description: 'Get in touch with me for general enquiries or to start your coaching journey',
  },
];

interface NavigationLinkProps {
  href: string;
  icon?: string;
  title: string;
  description: string;
}

const NavigationLink = ({ href, icon, title, description }: NavigationLinkProps) => (
  <Link
    href={href}
    className='group bg-brand-charcoal-light shadow-sm rounded-lg p-4 hover:bg-brand-primary/10 hover:shadow-md transition-all duration-200'>
    <div className='text-body-xl font-medium mb-2 text-brand-secondary'>
      {icon} {title}
    </div>
    <div className='text-body-base'>{description}</div>
  </Link>
);

export default function NotFound() {
  return (
    <>
      <PageHero
        title='Page Not Found'
        subtTitle='Sorry, the page you are looking for could not be found.'
      />
      <Breadcrumb pageTitle='Page Not Found' />

      <Container>
        <div className='flex flex-col items-center text-center pb-12 md:pb-16'>
          <div className='max-w-2xl mb-8 md:mb-12'>
            <p className='text-body-lg md:text-body-xl leading-relaxed mb-6'>
              The page you're looking for doesn't exist or may have been moved. Please check the URL
              for errors, or explore the links below.
            </p>
          </div>

          <div className='w-full max-w-4xl mb-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
              {navigationLinks.map((link, index) => (
                <NavigationLink key={index} {...link} />
              ))}
            </div>
          </div>

          <CTA href='/' variant='filled' className='text-body-lg'>
            Back to home
          </CTA>
        </div>
      </Container>
    </>
  );
}
