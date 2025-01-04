import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLSI(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLDoubleQuotation",
        /[“”"]/g
    );
}
