/**
 * Styled admin notification email template for new contact form submissions
 * Uses brand colors for professional appearance
 * IMPORTANT: Uses colors that work in both light and dark modes without media queries
 */

import { EMAIL_COLORS, EMAIL_STYLES } from './emailStyles';

interface AdminNotificationEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function generateAdminNotificationEmail(data: AdminNotificationEmailData): string {
  const { name, email, phone, message } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Chau+Philomene+One&display=swap" rel="stylesheet">
    </head>
    <body style="${EMAIL_STYLES.body}">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.outerTable}">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="${EMAIL_STYLES.container}">

              <!-- Header with Brand Gradient -->
              <tr>
                <td style="${EMAIL_STYLES.header}">
                  <h1 style="margin: 0; color: ${EMAIL_COLORS.brandGold}; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    New Contact Form Submission
                  </h1>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; ${EMAIL_STYLES.textPrimary}">
                    You have received a new message from your website contact form:
                  </p>

                  <!-- Contact Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${EMAIL_STYLES.infoBox}">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="${EMAIL_STYLES.infoBoxHeading}">
                          Contact Information
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Name:</strong> ${name}
                            </td>
                          </tr>
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Email:</strong>
                              <a href="mailto:${email}" style="${EMAIL_STYLES.link}">
                                ${email}
                              </a>
                            </td>
                          </tr>
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="${EMAIL_STYLES.infoBoxText}">
                              <strong style="${EMAIL_STYLES.infoBoxLabel}">Phone:</strong>
                              <a href="tel:${phone.replace(/\s/g, '')}" style="${EMAIL_STYLES.link}">
                                ${phone}
                              </a>
                            </td>
                          </tr>
                          `
                              : ''
                          }
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${EMAIL_COLORS.messageBoxBackground}; border-radius: 4px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: ${EMAIL_COLORS.textWhite}; font-size: 16px; font-weight: 600;">
                          Message:
                        </h2>
                        <p style="margin: 0; color: ${EMAIL_COLORS.textInBox}; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Quick Reply -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <p style="font-size: 16px; ${EMAIL_STYLES.textPrimary}">
                          You can reply directly to this email to get back to ${name}.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: ${EMAIL_COLORS.messageBoxBackground}; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; color: ${EMAIL_COLORS.textSecondary}; font-size: 12px; line-height: 1.5;">
                    This message was sent via the contact form on your website.
                  </p>
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
