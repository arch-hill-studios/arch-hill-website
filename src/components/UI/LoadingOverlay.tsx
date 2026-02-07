'use client';

import React, { useEffect, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import UnifiedImage from '@/components/UI/UnifiedImage';

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

        {/* Spinner loader in center */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='relative w-20 h-20 sm:w-40 sm:h-40'>
            {/* Outer ring - brand primary */}
            <div
              className='absolute inset-0 rounded-full border-4 sm:border-8 border-transparent'
              style={{
                borderTopColor: 'var(--color-brand-primary)',
                borderRightColor: 'var(--color-brand-primary)',
                animation: 'spin 1.5s linear infinite',
              }}
            />
            {/* Inner ring - brand secondary */}
            <div
              className='absolute inset-4 rounded-full border-4 sm:border-8 border-transparent'
              style={{
                borderBottomColor: 'var(--color-brand-secondary)',
                borderLeftColor: 'var(--color-brand-secondary)',
                animation: 'spin-reverse 1s linear infinite',
              }}
            />
            {/* Center dot - gradient */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-brand-secondary) 100%)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default LoadingOverlay;
