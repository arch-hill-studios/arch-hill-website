# Sanity Dataset Management

This guide covers how to backup, export, and sync data between Sanity datasets (production and development).

## Quick Reference

### Export Dataset to File

```bash
# Export production to compressed backup
npx sanity dataset export production backup-production.tar.gz

# Export as JSON (uncompressed)
npx sanity dataset export production backup-production.ndjson

# Export with date in filename
npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz

# Export without assets (smaller file size)
npx sanity dataset export production backup-production.tar.gz --no-assets
```

### Import Data into Dataset

```bash
# Import backup file into development
npx sanity dataset import backup-production.tar.gz development

# Direct pipe (no intermediate file) [THIS DOESN'T WORK]
npx sanity dataset export production | npx sanity dataset import - development
```

## Common Workflows

### 1. Populate Empty Development Dataset

When your development dataset is empty and you want production data:

```bash
# Step 1: Export production
npx sanity dataset export production backup-production.tar.gz

# Step 2: Import into development
npx sanity dataset import backup-production.tar.gz development
```

### 2. Complete Dataset Replacement (Clean Copy)

When you want development to be identical to production:

```bash
# Delete all data in development
npx sanity dataset delete development

# Recreate the dataset
npx sanity dataset create development

# Import production data (no --replace needed since dataset is empty)
npx sanity dataset import backup-production.tar.gz development
```

### 3. Selective Update (Merge/Overwrite)

When you want to update development with production changes but keep dev-only content:

```bash
# Import with replace flag (merges/overwrites existing documents)
npx sanity dataset import backup-production.tar.gz development --replace
```

## Understanding Import Behaviors

| Scenario                      | Command                                      | Result                                                                           |
| ----------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| Empty development dataset     | `import backup.tar.gz development`           | All production data copied over                                                  |
| Development has existing data | `import backup.tar.gz development`           | Error if document IDs conflict                                                   |
| Development has existing data | `import backup.tar.gz development --replace` | Production documents overwrite matching dev documents, dev-only documents remain |
| After deleting dataset        | `import backup.tar.gz development`           | Clean copy of production (no conflicts possible)                                 |

## Important Notes

- **Environment Variables**: You don't need to change your `.env.local` - commands can specify dataset explicitly
- **Schema vs Data**: Exports include document data and assets, but not schema definitions (those come from your code)
- **Document IDs**: Documents with matching IDs will conflict unless using `--replace`
- **Assets**: Images and files are included in exports by default
- **Safety**: Always backup before overwriting production data

## Recommended Practices

### Regular Backups

```bash
# Create dated backups of production
npx sanity dataset export production backups/backup-$(date +%Y%m%d).tar.gz
```

### Development Refresh Workflow

```bash
# Monthly clean refresh of development environment
npx sanity dataset delete development
npx sanity dataset create development
npx sanity dataset import backup-production.tar.gz development
```

### Safety First

- Keep `.env.local` pointing to development dataset
- Always test changes in development first
- Create backups before major operations
- Consider adding `*.tar.gz` to `.gitignore`

## File Formats

- **`.tar.gz`**: Compressed, includes assets (recommended for backups)
- **`.ndjson`**: Newline-delimited JSON, text-only, no assets (good for inspection)
- **`-`**: Pipe directly between commands (no file created)
