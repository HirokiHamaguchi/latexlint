import * as vscode from './vscode-mock';
import { alignRules, standardRules } from '@latexlint/util/rules';
import enumAlignEnvs from '@latexlint/util/enumAlignEnvs';

// Simplified diagnostic interface for web version
export interface WebDiagnostic {
    range: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    message: string;
    severity: 'error' | 'warning' | 'info';
    source: string;
    code?: string;
}

function createDocument(text: string): vscode.TextDocument {
    // Use the existing createMockTextDocument from vscode-mock
    const uri = vscode.Uri.file('untitled.tex');
    return vscode.createMockTextDocument(text, uri);
}

function convertDiagnostic(diag: import('vscode').Diagnostic): WebDiagnostic {
    let severity: 'error' | 'warning' | 'info' = 'info';
    switch (diag.severity) {
        case 0: severity = 'error'; break;
        case 1: severity = 'warning'; break;
        case 2:
        case 3:
        default: severity = 'info'; break;
    }

    return {
        range: {
            start: { line: diag.range.start.line, character: diag.range.start.character },
            end: { line: diag.range.end.line, character: diag.range.end.character }
        },
        message: diag.message,
        severity: severity,
        source: diag.source || 'latexlint',
        code: typeof diag.code === 'string' || typeof diag.code === 'number' ? diag.code.toString() : undefined
    };
}

// Main lint function for web version
export function lintLatex(text: string, disabledRules: string[] = []): WebDiagnostic[] {
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

    return diagnostics.map(convertDiagnostic);
}