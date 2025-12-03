import * as vscode from 'vscode';
import type { LLText } from '../util/LLText';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLNonASCII(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    return regex2diagnostics(
        doc, txt.text,
        "LLNonASCII",
        /[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]/g
    );
}
