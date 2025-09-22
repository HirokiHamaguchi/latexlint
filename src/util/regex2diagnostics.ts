import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';
import match2range from './match2range';

export default function regex2diagnostics(
    doc: vscode.TextDocument,
    txt: string,
    code: LLCode,
    pattern: RegExp
): vscode.Diagnostic[] {
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(pattern)) {
        const range = match2range(doc, match);
        let mes = messages[code];

        /* eslint-disable */
        if (code === "LLBig") {
            mes = mes.replaceAll("%1", match[1]);
        } else if (code === "LLBracketCurly") {
            mes = mes.replaceAll("%1", match[1]);
        } else if (code === "LLColonEqq") {
            const correctCommandsColonEqq: { [key: string]: string } = {
                "::=": "\\Coloneqq",
                "=::": "\\Eqqcolon",
                ":=": "\\coloneqq",
                "=:": "\\eqqcolon"
            };
            mes = mes.replaceAll("%1", correctCommandsColonEqq[match[0]]).replaceAll("%2", match[0]);
        } else if (code === "LLLlGg") {
            const correctCommandsLlGg: { [key: string]: string } = {
                "<<": "\\ll",
                ">>": "\\gg",
            };
            mes = mes.replaceAll("%1", correctCommandsLlGg[match[0]]).replaceAll("%2", match[0]);
        } else if (code === "LLThousands") {
            mes = mes.replaceAll("%1", match[1]).replaceAll("%2", match[2]);
        } else if (code === "LLUserDefined") {
            mes = mes.replaceAll("%1", pattern.source);
        }
        /* eslint-enable */

        message.push(mes);
        ranges.push(range);
    }
    return ranges2diagnostics(doc, code, message, ranges);
}
