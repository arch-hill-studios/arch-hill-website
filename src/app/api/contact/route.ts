import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateConfirmationEmail } from '@/lib/email-templates/contactConfirmationEmail';
import { generateAdminNotificationEmail } from '@/lib/email-templates/contactAdminNotificationEmail';
import { SITE_CONFIG } from '@/lib/constants';
import {
  getOrganizationName,
  getOrganizationEmail,
  getOrganizationPhone,
  getOrganizationAddress,
  getOrganizationAddressLink,
  getLogo,
} from '@/lib/organizationInfo';
import { urlFor } from '@/sanity/lib/image';
import { getContactConfirmationEmail, getBusinessContactInfo } from '@/actions';

// Initialize Resend with API key from environment variable
// IMPORTANT: Add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Add these environment variables to your .env.local file:
// RESEND_API_KEY=your_resend_api_key_here
// NEXT_PUBLIC_CONTACT_EMAIL=your_contact_email@example.com
// RESEND_FROM_EMAIL=noreply@yourdomain.com (must be verified in Resend)

// ========================================
// RATE LIMITING CONFIGURATION
// ========================================
// Set this to false to disable rate limiting (useful for testing)
const ENABLE_RATE_LIMITING = false;

// Rate limiting configuration (in-memory, resets on server restart)
// For production, consider using a more robust solution like Redis or Upstash
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 3; // Maximum 3 submissions per IP per hour
const requestLog = new Map<string, { count: number; timestamp: number }>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLog.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      requestLog.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

// Simple honeypot field validation (bot detection)
// Bots often fill in all fields, including hidden ones
function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot === '';
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent injection attacks
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim();
}

// Check rate limit for IP address
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = requestLog.get(ip);

  if (!requestData) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    // Reset the count if the window has passed
    requestLog.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestData.count >= MAX_REQUESTS_PER_IP) {
    return false;
  }

  requestData.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Check rate limit (only if enabled)
    if (ENABLE_RATE_LIMITING && !checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          rateLimited: true,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, email, phone, message, honeypot } = body;

    // Honeypot validation (bot detection)
    if (!validateHoneypot(honeypot)) {
      console.warn('Honeypot triggered - possible bot submission');
      // Return success to not alert the bot
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 },
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 },
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : '';
    const sanitizedMessage = sanitizeInput(message);

    // Validate sanitized inputs aren't empty after sanitization
    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      return NextResponse.json({ error: 'Invalid input detected.' }, { status: 400 });
    }

    // Fetch business contact info from Sanity
    const businessContactInfo = await getBusinessContactInfo();
    const organizationName = getOrganizationName(businessContactInfo);
    const organizationEmail = getOrganizationEmail(businessContactInfo);
    const organizationPhone = getOrganizationPhone(businessContactInfo);
    const organizationAddress = getOrganizationAddress(businessContactInfo);
    const organizationAddressLink = getOrganizationAddressLink(businessContactInfo);
    const productionDomain = SITE_CONFIG.PRODUCTION_DOMAIN;

    // Get contact email from environment variable
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const fromEmail = `${organizationName} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`;

    if (!contactEmail) {
      console.error('NEXT_PUBLIC_CONTACT_EMAIL environment variable is not set');
      return NextResponse.json(
        {
          error:
            'Contact form is currently unavailable. Please contact me directly via phone or email.',
          configError: true,
        },
        { status: 500 },
      );
    }

    // Construct logo URL from Sanity CMS
    const logo = getLogo(businessContactInfo);
    const logoUrl = logo?.asset ? urlFor(logo).width(160).url() : '';

    // Fetch confirmation email settings from Sanity for customizable email content
    const confirmationEmailSettings = await getContactConfirmationEmail();

    // Send email to business owner using styled template
    const adminEmailHtml = generateAdminNotificationEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      message: sanitizedMessage,
    });

    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: adminEmailHtml,
    });

    if (adminEmailResult.error) {
      // Log detailed Resend error to server console for debugging
      console.error('❌ Failed to send admin notification email');
      console.error('Resend Error Details:', {
        statusCode: (adminEmailResult.error as any).statusCode,
        name: (adminEmailResult.error as any).name,
        message: (adminEmailResult.error as any).message,
        fullError: adminEmailResult.error,
      });
      throw new Error('Failed to send notification email');
    }

    // Send confirmation email to the sender using styled template
    // NOTE: On Resend free tier (without domain verification), confirmation emails can only
    // be sent to the email address you signed up with. Once you verify a domain, this will
    // work for any recipient email address.
    try {
      const confirmationEmailHtml = generateConfirmationEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        logoUrl,
        organizationName,
        emailGreeting: confirmationEmailSettings?.emailGreeting || undefined,
        emailIntroMessage: confirmationEmailSettings?.emailIntroMessage || undefined,
        emailOutroMessage: confirmationEmailSettings?.emailOutroMessage || undefined,
        organizationEmail,
        organizationPhone,
        organizationAddress,
        organizationAddressLink,
        productionDomain,
      });

      const confirmationEmailResult = await resend.emails.send({
        from: fromEmail,
        to: sanitizedEmail,
        replyTo: organizationEmail || sanitizedEmail,
        subject: `Thank you for contacting ${organizationName}`,
        html: confirmationEmailHtml,
      });

      if (confirmationEmailResult.error) {
        // Check if it's the domain verification error
        const errorObj = confirmationEmailResult.error as { statusCode?: number; message?: string };
        if (errorObj.statusCode === 403) {
          console.warn(
            '⚠️  Confirmation email skipped - domain not verified.',
            'Admin notification email was sent successfully.',
          );
        } else {
          console.error('❌ Error sending confirmation email:', {
            statusCode: errorObj.statusCode,
            message: errorObj.message,
            fullError: confirmationEmailResult.error,
          });
        }
      } else {
        console.log('✓ Confirmation email sent successfully to:', sanitizedEmail);
      }
    } catch (confirmationError) {
      // Log error but don't fail the request if confirmation email fails
      console.error('❌ Failed to send confirmation email:', confirmationError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    // Log comprehensive error details to server console (visible in Vercel logs)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ CONTACT FORM ERROR');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (error instanceof Error) {
      console.error('Error Type:', error.name);
      console.error('Error Message:', error.message);
      console.error('Stack Trace:', error.stack);
    } else {
      console.error('Unknown Error:', error);
    }

    console.error('Environment:', {
      NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasContactEmail: !!process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      hasFromEmail: !!process.env.RESEND_FROM_EMAIL,
    });
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to send message. Please try again later.';

    return NextResponse.json(
      {
        error:
          'I encountered an issue sending your message. Please try contacting me directly via email or phone.',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
