#!/usr/bin/env node
/*
 * Run enumerateDiagnostics on a given TeX/Markdown file using the vscode mock.
 * Output: JSON on stdout with diagnostics or error info.
 */
const fs = require('fs');
const Module = require('module');
const path = require('path');
const ts = require('typescript');

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

function loadTypeScriptModule(modulePath) {
    const source = fs.readFileSync(modulePath, 'utf8');
    const transpiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
        },
        fileName: modulePath,
    });

    const mod = new Module(modulePath, module);
    mod.filename = modulePath;
    mod.paths = Module._nodeModulePaths(path.dirname(modulePath));
    mod._compile(transpiled.outputText, modulePath);
    return mod.exports;
}

function bundleAndLoad(repoRoot) {
    const mockPath = path.join(repoRoot, 'script', 'vscode-mock.ts');
    const enumerateDiagnosticsPath = path.join(
        repoRoot,
        'out',
        'util',
        'enumerateDiagnostics.js'
    );

    if (!fs.existsSync(enumerateDiagnosticsPath))
        throw new Error(
            `compiled file not found: ${enumerateDiagnosticsPath}. Run "npm.cmd run compile-tests" first.`
        );

    const vscodeMock = loadTypeScriptModule(mockPath);
    const originalLoad = Module._load;
    Module._load = function patchedLoad(request, parent, isMain) {
        if (request === 'vscode') return vscodeMock;
        return originalLoad.call(this, request, parent, isMain);
    };

    try {
        delete require.cache[enumerateDiagnosticsPath];
        const mod = require(enumerateDiagnosticsPath);
        return {
            enumerateDiagnostics: mod.default,
            createMockTextDocument: vscodeMock.createMockTextDocument,
            Uri: vscodeMock.Uri,
        };
    } finally {
        Module._load = originalLoad;
    }
}

function processFile(filePath, enumerateDiagnostics, createMockTextDocument, Uri) {
    const absPath = path.resolve(filePath);
    try {
        const text = fs.readFileSync(absPath, 'utf8');
        const languageId = absPath.toLowerCase().endsWith('.md') ? 'markdown' : 'latex';
        const doc = createMockTextDocument(text, Uri.file(absPath), languageId);
        const diagnostics = enumerateDiagnostics(doc) || [];
        const payload = diagnostics.map((d) => {
            // Extract the text at the error location (up to first newline)
            let errorText = doc.getText(d.range);
            const newlineIndex = errorText.indexOf('\n');
            if (newlineIndex !== -1) {
                const remainingLines = (errorText.match(/\n/g) || []).length;
                errorText = errorText.substring(0, newlineIndex);
                if (remainingLines > 0)
                    errorText += ` (and ${remainingLines} more line${remainingLines > 1 ? 's' : ''}...)`;
            }
            return {
                message: d.message,
                severity: d.severity,
                start: { line: d.range.start.line, character: d.range.start.character },
                end: { line: d.range.end.line, character: d.range.end.character },
                code: d.code,
                errorText: errorText,
            };
        });
        return { ok: true, file: absPath, diagnostics: payload };
    } catch (err) {
        return { ok: false, file: absPath, error: err.message };
    }
}

function main() {
    ensureLocalStorage();
    applyDefaultConfig();

    // Support both single file and multiple files (batch mode)
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error(JSON.stringify({ ok: false, error: 'Usage: run_diagnose.js <file1> [file2] ... or run_diagnose.js --batch <files.json>' }));
        process.exit(1);
    }

    const repoRoot = path.resolve(__dirname, '..');

    // Bundle once for all files
    let enumerateDiagnostics, createMockTextDocument, Uri;
    try {
        ({ enumerateDiagnostics, createMockTextDocument, Uri } = bundleAndLoad(repoRoot));
    } catch (err) {
        console.error(JSON.stringify({ ok: false, error: `bundle failed: ${err.message}` }));
        process.exit(1);
    }

    try {
        let filePaths;

        // Check if batch mode (reading file paths from JSON file)
        if (args[0] === '--batch' && args[1])
            try {
                const batchContent = fs.readFileSync(args[1], 'utf8');
                filePaths = JSON.parse(batchContent);
                if (!Array.isArray(filePaths))
                    throw new Error('Batch file must contain an array of file paths');
            } catch (err) {
                console.error(JSON.stringify({ ok: false, error: `batch read failed: ${err.message}` }));
                process.exit(1);
            }
        else
            filePaths = args;

        // Process all files
        const results = filePaths.map((fp) => processFile(fp, enumerateDiagnostics, createMockTextDocument, Uri));
        console.log(JSON.stringify({ ok: true, results }));
    } catch (err) {
        console.error(JSON.stringify({ ok: false, error: `processing failed: ${err.message}`, stack: err && err.stack }));
        process.exit(1);
    }
}

main();
