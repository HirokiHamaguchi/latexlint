import * as vscode from 'vscode';
import ranges2diagnostics from '../util/ranges2diagnostics';
import { messages } from '../util/constants';

export default function LLAlignEnd(doc: vscode.TextDocument, txt: string, alignLikeEnvs: [number, number][]): vscode.Diagnostic[] {
    const code = 'LLAlignEnd';
    const message = messages[code];
    const ranges = [];
    for (const [s, t] of alignLikeEnvs) {
        const txt2 = txt.slice(s, t);
        if (txt2.startsWith("\\begin{split")) continue;
        let i = txt2.length - 1;
        while (i >= 0 && (/\s/.test(txt2[i]))) i--;
        if (i >= 1 && txt2[i] === '\\' && txt2[i - 1] === '\\') {
            const startPos = doc.positionAt(s + i - 1);
            const endPos = startPos.translate(0, 2);
            ranges.push(new vscode.Range(startPos, endPos));
        }
    }
    return ranges2diagnostics(code, message, ranges);
}
