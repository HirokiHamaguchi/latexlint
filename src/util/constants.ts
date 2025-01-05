export const extensionDisplayName = 'LaTeX Lint';

export type LLCode =
    'LLAlignAnd' |
    'LLColonEqq' |
    'LLColonForMapping' |
    'LLCref' |
    'LLDoubleQuotation' |
    'LLENDash' |
    'LLNonASCII' |
    'LLSI' |
    'LLT' |
    'LLTitle' |
    'LLUserDefined';

export const messages: Record<LLCode, string> = {
    LLAlignAnd: '=& might be better written as ={}& to avoid spacing issues if it is in an align environment.',
    LLColonEqq: 'You might better to use \\coloneqq, \\eqqcolon, \\Coloneqq and \\Eqqcolon.',
    LLColonForMapping: 'You might better to use \\colon instead of : for mapping.',
    LLCref: 'You might better to use \\cref instead of \\ref.',
    LLDoubleQuotation: 'If you meant to use a double quotation mark, use `` and \'\' instead of ".',
    LLENDash: 'This might be better to use an en-dash (--) instead of a hyphen (-).',
    LLNonASCII: 'Is this non-ASCII character intentional or a mistake?',
    LLSI: 'You might better to use \\si for units.',
    LLT: '^T might be better written as ^\\top or ^\\mathsf{T}.',
    LLTitle: 'This might violate the title capitalization rule, expected {EXPECTED}', // replace {EXPECTED}
    LLUserDefined: 'This violates your defined rule {RULE}', // replace {RULE}
};
