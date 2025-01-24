import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import isInComment from '../util/isInComment';

export default function LLDoubleQuotes(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const callback = (startPos: vscode.Position, _endPos: vscode.Position): boolean => {
        return isInComment(doc.lineAt(startPos.line).text, startPos.character);
    };

    return regex2diagnostics(
        doc, txt,
        "LLDoubleQuotes",
        /(?<!\\)[“”"]/g,
        callback
    );
}