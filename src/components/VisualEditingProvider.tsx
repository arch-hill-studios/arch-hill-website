'use client';

import { VisualEditing } from '@sanity/visual-editing/react';
import { Suspense } from 'react';

export function VisualEditingProvider() {
  // VisualEditing component handles its own activation logic
  // It will only activate when in presentation/draft mode
  // portal={false} renders the overlay inline, portal={true} renders in a portal
  return (
    <Suspense fallback={null}>
      <VisualEditing portal={false} />
    </Suspense>
  );
}
