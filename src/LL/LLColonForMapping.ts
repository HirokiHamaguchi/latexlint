import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

function testCurrentWord(
    doc: vscode.TextDocument, idx: number, currentWord: string, ranges: vscode.Range[]
): boolean {
    if (['\\\\to', '\\\\mapsto', '\\\\rightarrow'].some(
        // Equivalent to /\\to(...)/
        substring => RegExp(`${substring}(?![a-zA-Z])`).test(currentWord))
    ) {
        const startPos = doc.positionAt(idx);
        const endPos = startPos.translate(0, 1);
        ranges.push(new vscode.Range(startPos, endPos));
        return true;
    }
    return false;
}

export default function LLColonForMapping(doc: vscode.TextDocument): vscode.Diagnostic[] {
    const text = doc.getText();
    const ranges: vscode.Range[] = [];

    const regex = /:/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        let i = match.index + 1;
        let currentWord = '';
        let wordCount = 0;
        while (i < text.length && wordCount < 10) {
            const char = text[i];
            if (/\s/.test(char)) {
                if (currentWord) {
                    wordCount++;
                    if (testCurrentWord(doc, match.index, currentWord, ranges)) break;
                    currentWord = '';
                }
                while (i < text.length && /\s/.test(text[i])) i++;
            } else {
                if (char === '$') {
                    testCurrentWord(doc, match.index, currentWord, ranges);
                    break;
                }
                currentWord += char;
                i++;
            }
        }
    }

    const code = 'LLColonForMapping';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
