const path = require('node:path');
const fs = require('node:fs');
const { buildSync } = require('esbuild');
const metadata = require('../package.json');

const root = path.resolve(__dirname, '..');
const defaults = Object.fromEntries(Object.entries(metadata.contributes.configuration.properties)
    .map(([key, value]) => [key.replace(/^latexlint\./, ''), value.default]));

// Bundle every runtime dependency (including vocabulary JSON) into the executable.
// https://esbuild.github.io/api/#alias
const buildOptions = {
    absWorkingDir: root,
    entryPoints: [path.join(root, 'src/cli/main.ts')],
    outfile: 'dist/cli.cjs',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    alias: { vscode: path.join(root, 'src/cli/vscode.ts') },
    define: {
        __LATEXLINT_DEFAULTS__: JSON.stringify(defaults),
        __LATEXLINT_VERSION__: JSON.stringify(metadata.version)
    },
    banner: { js: '#!/usr/bin/env node' },
    legalComments: 'eof',
    metafile: true,
    logLevel: 'info'
};

function writeLicenses(metafile) {
    const packages = new Map();
    for (const input of Object.keys(metafile.inputs)) {
        if (!input.includes('node_modules/')) continue;
        let directory = path.dirname(path.resolve(root, input));
        while (directory !== path.dirname(directory)) {
            const manifestPath = path.join(directory, 'package.json');
            if (fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (manifest.name && manifest.version) {
                    packages.set(`${manifest.name}@${manifest.version}`, { directory, manifest });
                    break;
                }
            }
            directory = path.dirname(directory);
        }
    }
    // Bundling does not automatically copy LICENSE files. Include the original
    // notices for exactly the installed packages recorded in esbuild's inputs.
    const notices = [...packages].sort(([left], [right]) => left.localeCompare(right))
        .map(([name, { directory, manifest }]) => {
            const filenames = fs.readdirSync(directory).filter(filename => /^(license|licence|copying)([.-]|$)/i.test(filename));
            if (filenames.length === 0) throw new Error(`Missing third-party license: ${name}`);
            const texts = filenames.map(filename => fs.readFileSync(path.join(directory, filename), 'utf8').trim());
            return `${name} (${manifest.license})\n${texts.join('\n\n')}`;
        });
    fs.writeFileSync(path.join(root, 'dist/cli-licenses.txt'), notices.join('\n\n---\n\n') + '\n');
}

module.exports = buildOptions;
if (require.main === module) writeLicenses(buildSync(buildOptions).metafile);
