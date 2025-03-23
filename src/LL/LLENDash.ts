import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import isLabelOrURL from '../util/isLabelOrURL';
import match2range from '../util/match2range';

const okWords = [
    'Fritz-John',
];

const okPrefixes = ['Anti', 'Auto', 'Award', 'Best', 'Bi', 'Bottom', 'Co', 'Cross', 'Cutting', 'Data', 'De', 'Deep', 'Dis', 'En', 'Ex', 'Feature', 'First', 'Full', 'High', 'Higher', 'Hyper', 'Ill', 'Infra', 'Inter', 'Intra', 'Long', 'Low', 'Machine', 'Macro', 'Micro', 'Multi', 'Neo', 'Non', 'Open', 'Out', 'Over', 'Pan', 'Part', 'Pop', 'Post', 'Post', 'Post', 'Pre', 'Pre', 'Pre', 'Pro', 'Re', 'Real', 'Reinforcement', 'Retro', 'Semi', 'Short', 'State', 'Sub', 'Super', 'Third', 'Top', 'Trans', 'Tri', 'Ultra', 'Ultra', 'Un', 'Under', 'Uni', 'User', 'Well', 'Zero'];

export default function LLENDash(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/[A-Z][a-zA-Z]*[a-z](?:-[A-Z][a-zA-Z]*[a-z])+/g)) {
        // Compared to the binary search, this is faster for small arrays.
        if (okWords.includes(match[0])) continue;
        const prefix = match[0].split('-')[0];
        if (okPrefixes.includes(prefix)) continue;
        if (isLabelOrURL(txt, match)) continue;
        ranges.push(match2range(doc, match));
    }

    const code = "LLENDash";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
