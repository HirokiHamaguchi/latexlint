import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isLabelOrURL from '../util/isLabelOrURL';


export default function LLBracketRound(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const code = "LLBracketRound";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/(\\sqrt|\^|_)\(/g)) {
        if (match[0] === "\\sqrt(")
            message.push(messages[code].replace(/%1/g, "\\sqrt"));
        else {
            if (isLabelOrURL(txt, match)) continue;
            message.push(messages[code].replace(/%1/g, txt[match.index]));
        }
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(code, message, ranges);
}
