import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

export default function LLPeriod(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const code = "LLPeriod";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/\b(?:i\.e\.|e\.g\.) /g)) {
        const pos = doc.positionAt(match.index);
        const line = doc.lineAt(pos.line);
        const idx = match.index - doc.offsetAt(line.range.start);
        if (isInComment(line.text, idx)) continue;

        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
