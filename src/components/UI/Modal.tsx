'use client';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ModalProps {
  isModalOpen?: boolean;
  closeModal?: () => void;
  children: React.ReactNode;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const Modal: React.FC<ModalProps> = ({
  children,
  isModalOpen = false,
  closeModal = () => {},
  'aria-labelledby': ariaLabelledby = 'modal-title',
  'aria-describedby': ariaDescribedby = 'modal-description',
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const focusTrapRef = useFocusTrap(isModalOpen && isVisible);

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    if (isModalOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      // Small delay to ensure dialog is rendered, then start fade in
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    }
  }, [isModalOpen]);

  // Close handler with fade out
  const closeDialog = useCallback(() => {
    setIsVisible(false);
    // Wait for fade out animation to complete before actually closing
    setTimeout(() => {
      dialogRef.current?.close();
      closeModal();
    }, 200); // Match the CSS transition duration
  }, [closeModal]);

  // Escape key handling
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      // Prevent default so ESC doesn’t just close without cleanup
      e.preventDefault();
      closeDialog();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [closeDialog]);

  return (
    <dialog
      ref={(el) => {
        dialogRef.current = el;
        // Type assertion is safe here since dialog element extends HTMLElement
        if (focusTrapRef.current !== el) {
          focusTrapRef.current = el as HTMLElement;
        }
      }}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={`backdrop:bg-black/87 flex-col items-center justify-center w-screen h-dvh bg-transparent overflow-hidden hidden open:flex p-0 m-0 max-w-none max-h-none transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={(e) => {
        // Close if clicking the dialog itself (backdrop), not its content
        if (e.target === e.currentTarget) {
          closeDialog();
        }
      }}>
      {/* Close button */}
      <button
        onClick={closeDialog}
        className='cursor-pointer absolute top-4 right-4 z-50 p-2 bg-black/70 hover:bg-brand-white rounded-full transition-colors group'
        aria-label='Close modal'>
        <svg
          className='w-6 h-6 text-brand-white group-hover:text-black transition-colors'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
      {children}
    </dialog>
  );
};

export default Modal;
