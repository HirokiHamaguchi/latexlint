import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLFootnote(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc, txt,
        "LLFootnote",
        /(\.)(\r?\n)+\\footnote/g,
    );
}

