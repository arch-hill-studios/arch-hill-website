/**
 * Script to create and populate Privacy Policy document in Sanity CMS
 * Tailored for Arch Hill Studios - Rehearsal, Recording, Drum Tuition & PA Hire
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/create-and-populate-pp.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// Load environment variables from .env
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Privacy Policy content structure
const privacyPolicyData = {
  _type: 'privacyPolicy',
  _id: 'privacyPolicy',
  hide: false,
  title: 'Privacy Policy',
  topText: `Last Updated: ${new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })} | Effective Date: ${new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`,
  content: [
    // =========================================================================
    // SECTION 1: Introduction
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'intro-section',
      hideSection: false,
      title: 'Introduction',
      anchorId: 'introduction',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'intro-text',
          content: [
            {
              _type: 'block',
              _key: 'intro-1',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Arch Hill Studios ("we", "us", "our"), located at 331 Great North Road, Grey Lynn, Auckland 1021, New Zealand, is committed to protecting your privacy and safeguarding your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'intro-2',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We handle your personal information in accordance with the New Zealand Privacy Act 2020 and the Information Privacy Principles set out within it. By using our website or services, you consent to the collection and use of your information as described in this policy.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 2: Information We Collect
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'info-collection-section',
      hideSection: false,
      title: 'Information We Collect',
      anchorId: 'information-we-collect',
      useCompactGap: true,
      content: [
        {
          _type: 'subSection',
          _key: 'info-you-provide',
          hideSection: false,
          title: 'Information You Provide Directly',
          anchorId: 'information-you-provide',
          useCompactGap: true,
          content: [
            {
              _type: 'richText',
              _key: 'info-you-provide-text',
              content: [
                {
                  _type: 'block',
                  _key: 'iyp-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'When you book our services, make enquiries, or interact with us, we may collect the following personal information:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Your name, email address, and phone number (via booking forms, contact forms, or direct communication)',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Booking details including dates, times, and services requested',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Payment information for processing service fees (note: we do not store full credit or debit card details — these are handled securely by our payment processor)',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-4',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'PA hire details such as delivery address and identification for deposit purposes',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-5',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Student information for drum tuition, including age and skill level',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-6',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Parent or guardian contact details for students under 18',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iyp-7',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'The content of any messages, emails, or enquiries you send us',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          _type: 'subSection',
          _key: 'info-auto-collected',
          hideSection: false,
          title: 'Information Collected Automatically',
          anchorId: 'information-collected-automatically',
          useCompactGap: true,
          content: [
            {
              _type: 'richText',
              _key: 'info-auto-text',
              content: [
                {
                  _type: 'block',
                  _key: 'iac-intro',
                  style: 'normal',
                  children: [
                    {
                      _type: 'span',
                      text: 'When you visit our website, certain information may be collected automatically:',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iac-1',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'IP address, browser type, device type, and operating system',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iac-2',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Pages visited, time spent on the site, and referring website',
                      marks: []
                    }
                  ]
                },
                {
                  _type: 'block',
                  _key: 'iac-3',
                  style: 'normal',
                  listItem: 'bullet',
                  children: [
                    {
                      _type: 'span',
                      text: 'Cookie data (see the Cookies section below for more details)',
                      marks: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 3: How We Use Your Information
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'info-use-section',
      hideSection: false,
      title: 'How We Use Your Information',
      anchorId: 'how-we-use-your-information',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'info-use-text',
          content: [
            {
              _type: 'block',
              _key: 'use-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We use the information we collect for the following purposes:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Processing and managing bookings: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Confirming rehearsal, recording, tuition, and PA hire reservations',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Communication: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Sending booking confirmations, reminders, and responding to your enquiries',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Payment processing: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Handling payments, deposits, and refunds for our services',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Drum tuition: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Tailoring lesson content to your skill level and tracking student progress',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-5',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'PA hire management: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Managing equipment hire agreements, deposits, and delivery arrangements',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-6',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Service improvement: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Understanding how our website is used so we can improve the experience',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-7',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Marketing: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Sending promotional updates about our services, events, or special offers (only with your consent, and you can opt out at any time)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'use-8',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Legal compliance: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Meeting our obligations under New Zealand law, including tax and financial reporting requirements',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 4: Cookies & Tracking Technologies
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'cookies-section',
      hideSection: false,
      title: 'Cookies & Tracking Technologies',
      anchorId: 'cookies-and-tracking',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'cookies-text',
          content: [
            {
              _type: 'block',
              _key: 'cookie-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Our website uses cookies and similar technologies to improve your browsing experience and help us understand how visitors use our site. Cookies are small text files stored on your device by your web browser.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookie-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Essential cookies: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Required for the website to function properly, including session management and security features.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookie-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Analytics cookies: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'We use Google Analytics to understand how visitors interact with our website, including pages visited, time on site, and traffic sources. This data is aggregated and anonymous.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookie-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Third-party cookies: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Embedded content from third-party services (such as YouTube videos or Google Maps) may set their own cookies when you interact with that content.',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cookie-control',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'You can control or disable cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing ones. Please note that disabling cookies may affect some website functionality.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 5: Third-Party Services
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'third-party-section',
      hideSection: false,
      title: 'Third-Party Services',
      anchorId: 'third-party-services',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'third-party-text',
          content: [
            {
              _type: 'block',
              _key: 'tp-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Our website and services integrate with third-party platforms that have their own privacy policies. These services may collect data independently:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Google Analytics: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Website traffic analysis and performance tracking',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Payment processors: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Secure handling of payment transactions (we do not store full card details on our systems)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Google Maps: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Displaying our studio location and providing directions',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'YouTube: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Embedded video content on our website',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-5',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Social media platforms: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Links to our Facebook and Instagram pages',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-6',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Email service provider: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Delivery of booking confirmations, enquiry responses, and notifications',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'tp-disclaimer',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We are not responsible for the privacy practices of these third-party services. We encourage you to review their respective privacy policies.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 6: Data Sharing & Disclosure
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'data-sharing-section',
      hideSection: false,
      title: 'Data Sharing & Disclosure',
      anchorId: 'data-sharing-and-disclosure',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'data-sharing-text',
          content: [
            {
              _type: 'block',
              _key: 'ds-policy',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We do not sell, trade, or rent your personal information to third parties.',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: ' We may share your information only in the following limited circumstances:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ds-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Service providers: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'With trusted third-party providers who assist our business operations (such as payment processors, email delivery services, and website hosting), who are contractually required to keep your data secure',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ds-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Legal requirements: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'When required by law, court order, or to comply with legal obligations',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ds-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Safety and rights: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'To protect the rights, safety, or property of Arch Hill Studios, our clients, or others',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ds-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Business transfer: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'In the event of a sale, merger, or transfer of business ownership, your information may be transferred to the new owner, who will be required to continue protecting your data',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 7: Data Security
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'data-security-section',
      hideSection: false,
      title: 'Data Security',
      anchorId: 'data-security',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'data-security-text',
          content: [
            {
              _type: 'block',
              _key: 'sec-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We take reasonable steps to protect your personal information from unauthorised access, use, or disclosure:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sec-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Our website uses HTTPS/SSL encryption to secure data in transit',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sec-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Access to personal information is restricted to authorised personnel only',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sec-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Payment card details are processed securely by our third-party payment provider and are never stored on our systems',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'sec-disclaimer',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'While we strive to protect your personal information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security but will notify you and any applicable authority of a breach if required by law.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 8: Data Retention
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'data-retention-section',
      hideSection: false,
      title: 'Data Retention',
      anchorId: 'data-retention',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'data-retention-text',
          content: [
            {
              _type: 'block',
              _key: 'ret-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, or as required by law:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Booking records: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained for 7 years for tax and legal compliance purposes',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Contact form enquiries: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained for up to 2 years unless you become a client',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Payment records: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained for 7 years as required by New Zealand tax law',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Drum tuition records: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained for the duration of the student relationship plus 2 years',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-5',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'PA hire records: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained until all deposit and damage matters are fully resolved, plus 2 years',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-6',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Marketing consent records: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'Retained until you withdraw your consent',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'ret-end',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'When personal information is no longer required, it will be securely deleted or anonymised.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 9: Your Rights
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'your-rights-section',
      hideSection: false,
      title: 'Your Rights',
      anchorId: 'your-rights',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'your-rights-text',
          content: [
            {
              _type: 'block',
              _key: 'rights-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Under the New Zealand Privacy Act 2020, you have the following rights regarding your personal information:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-1',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Right to access: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'You may request a copy of the personal information we hold about you',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Right to correction: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'You may request correction of any inaccurate or incomplete information',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Right to request deletion: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'You may request deletion of your personal data, subject to our legal retention obligations',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Right to withdraw consent: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'You may withdraw your consent for marketing communications at any time by using the unsubscribe link in our emails or contacting us directly',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-5',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Right to complain: ',
                  marks: ['strong']
                },
                {
                  _type: 'span',
                  text: 'If you believe your privacy has been breached, you have the right to lodge a complaint with the Office of the Privacy Commissioner (www.privacy.org.nz)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'rights-exercise',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'To exercise any of these rights, please contact us using the details provided at the bottom of this page. We will respond to your request within 20 working days, as required by the Privacy Act 2020.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 10: Children's Privacy
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'children-section',
      hideSection: false,
      title: "Children's Privacy",
      anchorId: 'childrens-privacy',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'children-text',
          content: [
            {
              _type: 'block',
              _key: 'child-1',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We offer drum tuition services to students of all ages, which may include children under the age of 16. When providing services to minors, the following applies:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'child-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'We require parental or guardian consent before collecting any personal information about students under 16',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'child-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'We only collect information that is necessary for providing tuition services (name, age, skill level, and parent/guardian contact details)',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'child-4',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'Parents and guardians have the right to access, correct, or request deletion of their child\'s personal information at any time',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 11: Changes to This Policy
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'changes-section',
      hideSection: false,
      title: 'Changes to This Policy',
      anchorId: 'changes-to-this-policy',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'changes-text',
          content: [
            {
              _type: 'block',
              _key: 'chg-1',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make changes:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'chg-2',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'The updated policy will be posted on our website with a revised "Last Updated" date',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'chg-3',
              style: 'normal',
              listItem: 'bullet',
              children: [
                {
                  _type: 'span',
                  text: 'For significant changes, we will make reasonable efforts to notify affected individuals directly',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'chg-4',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Your continued use of our services after any changes to this policy constitutes your acceptance of the updated terms.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    },

    // =========================================================================
    // SECTION 12: Contact Information
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'contact-section',
      hideSection: false,
      title: 'Contact Information',
      anchorId: 'contact-information',
      useCompactGap: true,
      content: [
        {
          _type: 'richText',
          _key: 'contact-text',
          content: [
            {
              _type: 'block',
              _key: 'cont-intro',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us:',
                  marks: []
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cont-email',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Email: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: 'john@archhillstudios.nz',
                  marks: ['strong']
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cont-phone',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Phone: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: '+64 21 209 7464',
                  marks: ['strong']
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cont-address',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Address: ',
                  marks: []
                },
                {
                  _type: 'span',
                  text: '331 Great North Road, Grey Lynn, Auckland 1021, New Zealand',
                  marks: ['strong']
                }
              ]
            },
            {
              _type: 'block',
              _key: 'cont-privacy',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'If you are not satisfied with our response to a privacy concern, you may contact the Office of the New Zealand Privacy Commissioner at www.privacy.org.nz.',
                  marks: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

async function createAndPopulatePrivacyPolicy() {
  try {
    console.log('Creating Privacy Policy document for Arch Hill Studios...');

    // Check if document already exists
    const existingDoc = await client.fetch('*[_id == "privacyPolicy"][0]');

    if (existingDoc) {
      console.log('Privacy Policy document already exists. Updating...');
      const result = await client.createOrReplace(privacyPolicyData);
      console.log(`Updated Privacy Policy document (ID: ${result._id})`);
    } else {
      const result = await client.create(privacyPolicyData);
      console.log(`Created Privacy Policy document (ID: ${result._id})`);
    }

    console.log('\nNext steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Site Management > Legal > Privacy Policy');
    console.log('3. Review the content and make any necessary adjustments');
    console.log('4. Publish the document when ready');
    console.log('5. The page will be available at /privacy-policy');
    console.log('\nRemember to have this document reviewed by a legal professional before publishing!');
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulatePrivacyPolicy();
