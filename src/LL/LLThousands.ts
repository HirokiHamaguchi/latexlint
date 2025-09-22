import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';

export default function LLThousands(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    if (txt.includes('\n\\usepackage{icomma}')) return [];
    const code = "LLThousands";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(/(\d{1,3}),(\d{3})(?=\$|\\\))/g)) {
        message.push(messages[code].replaceAll("%1", match[1]).replaceAll("%2", match[2]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}