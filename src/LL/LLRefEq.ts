import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLRefEq(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc,
        "LLRefEq",
        /\\ref\{eq:/g,
    );
}
