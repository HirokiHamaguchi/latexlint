import * as vscode from './vscode-mock';
import LLAlignAnd from '@latexlint/LL/LLAlignAnd';
import LLAlignEnd from '@latexlint/LL/LLAlignEnd';
import LLAlignSingleLine from '@latexlint/LL/LLAlignSingleLine';
import LLArticle from '@latexlint/LL/LLArticle';
import LLBig from '@latexlint/LL/LLBig';
import LLBracketCurly from '@latexlint/LL/LLBracketCurly';
import LLBracketMissing from '@latexlint/LL/LLBracketMissing';
import LLBracketRound from '@latexlint/LL/LLBracketRound';
import LLColonEqq from '@latexlint/LL/LLColonEqq';
import LLColonForMapping from '@latexlint/LL/LLColonForMapping';
import LLCref from '@latexlint/LL/LLCref';
import LLDoubleQuotes from '@latexlint/LL/LLDoubleQuotes';
import LLENDash from '@latexlint/LL/LLENDash';
import LLEqnarray from '@latexlint/LL/LLEqnarray';
import LLFootnote from '@latexlint/LL/LLFootnote';
import LLJapaneseSpace from '@latexlint/LL/LLJapaneseSpace';
import LLLlGg from '@latexlint/LL/LLLlGg';
import LLNonASCII from '@latexlint/LL/LLNonASCII';
import LLPeriod from '@latexlint/LL/LLPeriod';
import LLRefEq from '@latexlint/LL/LLRefEq';
import LLSharp from '@latexlint/LL/LLSharp';
import LLSI from '@latexlint/LL/LLSI';
import LLSortedCites from '@latexlint/LL/LLSortedCites';
import LLT from '@latexlint/LL/LLT';
import LLThousands from '@latexlint/LL/LLThousands';
import LLTitle from '@latexlint/LL/LLTitle';
import LLURL from '@latexlint/LL/LLURL';
import LLUserDefined from '@latexlint/LL/LLUserDefined';

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

// Web-compatible version of enumAlignEnvs
function enumAlignEnvsWeb(txt: string): [number, number][] {
    const alignLikeEnvs = [
        'align',
        'alignat',
        'aligned',
        'split',
        'gather',
    ];

    // Extract all \begin{align} and \end{align} commands
    const regexAndDeltas = [];
    for (let i = 0; i < alignLikeEnvs.length; i++) {
        const env = alignLikeEnvs[i];
        regexAndDeltas.push({ regex: new RegExp(`\\\\begin\\{${env}\\}`, 'g'), delta: +(2 * i + 1) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\begin\\{${env}\\*\\}`, 'g'), delta: +(2 * i + 2) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\end\\{${env}\\}`, 'g'), delta: -(2 * i + 1) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\end\\{${env}\\*\\}`, 'g'), delta: -(2 * i + 2) });
    }

    const cmdPairs = [];
    for (const { regex, delta } of regexAndDeltas)
        for (const match of txt.matchAll(regex)) {
            if (isInCommentWeb(txt, match.index)) continue;
            cmdPairs.push({ index: match.index, delta, depth: 0 });
        }
    cmdPairs.sort((a, b) => a.index - b.index);

    // Check if the commands are properly coupled
    const STs: [number, number][] = [];
    const stack = [];
    let isMatched = -1;
    for (const pair of cmdPairs)
        if (pair.delta > 0)
            stack.push(pair);
        else {
            const top = stack.pop();
            if (top === undefined || top.delta + pair.delta !== 0) {
                isMatched = pair.index;
                break;
            } else
                STs.push([top.index, pair.index]);
        }

    if (isMatched !== -1 || stack.length !== 0) {
        console.warn("Unmatched \\begin{align} and \\end{align} commands");
        return [];
    }
    return STs;
}

// Web-compatible version of isInComment
function isInCommentWeb(txt: string, index: number): boolean {
    // Find the start of the line containing the index
    let lineStart = index;
    while (lineStart > 0 && txt[lineStart - 1] !== '\n')
        lineStart--;

    // Check if there's a % before the index on the same line
    for (let i = lineStart; i < index; i++)
        if (txt[i] === '%')
            return true;
    return false;
}

// Main lint function for web version
export function lintLatex(text: string, disabledRules: string[] = []): WebDiagnostic[] {
    const doc = createDocument(text);
    const txt = text;
    const alignLikeEnvs = enumAlignEnvsWeb(txt);

    // Note: Using type assertion to bridge mock types with real VS Code types for web compatibility
    const vscodeDoc = doc as unknown as import('vscode').TextDocument;
    const diagnostics: import('vscode').Diagnostic[] = [];

    const t0 = performance.now();

    // Rules that need align environments
    for (const [ruleName, rule] of Object.entries({
        LLAlignAnd,
        LLAlignEnd,
        LLAlignSingleLine,
    })) {
        if (disabledRules.includes(ruleName)) continue;
        try {
            const diags = rule(vscodeDoc, txt, alignLikeEnvs);
            diagnostics.push(...diags);
        } catch (error) {
            console.warn(`Rule ${ruleName} failed:`, error);
        }
    }

    // Rules that don't need align environments
    for (const [ruleName, rule] of Object.entries({
        LLArticle,
        LLBig,
        LLBracketCurly,
        LLBracketMissing,
        LLBracketRound,
        LLColonEqq,
        LLColonForMapping,
        LLCref,
        LLDoubleQuotes,
        LLENDash,
        LLEqnarray,
        LLFootnote,
        LLJapaneseSpace,
        LLLlGg,
        LLNonASCII,
        LLPeriod,
        LLRefEq,
        LLSharp,
        LLSI,
        LLSortedCites,
        LLT,
        LLThousands,
        LLTitle,
        LLURL,
        LLUserDefined,
    })) {
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