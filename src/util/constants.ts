import * as vscode from 'vscode';

export const extensionDisplayName = 'LaTeX Lint';

export type LLCode =
    'LLAlignAnd' |
    'LLAlignSingleLine' |
    'LLColonEqq' |
    'LLColonForMapping' |
    'LLCref' |
    'LLDoubleQuotation' |
    'LLENDash' |
    'LLEqnarray' |
    'LLNonASCII' |
    'LLLlGg' |
    'LLRefEq' |
    'LLSharp' |
    'LLSI' |
    'LLT' |
    'LLTitle' |
    'LLUserDefined';

export const messages: Record<LLCode, string> = {
    LLAlignAnd: '=& might be better written as ={}& to avoid spacing issues if it is in an align environment.',
    LLAlignSingleLine: 'Use equation environment instead of align for single-line equation.',
    LLColonEqq: 'You might better to use \\coloneqq, \\eqqcolon, \\Coloneqq and \\Eqqcolon.',
    LLColonForMapping: 'You might better to use \\colon instead of : for mapping.',
    LLCref: 'You might better to use \\cref instead of \\ref.',
    LLDoubleQuotation: 'If you meant to use a double quotation mark, use `` and \'\' instead of ".',
    LLENDash: 'This might be en-dash (--) instead of a hyphen (-), if this is names of people.',
    LLEqnarray: 'You might better to use align environment instead of eqnarray.',
    LLNonASCII: 'Is this non-ASCII character intentional or a mistake?',
    LLLlGg: 'You might better to use \\ll and \\gg instead of << and >>.',
    LLRefEq: 'You might better to use \\eqref instead of \\ref.',
    LLSharp: 'You might better to use \\# instead of \\sharp.',
    LLSI: 'You might better to use \\SI for units.',
    LLT: '^T might be better written as ^\\top or ^\\mathsf{T}.',
    LLTitle: 'Maybe this should be {EXPECTED}, but follow the style guide you prefer.', // replace {EXPECTED}
    LLUserDefined: 'This violates your defined rule {RULE}', // replace {RULE}
};

const INFO = vscode.DiagnosticSeverity.Information;
const WARN = vscode.DiagnosticSeverity.Warning;
export const severity: Record<LLCode, vscode.DiagnosticSeverity> = {
    LLAlignAnd: WARN,
    LLAlignSingleLine: WARN,
    LLColonEqq: WARN,
    LLColonForMapping: WARN,
    LLCref: WARN,
    LLDoubleQuotation: WARN,
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