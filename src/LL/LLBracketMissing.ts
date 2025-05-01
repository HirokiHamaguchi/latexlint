import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import isLabelOrURL from '../util/isLabelOrURL';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

export default function LLBracketMissing(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    // In Markdown, _ can be used for various purposes, unlike in LaTeX.
    // e.g. _italic_, ![test_image](test.png), [^test_link] etc.
    // We skip the check for markdown files, quite regretfully.
    // Can you think of a way to check even in markdown files?
    if (doc.languageId !== "latex") return [];

    const code = "LLBracketMissing";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    const idxOfBegin = txt.indexOf("\\begin{document}");
    for (const match of txt.matchAll(/(?<![\\\[])[\^_](?:[0-9]{2}|[a-zA-Z]{2})/g)) {
        // Skip if the match is inside the document environment
        // ??? Can the commands with underscores be used inside the document environment ???
        if (idxOfBegin !== -1 && match.index < idxOfBegin) continue;

        if (isLabelOrURL(txt, match)) continue;

        const pos = doc.positionAt(match.index);
        const line = doc.lineAt(pos.line);
        const idx = match.index - doc.offsetAt(line.range.start);
        if (isInComment(line.text, idx)) continue;

        message.push(messages[code].replaceAll("%1", match[0][0]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
