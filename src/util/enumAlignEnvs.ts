import * as vscode from 'vscode';
import isInComment from './isInComment';

const alignLikeEnvs = [
    'align',
    'alignat',
    'aligned',
    'split', // No problem with LLAlignEnd
    'gather',
    // ignore `eqnarray` because we have LLEqnarray
];

export default function enumAlignEnvs(doc: vscode.TextDocument, txt: string): [number, number][] {
    // Extract all \begin{align} and \end{align} commands

    const regexAndDeltas = [];
    for (let i = 0; i < alignLikeEnvs.length; i++) {
        const env = alignLikeEnvs[i];
        regexAndDeltas.push({ regex: new RegExp(`\\\\begin\\{${env}\\}`, 'g'), delta: +(2 * i + 1) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\begin\\{${env}\\*\\}`, 'g'), delta: +(2 * i + 2) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\end\\{${env}\\}`, 'g'), delta: -(2 * i + 1) });
        regexAndDeltas.push({ regex: new RegExp(`\\\\end\\{${env}\\*\\}`, 'g'), delta: -(2 * i + 2) });
    }

    let cmdPairs = [];
    for (const { regex, delta } of regexAndDeltas)
        for (const match of txt.matchAll(regex)) {
            if (isInComment(txt, match.index)) continue;
            cmdPairs.push({ index: match.index, delta, depth: 0 });
        }
    cmdPairs.sort((a, b) => a.index - b.index);

    // Check if the commands are properly coupled
    const STs: [number, number][] = [];
    const stack = [];
    let isMatched = -1;
    for (const pair of cmdPairs)
        if (pair.delta > 0)
            stack.push(pair);
        else {
            const top = stack.pop();
            if (top === undefined || top.delta + pair.delta !== 0) {
                isMatched = pair.index;
                break;
            } else
                STs.push([top.index, pair.index]);
        }

    if (isMatched !== -1 || stack.length !== 0) {
        const errorPos = isMatched !== -1 ? doc.positionAt(isMatched) : doc.positionAt(stack[0].index);
        vscode.window.showErrorMessage(
            "Unmatched \\begin{align} and \\end{align} commands" +
            ` at Line ${errorPos.line + 1}, Character ${errorPos.character + 1}. ` +
            "Are the commands properly paired?"
        );
        return [];
    }
    return STs;
}
