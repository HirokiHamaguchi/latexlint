import * as vscode from 'vscode';
import ranges2diagnostics from '../util/ranges2diagnostics';
import { messages } from '../util/constants';

export default function LLAlignSingleLine(doc: vscode.TextDocument, txt: string, alignLikeEnvs: [number, number][]): vscode.Diagnostic[] {
    const code = 'LLAlignSingleLine';
    const message = messages[code];
    const ranges = [];
    for (const [s, t] of alignLikeEnvs)
        if (!/\\\\/.test(txt.slice(s, t))) {
            const startPos = doc.positionAt(s);
            const endPos = doc.positionAt(t);
            ranges.push(new vscode.Range(startPos, endPos));
        }
    return ranges2diagnostics(code, message, ranges);
}
