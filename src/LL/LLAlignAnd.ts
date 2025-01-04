import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLAlignAnd(doc: vscode.TextDocument): vscode.Diagnostic[] {
    return regex2ranges(
        doc,
        "LLAlignAnd",
        /=[\t ]*&/g
    );
}