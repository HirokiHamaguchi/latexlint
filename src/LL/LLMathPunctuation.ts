import * as vscode from 'vscode';

import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';


export default function LLMathPunctuation(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== 'latex') return [];

    const code = 'LLMathPunctuation';
    const message = messages[code];
    const ranges: vscode.Range[] = [];

    const pattern = new RegExp(
        String.raw`(?<!\\right)([.,])\s*\\end\{(?:align|alignat|equation|gather)\*?\}\s*([A-Za-z])`,
        'g'
    );

    for (const match of txt.text.matchAll(pattern)) {
        if (match.index === undefined) continue;
        if (!txt.isValid(match.index)) continue;

        const punctuation = match[1];
        const nextCharacter = match[2];
        const isUppercase = /[A-Z]/.test(nextCharacter);
        const isLowercase = /[a-z]/.test(nextCharacter);

        if (punctuation === ',' && !isUppercase) continue;
        if (punctuation === '.' && !isLowercase) continue;

        ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
    }

    return ranges2diagnostics(code, message, ranges);
}
