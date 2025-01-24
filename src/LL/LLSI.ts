import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLSI(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/\d\S* ?\S*(kB|KB|MB|GB|TB|PB|EB|ZB|YB|KiB|MiB|GiB|TiB|PiB|EiB|ZiB|YiB)(?![a-zA-Z])/g)) {
        let i = match.index + match[0].length - 2;
        if (txt[i] === 'i') i--;
        if (/[a-zA-Z\\]/.test(txt[i - 1])) continue;
        ranges.push(new vscode.Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
    }
    const code = "LLSI";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
