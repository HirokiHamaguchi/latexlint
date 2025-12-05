import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLT(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    // In Markdown, `[^abc]` is a link to the anchor `abc`.
    return regex2diagnostics(
        doc, txt,
        "LLT",
        /(?<!\[)\^T/g,
    );
}
