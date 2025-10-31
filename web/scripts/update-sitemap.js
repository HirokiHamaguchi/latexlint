#!/usr/bin/env node

/**
 * Script to update the lastmod date in sitemap.xml to the current date
 * This ensures search engines know when the site was last updated
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

try {
  // Get current date in ISO format (YYYY-MM-DD)
  const currentDate = new Date().toISOString().split('T')[0];

  // Read the sitemap file
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap file not found at ${sitemapPath}`);
  }

  let sitemap = fs.readFileSync(sitemapPath, 'utf8');

  // Update the lastmod date
  sitemap = sitemap.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${currentDate}</lastmod>`
  );

  // Write back to file
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`✓ Updated sitemap.xml lastmod to ${currentDate}`);
} catch (error) {
  console.error(`✗ Failed to update sitemap.xml: ${error.message}`);
  process.exit(1);
}
