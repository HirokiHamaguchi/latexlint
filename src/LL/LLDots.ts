import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

const PATTERNS = [
    /\W[ \t]*\.[ \t]*\.[ \t]*\.[ \t]*\W/g,
    /[0-9]\.?[0-9]\.[ \t]*\.[ \t]*\./g,
];

export default function LLDots(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const pattern of PATTERNS)
        for (const match of txt.text.matchAll(pattern)) {
            if (!txt.isValid(match.index)) continue;
            const dotsIndex = match[0].search(/\.[ \t]*\.[ \t]*\./);
            const dots = match[0].slice(dotsIndex).match(/^\.[ \t]*\.[ \t]*\./);
            console.assert(dotsIndex >= 0 && dots !== null);

            const startPos = doc.positionAt(match.index + dotsIndex);
            const endPos = doc.positionAt(match.index + dotsIndex + dots![0].length);
            const range = new vscode.Range(startPos, endPos);
            ranges.push(range);
        }

    const code = 'LLDots';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
