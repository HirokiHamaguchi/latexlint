import * as vscode from 'vscode';
import type { LLText } from '../util/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLNonstandardNotation(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    // Detect iff as a word (not as part of another word like "different" or after a backslash like "\iff")
    for (const match of txt.text.matchAll(/(?:^|\s)(?:iff|Iff)(?![A-Za-z])/g)) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }

    // Detect \therefore and \because (exact matches only)
    for (const match of txt.text.matchAll(/\\(?:therefore|because)(?![a-zA-Z])/g)) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }

    // Detect \fallingdotseq and \risingdotseq
    for (const match of txt.text.matchAll(/\\(?:fallingdotseq|risingdotseq)(?![a-zA-Z])/g)) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }

    // Detect {}_n C_k and {}_n \mathrm{C}_k (exact matches)
    for (const match of txt.text.matchAll(/\{\}_n (?:\\mathrm\{C\}|C)_k/g)) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }

    const code = "LLNonstandardNotation";
    const message = messages[code];
    return ranges2diagnostics(doc, code, message, ranges);
}
