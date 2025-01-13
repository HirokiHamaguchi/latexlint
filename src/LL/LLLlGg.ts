import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLLlGg(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLLlGg",
        /(?<!<)<{2}(?!<)|(?<!>)>{2}(?!>)|(?<!\|)\|{2}(?!\|)/g,
    );
}
