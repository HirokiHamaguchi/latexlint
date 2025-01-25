import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';
import match2range from './match2range';

const correctCommandsColonEqq: { [key: string]: string } = {
    "::=": "\\Coloneqq",
    "=::": "\\Eqqcolon",
    ":=": "\\coloneqq",
    "=:": "\\eqqcolon"
};

const correctCommandsLlGg: { [key: string]: string } = {
    "<<": "\\ll",
    ">>": "\\gg",
};

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
        if (code === "LLAlignAnd") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLBig") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLBracketCurly") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLColonEqq") mes = mes.replace(/%1/g, correctCommandsColonEqq[match[0]]).replace(/%2/g, match[0]);
        else if (code === "LLLlGg") mes = mes.replace(/%1/g, correctCommandsLlGg[match[0]]).replace(/%2/g, match[0]);
        else if (code === "LLUserDefined") mes = mes.replace(/%1/g, pattern.source);
        message.push(mes);
        ranges.push(range);
    }
    return ranges2diagnostics(code, message, ranges);
}
