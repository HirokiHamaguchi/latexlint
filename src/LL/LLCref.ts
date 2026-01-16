import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLCref(doc: vscode.TextDocument, txt: LLText, exceptions: string[]): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLCref";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/\\ref\{([^}]*)/g)) {
        if (txt.isPreamble(match.index)) continue;
        if (!txt.isValid(match.index)) continue;
        const refContent = match[1];
        if (exceptions.some(exception => refContent.startsWith(exception))) continue;
        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(code, message, ranges);
}
