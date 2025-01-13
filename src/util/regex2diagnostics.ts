import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';

export default function regex2diagnostics(doc: vscode.TextDocument, txt: string, code: LLCode, pattern: RegExp): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(pattern)) {
        const startPos = doc.positionAt(match.index);
        const endPos = startPos.translate(0, match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }
    let message = messages[code];
    if (code === 'LLUserDefined') message = message.replace('{RULE}', pattern.source);
    return ranges2diagnostics(code, message, ranges);
}
