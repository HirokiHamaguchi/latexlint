import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLThousands(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    if (txt.text.includes('\n\\usepackage{icomma}')) return [];
    const code = "LLThousands";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(/(\d{1,3}),(\d{3})(?=\$|\\\))/g)) {
        message.push(messages[code].replaceAll("%1", match[1]).replaceAll("%2", match[2]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}