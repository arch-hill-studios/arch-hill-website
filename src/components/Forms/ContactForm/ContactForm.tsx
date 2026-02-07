'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import CTA from '@/components/UI/CTA';
import type { CONTACT_FORM_SETTINGS_QUERYResult } from '@/sanity/types';
import TextInput from '@/components/Forms/TextInput';
import TextArea from '@/components/Forms/TextArea';

interface ContactFormProps {
  className?: string;
  settings?: CONTACT_FORM_SETTINGS_QUERYResult | null;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

const ContactForm = ({ className = '', settings }: ContactFormProps) => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      honeypot: '',
    },
  });

  // Fallback values if settings are not provided
  const successHeading = settings?.successHeading || 'Thank you for your message!';
  const successMessage =
    settings?.successMessage ||
    'We have received your message and will get back to you as soon as possible. You should also receive a confirmation email shortly.';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Scroll to form when success message appears
  useEffect(() => {
    if (status === 'success') {
      // Use hash navigation to scroll to the contact form card
      // This ensures the entire card is visible under the header
      window.location.hash = '#contact-form';
    }
  }, [status]);

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(
          responseData.error ||
            'I encountered an issue sending your message. Please try contacting me directly via email or phone.'
        );
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        'I encountered an issue sending your message. Please try contacting me directly via email or phone.'
      );
      console.error('Contact form submission error:', error);
    }
  };

  const fieldDisabled = status === 'loading' || status === 'success';

  return (
    <div className={`max-w-2xl rounded-lg text-left ${className}`.trim()}>
      {status !== 'success' && (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 p-1'>
          {/* Honeypot field - hidden from users, only bots will fill it */}
          <div className='hidden' aria-hidden='true'>
            <label htmlFor='honeypot'>Leave this field empty</label>
            <input
              type='text'
              id='honeypot'
              {...register('honeypot')}
              tabIndex={-1}
              autoComplete='off'
            />
          </div>

          <TextInput
            id='name'
            label='Name'
            type='text'
            placeholder='Your name'
            required
            disabled={fieldDisabled}
            error={errors.name}
            register={register}
            validation={{
              required: 'Please enter your name',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
          />

          <TextInput
            id='email'
            label='Email'
            type='email'
            placeholder='your.email@example.com'
            required
            disabled={fieldDisabled}
            error={errors.email}
            register={register}
            validation={{
              required: 'Please enter your email address',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            }}
          />

          <TextInput
            id='phone'
            label='Phone'
            type='tel'
            placeholder='+64 21 123 4567'
            disabled={fieldDisabled}
            error={errors.phone}
            register={register}
            showOptionalLabel
          />

          <TextArea
            id='message'
            label='Message'
            placeholder='Tell me how I can help you...'
            required
            disabled={fieldDisabled}
            error={errors.message}
            register={register}
            validation={{
              required: 'Please enter a message',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters',
              },
            }}
            rows={6}
          />

          {/* Error message display */}
          {status === 'error' && (
            <div className='bg-red-50 border-2 border-red-200 rounded-lg p-4'>
              <p className='text-body-base text-red-700'>{errorMessage}</p>
            </div>
          )}

          {/* Submit button */}
          <CTA
            as='button'
            type='submit'
            variant='filled'
            disabled={fieldDisabled}
            className='w-full'>
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </CTA>
        </form>
      )}

      {status === 'success' && (
        <div className='bg-black rounded-lg shadow-sm p-6 mt-4 text-center'>
          <p className='text-h4 mb-2 text-brand-secondary'>{successHeading}</p>
          <p className='text-body-base mb-4'>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
