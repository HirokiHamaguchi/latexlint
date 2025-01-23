import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLT(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    // In Markdown, `[^abc]` is a link to the anchor `abc`.
    return regex2diagnostics(
        doc, txt,
        "LLT",
        /(?<!\[)\^T/g,
    );
}
