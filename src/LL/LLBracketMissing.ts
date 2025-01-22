import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLBracketMissing(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLBracketMissing",
        /[\^_][0-9A-Za-z]{2}/g
    );
}
