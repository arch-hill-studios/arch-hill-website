import React from 'react';
import NextImage from 'next/image';
import Heading from '../Typography/Heading';
import Modal from '../UI/Modal';

interface ImageModalProps {
  imageUrl: string;
  imageAlt: string;
  caption?: string;
  isModalOpen: boolean;
  closeModal: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  imageAlt,
  caption,
  isModalOpen,
  closeModal,
}) => {
  return (
    <Modal
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      aria-labelledby='image-modal-title'
      aria-describedby='image-modal-description'>
      <div>
        <Heading level='h2' id='image-modal-title' className='sr-only'>
          Full-screen image view
        </Heading>
        <div id='image-modal-description' className='sr-only'>
          {imageAlt}
        </div>

        {/* Main image */}
        <div className='relative flex items-center justify-center flex-1'>
          <NextImage
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={900}
            className='max-w-[90vw] max-h-[80svh] w-auto h-auto object-contain'
            priority
          />
        </div>

        {/* Caption */}
        {caption && (
          <div className='shrink-0 w-full mt-4'>
            <p className='text-brand-white text-center max-w-2xl px-4 mx-auto text-body-sm'>
              {caption}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
