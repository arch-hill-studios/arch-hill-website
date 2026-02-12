/**
 * Shared email styling constants for all email templates
 * This ensures consistency across contact and application emails
 * and makes it easy to update colors globally
 */

export const EMAIL_COLORS = {
  // Background colors
  outerBackground: '#f5f5f5', // Light gray outer background (visible in desktop clients)
  containerBackground: '#1a1a1a', // Very dark gray - main email container
  headerBackground: '#2a2a2a', // Medium dark gray - header section
  footerBackground: '#2a2a2a', // Medium dark gray - footer section
  infoBoxBackground: '#2a2a2a', // Medium dark gray - info/detail boxes
  sectionHeaderBackground: '#3a3a3a', // Slightly lighter dark gray - section headers (application forms)
  messageBoxBackground: '#2a2a2a', // Medium dark gray - message boxes

  // Text colors
  textPrimary: '#e0e0e0', // Light gray - primary text
  textSecondary: '#b0b0b0', // Medium gray - secondary text
  textWhite: '#ffffff', // White - labels and emphasized text
  textInBox: '#c0c0c0', // Light gray - text inside info boxes
  textSubQuestion: '#b0b0b0', // Medium gray - sub-question text (application forms)

  // Brand colors
  brandPrimary: '#6b1c1c', // Primary brand colour
  brandSecondary: '#8a2424', // Secondary brand colour (links, accents)
  brandWhite: '#fff7db', // Off-white - used for highlights and accents

  // Border and divider colors
  border: '#333333', // Border for main container
  sectionDivider: '#404040', // Dark gray divider between items
  footerDivider: 'rgba(59, 130, 246, 0.3)', // Semi-transparent primary brand divider

  // Link colors
  linkColor: '#60a5fa', // Secondary brand for clickable links

  // Special colors
  notAnswered: '#999999', // Gray for "Not answered" text (application forms)
} as const;

/**
 * Common inline styles for email elements
 * These can be used directly or customized per template
 */
export const EMAIL_STYLES = {
  body: `margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${EMAIL_COLORS.outerBackground};`,

  outerTable: `background-color: ${EMAIL_COLORS.outerBackground}; padding: 40px 20px;`,

  container: `max-width: 600px; background-color: ${EMAIL_COLORS.containerBackground}; border-radius: 8px; border: 1px solid ${EMAIL_COLORS.border};`,

  containerWide: `max-width: 700px; background-color: ${EMAIL_COLORS.containerBackground}; border-radius: 8px; border: 1px solid ${EMAIL_COLORS.border};`,

  header: `background-color: ${EMAIL_COLORS.headerBackground}; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;`,

  footer: `background-color: ${EMAIL_COLORS.footerBackground}; padding: 30px; border-radius: 0 0 8px 8px;`,

  textPrimary: `color: ${EMAIL_COLORS.textPrimary}; font-size: 16px; line-height: 1.6;`,

  textSecondary: `color: ${EMAIL_COLORS.textSecondary}; font-size: 16px; line-height: 1.6;`,

  infoBox: `background-color: ${EMAIL_COLORS.infoBoxBackground}; border-left: 4px solid ${EMAIL_COLORS.brandPrimary}; border-radius: 4px; margin-bottom: 30px;`,

  infoBoxHeading: `margin: 0 0 15px 0; color: ${EMAIL_COLORS.brandWhite}; font-size: 18px; font-weight: 600;`,

  infoBoxText: `padding: 8px 0; color: ${EMAIL_COLORS.textInBox}; font-size: 14px;`,

  infoBoxLabel: `color: ${EMAIL_COLORS.textWhite};`,

  link: `color: ${EMAIL_COLORS.linkColor}; text-decoration: none;`,

  contactInfoLink: `color: ${EMAIL_COLORS.textWhite}; text-decoration: none; font-size: 14px;`,

  footerDivider: `border-top: 1px solid ${EMAIL_COLORS.footerDivider}; margin: 20px 0;`,

  footerText: `margin: 0; color: ${EMAIL_COLORS.textWhite}; font-size: 12px; text-align: center; line-height: 1.5;`,
} as const;
