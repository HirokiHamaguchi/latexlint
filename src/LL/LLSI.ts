import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLSI(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const ranges: vscode.Range[] = [];

    // // This code is slow.
    // for (const match of txt.matchAll(/\d\S* ?\S*(?:kB|KB|MB|GB|TB|PB|EB|ZB|YB|KiB|MiB|GiB|TiB|PiB|EiB|ZiB|YiB)(?![a-zA-Z])/g)) {
    //     let i = match.index + match[0].length - 2;
    //     if (txt[i] === 'i') i--;
    //     if (/[a-zA-Z\\]/.test(txt[i - 1])) continue;
    //     ranges.push(match2range(doc, match));
    // }

    // This code is faster.
    for (const match of txt.matchAll(/B(?![a-zA-Z])/g)) {
        let i = match.index;
        if (!/(?:k|K|M|G|T|P|E|Z|Y|Ki|Mi|Gi|Ti|Pi|Ei|Zi|Yi)$/.test(txt.slice(Math.max(0, i - 2), i))) continue;

        while (i > 0 && !/\d/.test(txt[i])) i--;
        while (i > 0 && /\d/.test(txt[i - 1])) i--;
        const j = match.index + 1;

        const match2 = txt.slice(i, j).match(/\d\S* ?\S*/);
        if (!match2 || match2[0].length !== j - i) continue;

        let i2 = txt[match.index - 1] === 'i' ? match.index - 2 : match.index - 1;
        if (/[a-zA-Z\\]/.test(txt[i2 - 1])) continue;

        const startPos = doc.positionAt(i);
        const endPos = doc.positionAt(j); // translate cannot be used here
        ranges.push(new vscode.Range(startPos, endPos));
    }

    const code = "LLSI";
    const message = messages[code];
    return ranges2diagnostics(doc, code, message, ranges);
}
