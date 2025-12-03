import * as vscode from 'vscode';
import type { LLText } from '../util/LLText';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

const collectNonCommentMatches = (doc: vscode.TextDocument, txt: string, regex: RegExp) => {
    const matches: { index: number, pos: vscode.Position, line: vscode.TextLine, idx: number }[] = [];
    for (const m of txt.matchAll(regex)) {
        const index = m.index!;
        const pos = doc.positionAt(index);
        const line = doc.lineAt(pos.line);
        const idx = index - doc.offsetAt(line.range.start);
        if (!isInComment(line.text, idx)) matches.push({ index, pos, line, idx });
    }
    return matches;
};


export default function LLUnRef(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLUnRef";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    // Collect all references
    const allRefs = new Set<string>();
    const refRegex = /\\[cC]?ref\{([^}]*)\}/g;
    for (const refMatch of txt.text.matchAll(refRegex)) {
        const pos = doc.positionAt(refMatch.index!);
        const line = doc.lineAt(pos.line);
        const idx = refMatch.index! - doc.offsetAt(line.range.start);
        if (!isInComment(line.text, idx)) allRefs.add(refMatch[1]);
    }

    // Helper function to process environment labels
    const processEnvironmentLabels = (envName: string) => {
        const beginRegex = new RegExp(`\\\\begin\\{${envName}\\}`, 'g');
        const beginMatches = collectNonCommentMatches(doc, txt.text, beginRegex);

        const endRegex = new RegExp(`\\\\end\\{${envName}\\}`, 'g');
        const endMatches = collectNonCommentMatches(doc, txt.text, endRegex);

        for (const beginMatch of beginMatches) {
            const correspondingEnd = endMatches.find(endMatch => endMatch.index > beginMatch.index);
            if (correspondingEnd) {
                const envContent = txt.text.substring(
                    beginMatch.index + `\\begin{${envName}}`.length,
                    correspondingEnd.index
                );

                const labelRegex = /\\label\{([^}]*)\}/g;
                for (const labelMatch of envContent.matchAll(labelRegex)) {
                    const labelName = labelMatch[1];
                    const absoluteIndex = beginMatch.index + `\\begin{${envName}}`.length + labelMatch.index!;

                    const labelPos = doc.positionAt(absoluteIndex);
                    const labelLine = doc.lineAt(labelPos.line);
                    const labelIdx = absoluteIndex - doc.offsetAt(labelLine.range.start);
                    if (isInComment(labelLine.text, labelIdx)) continue;

                    if (!allRefs.has(labelName)) {
                        message.push(messages[code].replaceAll("%1", labelName));
                        ranges.push(match2range(doc, { ...labelMatch, index: absoluteIndex }));
                    }
                }
            }
        }
    };

    // Process figure and table environments
    processEnvironmentLabels('figure');
    processEnvironmentLabels('table');

    return ranges2diagnostics(doc, code, message, ranges);
}