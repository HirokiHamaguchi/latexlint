import * as vscode from 'vscode';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import { messages } from '../util/constants';

export default function LLAlignAnd(doc: vscode.TextDocument, txt: string, alignLikeEnvs: [number, number][]): vscode.Diagnostic[] {
    const code = 'LLAlignAnd';
    const message = messages[code];
    const replacedMessages = [];
    const ranges = [];
    for (const [s, t] of alignLikeEnvs) {
        const match = txt.slice(s, t).matchAll(/(=|<|>|\\neq|\\leq|\\geq|\\le|\\ge|\\succ|\\prec|\\succeq|\\preceq|\\approx|\\asymp|\\iff|\\implies|\\impliedby)\s*&/g);
        for (const m of match) {
            ranges.push(match2range(doc, m, s));
            replacedMessages.push(message.replaceAll("%1", m[1]));
        }
    }
    return ranges2diagnostics(doc, code, replacedMessages, ranges);
}