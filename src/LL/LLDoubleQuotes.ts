import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLDoubleQuotes(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLDoubleQuotes";
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/(?<!\\)[“”"]/g)) {
        if (!txt.isValid(match.index)) continue;
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(code, messages[code], ranges);

}
