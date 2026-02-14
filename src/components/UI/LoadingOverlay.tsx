'use client';

import React, { useEffect, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface LoadingOverlayProps {
  isLoading?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useBodyScrollLock(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      // Small delay to ensure component is rendered, then start fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      // Start fade out
      setIsVisible(false);
      // Wait for fade out animation to complete before removing from DOM
      setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match the CSS transition duration
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        role='dialog'
        aria-modal='true'
        aria-label='Page loading'>
        {/* Black overlay with reduced opacity */}
        <div className='absolute inset-0 bg-black/70' />

        {/* Soundwave bars in center */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex items-end gap-1.25 sm:gap-1.75 h-16 sm:h-24'>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='w-1.5 sm:w-2.5 rounded-full'
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  animation: `soundbar 1.2s ease-in-out ${i * 0.15}s infinite`,
                  height: '20%',
                }}
              />
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes soundbar {
            0%, 100% {
              height: 20%;
            }
            25% {
              height: 80%;
            }
            50% {
              height: 40%;
            }
            75% {
              height: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default LoadingOverlay;
