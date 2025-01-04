import * as vscode from 'vscode';
import regex2ranges from '../util/regex2ranges';

export default function LLSI(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2ranges(
        doc,
        "LLSI",
        /(?<![a-zA-Z\\])(kB|KB|MB|GB|TB|PB|EB|ZB|YB|KiB|MiB|GiB|TiB|PiB|EiB|ZiB|YiB)(?![a-zA-Z])/g
    );
}