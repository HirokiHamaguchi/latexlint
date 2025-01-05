import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLEqnarray(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLEqnarray",
        /\\begin\{eqnarray\}/g,
    );
}
