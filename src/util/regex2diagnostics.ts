import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';
import match2range from './match2range';

export default function regex2diagnostics(
    doc: vscode.TextDocument,
    txt: string,
    code: LLCode,
    pattern: RegExp
): vscode.Diagnostic[] {
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(pattern)) {
        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
