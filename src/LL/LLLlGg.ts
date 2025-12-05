import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

const correctCommandsLlGg: { [key: string]: string } = {
    "<<": "\\ll",
    ">>": "\\gg",
};

export default function LLLlGg(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLLlGg";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(/(?<!<)<<(?!<)|(?<!>)>>(?!>)/g)) {
        if (!txt.isValid(match.index)) continue;
        const i = match.index!;
        if (i > 0 && "{,".includes(txt.text[i - 1])) continue;
        if (i + 2 < txt.text.length && "},".includes(txt.text[i + 2])) continue;
        message.push(messages[code].replaceAll("%1", correctCommandsLlGg[match[0]]).replaceAll("%2", match[0]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(code, message, ranges);
}
