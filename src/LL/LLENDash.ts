import * as vscode from 'vscode';
import isLabelOrURL from '../LLText/isLabelOrURL';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';
import { wordSet } from '../util/wordSet';

const okWords = [
    'Fritz-John',
    'Primal-Dual',
    'Zig-Zag',
];

export default function LLENDash(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/[A-Z][a-zA-Z]*[a-z](?:-[A-Z][a-zA-Z]*[a-z])+/g)) {
        if (okWords.includes(match[0])) continue;
        const words = match[0].split('-');
        if (words.every(word => wordSet.has(word.toLowerCase()))) continue;
        if (words.some(word => word.length === 1)) continue;
        if (isLabelOrURL(txt.text, match)) continue;
        ranges.push(match2range(doc, match));
    }

    const code = "LLENDash";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
