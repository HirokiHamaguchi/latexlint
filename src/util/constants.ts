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
    LLAlignAnd: 'Use ={}& instead of =& to avoid spacing issues in align environments.',
    LLAlignEnd: '\\\\ at the enf of align-like environments might be unnecessary.',
    LLAlignSingleLine: 'For single-line equations, use the equation environment instead of align-like environments.',
    LLBig: 'Consider using \\big... versions for subscripts and superscripts.',
    LLBracketCurly: 'Did you mean "\\max(...)" or "\\min(...)"? Add a space if intentional.',
    LLBracketMissing: 'Did you mean "^{...}" or "_{...}"? For example, write "x^{23}" or "x^2 3" instead of "x^23".',
    LLBracketRound: 'Did you mean "^{...}", "_{...}" or "\\sqrt{...}"?',
    LLColonEqq: 'Consider using \\coloneqq, \\eqqcolon, \\Coloneqq, or \\Eqqcolon.',
    LLColonForMapping: 'If this colon (:) is for a mapping, consider using \\colon.',
    LLCref: 'Consider using \\cref instead of \\ref.',
    LLDoubleQuotes: 'For double quotes, use ``...\'\'.',
    LLENDash: 'If these are names, consider using en-dash (--)',
    LLEqnarray: 'Eqnarray is not recommended. Use align or gather instead.',
    LLNonASCII: 'This is a non-ASCII character. Is this intentional?',
    LLLlGg: 'Consider using \\ll and \\gg instead of << and >>.',
    LLRefEq: 'Consider using \\eqref instead of \\ref for equations.',
    LLSharp: 'If this sharp is for a number sign, consider using \\#.',
    LLSI: 'If this is a unit, consider using the siunitx package \\SI{number}{unit}.',
    LLT: 'Write ^\\top or ^\\mathsf{T} instead of ^T.',
    LLTitle: 'Should this be {EXPECTED}? Follow your preferred style guide.', // replace {EXPECTED}
    LLUserDefined: 'This violates your defined rule: {RULE}', // replace {RULE}
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