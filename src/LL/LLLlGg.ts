import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';

const correctCommandsLlGg: { [key: string]: string } = {
    "<<": "\\ll",
    ">>": "\\gg",
};

export default function LLLlGg(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const code = "LLLlGg";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(/(?<!<)<<(?!<)|(?<!>)>>(?!>)/g)) {
        message.push(messages[code].replaceAll("%1", correctCommandsLlGg[match[0]]).replaceAll("%2", match[0]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
