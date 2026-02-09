
import type { HEADER_QUERY_RESULT } from '@/sanity/types';

// Extract the types from the generated Sanity types
type HeaderResult = Extract<HEADER_QUERY_RESULT, { _type: 'header' }>;
export type NavigationSection = Extract<NonNullable<HeaderResult['verticalNav']>[0], { _type: 'navSection' }>;
export type NavigationLink = Extract<NonNullable<NavigationSection['links']>[0], { _type: 'verticalNavLink' }>;
export type NavigationItem = NonNullable<HeaderResult['verticalNav']>[0];

// For horizontal navigation (still uses original navLink type)
export type HorizontalNavigationLink = Extract<NonNullable<HeaderResult['horizontalNav']>[0], { _type: 'navLink' }>;

// Overloaded functions for both horizontal and vertical navigation
export function getNavLinkProps(link: NavigationLink): { href: string; target?: string; rel?: string; };
export function getNavLinkProps(link: HorizontalNavigationLink): { href: string; target?: string; rel?: string; };
export function getNavLinkProps(link: NavigationLink | HorizontalNavigationLink) {
  const props: {
    href: string;
    target?: string;
    rel?: string;
  } = {
    href: link.computedHref || '/',
  };

  if (link.linkType === 'external' || link.openInNewTab) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }

  return props;
}

export function getNavLinkLabel(link: NavigationLink): string;
export function getNavLinkLabel(link: HorizontalNavigationLink): string;
export function getNavLinkLabel(link: NavigationLink | HorizontalNavigationLink): string {
  return link.label || 'Unnamed Link';
}

export const isNavigationSection = (item: NavigationItem): item is NavigationSection => {
  return item._type === 'navSection';
};

export const isNavigationLink = (item: NavigationLink): item is NavigationLink => {
  return item._type === 'verticalNavLink';
};

// Horizontal navigation utilities
export const getHorizontalNavLinkProps = (link: HorizontalNavigationLink) => {
  const props: {
    href: string;
    target?: string;
    rel?: string;
  } = {
    href: link.computedHref || '/',
  };

  if (link.linkType === 'external' || link.openInNewTab) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }

  return props;
};

export const getHorizontalNavLinkLabel = (link: HorizontalNavigationLink): string => {
  return link.label || 'Unnamed Link';
};

export type HorizontalNavData = NonNullable<HeaderResult['horizontalNav']>;
export type HorizontalNavCTAData = NonNullable<HeaderResult['horizontalNavCtas']>;
export type VerticalNavData = NonNullable<HeaderResult['verticalNav']>;
export type VerticalNavCTAData = NonNullable<HeaderResult['verticalNavCtas']>;