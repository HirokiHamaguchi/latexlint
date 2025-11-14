import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..', '..');
const webDir = join(__dirname, '..');

const sourceReadme = join(rootDir, 'README.md');
const targetDir = join(webDir, 'src', 'assets');
const targetReadme = join(targetDir, 'README.md');

try {
    // Ensure target directory exists
    mkdirSync(targetDir, { recursive: true });

    // Copy README.md
    const content = readFileSync(sourceReadme, 'utf-8');
    writeFileSync(targetReadme, content, 'utf-8');

    console.log('✓ README.md copied successfully');
} catch (error) {
    console.error(`✗ Failed to copy README.md from "${sourceReadme}" to "${targetReadme}":`, error);
    process.exit(1);
}
