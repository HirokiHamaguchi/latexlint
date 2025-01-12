import * as vscode from 'vscode';
import toTitleCase from '../util/toTitleCase';
import { extensionDisplayName, severity, messages } from '../util/constants';
import { getCodeWithURI } from '../util/getCodeWithURI';

export default function LLTitle(doc: vscode.TextDocument): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const text = doc.getText();
    const backslashPositions: number[] = Array.from(text.matchAll(/\\/g), match => match.index);

    const code = 'LLTitle';
    const diagnostics: vscode.Diagnostic[] = [];

    for (const backslashIndex of backslashPositions)
        for (const commands of [
            "title",
            "section", "subsection", "subsubsection",
            "paragraph", "subparagraph"
        ]) {
            if (!text.startsWith(`\\${commands}{`, backslashIndex)) continue;
            let index = backslashIndex + `\\${commands}{`.length;
            const beginIndex = index;
            let braceCount = 1;
            while (braceCount > 0 && index < text.length) {
                if (text[index] === '{') braceCount++;
                else if (text[index] === '}') braceCount--;
                index++;
            }
            const endIndex = index - 1;
            const sectionText = text.slice(beginIndex, endIndex);
            const titleCaseText = toTitleCase(sectionText);
            if (sectionText === titleCaseText) continue;
            const L = doc.positionAt(beginIndex);
            const R = doc.positionAt(endIndex);
            const range = new vscode.Range(L, R);
            diagnostics.push({
                code: getCodeWithURI(code),
                message: messages[code].replace('{EXPECTED}', `"${titleCaseText}"`),
                range: range,
                severity: severity[code],
                source: extensionDisplayName,
            });
        }
    return diagnostics;
}
