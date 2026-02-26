/**
 * Sanity Dataset Copy Script
 *
 * Backs up the destination dataset, wipes it, then copies the source dataset into it.
 *
 * To run this script:
 * 1. Make sure you're in the project root directory
 * 2. Run: node scripts/copy-dataset.js
 *
 * You will be prompted for:
 *   - Source dataset name      (the dataset to copy FROM)
 *   - Destination dataset name (the dataset to copy TO — will be wiped first)
 *
 * What the script does:
 *   Step 1 — Exports the destination dataset as a dated .tar.gz backup in /backups
 *   Step 2 — Deletes the destination dataset
 *   Step 3 — Recreates the destination dataset (empty)
 *   Step 4 — Exports the source dataset, imports it into the destination, then
 *             removes the temporary source export file
 *
 * The destination backup in /backups is always kept, even if something goes wrong.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const readline = require('readline');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.join(__dirname, '..');
const BACKUPS_DIR = path.join(PROJECT_ROOT, 'backups');

// ── Helpers ───────────────────────────────────────────────────────────────────

const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: PROJECT_ROOT });

const timestamp = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
};

const prompt = (rl, question) =>
  new Promise((resolve) => rl.question(question, resolve));

// ── Main ──────────────────────────────────────────────────────────────────────

const main = async () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\nSanity Dataset Copy Tool');
  console.log('========================');
  console.log('This script will:');
  console.log('  1. Back up the destination dataset to /backups');
  console.log('  2. Delete and recreate the destination dataset (clean wipe)');
  console.log('  3. Import the source dataset into the destination\n');

  const source = (await prompt(rl, 'Source dataset name:      ')).trim();
  const destination = (await prompt(rl, 'Destination dataset name: ')).trim();

  console.log('');

  if (!source || !destination) {
    console.error('✖  Both dataset names are required. Aborting.');
    rl.close();
    process.exit(1);
  }

  if (source === destination) {
    console.error('✖  Source and destination cannot be the same dataset. Aborting.');
    rl.close();
    process.exit(1);
  }

  console.warn(`⚠  You are about to PERMANENTLY overwrite '${destination}' with data from '${source}'.`);
  const confirm = (await prompt(rl, "Type 'yes' to confirm: ")).trim();
  rl.close();
  console.log('');

  if (confirm !== 'yes') {
    console.log('ℹ  Aborted by user.');
    process.exit(0);
  }

  fs.mkdirSync(BACKUPS_DIR, { recursive: true });

  const ts = timestamp();
  const backupFile = path.join(BACKUPS_DIR, `backup-${destination}-${ts}.tar.gz`);
  const sourceExportFile = path.join(BACKUPS_DIR, `export-${source}-${ts}.tar.gz`);

  // Step 1 — Back up destination
  console.log(`\nStep 1/4 — Backing up '${destination}' dataset`);
  console.log(`ℹ  Exporting to: ${backupFile}`);
  run(`npx sanity dataset export ${destination} "${backupFile}"`);
  console.log(`✔  Backup complete: ${backupFile}`);

  // Step 2 — Delete destination
  console.log(`\nStep 2/4 — Deleting '${destination}' dataset`);
  run(`npx sanity dataset delete ${destination}`);
  console.log(`✔  Dataset '${destination}' deleted.`);

  // Step 3 — Recreate destination
  console.log(`\nStep 3/4 — Recreating '${destination}' dataset`);
  run(`npx sanity dataset create ${destination}`);
  console.log(`✔  Dataset '${destination}' recreated (empty).`);

  // Step 4 — Copy source into destination
  console.log(`\nStep 4/4 — Copying '${source}' → '${destination}'`);
  console.log(`ℹ  Exporting source dataset '${source}'...`);
  run(`npx sanity dataset export ${source} "${sourceExportFile}"`);
  console.log('✔  Source export complete.');

  console.log(`ℹ  Importing into '${destination}'...`);
  run(`npx sanity dataset import "${sourceExportFile}" ${destination}`);
  console.log('✔  Import complete.');

  fs.rmSync(sourceExportFile);
  console.log('ℹ  Cleaned up temporary source export.');

  console.log(`\n✔  Done! '${destination}' now contains a copy of '${source}'.`);
  console.log(`ℹ  Destination backup kept at: ${backupFile}`);
};

main().catch((err) => {
  console.error('✖  Unexpected error:', err.message);
  process.exit(1);
});
