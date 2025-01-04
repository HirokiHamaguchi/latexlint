import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLENDash(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2ranges(
        doc,
        "LLENDash",
        /(?!(Fritz-John))[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+/g
    );
}