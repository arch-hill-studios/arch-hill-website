# UnifiedImage Component Usage Guide

## Overview

The `UnifiedImage` component is a comprehensive solution for all image handling in the application. It automatically resolves common image issues and provides consistent behavior across the entire site.

## Quick Start

```typescript
import UnifiedImage from '@/components/UI/UnifiedImage';

// Basic usage
<UnifiedImage
  src={image}
  alt="Description"
  mode="fill"
  sizeContext="card"
/>
```

## Key Benefits

✅ **No more blurry images** - Automatically requests optimal resolution from Sanity
✅ **SEO optimization** - Generates ImageObject schema markup automatically
✅ **Consistent behavior** - Handles null/undefined images gracefully
✅ **Performance optimized** - Smart responsive sizing and DPI handling
✅ **Modal support** - Built-in full-screen image viewing
✅ **Accessibility ready** - Proper alt text and ARIA attributes

## Common Usage Patterns

### Blog Card Images
```typescript
<div className="relative w-full aspect-[4/3] overflow-hidden">
  <UnifiedImage
    src={post.mainImage}
    alt={`${post.title} image`}
    mode="fill"
    sizeContext="card"
    objectFit="cover"
    generateSchema
    schemaContext="blog"
  />
</div>
```

### Gallery with Modal
```typescript
<UnifiedImage
  src={galleryImage}
  alt="Gallery image"
  mode="fill"
  sizeContext="gallery"
  enableModal
  modalCaption="Image description"
  sizes="(max-width: 768px) 50vw, 33vw"
/>
```

### Icons and Logos
```typescript
<UnifiedImage
  src={icon}
  alt="Icon description"
  mode="sized"
  width={24}
  height={24}
  sizeContext="icon"
  objectFit="contain"
/>
```

### Hero Images
```typescript
<UnifiedImage
  src={heroImage}
  alt=""
  mode="fill"
  sizeContext="hero"
  objectFit="cover"
  priority
  sizes="100vw"
/>
```

## Props Reference

### Core Props
- `src`: Sanity image object or URL string
- `alt`: Alt text (auto-generated if not provided)
- `mode`: 'fill' or 'sized'
- `sizeContext`: 'icon' | 'thumbnail' | 'card' | 'gallery' | 'hero' | 'full'

### Layout Props
- `width`, `height`: Explicit dimensions (for 'sized' mode)
- `aspectRatio`: Container aspect ratio (for 'fill' mode)
- `objectFit`: 'cover' | 'contain'

### Optimization Props
- `displaySize`: { width: number, height?: number }
- `dpiMultiplier`: 1 | 2 | 3 | 'auto'
- `quality`: Image quality (default: 90)

### SEO Props
- `generateSchema`: Generate ImageObject schema
- `schemaContext`: 'blog' | 'article' | 'gallery' | 'profile'

### Behavior Props
- `enableModal`: Enable full-screen modal
- `modalCaption`: Caption for modal
- `priority`: Next.js priority loading

## Size Contexts

| Context | Base Size | Multiplier | Sanity Request | Use Case |
|---------|-----------|------------|----------------|----------|
| `icon` | 24px | 3x | 72px | Small icons |
| `thumbnail` | 64px | 2.5x | 160px | Profile pics, thumbnails |
| `card` | 200px | 2x | 400px | Card images, previews |
| `gallery` | 300px | 2x | 600px | Gallery items |
| `hero` | 800px | 2x | 1600px | Hero backgrounds |
| `full` | 1200px | 1.5x | 1800px | Full-width content |

## Migration from Old Patterns

### Before (Old Pattern)
```typescript
// ❌ Manual urlFor() with potential blur issues
const imageUrl = image ? urlFor(image).width(400).height(300).url() : null;

{imageUrl ? (
  <Image
    src={imageUrl}
    alt={image.alt || 'Default alt'}
    fill
    className="object-cover"
  />
) : (
  <PlaceholderComponent />
)}
```

### After (UnifiedImage)
```typescript
// ✅ Automatic optimization and handling
<UnifiedImage
  src={image}
  alt="Description"
  mode="fill"
  sizeContext="card"
  objectFit="cover"
/>
```

## Best Practices

1. **Always use sizeContext** for automatic optimization
2. **Enable schema for SEO-critical images** (blog posts, featured content)
3. **Use appropriate object fit** (cover for backgrounds, contain for logos)
4. **Filter arrays before mapping** for better performance
5. **Set priority for above-fold images** (hero, featured content)

## Array Filtering Example

```typescript
// Filter invalid images before mapping
const validImages = images?.filter(item => item.image?.asset?._ref) || [];

{validImages.map((item, index) => (
  <UnifiedImage
    key={item._key || index}
    src={item.image}
    alt={`Gallery image ${index + 1}`}
    mode="fill"
    sizeContext="gallery"
  />
))}
```

## Troubleshooting

**Image appears blurry?**
- Check if you're using the right `sizeContext`
- Verify `dpiMultiplier` is set to 'auto' or appropriate value

**Schema not appearing?**
- Ensure `generateSchema={true}` is set
- Check browser dev tools for JSON-LD script tags

**Modal not working?**
- Verify `enableModal={true}` is set
- Check that image has valid `src`

**Fallback not showing?**
- Component automatically handles invalid images
- Customize with `fallback` prop if needed