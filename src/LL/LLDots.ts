import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

const PATTERNS = [
    /\W[ \t]*\.[ \t]*\.[ \t]*\.[ \t]*\W/g,
    /[0-9]\.?[0-9]\.[ \t]*\.[ \t]*\./g,
];
const DOTS_PATTERN = /\.[ \t]*\.[ \t]*\./;

export default function LLDots(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const pattern of PATTERNS)
        for (const match of txt.text.matchAll(pattern)) {
            if (!txt.isValid(match.index)) continue;
            const dots = DOTS_PATTERN.exec(match[0]);
            console.assert(dots !== null);

            const dotsIndex = dots!.index;
            const startPos = doc.positionAt(match.index + dotsIndex);
            const endPos = doc.positionAt(match.index + dotsIndex + dots![0].length);
            const range = new vscode.Range(startPos, endPos);
            ranges.push(range);
        }

    const code = 'LLDots';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
