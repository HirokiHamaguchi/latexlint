import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isLabelOrURL from '../util/isLabelOrURL';
import type { LLText } from '../util/LLText';


export default function LLBracketRound(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLBracketRound";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/(?:\\sqrt|\^|_)\(/g)) {
        if (match[0] === "\\sqrt(")
            message.push(messages[code].replaceAll("%1", "\\sqrt"));
        else {
            if (isLabelOrURL(txt.text, match)) continue;
            message.push(messages[code].replaceAll("%1", txt.text[match.index]));
        }
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(doc, code, message, ranges);
}
