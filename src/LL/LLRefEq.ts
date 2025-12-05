import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLRefEq(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc, txt,
        "LLRefEq",
        /\\ref\{eq:/g,
    );
}
