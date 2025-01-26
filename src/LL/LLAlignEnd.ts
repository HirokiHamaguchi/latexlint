import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLAlignEnd(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLAlignEnd",
        /\\\\\s*\\end{(?:align\*?|alignat\*?|\gather\*?)}/g,
    );
}
