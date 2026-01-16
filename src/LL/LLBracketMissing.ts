import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import isLabelOrURL from '../LLText/isLabelOrURL';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLBracketMissing(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    // In Markdown, _ can be used for various purposes, unlike in LaTeX.
    // e.g. _italic_, ![test_image](test.png), [^test_link] etc.
    // We skip the check for markdown files, quite regretfully.
    // Can you think of a way to check even in markdown files?
    if (doc.languageId !== "latex") return [];

    const code = "LLBracketMissing";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(/(?<![\\\[])[\^_](?:[0-9]{2}|[a-zA-Z]{2}|[+\-][0-9])/g)) {
        // Skip if the match is not in the document environment
        // ??? Can the commands with underscores be used inside the document environment ???
        if (txt.isPreamble(match.index)) continue;
        if (isLabelOrURL(txt.text, match)) continue;
        if (!txt.isValid(match.index)) continue;
        message.push(messages[code].replaceAll("%1", match[0][0]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
