import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

export default function LLFigRef(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLFigRef";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    // Collect all references
    const allRefs = new Set<string>();

    // Find all \ref{...} and \cref{...} commands
    const refRegex = /\\[cC]?ref\{([^}]*)\}/g;
    for (const refMatch of txt.matchAll(refRegex)) {
        const refLabel = refMatch[1];

        // Skip if the reference is in a comment
        const pos = doc.positionAt(refMatch.index!);
        const line = doc.lineAt(pos.line);
        const idx = refMatch.index! - doc.offsetAt(line.range.start);
        if (isInComment(line.text, idx)) continue;

        allRefs.add(refLabel);
    }

    // Find labels that should be referenced
    const figureRegex = /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g;
    for (const figMatch of txt.matchAll(figureRegex)) {
        const figureContent = figMatch[1];
        const labelRegex = /\\label\{([^}]*)\}/g;
        for (const labelMatch of figureContent.matchAll(labelRegex)) {
            const labelName = labelMatch[1];

            // Calculate absolute position by adding figMatch index and offset within figure content
            const absoluteIndex = figMatch.index! + figMatch[0].indexOf(figMatch[1]) + labelMatch.index!;

            // Skip if the label is in a comment
            const labelPos = doc.positionAt(absoluteIndex);
            const labelLine = doc.lineAt(labelPos.line);
            const labelIdx = absoluteIndex - doc.offsetAt(labelLine.range.start);
            if (isInComment(labelLine.text, labelIdx)) continue;

            if (!allRefs.has(labelName)) {
                message.push(messages[code].replaceAll("%1", labelName));
                // Create a new match object with correct absolute position
                const absoluteMatch = {
                    ...labelMatch,
                    index: absoluteIndex
                };
                ranges.push(match2range(doc, absoluteMatch));
            }
        }
    }

    return ranges2diagnostics(doc, code, message, ranges);
}