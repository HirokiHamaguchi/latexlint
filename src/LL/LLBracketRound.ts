import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';


export default function LLBracketRound(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/(\\sqrt|\^|_)\(/g)) {
        if (match[0][0] === "\\") {
            ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + 1)));
            continue;
        }

        let i = match.index, j = match.index + 1;
        while (i > 1 && !/\s/.test(txt[i - 1])) i--;
        while (j < txt.length - 1 && !/\s/.test(txt[j])) j++;
        const word = txt.slice(i, j);

        // Test if the word is a link to a png, pdf, gif, etc.
        if (/\.(png|pdf|jpg|jpeg|gif|bmp|eps|svg|tiff)/.test(word)) continue;

        ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + 1)));
    }
    const code = "LLBracketRound";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
