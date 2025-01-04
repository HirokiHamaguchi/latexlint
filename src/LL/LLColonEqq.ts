import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLColonEqq(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc,
        "LLColonEqq",
        /::=|=::|:=|=:/g,
    );
}
