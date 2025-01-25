import * as vscode from 'vscode';

export const extensionDisplayName = 'LaTeX Lint';

export const LLCodeStrings = [
    'LLAlignAnd',
    'LLAlignEnd',
    'LLAlignSingleLine',
    'LLBig',
    `LLBracketCurly`,
    `LLBracketMissing`,
    `LLBracketRound`,
    'LLColonEqq',
    'LLColonForMapping',
    'LLCref',
    'LLDoubleQuotes',
    'LLENDash',
    'LLEqnarray',
    'LLNonASCII',
    'LLLlGg',
    'LLRefEq',
    'LLSharp',
    'LLSI',
    'LLT',
    'LLTitle',
    'LLUserDefined',
];

export type LLCode = typeof LLCodeStrings[number];

export const messages: Record<LLCode, string> = {
    LLAlignAnd: 'Use %1{}& instead of %1& to avoid spacing issues in align environments.',
    LLAlignEnd: '\\\\ at the enf of align-like environments might be unnecessary.',
    LLAlignSingleLine: 'For single-line equations, use the equation environment instead of align-like environments.',
    LLBig: 'Consider using \\big%1 for subscripts and superscripts.',
    LLBracketCurly: 'Did you mean "%1(...)" instead of "%1{...}"? Add a space if intentional.',
    LLBracketMissing: 'Did you mean "%1{...}"? For example, write "x%1{23}" or "x%12 3" instead of "x%123".',
    LLBracketRound: 'Did you mean "%1{...}" instead of "%1(...)"?',
    LLColonEqq: 'Consider using %1 instead of %2.',
    LLColonForMapping: 'If this : is for a mapping, consider using \\colon.',
    LLCref: 'Consider using \\cref instead of \\ref.',
    LLDoubleQuotes: 'For double quotes, use ``...\'\'.',
    LLENDash: 'If these are names, consider using en-dash (--). Otherwise, register as an exception or add a space around "-".',
    LLEqnarray: 'Eqnarray is not recommended. Use align or gather instead.',
    LLNonASCII: 'This is a non-ASCII character. Is this intentional?',
    LLLlGg: 'Consider using %1 instead of %2.',
    LLRefEq: 'Consider using \\eqref instead of \\ref for equations.',
    LLSharp: 'If this sharp is for a number sign, consider using \\#.',
    LLSI: 'If this is a unit, consider using the siunitx(\\SI{number}{unit}). Otherwise, register as an exception.',
    LLT: 'Write ^\\top or ^\\mathsf{T} instead of ^T. If this is a power of T, write as ^{T}.',
    LLTitle: 'Should this be "%1"? Follow your preferred style guide and register as an exception if necessary.',
    LLUserDefined: 'This violates your defined rule: %1',
};

const INFO = vscode.DiagnosticSeverity.Information;
const WARN = vscode.DiagnosticSeverity.Warning;
export const severity: Record<LLCode, vscode.DiagnosticSeverity> = {
    LLAlignAnd: WARN,
    LLAlignEnd: WARN,
    LLAlignSingleLine: WARN,
    LLBig: WARN,
    LLBracketCurly: WARN,
    LLBracketMissing: WARN,
    LLBracketRound: WARN,
    LLColonEqq: WARN,
    LLColonForMapping: WARN,
    LLCref: WARN,
    LLDoubleQuotes: WARN,
    LLENDash: WARN,
    LLEqnarray: WARN,
    LLNonASCII: INFO,
    LLLlGg: WARN,
    LLRefEq: WARN,
    LLSharp: WARN,
    LLSI: WARN,
    LLT: WARN,
    LLTitle: INFO,
    LLUserDefined: WARN,
};