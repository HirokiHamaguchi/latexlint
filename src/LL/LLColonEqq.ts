import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import type { LLText } from '../util/LLText';

const correctCommandsColonEqq: { [key: string]: string } = {
    "::=": "\\Coloneqq",
    "=::": "\\Eqqcolon",
    ":=": "\\coloneqq",
    "=:": "\\eqqcolon"
};

export default function LLColonEqq(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = "LLColonEqq";
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.text.matchAll(/::=|=::|:=|=:/g)) {
        message.push(messages[code].replaceAll("%1", correctCommandsColonEqq[match[0]]).replaceAll("%2", match[0]));
        ranges.push(match2range(doc, match));
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
