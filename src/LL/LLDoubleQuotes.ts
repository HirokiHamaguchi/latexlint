import * as vscode from 'vscode';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import { messages } from '../util/constants';
import isInComment from '../util/isInComment';

export default function LLDoubleQuotes(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLDoubleQuotes";
    const ranges: vscode.Range[] = [];

    let isVerb = false;
    for (const match of txt.matchAll(/[“”"]/g)) {
        if (isVerb) {
            isVerb = false;
            continue;
        }
        if (txt.slice(Math.max(0, match.index - 5), match.index) === "\\verb") {
            isVerb = true;
            continue;
        }
        // H\"older
        if (txt.slice(Math.max(0, match.index - 1), match.index) === "\\") continue;
        const range = match2range(doc, match);
        if (isInComment(doc.lineAt(range.start.line).text, range.start.character)) continue;
        ranges.push(range);
    }

    return ranges2diagnostics(doc, code, messages[code], ranges);

}