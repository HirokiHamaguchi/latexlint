import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import findLatexCommandMatches from '../util/findLatexCommandMatches';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLCref(doc: vscode.TextDocument, txt: LLText, exceptions: string[]): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLCref";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of findLatexCommandMatches(txt.text, /\\ref\{/g)) {
        if (txt.isPreamble(match.index)) continue;
        if (!txt.isValid(match.index)) continue;
        const refContent = match.content;
        if (exceptions.some(exception => refContent.startsWith(exception))) continue;
        message.push(messages[code]);
        ranges.push(new vscode.Range(
            doc.positionAt(match.index),
            doc.positionAt(match.fullEnd)
        ));
    }

    return ranges2diagnostics(code, message, ranges);
}
