import * as vscode from 'vscode';
import regex2diagnostics from '../util/regex2diagnostics';

export default function LLSI(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];
    return regex2diagnostics(
        doc, txt,
        "LLSI",
        /\d[^,\s]*\s*(kB|KB|MB|GB|TB|PB|EB|ZB|YB|KiB|MiB|GiB|TiB|PiB|EiB|ZiB|YiB)(?![a-zA-Z])/g
    );
}
