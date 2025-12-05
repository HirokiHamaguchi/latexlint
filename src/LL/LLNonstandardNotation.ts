import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLNonstandardNotation(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    const regexList = [
        // iff / Iff
        /(?:^|\s)(?:iff|Iff)(?![A-Za-z])/g,

        // \therefore / \because
        /\\(?:therefore|because)(?![a-zA-Z])/g,

        // \fallingdotseq / \risingdotseq
        /\\(?:fallingdotseq|risingdotseq)(?![a-zA-Z])/g,

        // {}_n C_k / {}_n \mathrm{C}_k
        /\{\}_n (?:\\mathrm\{C\}|C)_k/g
    ];

    for (const regex of regexList)
        for (const match of txt.text.matchAll(regex)) {
            if (!txt.isValid(match.index)) continue;
            const startPos = doc.positionAt(match.index);
            const endPos = doc.positionAt(match.index + match[0].length);
            ranges.push(new vscode.Range(startPos, endPos));
        }

    const code = "LLNonstandardNotation";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
