/**
 * Example usage patterns for UnifiedImage component
 * These examples show how to replace existing image patterns with the new unified component
 */

import UnifiedImage from './UnifiedImage';
import type { SanityImageSource } from '@sanity/image-url';

// Example data types
interface BlogPost {
  mainImage?: SanityImageSource;
  title: string;
}

interface HeaderData {
  _id?: string;
  logo?: SanityImageSource;
}

/**
 * 1. Blog Card Image (replaces BlogCard pattern)
 * - Previously: urlFor(mainImage).url() with fill and object-cover
 * - Now: Automatic sizing with 'card' context
 */
export const BlogCardImageExample = ({ post }: { post: BlogPost }) => (
  <div className='relative w-full aspect-4/3 bg-gray-900 overflow-hidden'>
    <UnifiedImage
      src={post.mainImage}
      alt={`${post.title} image`}
      mode='fill'
      sizeContext='card'
      objectFit='cover'
      priority
      generateSchema
      schemaContext='blog'
    />
  </div>
);

/**
 * 2. Header Logo (replaces Header pattern)
 * - Previously: urlFor(logo).url() with object-contain and fixed dimensions
 * - Now: Automatic sizing with 'logo' context
 */
export const HeaderLogoExample = ({ headerData }: { headerData: HeaderData }) => (
  <UnifiedImage
    src={headerData.logo}
    alt='Example image'
    mode='sized'
    width={180}
    height={125}
    sizeContext='logo'
    objectFit='contain'
    className='w-40 md:w-45 h-auto'
    documentId={headerData._id}
    documentType='header'
    fieldPath='logo'
  />
);

/**
 * 3. Image Gallery (replaces ImageGallery pattern)
 * - Previously: urlFor(item.image).url() with fill and manual sizing
 * - Now: Automatic gallery optimization with modal support
 */
export const ImageGalleryItemExample = ({
  image,
  index,
  total,
}: {
  image: SanityImageSource;
  index: number;
  total: number;
}) => (
  <div className='w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] aspect-4/3'>
    <UnifiedImage
      src={image}
      alt={`Gallery image ${index + 1} of ${total}`}
      mode='fill'
      sizeContext='gallery'
      objectFit='cover'
      enableModal
      sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
      generateSchema
      schemaContext='gallery'
    />
  </div>
);

/**
 * 4. Page Hero Background (replaces PageHero pattern)
 * - Previously: urlFor(heroImage).url() with fill and object-cover
 * - Now: Automatic hero optimization
 */
export const PageHeroImageExample = ({ heroImage }: { heroImage: SanityImageSource | string }) => (
  <UnifiedImage
    src={heroImage}
    alt=''
    mode='fill'
    sizeContext='hero'
    objectFit='cover'
    priority
    className='z-10 transition-opacity duration-500 ease-in-out'
    sizes='100vw'
  />
);

/**
 * 5. Icon in Lists (replaces ItemList/Icon patterns)
 * - Previously: urlFor(item.icon).width(72).height(72).url()
 * - Now: Automatic icon optimization with proper DPI
 */
export const IconImageExample = ({ icon }: { icon: SanityImageSource }) => (
  <UnifiedImage
    src={icon}
    alt='Item icon'
    mode='sized'
    width={24}
    height={24}
    sizeContext='icon'
    objectFit='contain'
    className='p-1'
  />
);

/**
 * 6. Featured Items with Dynamic Aspect Ratio (replaces FeaturedItems pattern)
 * - Previously: urlFor(image).width(2000).url() with manual aspect ratio calculation
 * - Now: Automatic optimization with aspect ratio preservation
 */
export const FeaturedItemExample = ({
  image,
  aspectRatio,
}: {
  image: SanityImageSource;
  aspectRatio: number;
}) => (
  <div className='relative w-full landscape:h-[45vh] landscape:w-auto' style={{ aspectRatio }}>
    <UnifiedImage
      src={image}
      alt='Featured item'
      mode='fill'
      objectFit='contain'
      displaySize={{ width: 2000 }}
      priority
      sizes='(max-width: 768px) 90vw, 400px'
    />
  </div>
);

/**
 * 7. Blog Post Main Image (replaces blog post page pattern)
 * - Previously: urlFor(post.mainImage).url() with fill and specific sizing
 * - Now: Automatic optimization with schema generation
 */
export const BlogPostMainImageExample = ({ post }: { post: BlogPost }) => (
  <div className='relative w-full aspect-video overflow-hidden rounded-lg'>
    <UnifiedImage
      src={post.mainImage}
      alt={post.title || 'Blog post image'}
      mode='fill'
      sizeContext='hero'
      objectFit='cover'
      priority
      generateSchema
      schemaContext='blog'
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
    />
  </div>
);

/**
 * 8. Content Block Image with Modal (replaces blocks/Image pattern)
 * - Previously: urlFor(image).url() with width/height and modal support
 * - Now: Automatic optimization with built-in modal
 */
export const ContentBlockImageExample = ({
  image,
  caption,
  size = 'full',
}: {
  image: SanityImageSource;
  caption?: string;
  size?: 'small' | 'full';
}) => (
  <figure className={size === 'small' ? 'w-full md:w-1/2 mx-auto' : 'w-full'}>
    <UnifiedImage
      src={image}
      alt='Content image'
      mode='sized'
      width={800}
      height={600}
      sizeContext='full'
      objectFit='cover'
      enableModal
      modalCaption={caption}
      rounded
      className='w-full h-auto'
    />
    {caption && (
      <figcaption className='mt-2 text-body-sm text-gray-600 text-center italic'>
        {caption}
      </figcaption>
    )}
  </figure>
);

/**
 * 9. Responsive Image with Custom Breakpoints
 * - For complex responsive scenarios
 */
export const ResponsiveImageExample = ({ image }: { image: SanityImageSource }) => (
  <UnifiedImage
    src={image}
    alt='Responsive image'
    mode='fill'
    responsiveSizes={{
      mobile: { width: 400, height: 300 },
      tablet: { width: 600, height: 450 },
      desktop: { width: 800, height: 600 },
    }}
    objectFit='cover'
    sizes='(max-width: 768px) 400px, (max-width: 1024px) 600px, 800px'
  />
);
