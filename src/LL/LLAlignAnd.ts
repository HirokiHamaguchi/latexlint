import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLAlignAnd(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    const code = 'LLAlignAnd';
    const message = messages[code];
    const replacedMessages = [];
    const ranges = [];
    for (const [s, t] of txt.alignLikeEnvs) {
        const match = txt.text.slice(s, t).matchAll(/(=|<|>|\\neq|\\leq|\\geq|\\le|\\ge|\\succ|\\prec|\\succeq|\\preceq|\\approx|\\asymp|\\iff|\\implies|\\impliedby)\s*&/g);
        for (const m of match) {
            const range = match2range(doc, m, s);
            if (!txt.isValid(doc.offsetAt(range.start))) continue;
            ranges.push(range);
            replacedMessages.push(message.replaceAll("%1", m[1]));
        }
    }
    return ranges2diagnostics(code, replacedMessages, ranges);
}