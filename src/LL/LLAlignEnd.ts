import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLAlignEnd(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc,
        "LLAlignEnd",
        /\\\\\s*\\end{(align\*?|alignat\*?|\gather\*?)}/g,
    );
}
