#!/usr/bin/env node
/*
 * Run enumerateDiagnostics on a given TeX/Markdown file using the vscode mock.
 * Output: JSON on stdout with diagnostics or error info.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildSync } = require('esbuild');

function ensureLocalStorage() {
    if (typeof global.localStorage !== 'undefined') return;
    const store = new Map();
    global.localStorage = {
        getItem: (key) => (store.has(key) ? store.get(key) : null),
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear(),
    };
}

function applyDefaultConfig() {
    const defaults = {
        'vscode-config-latexlint.disabledRules': JSON.stringify(['LLCref', 'LLJapaneseSpace']),
        'vscode-config-latexlint.LLCrefExceptions': JSON.stringify(['line:', 'prob:', 'problem:']),
        'vscode-config-latexlint.userDefinedRules': JSON.stringify([]),
    };
    for (const [k, v] of Object.entries(defaults))
        if (global.localStorage.getItem(k) === null)
            global.localStorage.setItem(k, v);
}

function bundleAndLoad(repoRoot) {
    const entryTs = path.join(repoRoot, 'src', 'util', 'enumerateDiagnostics.ts');
    const mockTs = path.join(repoRoot, 'web', 'src', 'utils', 'vscode-mock.ts');

    const entryTmp = path.join(
        os.tmpdir(),
        `ll-entry-${Date.now()}-${Math.random().toString(16).slice(2)}.ts`
    );
    const outFile = path.join(
        os.tmpdir(),
        `ll-bundle-${Date.now()}-${Math.random().toString(16).slice(2)}.cjs`
    );

    const entrySource = `import enumerateDiagnostics from "${entryTs.replace(/\\/g, '\\\\')}";\n` +
        `import vscode from "${mockTs.replace(/\\/g, '\\\\')}";\n` +
        `export const createMockTextDocument = vscode.createMockTextDocument;\n` +
        `export const Uri = vscode.Uri;\n` +
        `export { enumerateDiagnostics };\n`;
    fs.writeFileSync(entryTmp, entrySource, 'utf8');

    buildSync({
        entryPoints: [entryTmp],
        outfile: outFile,
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: 'node20',
        sourcemap: false,
        alias: { vscode: mockTs },
        logLevel: 'silent',
    });

    const mod = require(outFile);
    try {
        fs.unlinkSync(entryTmp);
    } catch (_) { /* ignore */ }
    return { ...mod, bundlePath: outFile };
}

function main() {
    ensureLocalStorage();
    applyDefaultConfig();

    const filePath = process.argv[2];
    if (!filePath) {
        console.error(JSON.stringify({ ok: false, error: 'Usage: run_enumerate.js <file>' }));
        process.exit(1);
    }

    const repoRoot = path.resolve(__dirname, '..');
    const absPath = path.resolve(filePath);

    let text;
    try {
        text = fs.readFileSync(absPath, 'utf8');
    } catch (err) {
        console.error(JSON.stringify({ ok: false, error: `read failed: ${err.message}` }));
        process.exit(1);
    }

    let enumerateDiagnostics, createMockTextDocument, Uri, bundlePath;
    try {
        ({ enumerateDiagnostics, createMockTextDocument, Uri, bundlePath } = bundleAndLoad(repoRoot));
    } catch (err) {
        console.error(JSON.stringify({ ok: false, error: `bundle failed: ${err.message}` }));
        process.exit(1);
    }

    try {
        const languageId = absPath.toLowerCase().endsWith('.md') ? 'markdown' : 'latex';
        const doc = createMockTextDocument(text, Uri.file(absPath), languageId);
        const diagnostics = enumerateDiagnostics(doc) || [];
        const payload = diagnostics.map((d) => ({
            message: d.message,
            severity: d.severity,
            start: { line: d.range.start.line, character: d.range.start.character },
            end: { line: d.range.end.line, character: d.range.end.character },
            code: d.code,
        }));
        console.log(JSON.stringify({ ok: true, diagnostics: payload }));
    } catch (err) {
        console.error(JSON.stringify({ ok: false, error: `enumerate failed: ${err.message}`, stack: err && err.stack }));
        process.exit(1);
    } finally {
        try { fs.unlinkSync(bundlePath); } catch (_) { /* ignore */ }
    }
}

main();
