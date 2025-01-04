import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLNonASCII(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2ranges(
        doc,
        "LLNonASCII",
        /[\u3000\uFF01-\uFF5E]/g
    );
}