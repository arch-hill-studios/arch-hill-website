import React from 'react';
import UnifiedImage from '@/components/UI/UnifiedImage';
import Container from '@/components/Layout/Container';

/**
 * Test page for the new UnifiedImage component
 * This page demonstrates various usage patterns to ensure the component works correctly
 */
export default function TestUnifiedImagePage() {
  // Test with string URL
  const testStringUrl = '/images/hero-bg/hero-bg-option7-2.webp';

  return (
    <Container>
      <div className="py-8 space-y-8">
        <h1 className="text-h1 font-bold mb-8">UnifiedImage Component Test</h1>

        {/* Test 1: String URL with fill mode */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 1: String URL with Fill Mode (Hero Context)</h2>
          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <UnifiedImage
              src={testStringUrl}
              alt="Test hero image"
              mode="fill"
              sizeContext="hero"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Test 2: String URL with sized mode */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 2: String URL with Sized Mode (Icon Context)</h2>
          <UnifiedImage
            src={testStringUrl}
            alt="Test icon"
            mode="sized"
            width={64}
            height={64}
            sizeContext="icon"
            objectFit="contain"
            className="border border-gray-300 rounded"
          />
        </div>

        {/* Test 3: Card context with aspect ratio */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 3: Card Context with Aspect Ratio</h2>
          <div className="relative w-64 aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
            <UnifiedImage
              src={testStringUrl}
              alt="Test card image"
              mode="fill"
              sizeContext="card"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Test 4: Gallery context with modal */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 4: Gallery Context with Modal</h2>
          <div className="relative w-48 aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <UnifiedImage
              src={testStringUrl}
              alt="Test gallery image"
              mode="fill"
              sizeContext="gallery"
              objectFit="cover"
              enableModal
              modalCaption="This is a test gallery image with modal support"
              className="rounded-lg"
            />
          </div>
          <p className="text-body-sm text-gray-600">Click the image above to test modal functionality</p>
        </div>

        {/* Test 5: Fallback behavior */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 5: Fallback Behavior (No Image)</h2>
          <div className="relative w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
            <UnifiedImage
              src={null}
              alt="No image"
              mode="fill"
              sizeContext="thumbnail"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Test 6: Custom display size */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 6: Custom Display Size with DPI Multiplier</h2>
          <UnifiedImage
            src={testStringUrl}
            alt="Custom sized image"
            mode="sized"
            width={200}
            height={150}
            displaySize={{ width: 200, height: 150 }}
            dpiMultiplier={3}
            objectFit="cover"
            className="border border-gray-300 rounded"
          />
        </div>

        {/* Test 7: Schema generation */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 7: Schema Generation (Blog Context)</h2>
          <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden max-w-md">
            <UnifiedImage
              src={testStringUrl}
              alt="Blog post test image"
              mode="fill"
              sizeContext="full"
              objectFit="cover"
              generateSchema
              schemaContext="blog"
              className="rounded-lg"
            />
          </div>
          <p className="text-body-sm text-gray-600">Check page source for generated ImageObject schema</p>
        </div>

        {/* Test 8: Responsive sizes */}
        <div className="space-y-4">
          <h2 className="text-h3 font-semibold">Test 8: Responsive Sizes</h2>
          <div className="relative w-full aspect-[3/2] bg-gray-200 rounded-lg overflow-hidden max-w-lg">
            <UnifiedImage
              src={testStringUrl}
              alt="Responsive image"
              mode="fill"
              responsiveSizes={{
                mobile: { width: 400, height: 267 },
                tablet: { width: 600, height: 400 },
                desktop: { width: 800, height: 533 }
              }}
              objectFit="cover"
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 600px, 800px"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
