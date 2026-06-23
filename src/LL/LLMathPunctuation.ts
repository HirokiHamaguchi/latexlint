import * as vscode from 'vscode';

import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

const MATH_PUNCTUATION_PATTERN = /(?<!\\right)([.,])\s*\\end\{(?:align|alignat|equation|gather)\*?\}\s*([A-Za-z])/g;

// Python3
// >>> [chr(i) for i in [65,90,97,122]]
// ['A', 'Z', 'a', 'z']

const isUppercaseAscii = (char: string): boolean => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90;
};

const isLowercaseAscii = (char: string): boolean => {
    const code = char.charCodeAt(0);
    return code >= 97 && code <= 122;
};

export default function LLMathPunctuation(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== 'latex') return [];

    const code = 'LLMathPunctuation';
    const message = messages[code];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(MATH_PUNCTUATION_PATTERN)) {
        if (match.index === undefined) continue;
        if (!txt.isValid(match.index)) continue;

        const punctuation = match[1];
        const nextCharacter = match[2];

        if (punctuation === ',' && !isUppercaseAscii(nextCharacter)) continue;
        if (punctuation === '.' && !isLowercaseAscii(nextCharacter)) continue;

        ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
    }

    return ranges2diagnostics(code, message, ranges);
}
