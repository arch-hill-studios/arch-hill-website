// TEMPORARY_DEV: Modal for switching color schemes and hero styles during testing
// This entire file can be removed once final colors are decided

'use client';

import React from 'react';
import { useColor, COLOR_SCHEMES, ColorSchemeKey } from '@/contexts/ColorContext';
import { useHeroStyle, HERO_STYLES, HeroStyleKey } from '@/contexts/HeroStyleContext';

interface ColorSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColorSwitchModal = ({ isOpen, onClose }: ColorSwitchModalProps) => {
  const { currentScheme, setColorScheme } = useColor();
  const { currentStyle, setHeroStyle } = useHeroStyle();

  if (!isOpen) return null;

  const handleColorSelect = (scheme: ColorSchemeKey) => {
    setColorScheme(scheme);
    onClose();
  };

  const handleHeroStyleSelect = (style: HeroStyleKey) => {
    setHeroStyle(style);
    onClose();
  };

  return (
    <div
      className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
      onClick={onClose}>
      <div
        className='bg-brand-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-h3 font-bold text-black'>Options</h2>
          <button
            onClick={onClose}
            className='text-black hover:text-gray-600 text-body-2xl'
            aria-label='Close'>
            ×
          </button>
        </div>

        <p className='text-body-sm text-gray-600 mb-6'>
          Select options to preview. This is temporary for testing purposes.
        </p>

        {/* Hero Style Section */}
        <div className='mb-8'>
          <h3 className='text-h5 font-semibold text-black mb-3'>Hero Style</h3>
          <div className='space-y-2'>
            {(Object.keys(HERO_STYLES) as HeroStyleKey[]).map((key) => {
              const style = HERO_STYLES[key];
              const isSelected = currentStyle === key;

              return (
                <button
                  key={key}
                  onClick={() => handleHeroStyleSelect(key)}
                  className={`
                    w-full p-3 rounded-lg border-2 text-left
                    ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}>
                  <div className='font-semibold text-body-base text-black'>{style.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Scheme Section */}
        <div>
          <h3 className='text-h5 font-semibold text-black mb-3'>Color Scheme</h3>
          <div className='space-y-3'>
            {(Object.keys(COLOR_SCHEMES) as ColorSchemeKey[]).map((key) => {
              const scheme = COLOR_SCHEMES[key];
              const isSelected = currentScheme === key;

              return (
                <button
                  key={key}
                  onClick={() => handleColorSelect(key)}
                  className={`
                  w-full p-4 rounded-lg border-2
                  ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}>
                  <div className='flex items-center justify-between'>
                    <div className='text-left'>
                      <div className='font-semibold text-body-base text-black'>{scheme.name}</div>
                      <div className='text-body-sm text-gray-600 mt-1'>
                        Primary: {scheme.primary} | Secondary: {scheme.secondary}
                      </div>
                    </div>
                    <div className='flex gap-2 ml-4'>
                      <div
                        className='w-10 h-10 rounded border border-gray-300'
                        style={{ backgroundColor: scheme.primary }}
                        aria-label='Primary color preview'
                      />
                      <div
                        className='w-10 h-10 rounded border border-gray-300'
                        style={{ backgroundColor: scheme.secondary }}
                        aria-label='Secondary color preview'
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className='mt-6 pt-4 border-t border-gray-200'>
          <p className='text-body-xs text-gray-500 italic'>
            Note: Selected preferences are saved in your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorSwitchModal;
