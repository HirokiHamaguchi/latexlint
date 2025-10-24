import * as vscode from 'vscode';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';
import match2range from '../util/match2range';
import isInComment from '../util/isInComment';

export default function LLUnRef(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLUnRef";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    // Collect all references
    const allRefs = new Set<string>();
    const refRegex = /\\[cC]?ref\{([^}]*)\}/g;
    for (const refMatch of txt.matchAll(refRegex)) {
        const pos = doc.positionAt(refMatch.index!);
        const line = doc.lineAt(pos.line);
        const idx = refMatch.index! - doc.offsetAt(line.range.start);
        if (!isInComment(line.text, idx)) allRefs.add(refMatch[1]);
    }

    // Helper function to process environment labels
    const processEnvironmentLabels = (envRegex: RegExp) => {
        for (const envMatch of txt.matchAll(envRegex)) {
            const envContent = envMatch[1];
            const labelRegex = /\\label\{([^}]*)\}/g;
            for (const labelMatch of envContent.matchAll(labelRegex)) {
                const labelName = labelMatch[1];
                const absoluteIndex = envMatch.index! + envMatch[0].indexOf(envMatch[1]) + labelMatch.index!;

                // Skip if the label is in a comment
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
    };

    // Process figure and table environments
    processEnvironmentLabels(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g);
    processEnvironmentLabels(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g);

    return ranges2diagnostics(doc, code, message, ranges);
}