import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLEqnarray(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt,
        "LLEqnarray",
        /\\begin\{eqnarray\*?\}/g,
    );
}
