import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';
import type { LLText } from '../util/LLText';

export default function LLEqnarray(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt.text,
        "LLEqnarray",
        /\\begin\{eqnarray\*?\}/g,
    );
}
