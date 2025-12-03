import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import type { LLText } from '../util/LLText';

export default function LLCref(doc: vscode.TextDocument, txt: LLText, exceptions: string[]): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLCref";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    const refRegex = /\\ref\{([^}]*)/g;
    for (const match of txt.text.matchAll(refRegex)) {
        const refContent = match[1];
        if (exceptions.some(exception => refContent.startsWith(exception))) continue;

        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(doc, code, message, ranges);
}
