import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLColonEqq(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2ranges(
        doc,
        "LLColonEqq",
        /::=|=::|:=|=:/g,
    );
}