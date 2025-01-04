import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLT(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2ranges(
        doc,
        "LLT",
        /\^T/g,
    );
}