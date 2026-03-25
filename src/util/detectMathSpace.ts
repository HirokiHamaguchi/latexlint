import * as vscode from 'vscode';

import { LLText } from '../LLText/LLText';

export default function detectMathSpace(doc: vscode.TextDocument, txt: LLText): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    const text = txt.text;

    const SPACE_REGEX = /(?:[\$(?:\\\))][ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー])|(?:[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー][\$(?:\\\()])/gu;
    const re = new RegExp(SPACE_REGEX.source, SPACE_REGEX.flags);
    const matches: RegExpMatchArray[] = [...text.matchAll(re)];

    for (let i = matches.length - 1; i >= 0; i--) {
        const start = matches[i].index ?? 0;
        if (!txt.isValid(start)) continue;
        ranges.push(new vscode.Range(doc.positionAt(start), doc.positionAt(start + 1)));
    }

    return ranges;
}
