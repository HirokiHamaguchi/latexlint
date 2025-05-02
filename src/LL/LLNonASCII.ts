import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLNonASCII(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLNonASCII",
        /[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]/g
    );
}
