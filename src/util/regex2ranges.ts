import * as vscode from 'vscode';
import { LLCode } from './constants';
import ranges2diagnostics from './ranges2diagnostics';

export default function regex2ranges(doc: vscode.TextDocument, code: LLCode, pattern: RegExp): vscode.Diagnostic[] {
    const text = doc.getText();
    const ranges: vscode.Range[] = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const startPos = doc.positionAt(match.index);
        const endPos = doc.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        ranges.push(range);
    }
    return ranges2diagnostics(code, ranges);
}