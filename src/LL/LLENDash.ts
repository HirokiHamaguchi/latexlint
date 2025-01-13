import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLENDash(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLENDash",
        /(?!(Fritz-John))[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+/g
    );
}
