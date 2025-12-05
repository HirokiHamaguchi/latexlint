import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';

export default function LLSortedCites(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const bibtexIterator = txt.text.matchAll(/\\bibliography\{/g);
    const firstMatchResult = bibtexIterator.next();
    const firstMatch = firstMatchResult.value;
    if (!firstMatch) return [];

    const natbibPattern = /\\usepackage(\[[^\]]*\])?\{natbib\}/g;
    const matches = txt.text.matchAll(natbibPattern);
    let hasNatbibSort = false;
    for (const match of matches) {
        const options = match[1];
        if (options.includes('sort')) hasNatbibSort = true;
    }
    if (hasNatbibSort) return [];

    const citePackagePattern = /\\usepackage(\[[^\]]*\])?\{cite\}/g;
    const biblatexPattern = /\\usepackage(\[[^\]]*\])?\{biblatex\}/g;
    if (txt.text.match(citePackagePattern) || txt.text.match(biblatexPattern)) return [];

    const range = match2range(doc, firstMatch);
    const message = messages['LLSortedCites'];
    return ranges2diagnostics('LLSortedCites', [message], [range]);
}