/**
 * Script to populate the Gear page with gear list items in Sanity CMS
 * Tailored for Arch Hill Studios
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/populate-gear-list.js
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

// Generate a unique key for Sanity array items
function generateKey() {
  return Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 6);
}

// =========================================================================
// GEAR LIST DATA
// =========================================================================
const gearCategories = [
  {
    title: 'Live Room',
    items: [
      'Pearl professional MX Drumkit 5 Piece',
      'Peavey Session Bass Amp 250 watts',
      'Ampeg 8x10 Bass Cab',
      'Galien Gruger 4x 10 Bass Cab',
      'Randall Rx75R Gat Combo',
    ],
  },
  {
    title: 'PA',
    items: [
      'Allen & Heath Mix Wizard 16:2 sound desk',
      'Mackie DL 1608 Digital Desk',
      '2 x DSC K12 Speakers FOH 1200 watts RMS',
      '2 x Mackie DLM 12 Monitors 1000 watts RMS',
      '1 x Wharfdale Pro 18" Sub 100watts RMS',
      'Assortment Of Mic Stands And Cables',
    ],
  },
  {
    title: 'Mics',
    items: [
      'Neuman TLM 103 Condensor Mic',
      'Nady TCM 1050 Condensor Mic (Neuman U67 clone)',
      'Audio Technica AE 2500 Dual Condensor And Dynamic Mic',
      'Audio Technica AT4041 Pencil Condensor Mic',
      'SennHeiser MD 421 Vintage Dynamic Mic',
      '3 x Octava MC 012 Condensor Mics',
      '2 x Earth works OM1 Condensor Mics',
      '2 x Shure SM 57 Dynamic Mics',
      '2x Shure SM 58 Dynamic Mics',
      '1 x Shure PG Drum Mic Kit',
    ],
  },
  {
    title: 'Control Room',
    items: [
      'MOTU 828 ES 10 Channel Master Audio Interface',
      'Audient ASP 008 8 Channel ADAT Audio Interface',
      'Tone Beast TB 12 Mic Pre-Amp',
      'Joe Meek VC 7 Dual Mic Pre Amps',
      'GA Project Pre 73 MK111. Dual Mic Amps (Neve Clone)',
      '2 x ART Pro MPA Dual Mic Amps',
      '2 x Genelec 1030a Studio Monitors',
      'Apple Mac M1 Mac Mini Studio (Silicon)',
    ],
  },
];

// Build the gear list block
function buildGearListBlock(existingKey) {
  return {
    _type: 'gearList',
    _key: existingKey || generateKey(),
    categories: gearCategories.map((cat) => ({
      _type: 'gearCategory',
      _key: generateKey(),
      title: cat.title,
      items: cat.items.map((itemText) => ({
        _type: 'gearItem',
        _key: generateKey(),
        text: itemText,
      })),
    })),
  };
}

// Build a content wrapper block containing the gear list
function buildContentWrapperWithGearList(existingWrapperKey, existingGearListKey) {
  return {
    _type: 'contentWrapper',
    _key: existingWrapperKey || generateKey(),
    content: [buildGearListBlock(existingGearListKey)],
  };
}

async function main() {
  console.log('🔍 Looking for the Gear page in Sanity...\n');

  // Query for the Gear page - try both lowercase and proper case
  const gearPage = await client.fetch(
    `*[_type == "page" && (
      lower(title) == "gear" ||
      slug.current == "gear"
    )][0]{
      _id,
      title,
      slug,
      content
    }`
  );

  if (!gearPage) {
    console.error('❌ Could not find a page with title "Gear" or slug "gear".');
    console.error('   Please check the page exists in Sanity Studio and try again.');
    process.exit(1);
  }

  console.log(`✅ Found page: "${gearPage.title}" (ID: ${gearPage._id})\n`);

  const content = gearPage.content || [];

  // Look for an existing contentWrapper that already contains a gearList block
  const existingWrapper = content.find(
    (block) =>
      block._type === 'contentWrapper' &&
      Array.isArray(block.content) &&
      block.content.some((inner) => inner._type === 'gearList')
  );

  if (existingWrapper) {
    const existingGearList = existingWrapper.content.find((b) => b._type === 'gearList');
    console.log(`📋 Found existing Content Wrapper (key: ${existingWrapper._key}) with Gear List inside (key: ${existingGearList._key})`);
    console.log('   Replacing categories with new gear list data...\n');

    // Update the gearList block in place using its nested path, preserving both keys
    const updatedGearListBlock = buildGearListBlock(existingGearList._key);

    await client
      .patch(gearPage._id)
      .set({
        [`content[_key=="${existingWrapper._key}"].content[_key=="${existingGearList._key}"]`]:
          updatedGearListBlock,
      })
      .commit();

    console.log('✅ Gear List block updated successfully inside existing Content Wrapper!\n');
  } else {
    console.log('📋 No existing Content Wrapper with Gear List found. Appending a new Content Wrapper at the end of the page...\n');

    const newWrapper = buildContentWrapperWithGearList();

    await client
      .patch(gearPage._id)
      .setIfMissing({ content: [] })
      .append('content', [newWrapper])
      .commit();

    console.log('✅ New Content Wrapper with Gear List appended successfully!\n');
  }

  // Summary
  console.log('📦 Gear list summary:');
  gearCategories.forEach((cat) => {
    console.log(`   ${cat.title}: ${cat.items.length} item(s)`);
  });

  const totalItems = gearCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  console.log(`\n   Total: ${gearCategories.length} categories, ${totalItems} items`);
  console.log('\n🎉 Done! Visit Sanity Studio to review the changes.');
}

main().catch((error) => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
