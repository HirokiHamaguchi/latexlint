import type * as Monaco from 'monaco-editor';

export const LATEX_LANGUAGE_ID = 'latex';

export const latexMonarchTokensProvider: Monaco.languages.IMonarchLanguage = {
    tokenizer: {
        root: [
            [/\\[a-zA-Z@]+/, 'keyword'],
            [/\\[^a-zA-Z@]/, 'keyword'],
            [/%.*$/, 'comment'],
            [/\$\$/, 'string', '@display_math'],
            [/\$/, 'string', '@inline_math'],
            [/\\begin\{[^}]+\}/, 'keyword'],
            [/\\end\{[^}]+\}/, 'keyword'],
            [/\{/, 'delimiter.curly'],
            [/\}/, 'delimiter.curly'],
            [/\[/, 'delimiter.square'],
            [/\]/, 'delimiter.square'],
        ],
        inline_math: [
            [/[^$\\]+/, 'string'],
            [/\$/, 'string', '@pop'],
            [/\\[a-zA-Z@]+/, 'keyword'],
            [/\\[^a-zA-Z@]/, 'keyword'],
        ],
        display_math: [
            [/[^$\\]+/, 'string'],
            [/\$\$/, 'string', '@pop'],
            [/\\[a-zA-Z@]+/, 'keyword'],
            [/\\[^a-zA-Z@]/, 'keyword'],
        ],
    },
};
