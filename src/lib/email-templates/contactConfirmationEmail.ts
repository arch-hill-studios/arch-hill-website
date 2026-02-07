/**
 * Styled confirmation email template for contact form submissions
 * Uses brand colors and includes professional signature
 * IMPORTANT: Uses colors that work in both light and dark modes without media queries
 */

import { EMAIL_COLORS, EMAIL_STYLES } from './emailStyles';

interface ConfirmationEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  logoUrl: string;
  organizationName: string;
  emailGreeting?: string;
  emailIntroMessage?: string;
  emailOutroMessage?: string;
  // Contact info from Sanity
  organizationEmail: string;
  organizationPhone: string;
  organizationAddress: string;
  organizationAddressLink: string;
  productionDomain: string;
}

export function generateConfirmationEmail(data: ConfirmationEmailData): string {
  const {
    name,
    email,
    phone,
    message,
    logoUrl,
    organizationName,
    emailGreeting = 'Hi',
    emailIntroMessage = 'I have successfully received your message and will aim to get back to you as soon as possible.',
    emailOutroMessage = 'If you have any urgent questions, feel free to reach out to me directly.',
    organizationEmail,
    organizationPhone,
    organizationAddress,
    organizationAddressLink,
    productionDomain,
  } = data;

  // Generate links from values
  const emailLink = organizationEmail ? `mailto:${organizationEmail}` : '';
  const phoneLink = organizationPhone ? `tel:${organizationPhone.replace(/\s+/g, '')}` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting ${organizationName}</title>
    </head>
    <body style="${EMAIL_STYLES.body}">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.outerTable}">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${EMAIL_STYLES.container}">

              <!-- Header with Logo and Brand -->
              <tr>
                <td style="${EMAIL_STYLES.header}">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-block;">
                          <tr>
                            <td align="center" valign="middle" style="padding-right: 12px;">
                              <!-- Logo -->
                              <img
                                src="${logoUrl}"
                                alt="${organizationName} Logo"
                                width="80"
                                height="auto"
                                style="display: block; margin: 0; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));"
                              />
                            </td>
                            <td align="left" valign="middle" style="white-space: nowrap;">
                              <!-- Business Name -->
                              <span style="${EMAIL_STYLES.brandNameGold}">${organizationName}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; ${EMAIL_STYLES.textPrimary}">
                    ${emailGreeting} <strong style="color: ${EMAIL_COLORS.textWhite};">${name}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; ${EMAIL_STYLES.textPrimary}">
                    ${emailIntroMessage}
                  </p>

                  <!-- Message Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.infoBox}">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="${EMAIL_STYLES.infoBoxHeading}">
                          Your Message Details
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Email:</strong> ${email}
                            </td>
                          </tr>
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Phone:</strong> ${phone}
                            </td>
                          </tr>
                          `
                              : ''
                          }
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Message:</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 0 0; color: ${EMAIL_COLORS.textInBox}; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; ${EMAIL_STYLES.textSecondary}">
                    ${emailOutroMessage}
                  </p>
                </td>
              </tr>

              <!-- Signature Section -->
              <tr>
                <td style="${EMAIL_STYLES.footer}">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <!-- Business Name -->
                        <span style="${EMAIL_STYLES.brandNameGold}">${organizationName}</span>
                        <!-- Contact Info -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          ${organizationEmail ? `<tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${emailLink}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${organizationEmail}
                              </a>
                            </td>
                          </tr>` : ''}
                          ${organizationPhone ? `<tr>
                            <td align="center" style="padding: 5px 0;">
                              <a href="${phoneLink}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${organizationPhone}
                              </a>
                            </td>
                          </tr>` : ''}
                          ${organizationAddress ? `<tr>
                            <td align="center" style="padding: 5px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 14px;">
                              <a href="${organizationAddressLink || '#'}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${organizationAddress}
                              </a>
                            </td>
                          </tr>` : ''}
                          ${productionDomain ? `<tr>
                            <td align="center" style="padding: 5px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 14px;">
                              <a href="${productionDomain}" style="${EMAIL_STYLES.contactInfoLink}">
                                ${productionDomain}
                              </a>
                            </td>
                          </tr>` : ''}
                        </table>

                        <!-- Divider -->
                        <div style="${EMAIL_STYLES.footerDivider}"></div>

                        <!-- Footer Text -->
                        <p style="${EMAIL_STYLES.footerText}">
                          This is an automated confirmation email from ${organizationName}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
