import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLENDash(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLENDash",
        /(?!(Fritz-John))[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+/g
    );
}
