import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLPeriod(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLPeriod";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/\b(?:i\.e\.|e\.g\.) /g)) {
        if (!txt.isValid(match.index)) continue;
        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
