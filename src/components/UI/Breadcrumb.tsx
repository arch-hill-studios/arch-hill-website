import React from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { breadcrumbBottomSpacing } from '@/utils/spacingConstants';

interface BreadcrumbProps {
  /** The current page title */
  pageTitle: string;
  /** Whether the page title should be clickable (for blog posts) */
  pageTitleClickable?: boolean;
  /** The href for clickable page title (e.g., '/blog' for blog posts) */
  pageTitleHref?: string;
}

const Breadcrumb = ({ pageTitle, pageTitleClickable = false, pageTitleHref }: BreadcrumbProps) => {
  return null;
  // return (
  //   <nav
  //     className={`flex items-center gap-2 text-brand-secondary px-4 md:px-8 py-2 ${breadcrumbBottomSpacing}`}
  //     aria-label='Breadcrumb'>
  //     {/* Home Icon */}
  //     <Link
  //       href='/'
  //       className='flex items-center hover:text-brand-primary transition-colors duration-200'
  //       aria-label='Go to home page'>
  //       <FaHome />
  //     </Link>

  //     {/* Separator */}
  //     <span aria-hidden='true'>&gt;</span>

  //     {/* Page Title */}
  //     {pageTitleClickable && pageTitleHref ? (
  //       <Link
  //         href={pageTitleHref}
  //         className='hover:text-brand-primary transition-colors duration-200'>
  //         {pageTitle}
  //       </Link>
  //     ) : (
  //       <span>{pageTitle}</span>
  //     )}
  //   </nav>
  // );
};

export default Breadcrumb;
