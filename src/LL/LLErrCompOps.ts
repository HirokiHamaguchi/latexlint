import * as vscode from 'vscode';
import isLabelOrURL from '../LLText/isLabelOrURL';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

const targetRegex = /(?<![<>=a-zA-Z])(?:<\s*=|=\s*<|\\leq?\s*=|=\s*\\leq?|>\s*=|=\s*>|\\geq?\s*=|=\s*\\geq?)(?![<>=a-zA-Z])/g;

export default function LLErrCompOps(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = 'LLErrCompOps';
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    for (const match of txt.text.matchAll(targetRegex)) {
        if (!txt.isValid(match.index)) continue;
        if (doc.languageId === 'markdown' && (match[0] === '<=' || match[0] === '=>')) continue;
        if (isLabelOrURL(txt.text, match)) continue;
        message.push(messages[code]);
        ranges.push(match2range(doc, match));
    }

    return ranges2diagnostics(code, message, ranges);
}
