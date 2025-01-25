import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';

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
    /\\to(?![a-zA-Z])/,
    /\\mapsto(?![a-zA-Z])/,
    /\\rightarrow(?![a-zA-Z])/
];

export default function LLColonForMapping(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/:/g)) {
        let i = match.index + 1;
        let currentWord = '';
        let wordCount = 0;
        while (i < txt.length && wordCount < 10)
            if (!/\s/.test(txt[i]))
                currentWord += txt[i++];
            else {
                if (currentWord) {
                    wordCount++;
                    if (REGEXPS.some(regexp => {
                        const arrowIdx = currentWord.search(regexp);
                        if (arrowIdx === -1) return false;
                        const strFromColon2Arrow = txt.slice(match.index + 1, i - currentWord.length + arrowIdx);
                        if (!strFromColon2Arrow.includes('$') &&
                            !strFromColon2Arrow.includes('\\(') &&
                            !strFromColon2Arrow.includes('\\begin{') &&
                            isCorrectBraces(strFromColon2Arrow)
                        )
                            ranges.push(match2range(doc, match));
                        return true;
                    })) break;
                    currentWord = '';
                }
                while (i < txt.length && /\s/.test(txt[i])) i++;
            }
    }

    const code = 'LLColonForMapping';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
