import * as vscode from 'vscode';
import toTitleCase from '../util/toTitleCase';
import { extensionDisplayName, severity, messages } from '../util/constants';
import { getCodeWithURI } from '../util/getCodeWithURI';


const REGEXPS = [
    /\\title{/g,
    /\\section\*?{/g,
    /\\subsection\*?{/g,
    /\\subsubsection\*?{/g,
    /\\paragraph\*?{/g,
    /\\subparagraph\*?{/g
];

export default function LLTitle(doc: vscode.TextDocument, txt: string): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = 'LLTitle';
    const diagnostics: vscode.Diagnostic[] = [];

    for (const regexp of REGEXPS)
        for (const match of txt.matchAll(regexp)) {
            let index = match.index + match[0].length;
            const beginIndex = index;
            let braceCount = 1;
            while (braceCount > 0 && index < txt.length) {
                if (txt[index] === '{') braceCount++;
                else if (txt[index] === '}') braceCount--;
                index++;
            }
            const endIndex = index - 1;
            const sectionText = txt.slice(beginIndex, endIndex);

            // TODO: elaborate on this
            if (sectionText === sectionText.toUpperCase()) continue;
            if (sectionText.includes("\\") || sectionText.includes("$")) continue;

            const titleCaseText = toTitleCase(sectionText);
            if (sectionText === titleCaseText) continue;
            const L = doc.positionAt(beginIndex);
            const R = doc.positionAt(endIndex);
            const range = new vscode.Range(L, R);
            diagnostics.push({
                code: getCodeWithURI(code),
                message: messages[code].replaceAll("%1", titleCaseText),
                range: range,
                severity: severity[code],
                source: extensionDisplayName,
            });
        }

    return diagnostics;
}
