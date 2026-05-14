import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { LLCode, messages } from './constants';
import match2range from './match2range';
import ranges2diagnostics from './ranges2diagnostics';

export default function regex2diagnostics(
    doc: vscode.TextDocument,
    txt: LLText,
    code: LLCode,
    pattern: RegExp
): vscode.Diagnostic[] {
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(pattern)) {
        if (!txt.isValid(match.index)) continue;
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, messages[code], ranges);
}
