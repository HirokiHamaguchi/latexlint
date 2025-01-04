import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';

export default function regex2diagnostics(doc: vscode.TextDocument, code: LLCode, pattern: RegExp): vscode.Diagnostic[] {
    const text = doc.getText();
    const ranges: vscode.Range[] = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        ranges.push(range);
    }
    const message = messages[code];
    if (code === 'LLUserDefined') message.replace('{RULE}', pattern.source);
    return ranges2diagnostics(code, message, ranges);
}
