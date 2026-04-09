import * as vscode from 'vscode';

import { LLText } from '../LLText/LLText';

export default function detectMathSpace(doc: vscode.TextDocument, txt: LLText): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    const text = txt.text;

    const REGEXES = [
        new RegExp(`\\$[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー]`, 'gu'), // $日
        new RegExp(`[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー]\\$`, 'gu'), // 日$
        new RegExp(`[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー]\\\\\\(`, 'gu'), // 日\(
        new RegExp(`\\\\\\)[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠ー]`, 'gu'), // \)日
    ];

    for (const regex of REGEXES) {
        const matches: RegExpMatchArray[] = [...text.matchAll(regex)];
        if (!matches) continue;
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index ?? 0;
            if (!txt.isValid(start)) continue;
            const startPos = doc.positionAt(start);
            const endPos = startPos.translate(0, matches[i][0].length);
            ranges.push(new vscode.Range(startPos, endPos));
        }
    }

    return ranges;
}
