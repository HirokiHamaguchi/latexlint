import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLBig(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLBig",
        /\\(cap|cup|odot|oplus|otimes|sqcup|uplus|vee|wedge)_/g,
    );
}