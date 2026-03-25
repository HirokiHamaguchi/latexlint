import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLSpaceEnglish(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLSpaceEnglish";
    const ranges: vscode.Range[] = [];
    const text = txt.text;
    const targetRegex = /(?<=[a-zA-Z])(\$|\\\(|\\\))(?=[a-zA-Z])/gu;

    for (const match of text.matchAll(targetRegex)) {
        const token = match[0];
        const start = match.index ?? 0;
        if (!txt.isValid(start)) continue;

        // Exclude $x$s and $n$th
        const end = start + token.length;
        const afterTwoChars = text.slice(end, Math.min(end + 2, text.length)).toLowerCase();
        if (afterTwoChars.startsWith('s') && !/[a-zA-Z]/.test(afterTwoChars[1] ?? '')) continue;
        const afterThreeChars = text.slice(end, Math.min(end + 3, text.length)).toLowerCase();
        if (afterThreeChars.startsWith('th') && !/[a-zA-Z]/.test(afterThreeChars[2] ?? '')) continue;

        // Exclude $\backslash$n
        let i = start - 1;
        while (i >= 0 && /[a-zA-Z]/.test(text[i])) i--;
        if (i < start - 1 && text[i] === '\\') continue;

        ranges.push(new vscode.Range(doc.positionAt(start), doc.positionAt(end)));
    }

    return ranges2diagnostics(code, messages[code], ranges);
}
