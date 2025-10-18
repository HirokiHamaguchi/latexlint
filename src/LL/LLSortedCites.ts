import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';

export default function LLSortedCites(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const bibtexIterator = txt.matchAll(/\\bibliography\{/g);
    const firstMatchResult = bibtexIterator.next();
    const firstMatch = firstMatchResult.value;
    if (!firstMatch) return [];

    const natbibPattern = /\\usepackage(\[[^\]]*\])?\{natbib\}/g;
    const matches = txt.matchAll(natbibPattern);
    let hasNatbibSort = false;
    for (const match of matches) {
        const options = match[1];
        if (options.includes('sort')) hasNatbibSort = true;
    }
    if (hasNatbibSort) return [];

    const citePackagePattern = /\\usepackage(\[[^\]]*\])?\{cite\}/g;
    const biblatexPattern = /\\usepackage(\[[^\]]*\])?\{biblatex\}/g;
    if (txt.match(citePackagePattern) || txt.match(biblatexPattern)) return [];

    const range = match2range(doc, firstMatch);
    const message = messages['LLSortedCites'];
    return ranges2diagnostics(doc, 'LLSortedCites', [message], [range]);
}