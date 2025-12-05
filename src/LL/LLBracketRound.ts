import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import isLabelOrURL from '../LLText/isLabelOrURL';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLBracketRound(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLBracketRound";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/(?:\\sqrt|\^|_)\(/g)) {
        if (!txt.isValid(match.index)) continue;
        if (match[0] === "\\sqrt(")
            message.push(messages[code].replaceAll("%1", "\\sqrt"));
        else {
            if (isLabelOrURL(txt.text, match)) continue;
            message.push(messages[code].replaceAll("%1", txt.text[match.index]));
        }
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(code, message, ranges);
}
