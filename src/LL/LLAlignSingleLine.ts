import * as vscode from 'vscode';
import isInComment from '../util/isInComment';
import ranges2diagnostics from '../util/ranges2diagnostics';
import { messages } from '../util/constants';

export default function LLAlignSingleLine(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    // Extract all \begin{align} and \end{align} commands
    let cmdPairs = [];
    for (const { regex, delta } of [
        { regex: /\\begin\{alignat\*\}/g, delta: +1e5 },
        { regex: /\\begin\{alignat\}/g, delta: +1e4 },
        { regex: /\\begin\{gather\*\}/g, delta: +1e3 },
        { regex: /\\begin\{gather\}/g, delta: +1e2 },
        { regex: /\\begin\{align\*\}/g, delta: +1e1 },
        { regex: /\\begin\{align\}/g, delta: +1e0 },
        { regex: /\\end\{align\}/g, delta: -1e0 },
        { regex: /\\end\{align\*\}/g, delta: -1e1 },
        { regex: /\\end\{gather\}/g, delta: -1e2 },
        { regex: /\\end\{gather\*\}/g, delta: -1e3 },
        { regex: /\\end\{alignat\}/g, delta: -1e4 },
        { regex: /\\end\{alignat\*\}/g, delta: -1e5 },
    ])
        for (const match of txt.matchAll(regex)) {
            if (isInComment(txt, match.index)) continue;
            cmdPairs.push({ index: match.index, delta, depth: 0 });
        }
    cmdPairs.sort((a, b) => a.index - b.index);

    // Check if the commands are properly coupled
    let depth = 0;
    let isMatched = true;
    let cnt = 0;
    for (let pair of cmdPairs) {
        pair.depth = (depth += pair.delta);
        if (cnt % 2 === 1 && pair.depth !== 0) isMatched = false;
        cnt++;
    }
    if (depth !== 0) {
        vscode.window.showErrorMessage(
            "Unmatched \\begin{align} and \\end{align} commands. Are the commands properly coupled?"
        );
        return [];
    }

    // make pairs from cmdPairs (i.e. couple even and odd indexes)
    const ranges = [];

    for (let i = 0; i < cmdPairs.length; i += 2) {
        const textInRange = txt.slice(cmdPairs[i].index, cmdPairs[i + 1].index);
        if (/\\\\/.test(textInRange)) continue;
        const startPos = doc.positionAt(cmdPairs[i].index);
        const endPos = doc.positionAt(cmdPairs[i + 1].index);
        const range = new vscode.Range(startPos, endPos);
        ranges.push(range);
    }

    const code = 'LLAlignSingleLine';
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
