import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLAlignAnd(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLAlignAnd",
        /(=|\\neq|\\leq|\\geq|\\le|\\ge|<|>)\s*&/g
    );
}
