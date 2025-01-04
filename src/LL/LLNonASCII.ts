import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLNonASCII(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLNonASCII",
        /[\u3000\uFF01-\uFF5E]/g
    );
}
