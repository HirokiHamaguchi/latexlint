import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLT(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLT",
        /\^T/g,
    );
}
