/**
 * Script to create and populate Terms & Conditions document in Sanity CMS
 * Tailored for Arch Hill Studios - Rehearsal, Recording, Drum Tuition & PA Hire
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/create-and-populate-tcs.js
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

// Terms & Conditions content structure
const termsAndConditionsData = {
  _type: 'termsAndConditions',
  _id: 'termsAndConditions',
  hide: false,
  title: 'Terms & Conditions',
  topText: `Last Updated: ${new Date().toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`,
  content: [
    // =========================================================================
    // SECTION 1: Acceptance of Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'acceptance-section',
      hideSection: false,
      title: 'Acceptance of Terms',
      anchorId: 'acceptance-of-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'acceptance-text',
        content: [
          {
            _type: 'block',
            _key: 'accept-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'By booking, entering, or using the services and facilities of Arch Hill Studios ("we", "us", "our"), located at 331 Great North Road, Grey Lynn, Auckland 1021, New Zealand, you ("you", "the client", "the hirer") agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'accept-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'These terms apply to all services offered by Arch Hill Studios, including rehearsal room hire, recording and mixing/mastering services, drum tuition, and PA system hire.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 2: Bookings & Payment
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'bookings-section',
      hideSection: false,
      title: 'Bookings & Payment',
      anchorId: 'bookings-and-payment',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'bookings-text',
        content: [
          {
            _type: 'block',
            _key: 'bookings-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Bookings can be made by phone, email, or through our website contact form. A booking is confirmed once we have acknowledged your reservation and payment has been received or agreed upon.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'bookings-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'All prices are quoted in New Zealand Dollars (NZD) and include GST where applicable. Payment is due at the time of booking unless alternative arrangements have been made in advance.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'bookings-3',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'We reserve the right to update our pricing at any time. Any confirmed bookings will be honoured at the price agreed at the time of confirmation.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 3: Cancellation & Rescheduling
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'cancellation-section',
      hideSection: false,
      title: 'Cancellation & Rescheduling',
      anchorId: 'cancellation-and-rescheduling',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'cancellation-text',
        content: [
          {
            _type: 'block',
            _key: 'cancel-1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'A minimum of 48 hours\' notice is required for any cancellation or schedule change to a confirmed booking.',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: ' This applies to all services, including rehearsal sessions, recording sessions, drum tuition lessons, and PA hire arrangements.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'cancel-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'The following cancellation terms apply:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'cancel-3',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Cancellations with 48 or more hours\' notice: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'Full refund or credit towards a future booking at your choice.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'cancel-4',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Cancellations with less than 48 hours\' notice: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'The full session fee will be charged and no refund or credit will be issued.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'cancel-5',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'No-shows: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'Failure to arrive for a confirmed booking without prior notice will be treated as a late cancellation and the full fee will apply.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'cancel-6',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'If we need to cancel or reschedule a booking due to unforeseen circumstances (such as equipment failure or emergency), we will offer a full refund or an alternative booking time at no additional cost.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 4: Rehearsal Room Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'rehearsal-section',
      hideSection: false,
      title: 'Rehearsal Room Terms',
      anchorId: 'rehearsal-room-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'rehearsal-text',
        content: [
          {
            _type: 'block',
            _key: 'reh-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Rehearsal room bookings include the use of our in-house backline equipment, including drum kit, guitar amplifiers, bass amplifier, keyboard amplifier, and PA system. All provided equipment must be treated with care and respect.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'The following conditions apply to all rehearsal room bookings:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Sessions begin and end at the booked times. Late arrivals will not result in extended session times, as subsequent bookings must be honoured.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Noise restrictions apply during weekdays between 10am and 5pm. Please be mindful of volume levels during these hours.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'You are responsible for leaving the room in a tidy condition. Please return all equipment to its original position and remove any rubbish.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-6',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Any damage to studio equipment or the premises must be reported immediately. You will be held liable for repair or replacement costs resulting from negligence or misuse.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-7',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Do not attempt to repair, modify, adjust the settings of, or move any fixed equipment without permission.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'reh-8',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Personal instruments and equipment brought into the studio are entirely at the owner\'s risk. Arch Hill Studios accepts no responsibility for loss, theft, or damage to personal belongings.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 5: Recording Studio Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'recording-section',
      hideSection: false,
      title: 'Recording, Mixing & Mastering Terms',
      anchorId: 'recording-studio-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'recording-text',
        content: [
          {
            _type: 'block',
            _key: 'rec-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Recording sessions are charged on an hourly basis. The scope of work (tracking, mixing, mastering, or a combination) should be discussed and agreed prior to the session.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'rec-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We recommend that artists come to recording sessions well-rehearsed and prepared. Studio time is charged regardless of the level of preparation.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'rec-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'You retain full ownership of your original music and recordings created during sessions at Arch Hill Studios.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'rec-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Final audio files will be delivered in the format agreed upon at the time of booking. Additional formats or revisions beyond the agreed scope may incur extra charges.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'rec-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Session files and project data will be retained by the studio for a reasonable period following the session. However, we strongly recommend that you maintain your own backups. Arch Hill Studios is not responsible for loss of data beyond the agreed delivery.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'rec-6',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'With your consent, we may use short excerpts or photographs from recording sessions for promotional purposes on our website or social media. You may opt out of this at any time.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 6: Drum Tuition Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'tuition-section',
      hideSection: false,
      title: 'Drum Tuition Terms',
      anchorId: 'drum-tuition-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'tuition-text',
        content: [
          {
            _type: 'block',
            _key: 'tuit-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Drum lessons are offered as one-on-one tuition tailored to your skill level, from beginners through to advanced players. Lessons are charged per hour.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'tuit-2',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'The 48-hour cancellation and rescheduling policy applies equally to drum tuition bookings.',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: ' Repeated no-shows may result in the loss of a regular lesson slot.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'tuit-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Students under the age of 18 must have parental or guardian consent before commencing lessons. A parent or guardian should be contactable during lesson times.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'tuit-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'All necessary equipment (drum kit, sticks, practice pads) is provided during lessons at the studio. Students are welcome to bring their own sticks if preferred.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'tuit-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Lesson content and any materials provided by the instructor are for the student\'s personal use only and may not be reproduced or distributed without permission.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 7: PA Hire Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'pa-hire-section',
      hideSection: false,
      title: 'PA Hire Terms',
      anchorId: 'pa-hire-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'pa-hire-text',
        content: [
          {
            _type: 'block',
            _key: 'pa-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'PA system hire includes powered speakers, mixer, microphones, and monitor speakers as agreed at the time of booking. The following terms apply to all PA hire arrangements:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'pa-2',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Deposit: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'A security deposit may be required at the time of booking. The deposit will be refunded upon the safe return of all equipment in the same condition it was provided, less any deductions for damage or missing items.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-3',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Hire period: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'The hire period begins at the agreed collection or delivery time and ends at the agreed return time. Late returns may incur additional daily charges.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-4',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Damage and loss: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'The hirer is fully responsible for the equipment from the point of collection or delivery until its return. Any damage, loss, or theft during the hire period will be charged to the hirer at the cost of repair or replacement.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-5',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Condition and inspection: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'Equipment will be inspected and tested before and after each hire. The hirer should check the equipment on receipt and report any pre-existing issues immediately.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-6',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Prohibited use: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'Equipment must not be sub-hired to third parties, used beyond its rated capacity, or used outdoors without adequate weather protection. The hirer must follow all operating instructions provided.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-7',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Insurance: ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'We recommend that hirers arrange their own insurance to cover the hired equipment during the hire period.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'pa-8',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'We reserve the right to refuse hire to any individual or organisation, particularly where there is a history of equipment damage or non-payment.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 8: Use of Premises & Equipment
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'premises-section',
      hideSection: false,
      title: 'Use of Premises & Equipment',
      anchorId: 'use-of-premises-and-equipment',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'premises-text',
        content: [
          {
            _type: 'block',
            _key: 'prem-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'When using our premises and equipment, you agree to the following:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Treat all studio equipment and facilities with care and respect.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Report any equipment faults, damage, or safety concerns to studio staff immediately.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Do not bring illegal substances, hazardous materials, or any prohibited items onto the premises.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Smoking and vaping are not permitted inside the studio or rehearsal rooms.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-6',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Be mindful of food and drinks near equipment. Please use designated areas for eating and drinking.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'prem-7',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Personal instruments, gear, and belongings brought onto the premises are at the owner\'s sole risk. We are not responsible for any loss, theft, or damage to personal property.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 9: Code of Conduct
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'conduct-section',
      hideSection: false,
      title: 'Code of Conduct',
      anchorId: 'code-of-conduct',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'conduct-text',
        content: [
          {
            _type: 'block',
            _key: 'cond-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Arch Hill Studios is a shared creative space, and we ask that all clients behave respectfully and considerately:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'cond-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Be respectful and courteous toward studio staff, other clients, and our neighbours.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'cond-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Keep noise to a minimum in common areas, car parks, and when entering or leaving the premises.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'cond-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We reserve the right to refuse service or terminate a session immediately if behaviour is disruptive, abusive, or threatens the safety of anyone on the premises.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'cond-5',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'No refund will be issued for sessions terminated due to a breach of this code of conduct.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 10: Liability & Insurance
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'liability-section',
      hideSection: false,
      title: 'Liability & Insurance',
      anchorId: 'liability-and-insurance',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'liability-text',
        content: [
          {
            _type: 'block',
            _key: 'liab-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'To the fullest extent permitted by New Zealand law:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Arch Hill Studios shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services or premises.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We accept no liability for loss, theft, or damage to personal instruments, equipment, or belongings brought onto the premises.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We are not liable for any loss of data, recordings, or session files beyond the agreed delivery of final audio.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'The hirer of PA equipment assumes full responsibility and liability for the equipment during the hire period, including any third-party claims arising from its use.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-6',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'We strongly recommend that all clients maintain their own insurance for personal instruments, equipment, and public liability as appropriate. This is particularly recommended for PA hire clients and bands bringing valuable gear to rehearsals.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'liab-7',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Nothing in these terms excludes or limits liability that cannot legally be excluded under New Zealand law, including liability for death or personal injury caused by negligence.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 11: Health & Safety
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'health-safety-section',
      hideSection: false,
      title: 'Health & Safety',
      anchorId: 'health-and-safety',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'health-safety-text',
        content: [
          {
            _type: 'block',
            _key: 'hs-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'The safety of everyone on our premises is a priority. All clients must comply with the following:',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'hs-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Follow all health and safety instructions provided by studio staff.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'hs-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Familiarise yourself with fire exits and emergency procedures upon arrival.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'hs-4',
            style: 'normal',
            listItem: 'bullet',
            children: [
              {
                _type: 'span',
                text: 'Ear protection is strongly recommended ',
                marks: ['strong']
              },
              {
                _type: 'span',
                text: 'during rehearsal and recording sessions. Prolonged exposure to high sound levels can cause hearing damage.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'hs-5',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We reserve the right to refuse entry to anyone who appears to be intoxicated or under the influence of drugs.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'hs-6',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'If you are feeling unwell or are experiencing symptoms of a contagious illness, please reschedule your booking rather than attending.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 12: Intellectual Property
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'ip-section',
      hideSection: false,
      title: 'Intellectual Property',
      anchorId: 'intellectual-property',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'ip-text',
        content: [
          {
            _type: 'block',
            _key: 'ip-1',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Clients retain full ownership of their original music, compositions, and recordings created at Arch Hill Studios.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'ip-2',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'All Arch Hill Studios branding, website content, lesson materials, and promotional content remain the intellectual property of Arch Hill Studios.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'ip-3',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'Recording, photographing, or filming of studio staff or other clients is not permitted without their express consent.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'ip-4',
            style: 'normal',
            listItem: 'bullet',
            children: [{
              _type: 'span',
              text: 'We may, with your permission, use photos or video taken on the premises for marketing and promotional purposes. You may opt out at any time by contacting us.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 13: Force Majeure
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'force-majeure-section',
      hideSection: false,
      title: 'Force Majeure',
      anchorId: 'force-majeure',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'force-majeure-text',
        content: [
          {
            _type: 'block',
            _key: 'fm-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Arch Hill Studios shall not be liable for any failure or delay in performing our obligations where such failure or delay results from events beyond our reasonable control, including but not limited to natural disasters, power outages, government actions, pandemics, or civil unrest. In such circumstances, we will make reasonable efforts to reschedule or offer credit for affected bookings.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 14: Privacy
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'privacy-section',
      hideSection: false,
      title: 'Privacy',
      anchorId: 'privacy',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'privacy-text',
        content: [
          {
            _type: 'block',
            _key: 'priv-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Your privacy is important to us. Please refer to our Privacy Policy for full details on how we collect, use, and protect your personal information.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 15: Changes to Terms
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'changes-section',
      hideSection: false,
      title: 'Changes to These Terms',
      anchorId: 'changes-to-terms',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'changes-text',
        content: [
          {
            _type: 'block',
            _key: 'chg-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'We reserve the right to update or modify these Terms & Conditions at any time. The most current version will always be available on our website with the "Last Updated" date shown at the top of this page.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'chg-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'Continued use of our services following any changes constitutes your acceptance of the revised terms. Existing confirmed bookings will be honoured under the terms in effect at the time of booking.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 16: Governing Law
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'governing-law-section',
      hideSection: false,
      title: 'Governing Law',
      anchorId: 'governing-law',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'governing-law-text',
        content: [
          {
            _type: 'block',
            _key: 'gov-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'These Terms & Conditions are governed by and construed in accordance with the laws of New Zealand. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of New Zealand.',
              marks: []
            }]
          },
          {
            _type: 'block',
            _key: 'gov-2',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'In the event of a dispute, we encourage both parties to first attempt to resolve the matter informally through direct communication before pursuing legal proceedings.',
              marks: []
            }]
          }
        ]
      }]
    },

    // =========================================================================
    // SECTION 17: Contact Information
    // =========================================================================
    {
      _type: 'pageSection',
      _key: 'contact-section',
      hideSection: false,
      title: 'Contact Information',
      anchorId: 'contact-information',
      useCompactGap: true,
      content: [{
        _type: 'richText',
        _key: 'contact-text',
        content: [
          {
            _type: 'block',
            _key: 'cont-1',
            style: 'normal',
            children: [{
              _type: 'span',
              text: 'If you have any questions about these Terms & Conditions, please contact us:',
              marks: []
            }]
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
          }
        ]
      }]
    }
  ]
};

async function createAndPopulateTermsAndConditions() {
  try {
    console.log('Creating Terms & Conditions document for Arch Hill Studios...');

    // Check if document already exists
    const existingDoc = await client.fetch('*[_id == "termsAndConditions"][0]');

    if (existingDoc) {
      console.log('Terms & Conditions document already exists. Updating...');
      const result = await client.createOrReplace(termsAndConditionsData);
      console.log(`Updated Terms & Conditions document (ID: ${result._id})`);
    } else {
      const result = await client.create(termsAndConditionsData);
      console.log(`Created Terms & Conditions document (ID: ${result._id})`);
    }

    console.log('\nNext steps:');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Site Management > Legal > Terms & Conditions');
    console.log('3. Review the content and make any necessary adjustments');
    console.log('4. Publish the document when ready');
    console.log('5. The page will be available at /terms-and-conditions');
    console.log('\nRemember to have this document reviewed by a legal professional before publishing!');
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
createAndPopulateTermsAndConditions();
