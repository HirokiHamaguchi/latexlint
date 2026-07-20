import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import findLatexCommandMatches from '../util/findLatexCommandMatches';
import { messages } from '../util/constants';
import ranges2diagnostics from '../util/ranges2diagnostics';


export default function LLUnRef(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLUnRef";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    const collectRefs = () => {
        const foundRefs = new Set<string>();
        // This regex matches LaTeX commands that contain "ref" (case-insensitive).
        // If we lack the "ref" part, we might match other commands like \label.
        const refRegex = /\\[a-zA-Z]*(?:ref|Ref|REF)[a-zA-Z]*\{/g;
        for (const refMatch of findLatexCommandMatches(txt.text, refRegex)) {
            if (!txt.isValid(refMatch.index)) continue;
            const refNames = refMatch.content.split(',').map(name => name.trim());
            for (const refName of refNames) foundRefs.add(refName);
        }
        return foundRefs;
    };

    const findNextValidMatch = (regex: RegExp, start: number): RegExpExecArray | null => {
        regex.lastIndex = start;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(txt.text)) !== null) {
            if (!txt.isValid(match.index)) continue;
            return match;
        }
        return null;
    };

    const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const processEnvironmentLabels = (envName: string) => {
        const escapedEnvName = escapeRegExp(envName);
        const beginRegex = new RegExp(`\\\\begin\\{${escapedEnvName}\\}`, 'g');
        const endRegex = new RegExp(`\\\\end\\{${escapedEnvName}\\}`, 'g');
        const envHeaderLength = `\\begin{${envName}}`.length;

        let beginMatch: RegExpExecArray | null;
        while ((beginMatch = beginRegex.exec(txt.text)) !== null) {
            if (!txt.isValid(beginMatch.index)) continue;

            const endMatch = findNextValidMatch(endRegex, beginMatch.index);
            if (!endMatch) continue;

            const envContent = txt.text.substring(beginMatch.index + envHeaderLength, endMatch.index);
            const labelRegex = /\\label\{/g;

            for (const labelMatch of findLatexCommandMatches(envContent, labelRegex)) {
                const labelName = labelMatch.content;
                const absoluteIndex = beginMatch.index + envHeaderLength + labelMatch.index;
                if (!txt.isValid(absoluteIndex)) continue;
                if (allRefs.has(labelName)) continue;

                message.push(messages[code].replaceAll("%1", labelName).replaceAll("%2", envName));
                ranges.push(new vscode.Range(
                    doc.positionAt(absoluteIndex),
                    doc.positionAt(beginMatch.index + envHeaderLength + labelMatch.fullEnd)
                ));
            }
        }
    };

    const allRefs = collectRefs();
    ['figure', 'table', 'figure*', 'table*'].forEach(processEnvironmentLabels);

    return ranges2diagnostics(code, message, ranges);
}
