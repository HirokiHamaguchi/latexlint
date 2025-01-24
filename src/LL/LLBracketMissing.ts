import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLBracketMissing(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    // In Markdown, _ can be used for various purposes, unlike in LaTeX.
    // e.g. _italic_, ![test_image](test.png), [^test_link] etc.
    // We skip the check for markdown files, quite regretfully.
    // Can you think of a way to check even in markdown files?
    if (doc.languageId !== "latex") return [];

    const idxOfBegin = txt.indexOf("\\begin{document}");

    for (const match of txt.matchAll(/(?<![\\\[])[\^_][0-9A-Za-z]{2}/g)) {
        // Skip if the match is inside the document environment
        // ??? Can the commands with underscores be used inside the document environment ???
        if (idxOfBegin !== -1 && match.index < idxOfBegin) continue;

        // Find the word that contains the match
        let i = match.index, j = match.index + 3;
        while (i > 1 && !/\s/.test(txt[i - 1])) i--;
        while (j < txt.length - 1 && !/\s/.test(txt[j])) j++;
        const word = txt.slice(i, j);
        console.log(word);

        // Test if the word is a url
        if (word.includes("http")) continue;

        // Test if the word is a link to a png, pdf, gif, etc.
        if (/\.(png|pdf|jpg|jpeg|gif|bmp|eps|svg|tiff)/.test(word)) continue;

        ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + 3)));
    }
    const code = "LLBracketMissing";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
