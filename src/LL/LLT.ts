import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import type { LLText } from '../util/LLText';

export default function LLT(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    // In Markdown, `[^abc]` is a link to the anchor `abc`.
    return regex2diagnostics(
        doc, txt.text,
        "LLT",
        /(?<!\[)\^T/g,
    );
}
