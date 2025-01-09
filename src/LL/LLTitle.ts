import * as vscode from 'vscode';
import toTitleCase from '../util/toTitleCase';
import { extensionDisplayName, severity, messages } from '../util/constants';

export default function LLTitle(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const text = doc.getText();

    const backslashPositions: number[] = [];
    const backslashRegex = /\\/g;
    let match;
    while (match = backslashRegex.exec(text))
        backslashPositions.push(match.index);

    const sectionRanges: vscode.Range[] = [];
    for (const backslashIndex of backslashPositions)
        for (const commands of [
            "title",
            "section", "subsection", "subsubsection",
            "paragraph", "subparagraph"
        ])
            if (text.startsWith(`\\${commands}{`, backslashIndex)) {
                let index = backslashIndex + `\\${commands}{`.length;
                const L = doc.positionAt(index);
                let braceCount = 1;
                while (braceCount > 0 && index < text.length) {
                    if (text[index] === '{') braceCount++;
                    else if (text[index] === '}') braceCount--;
                    index++;
                }
                const R = doc.positionAt(index - 1);
                sectionRanges.push(new vscode.Range(L, R));
            }

    const code = 'LLTitle';
    const diagnostics: vscode.Diagnostic[] = [];
    for (const range of sectionRanges) {
        const sectionText = doc.getText(range);
        const titleCaseText = toTitleCase(sectionText);
        if (sectionText !== titleCaseText)
            diagnostics.push({
                code: code,
                message: messages[code].replace('{EXPECTED}', `"${titleCaseText}"`),
                range: range,
                severity: severity[code],
                source: extensionDisplayName,
            });
    }
    return diagnostics;
}
