import * as vscode from './vscode-mock';
import { alignRules, standardRules } from '@latexlint/util/rules';
import enumAlignEnvs from '@latexlint/util/enumAlignEnvs';
import type * as monaco from 'monaco-editor';
import { MyTextLint } from './my-text-lint/main';

function createDocument(text: string): vscode.TextDocument {
    // Use the existing createMockTextDocument from vscode-mock
    const uri = vscode.Uri.file('untitled.tex');
    return vscode.createMockTextDocument(text, uri);
}

function convertToMonacoMarker(diag: import('vscode').Diagnostic): monaco.editor.IMarkerData {
    // Convert VS Code DiagnosticSeverity to Monaco MarkerSeverity
    // VS Code: Error=0, Warning=1, Information=2, Hint=3
    // Monaco: Hint=1, Info=2, Warning=4, Error=8
    let severity: monaco.MarkerSeverity;
    switch (diag.severity) {
        case 0: severity = 8; break; // Error
        case 1: severity = 4; break; // Warning
        case 2: severity = 2; break; // Information
        case 3: severity = 1; break; // Hint
        default: severity = 2; break; // Default to Info
    }

    return {
        startLineNumber: diag.range.start.line + 1, // Monaco uses 1-based line numbers
        startColumn: diag.range.start.character + 1, // Monaco uses 1-based column numbers
        endLineNumber: diag.range.end.line + 1,
        endColumn: diag.range.end.character + 1,
        message: diag.message,
        severity: severity,
        source: diag.source || 'latexlint',
        code: (diag.code as { value: string }).value || '',
    };
}

// Main lint function for web version
export function lintLatex(text: string, disabledRules: string[] = []): monaco.editor.IMarkerData[] {
    const doc = createDocument(text);
    const txt = text;
    const alignLikeEnvs = enumAlignEnvs(txt, doc.positionAt, console.warn);

    // Note: Using type assertion to bridge mock types with real VS Code types for web compatibility
    const vscodeDoc = doc as unknown as import('vscode').TextDocument;
    const diagnostics: import('vscode').Diagnostic[] = [];

    const t0 = performance.now();

    // Rules that need align environments
    for (const [ruleName, rule] of Object.entries(alignRules)) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(vscodeDoc, txt, alignLikeEnvs);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // Rules that don't need align environments
    for (const [ruleName, rule] of Object.entries(standardRules)) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(vscodeDoc, txt);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    const t1 = performance.now();

    console.log(`Linting took ${(t1 - t0).toFixed(2)} ms`);

    console.log(MyTextLint(txt));

    return diagnostics.map(convertToMonacoMarker);
}