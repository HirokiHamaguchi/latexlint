import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

function getBracedArgument(text: string, openBraceIndex: number): string | undefined {
    let depth = 0;
    if (text[openBraceIndex] !== "{") return text[openBraceIndex];
    for (let i = openBraceIndex; i < text.length; i++)
        if (text[i] === "{")
            depth++;
        else if (text[i] === "}") {
            depth--;
            if (depth === 0) return text.slice(openBraceIndex + 1, i);
        }
    return undefined;
}

export default function LLBig(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLBig";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(/\\(cap|cup|odot|oplus|otimes|sqcup|uplus|vee|wedge)_/g)) {
        if (!txt.isValid(match.index)) continue;
        const subscript = getBracedArgument(txt.text, match.index + match[0].length);
        if (!subscript) continue;
        let ok: Boolean = false;
        if (/(,|:|=|<|>|\\(?:leq?|geq?|in|mid)\b)/.test(subscript)) ok = true;
        if (subscript.length === 1 && "ijklmn".includes(subscript)) ok = true;
        if (!ok) continue;
        message.push(messages[code].replaceAll("%1", match[1]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
