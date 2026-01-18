import * as vscode from 'vscode';
import type { LLText } from '../LLText/LLText';
import { messages } from '../util/constants';
import match2range from '../util/match2range';
import ranges2diagnostics from '../util/ranges2diagnostics';


export default function LLUnRef(doc: vscode.TextDocument, txt: LLText): vscode.Diagnostic[] {
    if (doc.languageId !== "latex") return [];

    const code = "LLUnRef";
    const message: string[] = [];
    const ranges: vscode.Range[] = [];

    const collectRefs = () => {
        const foundRefs = new Set<string>();
        const refRegex = /\\[cC]?ref\{([^}]*)\}/g;
        for (const refMatch of txt.text.matchAll(refRegex)) {
            if (!txt.isValid(refMatch.index!)) continue;
            const refNames = refMatch[1].split(',').map(name => name.trim());
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

    const processEnvironmentLabels = (envName: string) => {
        const beginRegex = new RegExp(`\\\\begin\\{${envName}\\}`, 'g');
        const endRegex = new RegExp(`\\\\end\\{${envName}\\}`, 'g');
        const envHeaderLength = `\\begin{${envName}}`.length;

        let beginMatch: RegExpExecArray | null;
        while ((beginMatch = beginRegex.exec(txt.text)) !== null) {
            if (!txt.isValid(beginMatch.index)) continue;

            const endMatch = findNextValidMatch(endRegex, beginMatch.index);
            if (!endMatch) continue;

            const envContent = txt.text.substring(beginMatch.index + envHeaderLength, endMatch.index);
            const labelRegex = /\\label\{([^}]*)\}/g;

            let labelMatch: RegExpExecArray | null;
            while ((labelMatch = labelRegex.exec(envContent)) !== null) {
                const labelName = labelMatch[1];
                const absoluteIndex = beginMatch.index + envHeaderLength + labelMatch.index!;
                if (!txt.isValid(absoluteIndex)) continue;
                if (allRefs.has(labelName)) continue;

                message.push(messages[code].replaceAll("%1", labelName));
                ranges.push(match2range(doc, { ...labelMatch, index: absoluteIndex }));
            }
        }
    };

    const allRefs = collectRefs();
    ['figure', 'table'].forEach(processEnvironmentLabels);

    return ranges2diagnostics(code, message, ranges);
}
