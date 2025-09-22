import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';

export default function LLBig(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const code = "LLBig";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(/\\(cap|cup|odot|oplus|otimes|sqcup|uplus|vee|wedge)_/g)) {
        message.push(messages[code].replaceAll("%1", match[1]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}