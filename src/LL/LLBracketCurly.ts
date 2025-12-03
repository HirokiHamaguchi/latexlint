import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import type { LLText } from '../util/LLText';

export default function LLBracketCurly(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLBracketCurly";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(/\\(min|max)\{/g)) {
        message.push(messages[code].replaceAll("%1", match[1]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
