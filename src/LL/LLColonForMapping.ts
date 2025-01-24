import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

const REGEXPS = [
    /\\to(?![a-zA-Z])/,
    /\\mapsto(?![a-zA-Z])/,
    /\\rightarrow(?![a-zA-Z])/
];

function testCurrentWord(
    doc: vscode.TextDocument, idx: number, currentWord: string, ranges: vscode.Range[]
): boolean {
    if (REGEXPS.some(regexp => regexp.test(currentWord))) {
        const startPos = doc.positionAt(idx);
        const endPos = startPos.translate(0, 1);
        ranges.push(new vscode.Range(startPos, endPos));
        return true;
    }
    return false;
}

export default function LLColonForMapping(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/:/g)) {
        let i = match.index + 1;
        let currentWord = '';
        let wordCount = 0;
        while (i < txt.length && wordCount < 10) {
            const char = txt[i];
            if (/\s/.test(char)) {
                if (currentWord) {
                    wordCount++;
                    if (currentWord.includes('$') || currentWord.includes('\\(') || currentWord.includes('\\begin{')) break;
                    if (testCurrentWord(doc, match.index, currentWord, ranges)) break;
                    currentWord = '';
                }
                while (i < txt.length && /\s/.test(txt[i])) i++;
            } else {
                currentWord += char;
                i++;
            }
        }
    }

    const code = 'LLColonForMapping';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
