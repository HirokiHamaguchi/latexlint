import * as vscode from 'vscode';

import { LLText } from '../LLText/LLText';

export default function detectMathSpace(doc: vscode.TextDocument, txt: LLText, locale: 'ja' | 'en'): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    const text = txt.text;

    const pushRange = (startIndex: number, endIndex: number) => {
        if (!txt.isValid(startIndex)) return;
        ranges.push(new vscode.Range(doc.positionAt(startIndex), doc.positionAt(endIndex)));
    };

    let matches: RegExpMatchArray[] = [];
    const SPACE_REGEX = locale === 'ja'
        ? /(?:[\$(?:\\\))][ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー])|(?:[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー][\$(?:\\\()])/gu
        : /(?:\\\)[a-zA-Z])|(?:[a-zA-Z]\\\()/gu;
    console.assert(SPACE_REGEX.flags.includes('g'), 'SPACE_REGEX should have the global flag set.');
    const re = new RegExp(SPACE_REGEX.source, SPACE_REGEX.flags);
    matches = [...text.matchAll(re)];

    if (matches.length === 0) {
        console.log('No math spacing issues detected.');
        return ranges;
    }

    for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        const matchText = m[0];
        const start = m.index ?? 0;
        const end = start + matchText.length;

        let isTarget = false;
        if (matchText.startsWith('$'))
            isTarget = true;
        else if (matchText.endsWith('$'))
            isTarget = true;
        else if (matchText.endsWith('\\('))
            if (text[end] === "{" && text[end + 1] === "}") isTarget = false;
            else if ("^_,.-".includes(text[end])) isTarget = false;
            else isTarget = true;
        else if (matchText.startsWith('\\)')) {
            console.assert(text[start] === '\\', 'Expected match to start with \\');
            let i = start - 2;
            while (i >= 0 && !(text.substring(i, i + 2) === '\\('))
                i--;
            // ignore cases like H\({}_2\)O
            // When content starts with {}_^, we do not consider it as a spacing issue.
            const content = text.substring(i + 2, i + 5) || "";
            if (content === "{}_" || content === "{}^") isTarget = false;
            else if (start > 0 && "^_,.-".includes(text[start - 1])) isTarget = false;
            else isTarget = true;
        }

        if (isTarget) pushRange(start, end);
    }

    return ranges;
}
