import * as vscode from 'vscode';
import { LLCode, messages } from './constants';
import ranges2diagnostics from './ranges2diagnostics';

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
    pattern: RegExp,
    callback?: (startPos: vscode.Position, endPos: vscode.Position) => boolean
): vscode.Diagnostic[] {
    let message: string[] = [];
    let ranges: vscode.Range[] = [];
    for (const match of txt.matchAll(pattern)) {
        const startPos = doc.positionAt(match.index);
        const endPos = startPos.translate(0, match[0].length);
        if (callback && callback(startPos, endPos)) continue;

        let mes = messages[code];
        if (code === "LLAlignAnd") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLBig") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLBracketCurly") mes = mes.replace(/%1/g, match[1]);
        else if (code === "LLColonEqq") mes = mes.replace(/%1/g, correctCommandsColonEqq[match[0]]).replace(/%2/g, match[0]);
        else if (code === "LLLlGg") mes = mes.replace(/%1/g, correctCommandsLlGg[match[0]]).replace(/%2/g, match[0]);
        else if (code === "LLUserDefined") mes = mes.replace(/%1/g, pattern.source);
        message.push(mes);

        ranges.push(new vscode.Range(startPos, endPos));
    }
    return ranges2diagnostics(code, message, ranges);
}
