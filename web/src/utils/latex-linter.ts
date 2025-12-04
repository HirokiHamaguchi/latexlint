import { checkNoDroppingI } from "@latexlint/TextLint/no_dropping_i";
import { checkNoDroppingRa } from "@latexlint/TextLint/no_dropping_ra";
import { checkNoSuccessiveWord } from "@latexlint/TextLint/no_successive_word";
import { checkOverlookedTypo } from "@latexlint/TextLint/overlooked_typo";
import { parseSentence } from "@latexlint/TextLint/parser";
import { checkTariTari } from "@latexlint/TextLint/tari_tari";
import type { LLTextLintErrorResult } from "@latexlint/TextLint/types";
import enumAlignEnvs from '@latexlint/util/enumAlignEnvs';
import formatException from "@latexlint/util/formatException";
import { getCodeWithURI } from '@latexlint/util/getCodeWithURI';
import type { LLText } from '@latexlint/util/LLText';
import { configuredRules, standardRules } from '@latexlint/util/rules';
import * as monaco from 'monaco-editor';
import { getConfig } from '../config';
import * as vscode from './vscode-mock';
import { DiagnosticSeverity, Range } from './vscode-mock';

// TextLint readiness state
let isTextLintReady = false;
let textLintPreloadPromise: Promise<void> | null = null;

export async function preloadTextLintDictionary(): Promise<void> {
    if (isTextLintReady || textLintPreloadPromise) {
        return textLintPreloadPromise || Promise.resolve();
    }

    textLintPreloadPromise = parseSentence('').then(() => {
        isTextLintReady = true;
    }).catch(error => {
        console.error('Failed to preload TextLint dictionary:', error);
        textLintPreloadPromise = null;
    });

    return textLintPreloadPromise;
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

    const code_value = String(typeof diag.code === "object" ? diag.code.value : diag.code);
    let code: string | { value: string; target: monaco.Uri } = "";
    if (typeof diag.code === "object" && diag.code.target) {
        const targetUrl = diag.code.target.toString();
        const hashMatch = targetUrl.match(/#(.+)$/);
        if (hashMatch) {
            const code_target = monaco.Uri.parse(`${window.location.origin}${window.location.pathname}#${hashMatch[1]}`);
            code = { value: code_value, target: code_target }
        }
    }
    if (!code) code = code_value;

    return {
        startLineNumber: diag.range.start.line + 1, // Monaco uses 1-based line numbers
        startColumn: diag.range.start.character + 1, // Monaco uses 1-based column numbers
        endLineNumber: diag.range.end.line + 1,
        endColumn: diag.range.end.character + 1,
        message: diag.message,
        severity: severity,
        source: diag.source,
        code: code
    };
}

// Main lint function for web version
export async function lintLatex(
    text: string,
    docType: 'latex' | 'markdown',
    forceTextLint: boolean
): Promise<monaco.editor.IMarkerData[]> {
    const ext = docType === 'latex' ? '.tex' : '.md';
    const doc = vscode.createMockTextDocument(text, vscode.Uri.file(`untitled${ext}`), docType === 'latex' ? 'latex' : 'markdown');
    const vscodeDoc = doc as unknown as import('vscode').TextDocument;
    const diagnostics: import('vscode').Diagnostic[] = [];
    const alignLikeEnvs = enumAlignEnvs(text, doc.positionAt, diagnostics);

    // Create LLText object
    const txt: LLText = {
        text: text,
        alignLikeEnvs: alignLikeEnvs
    };

    const config = getConfig();
    const disabledRules = config.disabledRules || [];

    const t0 = performance.now();

    // All standard rules (now includes former align rules)
    for (const [ruleName, rule] of Object.entries(standardRules)) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(vscodeDoc, txt);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // Rules that need configuration
    for (const [ruleName, { rule, configKey }] of Object.entries(configuredRules)) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(vscodeDoc, txt, config[configKey]);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // LLTextLint checks
    if (!disabledRules.includes('LLTextLint')) {
        if (isTextLintReady || forceTextLint) {
            try {
                // Parse the text into tokens
                const allTokens = await parseSentence(text);

                // Run all LLTextLint checks and collect error results
                const errorResults: LLTextLintErrorResult[] = [
                    ...checkNoDroppingI(allTokens),
                    ...checkNoDroppingRa(allTokens),
                    ...checkTariTari(allTokens),
                    ...checkNoSuccessiveWord(allTokens),
                    ...checkOverlookedTypo(text),
                ];

                // Convert to Diagnostics
                errorResults.map(error => {
                    diagnostics.push({
                        code: getCodeWithURI("LLTextLint"),
                        message: error.message,
                        range: new Range(doc.positionAt(error.startOffset), doc.positionAt(error.endOffset)),
                        severity: DiagnosticSeverity.Information,
                        source: "LaTeX Lint",
                    });
                });
            } catch (error) {
                console.warn('LLTextLint failed:', error);
            }
        } else {
            console.log("Skipping LLTextLint");
        }
    }

    const t1 = performance.now();

    console.log(`Linting took ${(t1 - t0).toFixed(2)} ms`);

    return diagnostics.filter(diag => !config.exceptions.includes(formatException(vscodeDoc.getText(diag.range)))).map(convertToMonacoMarker);
}