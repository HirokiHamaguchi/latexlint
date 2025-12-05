import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';

function isCorrectBraces(str: string): boolean {
    let count = 0;
    for (const c of str) {
        if (c === '{') count++;
        else if (c === '}') count--;
        if (count < 0) return false;
    }
    return count === 0;
}

const REGEXPS = [
    /\\to(?![a-zA-Z])/g,
    /\\mapsto(?![a-zA-Z])/g,
    /\\rightarrow(?![a-zA-Z])/g
];

export default function LLColonForMapping(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const regexp of REGEXPS)
        for (const match of txt.text.matchAll(regexp)) {
            if (!txt.isValid(match.index)) continue;
            let i = match.index - 1;
            for (let wordCount = 0; wordCount < 10; wordCount++) {
                while (i >= 0 && /\s/.test(txt.text[i])) i--;
                if (i < 0) break;
                while (i >= 0 && txt.text[i] !== ':' && txt.text[i] !== '$' && /\S/.test(txt.text[i])) i--;
                if (i < 0) break;
                if (txt.text[i] === '$') break;
                if (txt.text[i] === ':') {
                    const strColon2Arrow = txt.text.slice(i + 1, match.index);
                    if (!strColon2Arrow.includes('\\(') &&
                        !strColon2Arrow.includes('\\[') &&
                        !strColon2Arrow.includes('\\begin{') &&
                        isCorrectBraces(strColon2Arrow)
                    ) {
                        const startPos = doc.positionAt(i);
                        const endPos = startPos.translate(0, 1);
                        ranges.push(new vscode.Range(startPos, endPos));
                    }
                    break;
                }
            }
        }

    const code = 'LLColonForMapping';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
