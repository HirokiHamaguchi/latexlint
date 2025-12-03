import * as vscode from 'vscode';
import { messages } from '../util/constants';
import isLabelOrURL from '../util/isLabelOrURL';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';
import { wordSet } from '../util/wordSet';
import type { LLText } from '../util/LLText';

const okWords = [
    'Fritz-John',
    'Primal-Dual',
];

export default function LLENDash(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/[A-Z][a-zA-Z]*[a-z](?:-[A-Z][a-zA-Z]*[a-z])+/g)) {
        if (okWords.includes(match[0])) continue;
        const words = match[0].split('-');
        if (words.every(word => wordSet.has(word.toLowerCase()))) continue;
        if (isLabelOrURL(txt.text, match)) continue;
        ranges.push(match2range(doc, match));
    }

    const code = "LLENDash";
    const message = messages[code];
    return ranges2diagnostics(doc, code, message, ranges);
}
