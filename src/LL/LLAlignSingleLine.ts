import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLAlignSingleLine(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = 'LLAlignSingleLine';
    const message = messages[code];
    const ranges = [];
    for (const [s, t] of txt.alignLikeEnvs)
        if (!/\\\\/.test(txt.text.slice(s, t))) {
            const startPos = doc.positionAt(s);
            const endPos = doc.positionAt(t);
            ranges.push(new vscode.Range(startPos, endPos));
        }
    return ranges2diagnostics(code, message, ranges);
}
