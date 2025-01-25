import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import isLabelOrURL from '../util/isLabelOrURL';
import match2range from '../util/match2range';

const okWords = [
    'Award-Winning',
    'Best-In-Class',
    'Bottom-Up',
    'Cutting-Edge',
    'Data-Driven',
    'Deep-Learning',
    'Feature-Based',
    'Feature-Selection',
    'First-Order',
    'Fritz-John',
    'Full-Time',
    'High-Class',
    'High-Dimensional',
    'High-End',
    'High-Quality',
    'Higher-Order',
    'Ill-Defined',
    'Ill-Posed',
    'Long-Term',
    'Low-Dimensional',
    'Machine-Learning',
    'Non-Convex',
    'Non-Empty',
    'Non-Empty',
    'Non-Linear',
    'Non-Negative',
    'Non-Positive',
    'Non-Zero',
    'Open-Source',
    'Part-Time',
    'Pre-Processing',
    'Pop-Culture',
    'Real-Time',
    'Reinforcement-Learning',
    'Second-Order',
    'Short-Term',
    'State-Of-The-Art',
    'Third-Order',
    'Top-Down',
    'Top-Rated',
    'User-Friendly',
    'Well-Being',
    'Well-Defined',
    'Well-Documented',
    'Well-Known',
    'Well-Posed',
    'Zero-Sum',
];

// function binarySearch(word: string) {
//     let low = 0, high = okWords.length;
//     while (low < high) {
//         const mid = Math.floor((low + high) / 2);
//         const cmp = okWords[mid].localeCompare(word);
//         if (cmp < 0) low = mid + 1;
//         else if (cmp > 0) high = mid;
//         else return true;
//     }
//     return false;
// }

export default function LLENDash(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    const ranges: vscode.Range[] = [];

    for (const match of txt.matchAll(/[A-Z][a-zA-Z]*[a-z](-[A-Z][a-zA-Z]*[a-z])+/g)) {
        // Compared to the binary search, this is faster for small arrays.
        if (okWords.includes(match[0])) continue;
        if (isLabelOrURL(txt, match)) continue;
        ranges.push(match2range(doc, match));
    }

    const code = "LLENDash";
    const message = messages[code];
    return ranges2diagnostics(code, message, ranges);
}
