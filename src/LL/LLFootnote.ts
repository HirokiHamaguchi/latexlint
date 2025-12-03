import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import type { LLText } from '../util/LLText';

export default function LLFootnote(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc, txt.text,
        "LLFootnote",
        /(\.)(\r?\n)+\\footnote/g,
    );
}

